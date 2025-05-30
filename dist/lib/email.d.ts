/**
 * Email utilities for sending various types of emails
 */
interface EmailOptions {
    to: string;
    subject: string;
    html: string;
}
/**
* Send an email using the configured email provider
*/
export declare function sendEmail({ to, subject, html }: EmailOptions): Promise<boolean>;
/**
* Send a welcome email to new users
*/
export declare function sendWelcomeEmail(email: string, username?: string): Promise<boolean>;
/**
* Send a password reset OTP email
*/
export declare function sendPasswordResetEmail(email: string, otp: string): Promise<boolean>;
/**
* Send a login notification email for security monitoring
*/
export declare function sendLoginNotificationEmail(email: string): Promise<boolean>;
/**
* Send an email confirming password change
*/
export declare function sendPasswordChangedEmail(email: string): Promise<boolean>;
export {};
