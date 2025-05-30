"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Loader2, Github } from "lucide-react";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
const signUpSchema = z.object({
    username: z
        .string()
        .min(3, { message: "Username must be at least 3 characters" })
        .max(20, { message: "Username must be less than 20 characters" })
        .regex(/^[a-zA-Z0-9_]+$/, {
        message: "Username can only contain letters, numbers and underscores",
    }),
    email: z.string().email({ message: "Invalid email address" }),
    password: z
        .string()
        .min(8, { message: "Password must be at least 8 characters" })
        .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
        .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
        .regex(/[0-9]/, { message: "Password must contain at least one number" }),
    confirmPassword: z.string(),
    terms: z.boolean().refine(val => val === true, {
        message: "You must accept the terms and conditions"
    }),
}).refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
});
export default function SignUp() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isGithubLoading, setIsGithubLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const form = useForm({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            username: "",
            email: "",
            password: "",
            confirmPassword: "",
            terms: false,
        },
    });
    async function onSubmit(data) {
        setIsLoading(true);
        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    username: data.username,
                    email: data.email,
                    password: data.password,
                }),
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || "Registration failed");
            }
            // Send welcome email after successful registration
            await fetch("/api/auth/send-welcome-email", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email: data.email,
                    username: data.username
                }),
            }).catch(error => {
                // Log but don't block the flow if welcome email fails
                console.error("Failed to send welcome email:", error);
            });
            toast.success("Account created!", {
                description: "You've successfully created your account. Redirecting to sign in...",
            });
            // Auto sign in after successful registration
            setTimeout(async () => {
                await signIn("credentials", {
                    email: data.email,
                    password: data.password,
                    callbackUrl: "/dashboard",
                });
            }, 2000);
        }
        catch (error) {
            toast.error("Something went wrong. Please try again.", {
                description: error instanceof Error ? error.message : "An unexpected error occurred",
            });
        }
        finally {
            setIsLoading(false);
        }
    }
    const handleGithubSignIn = async () => {
        setIsGithubLoading(true);
        try {
            await signIn("github", { callbackUrl: "/dashboard" });
        }
        catch (_a) {
            toast.error("Error", {
                description: "Failed to sign in with GitHub.",
            });
        }
        finally {
            setIsGithubLoading(false);
        }
    };
    const handleGoogleSignIn = async () => {
        setIsGoogleLoading(true);
        try {
            await signIn("google", { callbackUrl: "/dashboard" });
        }
        catch (_a) {
            toast.error("Error", {
                description: "Failed to sign in with Google.",
            });
        }
        finally {
            setIsGoogleLoading(false);
        }
    };
    return (_jsx("div", { className: "flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 px-4", children: _jsxs(Card, { className: "w-full max-w-md shadow-lg", children: [_jsxs(CardHeader, { className: "space-y-1 text-center", children: [_jsx("div", { className: "flex justify-center mb-2", children: _jsx("img", { src: "/logo.svg", alt: "Logo", className: "h-12 w-auto" }) }), _jsx("h1", { className: "text-2xl font-bold tracking-tight", children: "Create an account" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Enter your details below to create your account" })] }), _jsxs(CardContent, { className: "space-y-4", children: [_jsxs("form", { onSubmit: form.handleSubmit(onSubmit), className: "space-y-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "username", children: "Username" }), _jsx(Input, Object.assign({ id: "username", placeholder: "username", autoComplete: "username" }, form.register("username"), { disabled: isLoading })), form.formState.errors.username && (_jsx("p", { className: "text-sm text-red-500", children: form.formState.errors.username.message }))] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "email", children: "Email" }), _jsx(Input, Object.assign({ id: "email", type: "email", placeholder: "name@example.com", autoComplete: "email" }, form.register("email"), { disabled: isLoading })), form.formState.errors.email && (_jsx("p", { className: "text-sm text-red-500", children: form.formState.errors.email.message }))] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "password", children: "Password" }), _jsx(Input, Object.assign({ id: "password", type: "password", autoComplete: "new-password" }, form.register("password"), { disabled: isLoading })), form.formState.errors.password && (_jsx("p", { className: "text-sm text-red-500", children: form.formState.errors.password.message }))] }), _jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "confirmPassword", children: "Confirm Password" }), _jsx(Input, Object.assign({ id: "confirmPassword", type: "password", autoComplete: "new-password" }, form.register("confirmPassword"), { disabled: isLoading })), form.formState.errors.confirmPassword && (_jsx("p", { className: "text-sm text-red-500", children: form.formState.errors.confirmPassword.message }))] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Checkbox, { id: "terms", checked: form.watch("terms"), onCheckedChange: (checked) => {
                                                form.setValue("terms", checked === true);
                                            }, disabled: isLoading }), _jsxs(Label, { htmlFor: "terms", className: "text-sm", children: ["I agree to the", " ", _jsx(Link, { href: "/terms", className: "text-primary hover:underline", children: "terms of service" }), " ", "and", " ", _jsx(Link, { href: "/privacy", className: "text-primary hover:underline", children: "privacy policy" })] })] }), form.formState.errors.terms && (_jsx("p", { className: "text-sm text-red-500", children: form.formState.errors.terms.message })), _jsx(Button, { type: "submit", className: "w-full", disabled: isLoading, children: isLoading ? (_jsxs(_Fragment, { children: [_jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }), " Please wait"] })) : ("Create account") })] }), _jsxs("div", { className: "relative", children: [_jsx("div", { className: "absolute inset-0 flex items-center", children: _jsx(Separator, { className: "w-full" }) }), _jsx("div", { className: "relative flex justify-center text-xs uppercase", children: _jsx("span", { className: "bg-background px-2 text-muted-foreground", children: "Or continue with" }) })] }), _jsxs("div", { className: "grid grid-cols-2 gap-4", children: [_jsxs(Button, { variant: "outline", onClick: handleGithubSignIn, disabled: isGithubLoading, className: "w-full", children: [isGithubLoading ? (_jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" })) : (_jsx(Github, { className: "mr-2 h-4 w-4" })), "GitHub"] }), _jsxs(Button, { variant: "outline", onClick: handleGoogleSignIn, disabled: isGoogleLoading, className: "w-full", children: [isGoogleLoading ? (_jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" })) : (_jsxs("svg", { className: "mr-2 h-4 w-4", xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", children: [_jsx("path", { d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z", fill: "#4285F4" }), _jsx("path", { d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z", fill: "#34A853" }), _jsx("path", { d: "M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z", fill: "#FBBC05" }), _jsx("path", { d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z", fill: "#EA4335" }), _jsx("path", { d: "M1 1h22v22H1z", fill: "none" })] })), "Google"] })] })] }), _jsx(CardFooter, { className: "text-center", children: _jsxs("p", { className: "text-sm text-muted-foreground", children: ["Already have an account?", " ", _jsx(Link, { href: "/sign-in", className: "text-primary hover:underline", children: "Sign in" })] }) })] }) }));
}
