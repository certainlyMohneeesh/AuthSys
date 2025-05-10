import { NextResponse } from "next/server";
import { sendWelcomeEmail } from "@/lib/email";
import { db } from "@/lib/db";
import * as z from "zod";

// Schema for validating the request body
const welcomeEmailSchema = z.object({
  email: z.string().email({ message: "Valid email is required" }),
  username: z.string().optional(),
});

export async function POST(req: Request) {
  try {
    // Parse and validate the request body
    const body = await req.json();
    const { email, username } = welcomeEmailSchema.parse(body);

    // Verify the user exists (optional security check)
    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      // For security reasons, don't reveal if the email exists
      return NextResponse.json(
        { message: "Welcome email will be sent if the account exists" },
        { status: 200 }
      );
    }

    // Send the welcome email
    const emailSent = await sendWelcomeEmail(email, username || user.username || undefined);

    if (!emailSent) {
      console.error("Failed to send welcome email to:", email);
      
      // For development, continue anyway
      if (process.env.NODE_ENV === 'development') {
        console.log("\n===== MOCK WELCOME EMAIL =====");
        console.log("To:", email);
        console.log("Username:", username || user.username || email.split('@')[0]);
        console.log("==============================\n");
        
        return NextResponse.json(
          { message: "Welcome email sent successfully (development mode)" },
          { status: 200 }
        );
      }
      
      return NextResponse.json(
        { message: "Failed to send welcome email" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { message: "Welcome email sent successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Welcome email error:", error);
    
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { message: "Invalid request data", errors: error.errors },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { message: "Failed to process your request" },
      { status: 500 }
    );
  }
}
