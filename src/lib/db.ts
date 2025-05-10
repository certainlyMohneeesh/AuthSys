
import { PrismaClient } from "@prisma/client";


const globalForPrisma = global as unknown as { prisma: PrismaClient };

export const db = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db;

/**
 * Find a user by email
 */
export async function getUserByEmail(email: string) {
    return await db.user.findUnique({
        where: { email },
    });
}

/**
 * Find a user by ID
 */
export async function getUserById(id: string) {
    return await db.user.findUnique({
        where: { id },
    });
}

/**
 * Find a user by username
 */
export async function getUserByUsername(username: string) {
    return await db.user.findUnique({
        where: { username },
    });
}

/**
 * Get password reset information for a user
 */
export async function getPasswordResetByUserId(userId: string) {
    return await db.passwordReset.findUnique({
        where: { userId },
    });
}

/**
 * Create or update a password reset record
 */
export async function upsertPasswordReset(userId: string, token: string, expires: Date) {
    return await db.passwordReset.upsert({
        where: { userId },
        update: {
            token,
            expires,
        },
        create: {
            userId,
            token,
            expires,
        },
    });
}

/**
 * Delete a password reset record
 */
export async function deletePasswordReset(userId: string) {
    return await db.passwordReset.delete({
        where: { userId },
    });
}

/**
 * Update user password
 */
export async function updateUserPassword(userId: string, hashedPassword: string) {
    return await db.user.update({
        where: { id: userId },
        data: { password: hashedPassword },
    });
}

/**
 * Create a new user
 */
export async function createUser(data: {
    username: string;
    email: string;
    password: string;
}) {
    return await db.user.create({
        data,
    });
}