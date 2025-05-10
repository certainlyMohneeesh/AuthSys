import { NextAuthOptions } from "next-auth";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";

import { db, getUserByEmail } from "./db";

/**
 * NextAuth configuration options
 */
export const authOptions: NextAuthOptions = {
    adapter: PrismaAdapter(db),
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_CLIENT_ID as string,
            clientSecret: process.env.GITHUB_CLIENT_SECRET as string,
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID as string,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
        }),
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!credentials?.email || !credentials?.password) {
                    throw new Error("Email and password are required");
                }

                const user = await getUserByEmail(credentials.email);

                if (!user || !user.password) {
                    throw new Error("Invalid email or password");
                }

                const isPasswordValid = await bcrypt.compare(
                    credentials.password,
                    user.password
                );

                if (!isPasswordValid) {
                    throw new Error("Invalid email or password");
                }

                // Send email notification for successful login
                try {
                    await fetch(`${process.env.NEXTAUTH_URL}/api/auth/send-login-notification`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({ email: user.email }),
                    });
                } catch (error) {
                    console.error("Failed to send login notification:", error);
                }

                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    username: user.username,
                    image: user.image,
                };
            },
        }),
    ],
    callbacks: {
        async jwt({ token, user }) {
            if (user) {
                token.id = user.id;
                token.username = user.username;
            }
            return token;
        },
        async session({ session, token }) {
            if (session.user) {
                session.user.id = token.id as string;
                session.user.username = token.username as string | null;
            }
            return session;
        },
    },
    pages: {
        signIn: "/sign-in",
        signOut: "/",
        error: "/sign-in",
        verifyRequest: "/verify-otp",
        newUser: "/sign-up",
    },
    session: {
        strategy: "jwt",
    },
    secret: process.env.NEXTAUTH_SECRET,
};

/**
 * Generate a random OTP (One-Time Password)
 */
export function generateOTP(length: number = 6): string {
    return Math.floor(100000 + Math.random() * 900000)
        .toString()
        .substring(0, length);
}

/**
 * Generate a secure random token
 */
export function generateToken(length: number = 32): string {
    return randomBytes(length).toString("hex");
}

/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
    return await bcrypt.hash(password, 10);
}

/**
 * Verify a password against a hash
 */
export async function verifyPassword(
    password: string,
    hashedPassword: string
): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword);
}

/**
 * Validate that a token has not expired
 */
export function isTokenExpired(expires: Date): boolean {
    return new Date() > expires;
}

/**
 * Calculate token expiration time (in minutes from now)
 */
export function calculateExpiry(minutes: number = 15): Date {
    const expiry = new Date();
    expiry.setMinutes(expiry.getMinutes() + minutes);
    return expiry;
}