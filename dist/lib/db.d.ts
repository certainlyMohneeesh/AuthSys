import { PrismaClient } from "@prisma/client";
export declare const db: PrismaClient<import("@prisma/client").Prisma.PrismaClientOptions, never, import(".prisma/client/runtime/library").DefaultArgs>;
/**
 * Find a user by email
 */
export declare function getUserByEmail(email: string): Promise<{
    name: string | null;
    id: string;
    username: string | null;
    email: string;
    emailVerified: Date | null;
    image: string | null;
    password: string | null;
    createdAt: Date;
    updatedAt: Date;
    isDeleted: boolean;
    deletedAt: Date | null;
} | null>;
/**
 * Find a user by ID
 */
export declare function getUserById(id: string): Promise<{
    name: string | null;
    id: string;
    username: string | null;
    email: string;
    emailVerified: Date | null;
    image: string | null;
    password: string | null;
    createdAt: Date;
    updatedAt: Date;
    isDeleted: boolean;
    deletedAt: Date | null;
} | null>;
/**
 * Find a user by username
 */
export declare function getUserByUsername(username: string): Promise<{
    name: string | null;
    id: string;
    username: string | null;
    email: string;
    emailVerified: Date | null;
    image: string | null;
    password: string | null;
    createdAt: Date;
    updatedAt: Date;
    isDeleted: boolean;
    deletedAt: Date | null;
} | null>;
/**
 * Get password reset information for a user
 */
export declare function getPasswordResetByUserId(userId: string): Promise<{
    id: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
    expires: Date;
    token: string;
} | null>;
/**
 * Create or update a password reset record
 */
export declare function upsertPasswordReset(userId: string, token: string, expires: Date): Promise<{
    id: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
    expires: Date;
    token: string;
}>;
/**
 * Delete a password reset record
 */
export declare function deletePasswordReset(userId: string): Promise<{
    id: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
    expires: Date;
    token: string;
}>;
/**
 * Update user password
 */
export declare function updateUserPassword(userId: string, hashedPassword: string): Promise<{
    name: string | null;
    id: string;
    username: string | null;
    email: string;
    emailVerified: Date | null;
    image: string | null;
    password: string | null;
    createdAt: Date;
    updatedAt: Date;
    isDeleted: boolean;
    deletedAt: Date | null;
}>;
/**
 * Create a new user
 */
export declare function createUser(data: {
    username: string;
    email: string;
    password: string;
}): Promise<{
    name: string | null;
    id: string;
    username: string | null;
    email: string;
    emailVerified: Date | null;
    image: string | null;
    password: string | null;
    createdAt: Date;
    updatedAt: Date;
    isDeleted: boolean;
    deletedAt: Date | null;
}>;
