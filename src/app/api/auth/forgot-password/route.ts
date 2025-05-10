import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { randomBytes } from "crypto";
import * as z from "zod";
import * as bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const forgotPasswordSchema = z.object({
    email: z.string().email(),
});

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { email } = forgotPasswordSchema.parse(body);

        // Check if user exists
        const user = await prisma.user.findUnique({
            where: { email },
        });

        if (!user) {
            // For security reasons, don't reveal if the email exists
            return NextResponse.json(
                { message: "If an account with that email exists, we've sent a reset code" },
                { status: 200 }
            );
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

        // Send OTP email using testemail.app
        const emailResponse = await fetch("https://api.testemail.app/v1/emails", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.TESTEMAIL_API_KEY}`,
            },
            body: JSON.stringify({
                to: email,
                subject: "Reset Your Password",
                html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2>Reset Your Password</h2>
            <p>We received a request to reset your password. Use the verification code below to continue:</p>
            <div style="background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 24px; letter-spacing: 5px; font-weight: bold; margin: 20px 0;">
              ${otp}
            </div>
            <p>This code will expire in 15 minutes.</p>
            <p>If you didn't request this password reset, please ignore this email or contact support if you have concerns.</p>
          </div>
        `,
            }),
        });

        if (!emailResponse.ok) {
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

        return NextResponse.json(
            { message: "Password reset email sent successfully" },
            { status: 200 }
        );
    } catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { message: "Invalid email format" },
                { status: 400 }
            );
        }

        console.error("Forgot password error:", error);
        return NextResponse.json(
            { message: "Failed to process your request" },
            { status: 500 }
        );
    }
}