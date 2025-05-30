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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Github, AtSign } from "lucide-react";
import { signIn } from "next-auth/react";
import { toast } from "sonner";
const loginSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
    rememberMe: z.boolean().optional(),
});
export default function SignIn() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isGithubLoading, setIsGithubLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const form = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
            rememberMe: false,
        },
    });
    async function onSubmit(data) {
        setIsLoading(true);
        try {
            const result = await signIn("credentials", {
                email: data.email,
                password: data.password,
                redirect: false,
            });
            if (result === null || result === void 0 ? void 0 : result.error) {
                toast.error("Authentication failed", {
                    description: "Invalid email or password. Please try again.",
                });
            }
            else {
                toast.success("Success!", {
                    description: "You have been signed in successfully.",
                });
                router.push("/dashboard");
                router.refresh();
            }
        }
        catch (error) {
            toast.error("Error", {
                description: "Something went wrong. Please try again.",
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
    return (_jsx("div", { className: "flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 px-4", children: _jsxs(Card, { className: "w-full max-w-md shadow-lg", children: [_jsxs(CardHeader, { className: "space-y-1 text-center", children: [_jsx("div", { className: "flex justify-center mb-2", children: _jsx("img", { src: "/logo.svg", alt: "Logo", className: "h-12 w-auto" }) }), _jsx("h1", { className: "text-2xl font-bold tracking-tight", children: "Welcome back" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Sign in to your account to continue" })] }), _jsx(CardContent, { children: _jsxs(Tabs, { defaultValue: "credentials", className: "w-full", children: [_jsxs(TabsList, { className: "grid w-full grid-cols-3 mb-4", children: [_jsxs(TabsTrigger, { value: "credentials", children: [_jsx(AtSign, { className: "h-4 w-4 mr-2" }), "Email"] }), _jsxs(TabsTrigger, { value: "github", children: [_jsx(Github, { className: "h-4 w-4 mr-2" }), "GitHub"] }), _jsxs(TabsTrigger, { value: "google", children: [_jsxs("svg", { className: "h-4 w-4 mr-2", xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", children: [_jsx("path", { d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z", fill: "#4285F4" }), _jsx("path", { d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z", fill: "#34A853" }), _jsx("path", { d: "M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z", fill: "#FBBC05" }), _jsx("path", { d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z", fill: "#EA4335" }), _jsx("path", { d: "M1 1h22v22H1z", fill: "none" })] }), "Google"] })] }), _jsx(TabsContent, { value: "credentials", className: "space-y-4", children: _jsxs("form", { onSubmit: form.handleSubmit(onSubmit), className: "space-y-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsx(Label, { htmlFor: "email", children: "Email" }), _jsx(Input, Object.assign({ id: "email", type: "email", placeholder: "name@example.com", autoComplete: "email" }, form.register("email"), { disabled: isLoading })), form.formState.errors.email && (_jsx("p", { className: "text-sm text-red-500", children: form.formState.errors.email.message }))] }), _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex items-center justify-between", children: [_jsx(Label, { htmlFor: "password", children: "Password" }), _jsx(Link, { href: "/forgot-password", className: "text-sm text-primary hover:underline", children: "Forgot password?" })] }), _jsx(Input, Object.assign({ id: "password", type: "password", autoComplete: "current-password" }, form.register("password"), { disabled: isLoading })), form.formState.errors.password && (_jsx("p", { className: "text-sm text-red-500", children: form.formState.errors.password.message }))] }), _jsxs("div", { className: "flex items-center space-x-2", children: [_jsx(Checkbox, Object.assign({ id: "remember" }, form.register("rememberMe"), { disabled: isLoading })), _jsx(Label, { htmlFor: "remember", className: "text-sm", children: "Remember me" })] }), _jsx(Button, { type: "submit", className: "w-full", disabled: isLoading, children: isLoading ? (_jsxs(_Fragment, { children: [_jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }), " Please wait"] })) : ("Sign in with Email") })] }) }), _jsxs(TabsContent, { value: "github", className: "space-y-4", children: [_jsx("div", { className: "text-center space-y-2 mb-4", children: _jsx("p", { className: "text-sm text-muted-foreground", children: "Sign in with your GitHub account" }) }), _jsx(Button, { onClick: handleGithubSignIn, className: "w-full", disabled: isGithubLoading, children: isGithubLoading ? (_jsxs(_Fragment, { children: [_jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }), " Please wait"] })) : (_jsxs(_Fragment, { children: [_jsx(Github, { className: "mr-2 h-5 w-5" }), " Sign in with GitHub"] })) })] }), _jsxs(TabsContent, { value: "google", className: "space-y-4", children: [_jsx("div", { className: "text-center space-y-2 mb-4", children: _jsx("p", { className: "text-sm text-muted-foreground", children: "Sign in with your Google account" }) }), _jsx(Button, { onClick: handleGoogleSignIn, className: "w-full", disabled: isGoogleLoading, variant: "outline", children: isGoogleLoading ? (_jsxs(_Fragment, { children: [_jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }), " Please wait"] })) : (_jsxs(_Fragment, { children: [_jsxs("svg", { className: "mr-2 h-5 w-5", xmlns: "http://www.w3.org/2000/svg", viewBox: "0 0 24 24", children: [_jsx("path", { d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z", fill: "#4285F4" }), _jsx("path", { d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z", fill: "#34A853" }), _jsx("path", { d: "M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z", fill: "#FBBC05" }), _jsx("path", { d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z", fill: "#EA4335" }), _jsx("path", { d: "M1 1h22v22H1z", fill: "none" })] }), "Sign in with Google"] })) })] })] }) }), _jsx(CardFooter, { className: "text-center", children: _jsxs("p", { className: "text-sm text-muted-foreground", children: ["Don't have an account?", " ", _jsx(Link, { href: "/sign-up", className: "text-primary hover:underline", children: "Sign up" })] }) })] }) }));
}
