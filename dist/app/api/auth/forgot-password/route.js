import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { randomBytes } from "crypto";
import * as z from "zod";
import * as bcrypt from "bcryptjs";
import { sendPasswordResetEmail } from "@/lib/email";
const prisma = new PrismaClient();
const forgotPasswordSchema = z.object({
    email: z.string().email(),
});
export async function POST(req) {
    var _a;
    try {
        const body = await req.json();
        const { email } = forgotPasswordSchema.parse(body);
        // Check if user exists
        const user = await prisma.user.findUnique({
            where: { email },
        });
        if (!user) {
            // For security reasons, don't reveal if the email exists
            return NextResponse.json({ message: "If an account with that email exists, we've sent a reset code" }, { status: 200 });
        }
        // Generate a 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        // Generate a unique token
        const token = randomBytes(32).toString("hex");
        // Set expiration time to 15 minutes from now
        const expiresAt = new Date();
        expiresAt.setMinutes(expiresAt.getMinutes() + 15);
        // Create or update password reset record
        await prisma.passwordReset.upsert({
            where: { userId: user.id },
            update: {
                token: token,
                expires: expiresAt,
            },
            create: {
                userId: user.id,
                token: token,
                expires: expiresAt,
            },
        });
        if (!process.env.MAILTRAP_API_KEY) {
            console.error("MAILTRAP_API_KEY is not defined");
            return NextResponse.json({ message: "Server configuration error" }, { status: 500 });
        }
        console.log("API Key available:", !!process.env.MAILTRAP_API_KEY);
        console.log("API Key length:", (_a = process.env.MAILTRAP_API_KEY) === null || _a === void 0 ? void 0 : _a.length);
        // Send OTP email using Mailtrap
        const emailSent = await sendPasswordResetEmail(email, otp);
        if (!emailSent) {
            throw new Error("Failed to send OTP email");
        }
        // Store OTP in database for verification later
        // Using the token field to store the hash of the OTP
        const hashedOtp = await bcrypt.hash(otp, 10);
        // Update the token to include both the reset token and hashed OTP
        await prisma.passwordReset.update({
            where: { userId: user.id },
            data: {
                token: `${token}:${hashedOtp}`,
            },
        });
        return NextResponse.json({ message: "Password reset email sent successfully" }, { status: 200 });
    }
    catch (error) {
        console.error("Detailed error:", error);
        if (error instanceof z.ZodError) {
            return NextResponse.json({ message: "Invalid email format" }, { status: 400 });
        }
        console.error("Forgot password error:", error);
        return NextResponse.json({ message: "Failed to process your request" }, { status: 500 });
    }
}
