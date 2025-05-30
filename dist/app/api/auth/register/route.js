import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import * as z from "zod";
const prisma = new PrismaClient();
const registerSchema = z.object({
    username: z.string().min(3).max(20).regex(/^[a-zA-Z0-9_]+$/),
    email: z.string().email(),
    password: z.string().min(8),
});
export async function POST(req) {
    try {
        const body = await req.json();
        const { username, email, password } = registerSchema.parse(body);
        // Check if user already exists
        const existingUserByEmail = await prisma.user.findUnique({
            where: { email },
        });
        if (existingUserByEmail) {
            return NextResponse.json({ message: "Email already in use" }, { status: 400 });
        }
        const existingUserByUsername = await prisma.user.findUnique({
            where: { username },
        });
        if (existingUserByUsername) {
            return NextResponse.json({ message: "Username already taken" }, { status: 400 });
        }
        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        // Create user
        const user = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
            },
        });
        // Send welcome email
        try {
            await fetch(`${process.env.NEXTAUTH_URL}/api/auth/send-welcome-email`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
        }
        catch (error) {
            console.error("Failed to send welcome email:", error);
        }
        return NextResponse.json({
            message: "User created successfully",
            user: {
                id: user.id,
                username: user.username,
                email: user.email,
            },
        }, { status: 201 });
    }
    catch (error) {
        if (error instanceof z.ZodError) {
            return NextResponse.json({ message: "Invalid input data", errors: error.errors }, { status: 400 });
        }
        console.error("Registration error:", error);
        return NextResponse.json({ message: "Internal server error" }, { status: 500 });
    }
}
