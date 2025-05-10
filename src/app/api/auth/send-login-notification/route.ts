import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
import * as z from "zod";

const prisma = new PrismaClient();

const otpSchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6).regex(/^\d+$/),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, otp } = otpSchema.parse(body);

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email },
      include: { passwordReset: true },
    });

    if (!user || !user.passwordReset) {
      return NextResponse.json(
        { message: "Invalid or expired OTP" },
        { status: 400 }
      );
    }

    // Check if reset token has expired
    if (user.passwordReset.expires < new Date()) {
      return NextResponse.json(
        { message: "OTP has expired" },
        { status: 400 }
      );
    }

    // Split token to get the actual token and hashed OTP
    const [resetToken, hashedOtp] = user.passwordReset.token.split(":");

    // Verify OTP
    const isOtpValid = await bcrypt.compare(otp, hashedOtp);

    if (!isOtpValid) {
      return NextResponse.json(
        { message: "Invalid OTP" },
        { status: 400 }
      );
    }

    // Generate a new token for the password reset page
    const newResetToken = `verified-${resetToken}`;
    
    // Update the token to indicate it's been verified
    await prisma.passwordReset.update({
      where: { userId: user.id },
      data: {
        token: newResetToken,
      },
    });

    return NextResponse.json(
      { 
        message: "OTP verified successfully",
        token: newResetToken,
      },
      { status: 200 }
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Invalid input data", errors: error.errors },
        { status: 400 }
      );
    }

    console.error("OTP verification error:", error);
    return NextResponse.json(
      { message: "Failed to verify OTP" },
      { status: 500 }
    );
  }
}