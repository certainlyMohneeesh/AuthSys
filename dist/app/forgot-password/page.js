"use client";
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from "react";
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
const forgotPasswordSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
});
export default function ForgotPassword() {
    const [isLoading, setIsLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const [emailValue, setEmailValue] = useState("");
    const form = useForm({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: "",
        },
    });
    async function onSubmit(data) {
        setIsLoading(true);
        setEmailValue(data.email);
        try {
            const response = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email: data.email }),
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || "Failed to process request");
            }
            setEmailSent(true);
            toast.success("Check your inbox for the password reset link.");
        }
        catch (error) {
            toast.error(error.message || "Something went wrong. Please try again.");
        }
        finally {
            setIsLoading(false);
        }
    }
    return (_jsx("div", { className: "flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 px-4", children: _jsxs(Card, { className: "w-full max-w-md shadow-lg", children: [_jsxs(CardHeader, { className: "space-y-1 text-center", children: [_jsx("div", { className: "flex justify-center mb-2", children: _jsx("img", { src: "/logo.svg", alt: "Logo", className: "h-12 w-auto" }) }), _jsx("h1", { className: "text-2xl font-bold tracking-tight", children: "Forgot your password?" }), _jsx("p", { className: "text-sm text-muted-foreground", children: emailSent
                                ? "We've sent you an email with a verification code."
                                : "Enter your email and we'll send you a verification code to reset your password." })] }), _jsx(CardContent, { className: "space-y-4", children: !emailSent ? (_jsxs("form", { onSubmit: form.handleSubmit(onSubmit), className: "space-y-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "email", children: "Email" }), _jsx(Input, Object.assign({ id: "email", type: "email", placeholder: "name@example.com", autoComplete: "email" }, form.register("email"), { disabled: isLoading })), form.formState.errors.email && (_jsx("p", { className: "text-sm text-red-500", children: form.formState.errors.email.message }))] }), _jsx(Button, { type: "submit", className: "w-full", disabled: isLoading, children: isLoading ? (_jsxs(_Fragment, { children: [_jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }), " Please wait"] })) : ("Send verification code") })] })) : (_jsxs("div", { className: "space-y-4", children: [_jsx("p", { className: "text-center text-sm", children: "We've sent a verification code to your email. Please check your inbox and enter the code on the next screen." }), _jsx(Button, { className: "w-full", variant: "outline", onClick: () => setEmailSent(false), children: "Didn't receive code? Try again" }), _jsx(Link, { href: `/verify-otp?email=${encodeURIComponent(emailValue)}`, className: "block", children: _jsx(Button, { className: "w-full", children: "Enter verification code" }) })] })) }), _jsx(CardFooter, { className: "text-center", children: _jsxs("p", { className: "text-sm text-muted-foreground", children: ["Remember your password?", " ", _jsx(Link, { href: "/src/app/sign-in", className: "text-primary hover:underline", children: "Sign in" })] }) })] }) }));
}
