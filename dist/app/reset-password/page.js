"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
const resetPasswordSchema = z.object({
    password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters" })
        .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
        .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
        .regex(/[0-9]/, { message: "Password must contain at least one number" }),
    confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});
// Create a client component that uses useSearchParams
function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isLoading, setIsLoading] = useState(false);
    const [resetSuccess, setResetSuccess] = useState(false);
    const token = searchParams.get("token") || "";
    const email = searchParams.get("email") || "";
    useEffect(() => {
        // Debug information
        if (process.env.NODE_ENV === 'development') {
            console.log("Token:", token);
            console.log("Email:", email);
        }
    }, [token, email]);
    const form = useForm({
        resolver: zodResolver(resetPasswordSchema),
        defaultValues: {
            password: "",
            confirmPassword: "",
        },
    });
    async function onSubmit(data) {
        setIsLoading(true);
        try {
            if (!token || !email) {
                throw new Error("Missing required parameters");
            }
            console.log("Submitting reset password with token:", token.substring(0, 10) + "...");
            const response = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    token,
                    email,
                    password: data.password,
                }),
            });
            const result = await response.json();
            if (!response.ok) {
                console.error("Reset password error:", result);
                throw new Error(result.message || "Failed to reset password");
            }
            setResetSuccess(true);
            toast.success("Password reset successful! You can now sign in with your new password.");
            // Redirect to signin page after 3 seconds
            setTimeout(() => {
                router.push("/sign-in");
            }, 3000);
        }
        catch (error) {
            toast.error(error.message || "Something went wrong. Please try again.");
        }
        finally {
            setIsLoading(false);
        }
    }
    if (!token || !email) {
        return (_jsx("div", { className: "flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 px-4", children: _jsxs(Card, { className: "w-full max-w-md shadow-lg", children: [_jsxs(CardHeader, { className: "space-y-1 text-center", children: [_jsx("div", { className: "flex justify-center mb-2", children: _jsx("img", { src: "/logo.svg", alt: "Logo", className: "h-12 w-auto" }) }), _jsx("h1", { className: "text-2xl font-bold tracking-tight", children: "Invalid Request" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Missing required parameters to reset your password." })] }), _jsxs(CardContent, { className: "text-center pt-6", children: [_jsx("p", { className: "mb-4", children: "Please try the password reset process again." }), _jsx(Link, { href: "/forgot-password", children: _jsx(Button, { className: "w-full", children: "Go to Reset Password" }) })] })] }) }));
    }
    return (_jsx("div", { className: "flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 px-4", children: _jsxs(Card, { className: "w-full max-w-md shadow-lg", children: [_jsxs(CardHeader, { className: "space-y-1 text-center", children: [_jsx("div", { className: "flex justify-center mb-2", children: _jsx("img", { src: "/logo.svg", alt: "Logo", className: "h-12 w-auto" }) }), _jsx("h1", { className: "text-2xl font-bold tracking-tight", children: "Reset Your Password" }), _jsx("p", { className: "text-sm text-muted-foreground", children: resetSuccess
                                ? "Your password has been reset successfully"
                                : "Enter your new password below" })] }), _jsx(CardContent, { className: "space-y-4", children: !resetSuccess ? (_jsxs("form", { onSubmit: form.handleSubmit(onSubmit), className: "space-y-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "password", children: "New Password" }), _jsx(Input, Object.assign({ id: "password", type: "password", autoComplete: "new-password" }, form.register("password"), { disabled: isLoading })), form.formState.errors.password && (_jsx("p", { className: "text-sm text-red-500", children: form.formState.errors.password.message }))] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "confirmPassword", children: "Confirm New Password" }), _jsx(Input, Object.assign({ id: "confirmPassword", type: "password", autoComplete: "new-password" }, form.register("confirmPassword"), { disabled: isLoading })), form.formState.errors.confirmPassword && (_jsx("p", { className: "text-sm text-red-500", children: form.formState.errors.confirmPassword.message }))] }), _jsx(Button, { type: "submit", className: "w-full", disabled: isLoading, children: isLoading ? (_jsxs(_Fragment, { children: [_jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }), " Resetting password"] })) : ("Reset Password") })] })) : (_jsxs("div", { className: "text-center space-y-4", children: [_jsx("div", { className: "bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 p-4 rounded-lg", children: _jsx("p", { children: "Your password has been reset successfully. You will be redirected to the sign-in page in a few seconds." }) }), _jsx(Link, { href: "/sign-in", children: _jsx(Button, { className: "w-full", children: "Sign In Now" }) })] })) }), !resetSuccess && (_jsx(CardFooter, { className: "text-center", children: _jsxs("p", { className: "text-sm text-muted-foreground", children: ["Remember your password?", " ", _jsx(Link, { href: "/sign-in", className: "text-primary hover:underline", children: "Back to sign in" })] }) }))] }) }));
}
// Main component with Suspense boundary
export default function ResetPassword() {
    return (_jsx(Suspense, { fallback: _jsx("div", { className: "flex items-center justify-center min-h-screen", children: _jsx("div", { className: "w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" }) }), children: _jsx(ResetPasswordForm, {}) }));
}
