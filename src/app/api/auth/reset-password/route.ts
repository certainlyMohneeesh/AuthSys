import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import jwt from "jsonwebtoken";
import { sendEmail } from "@/lib/email";

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
            };
        } catch {
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
        });

        // Notify user about password change
        await sendEmail({
            to: email,
            subject: "Password Changed Successfully",
            html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2>Password Reset Successful</h2>
          <p>Hello ${user.name || user.username || email.split("@")[0]},</p>
          <p>Your password has been successfully changed. If you didn't make this change, please contact our support team immediately.</p>
          <p>Thank you,<br>Your App Team</p>
        </div>
      `,
        });

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