import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import jwt from "jsonwebtoken";
import { sendPasswordChangedEmail } from "@/lib/email";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { token, email, password } = body;

        if (!token || !email || !password) {
            return NextResponse.json(
                { message: "Missing required fields" },
                { status: 400 }
            );
        }

        // Verify token
        let decodedToken;
        try {
            decodedToken = jwt.verify(token, process.env.NEXTAUTH_SECRET as string) as {
                userId: string;
                email: string;
                purpose?: string;
            };
            
            // Add additional validation
            if (decodedToken.purpose !== "password-reset") {
                throw new Error("Invalid token purpose");
            }
        } catch (error) {
            console.error("Token verification error:", error);
            return NextResponse.json(
                { message: "Invalid or expired token" },
                { status: 400 }
            );
        }

        // Check if token email matches provided email
        if (decodedToken.email !== email) {
            return NextResponse.json(
                { message: "Invalid token" },
                { status: 400 }
            );
        }

        // Find user
        const user = await db.user.findUnique({
            where: { id: decodedToken.userId },
        });

        if (!user) {
            return NextResponse.json(
                { message: "User not found" },
                { status: 404 }
            );
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update user password
        await db.user.update({
            where: { id: user.id },
            data: { password: hashedPassword },
        });

        // Clean up password reset record
        await db.passwordReset.delete({
            where: { userId: user.id },
        }).catch(err => {
            // Just log the error but don't fail the request
            console.error("Failed to delete password reset record:", err);
        });

        // Notify user about password change
        try {
            await sendPasswordChangedEmail(email);
        } catch (error) {
            console.error("Failed to send password changed email:", error);
            // Continue anyway
        }

        return NextResponse.json(
            { message: "Password reset successful" },
            { status: 200 }
        );
    } catch (error) {
        console.error("Reset password error:", error);
        return NextResponse.json(
            { message: "Internal server error" },
            { status: 500 }
        );
    }
}
