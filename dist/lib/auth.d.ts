import { NextAuthOptions } from "next-auth";
/**
 * NextAuth configuration options
 */
export declare const authOptions: NextAuthOptions;
/**
 * Generate a random OTP (One-Time Password)
 */
export declare function generateOTP(length?: number): string;
/**
 * Generate a secure random token
 */
export declare function generateToken(length?: number): string;
/**
 * Hash a password using bcrypt
 */
export declare function hashPassword(password: string): Promise<string>;
/**
 * Verify a password against a hash
 */
export declare function verifyPassword(password: string, hashedPassword: string): Promise<boolean>;
/**
 * Validate that a token has not expired
 */
export declare function isTokenExpired(expires: Date): boolean;
/**
 * Calculate token expiration time (in minutes from now)
 */
export declare function calculateExpiry(minutes?: number): Date;
