"use client";

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
import { Separator } from "@/components/ui/separator";
import { Loader2, Github, Mail, AtSign } from "lucide-react";
import { signIn } from "next-auth/react";
import { toast } from "sonner";

const loginSchema = z.object({
    email: z.string().email({ message: "Invalid email address" }),
    password: z.string().min(6, { message: "Password must be at least 6 characters" }),
    rememberMe: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function SignIn() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [isGithubLoading, setIsGithubLoading] = useState(false);
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
            rememberMe: false,
        },
    });

    async function onSubmit(data: LoginFormValues) {
        setIsLoading(true);

        try {
            const result = await signIn("credentials", {
                email: data.email,
                password: data.password,
                redirect: false,
            });

            if (result?.error) {
                toast.error("Authentication failed", {
                    description: "Invalid email or password. Please try again.",
                });
            } else {
                toast.success("Success!", {
                    description: "You have been signed in successfully.",
                });
                router.push("/dashboard");
                router.refresh();
            }
        } catch (error) {
            toast.error("Error", {
                description: "Something went wrong. Please try again.",
            });
        } finally {
            setIsLoading(false);
        }
    }

    const handleGithubSignIn = async () => {
        setIsGithubLoading(true);
        try {
            await signIn("github", { callbackUrl: "/dashboard" });
        } catch {
            toast.error("Error", {
                description: "Failed to sign in with GitHub.",
            });
        } finally {
            setIsGithubLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setIsGoogleLoading(true);
        try {
            await signIn("google", { callbackUrl: "/dashboard" });
        } catch {
            toast.error("Error", {
                description: "Failed to sign in with Google.",
            });
        } finally {
            setIsGoogleLoading(false);
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 px-4">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="space-y-1 text-center">
                    <div className="flex justify-center mb-2">
                        <img src="/logo.svg" alt="Logo" className="h-12 w-auto" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight">Welcome back</h1>
                    <p className="text-sm text-muted-foreground">
                        Sign in to your account to continue
                    </p>
                </CardHeader>
                <CardContent>
                    <Tabs defaultValue="credentials" className="w-full">
                        <TabsList className="grid w-full grid-cols-3 mb-4">
                            <TabsTrigger value="credentials">
                                <AtSign className="h-4 w-4 mr-2" />
                                Email
                            </TabsTrigger>
                            <TabsTrigger value="github">
                                <Github className="h-4 w-4 mr-2" />
                                GitHub
                            </TabsTrigger>
                            <TabsTrigger value="google">
                                <svg
                                    className="h-4 w-4 mr-2"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        fill="#4285F4"
                                    />
                                    <path
                                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        fill="#34A853"
                                    />
                                    <path
                                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                        fill="#FBBC05"
                                    />
                                    <path
                                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                        fill="#EA4335"
                                    />
                                    <path d="M1 1h22v22H1z" fill="none" />
                                </svg>
                                Google
                            </TabsTrigger>
                        </TabsList>

                        <TabsContent value="credentials" className="space-y-4">
                            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email</Label>
                                    <Input
                                        id="email"
                                        type="email"
                                        placeholder="name@example.com"
                                        autoComplete="email"
                                        {...form.register("email")}
                                        disabled={isLoading}
                                    />
                                    {form.formState.errors.email && (
                                        <p className="text-sm text-red-500">
                                            {form.formState.errors.email.message}
                                        </p>
                                    )}
                                </div>
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label htmlFor="password">Password</Label>
                                        <Link
                                            href="/forgot-password"
                                            className="text-sm text-primary hover:underline"
                                        >
                                            Forgot password?
                                        </Link>
                                    </div>
                                    <Input
                                        id="password"
                                        type="password"
                                        autoComplete="current-password"
                                        {...form.register("password")}
                                        disabled={isLoading}
                                    />
                                    {form.formState.errors.password && (
                                        <p className="text-sm text-red-500">
                                            {form.formState.errors.password.message}
                                        </p>
                                    )}
                                </div>
                                <div className="flex items-center space-x-2">
                                    <Checkbox
                                        id="remember"
                                        {...form.register("rememberMe")}
                                        disabled={isLoading}
                                    />
                                    <Label htmlFor="remember" className="text-sm">
                                        Remember me
                                    </Label>
                                </div>
                                <Button type="submit" className="w-full" disabled={isLoading}>
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                                        </>
                                    ) : (
                                        "Sign in with Email"
                                    )}
                                </Button>
                            </form>
                        </TabsContent>

                        <TabsContent value="github" className="space-y-4">
                            <div className="text-center space-y-2 mb-4">
                                <p className="text-sm text-muted-foreground">
                                    Sign in with your GitHub account
                                </p>
                            </div>
                            <Button
                                onClick={handleGithubSignIn}
                                className="w-full"
                                disabled={isGithubLoading}
                            >
                                {isGithubLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                                    </>
                                ) : (
                                    <>
                                        <Github className="mr-2 h-5 w-5" /> Sign in with GitHub
                                    </>
                                )}
                            </Button>
                        </TabsContent>

                        <TabsContent value="google" className="space-y-4">
                            <div className="text-center space-y-2 mb-4">
                                <p className="text-sm text-muted-foreground">
                                    Sign in with your Google account
                                </p>
                            </div>
                            <Button
                                onClick={handleGoogleSignIn}
                                className="w-full"
                                disabled={isGoogleLoading}
                                variant="outline"
                            >
                                {isGoogleLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                                    </>
                                ) : (
                                    <>
                                        <svg
                                            className="mr-2 h-5 w-5"
                                            xmlns="http://www.w3.org/2000/svg"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                                fill="#4285F4"
                                            />
                                            <path
                                                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                                fill="#34A853"
                                            />
                                            <path
                                                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                                fill="#FBBC05"
                                            />
                                            <path
                                                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                                fill="#EA4335"
                                            />
                                            <path d="M1 1h22v22H1z" fill="none" />
                                        </svg>
                                        Sign in with Google
                                    </>
                                )}
                            </Button>
                        </TabsContent>
                    </Tabs>
                </CardContent>
                <CardFooter className="text-center">
                    <p className="text-sm text-muted-foreground">
                        Don't have an account?{" "}
                        <Link href="/sign-up" className="text-primary hover:underline">
                            Sign up
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}