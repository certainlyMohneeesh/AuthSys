import { PrismaAdapter } from "@next-auth/prisma-adapter";
import CredentialsProvider from "next-auth/providers/credentials";
import GoogleProvider from "next-auth/providers/google";
import GithubProvider from "next-auth/providers/github";
import bcrypt from "bcryptjs";
import { randomBytes } from "crypto";
import { db, getUserByEmail } from "./db";
import { sendLoginNotificationEmail } from "./email";
if (!process.env.NEXTAUTH_SECRET) {
    throw new Error("NEXTAUTH_SECRET must be set");
}
/**
 * NextAuth configuration options
 */
export const authOptions = {
    adapter: PrismaAdapter(db),
    providers: [
        GithubProvider({
            clientId: process.env.GITHUB_CLIENT_ID || "",
            clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
        }),
        GoogleProvider({
            clientId: process.env.GOOGLE_CLIENT_ID || "",
            clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
        }),
        CredentialsProvider({
            name: "credentials",
            credentials: {
                email: { label: "Email", type: "email" },
                password: { label: "Password", type: "password" },
            },
            async authorize(credentials) {
                if (!(credentials === null || credentials === void 0 ? void 0 : credentials.email) || !(credentials === null || credentials === void 0 ? void 0 : credentials.password)) {
                    throw new Error("Email and password are required");
                }
                const user = await getUserByEmail(credentials.email);
                if (!user || !user.password) {
                    throw new Error("Invalid email or password");
                }
                const isPasswordValid = await bcrypt.compare(credentials.password, user.password);
                if (!isPasswordValid) {
                    throw new Error("Invalid email or password");
                }
                // Send email notification for successful login using direct function call
                try {
                    await sendLoginNotificationEmail(user.email);
                }
                catch (error) {
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
                session.user.id = token.id;
                session.user.username = token.username;
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
        maxAge: 30 * 24 * 60 * 60, // 30 days
    },
    secret: process.env.NEXTAUTH_SECRET,
};
/**
 * Generate a random OTP (One-Time Password)
 */
export function generateOTP(length = 6) {
    return Math.floor(100000 + Math.random() * 900000)
        .toString()
        .substring(0, length);
}
/**
 * Generate a secure random token
 */
export function generateToken(length = 32) {
    return randomBytes(length).toString("hex");
}
/**
 * Hash a password using bcrypt
 */
export async function hashPassword(password) {
    return await bcrypt.hash(password, 10);
}
/**
 * Verify a password against a hash
 */
export async function verifyPassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
}
/**
 * Validate that a token has not expired
 */
export function isTokenExpired(expires) {
    return new Date() > expires;
}
/**
 * Calculate token expiration time (in minutes from now)
 */
export function calculateExpiry(minutes = 15) {
    const expiry = new Date();
    expiry.setMinutes(expiry.getMinutes() + minutes);
    return expiry;
}
