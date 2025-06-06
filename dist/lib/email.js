/**
 * Email utilities for sending various types of emails
 */
/**
* Send an email using the configured email provider
*/
export async function sendEmail({ to, subject, html }) {
    try {
        // Check for Mailtrap API key
        if (process.env.MAILTRAP_API_KEY) {
            return await sendWithMailtrap({ to, subject, html });
        }
        // Add more email providers here as needed for future needs by Mohneesh
        // For example: Resend, SendGrid, or Nodemailer for future needs by Mohneesh
        console.error("No email provider configured");
        return false;
    }
    catch (error) {
        console.error("Failed to send email:", error);
        return false;
    }
}
/**
* Send email using Mailtrap
*/
async function sendWithMailtrap({ to, subject, html }) {
    try {
        const response = await fetch("https://send.api.mailtrap.io/api/send", {
            method: "POST",
            cache: 'no-store', // Prevent Next.js from caching the response
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${process.env.MAILTRAP_API_KEY}`,
            },
            body: JSON.stringify({
                from: {
                    email: "hello@demomailtrap.co",
                    name: "Auth System"
                },
                to: [{ email: to }],
                subject,
                html,
            }),
        });
        if (!response.ok) {
            // Safely try to parse the error response
            try {
                const errorText = await response.text();
                let errorData;
                try {
                    // Try to parse as JSON if possible
                    errorData = JSON.parse(errorText);
                    console.error("Mailtrap API error:", errorData);
                }
                catch (parseError) {
                    // If JSON parsing fails, use the text response directly
                    console.error("Mailtrap API error (non-JSON response):", errorText);
                }
            }
            catch (readError) {
                console.error("Mailtrap API error: Could not read response body");
            }
            console.error("Mailtrap API status:", response.status);
            return false;
        }
        return true;
    }
    catch (error) {
        console.error("Mailtrap API error:", error);
        return false;
    }
}
/**
* Send a welcome email to new users
*/
export async function sendWelcomeEmail(email, username) {
    const name = username || email.split('@')[0];
    return await sendEmail({
        to: email,
        subject: "Welcome to Our Platform!",
        html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Welcome to Our Platform!</h2>
      <p>Hello ${name},</p>
      <p>Thank you for creating an account. We're excited to have you join us!</p>
      <p>You can now sign in and start using our platform with all its features.</p>
      <div style="margin: 25px 0;">
        <a href="${process.env.NEXTAUTH_URL}/sign-in" 
           style="background-color: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
          Sign In
        </a>
      </div>
      <p>If you have any questions, feel free to contact our support team.</p>
      <p>Best regards,<br>The Team</p>
    </div>
  `,
    });
}
/**
* Send a password reset OTP email
*/
export async function sendPasswordResetEmail(email, otp) {
    return await sendEmail({
        to: email,
        subject: "Reset Your Password",
        html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Reset Your Password</h2>
      <p>We received a request to reset your password. Use the verification code below to continue:</p>
      <div style="background-color: #f4f4f4; padding: 15px; text-align: center; font-size: 24px; letter-spacing: 5px; font-weight: bold; margin: 20px 0;">
        ${otp}
      </div>
      <p>This code will expire in 15 minutes.</p>
      <p>If you didn't request this password reset, please ignore this email or contact support if you have concerns.</p>
    </div>
  `,
    });
}
/**
* Send a login notification email for security monitoring
*/
export async function sendLoginNotificationEmail(email) {
    const now = new Date();
    const formattedDate = now.toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short'
    });
    return await sendEmail({
        to: email,
        subject: "New Sign-In to Your Account",
        html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>New Sign-In Detected</h2>
      <p>Hello,</p>
      <p>We detected a new sign-in to your account at:</p>
      <p style="font-weight: bold; font-size: 16px; margin: 15px 0;">${formattedDate}</p>
      <p>If this was you, you can ignore this email.</p>
      <p>If you didn't sign in recently, please secure your account by changing your password immediately.</p>
      <div style="margin: 25px 0;">
        <a href="${process.env.NEXTAUTH_URL}/forgot-password" 
           style="background-color: #EF4444; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
          Secure My Account
        </a>
      </div>
      <p>Best regards,<br>The Security Team</p>
    </div>
  `,
    });
}
/**
* Send an email confirming password change
*/
export async function sendPasswordChangedEmail(email) {
    const now = new Date();
    const formattedDate = now.toLocaleString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        timeZoneName: 'short'
    });
    return await sendEmail({
        to: email,
        subject: "Your Password Has Been Changed",
        html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Password Changed</h2>
      <p>Hello,</p>
      <p>Your password was changed on ${formattedDate}.</p>
      <p>If you made this change, you can ignore this email.</p>
      <p>If you didn't change your password, please secure your account immediately:</p>
      <div style="margin: 25px 0;">
        <a href="${process.env.NEXTAUTH_URL}/forgot-password" 
           style="background-color: #EF4444; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
          Secure My Account
        </a>
      </div>
      <p>Best regards,<br>The Security Team</p>
    </div>
  `,
    });
}
