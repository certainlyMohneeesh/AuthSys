"use client";

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

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPassword() {
    const [isLoading, setIsLoading] = useState(false);
    const [emailSent, setEmailSent] = useState(false);
    const [emailValue, setEmailValue] = useState("");

    const form = useForm<ForgotPasswordFormValues>({
        resolver: zodResolver(forgotPasswordSchema),
        defaultValues: {
            email: "",
        },
    });

    async function onSubmit(data: ForgotPasswordFormValues) {
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

        } catch (error: any) {
            toast.error(error.message || "Something went wrong. Please try again.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 px-4">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="space-y-1 text-center">
                    <div className="flex justify-center mb-2">
                        <img src="/logo.svg" alt="Logo" className="h-12 w-auto" />
                    </div>
                    <h1 className="text-2xl font-bold tracking-tight">Forgot your password?</h1>
                    <p className="text-sm text-muted-foreground">
                        {emailSent
                            ? "We've sent you an email with a verification code."
                            : "Enter your email and we'll send you a verification code to reset your password."}
                    </p>
                </CardHeader>
                <CardContent className="space-y-4">
                    {!emailSent ? (
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
                            <Button type="submit" className="w-full" disabled={isLoading}>
                                {isLoading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                                    </>
                                ) : (
                                    "Send verification code"
                                )}
                            </Button>
                        </form>
                    ) : (
                        <div className="space-y-4">
                            <p className="text-center text-sm">
                                We've sent a verification code to your email. Please check your inbox and enter the code on the next screen.
                            </p>
                            <Button
                                className="w-full"
                                variant="outline"
                                onClick={() => setEmailSent(false)}
                            >
                                Didn't receive code? Try again
                            </Button>
                            <Link href={`/verify-otp?email=${encodeURIComponent(emailValue)}`} className="block">
                                <Button className="w-full">
                                    Enter verification code
                                </Button>
                            </Link>
                        </div>
                    )}
                </CardContent>
                <CardFooter className="text-center">
                    <p className="text-sm text-muted-foreground">
                        Remember your password?{" "}
                        <Link href="/src/app/sign-in" className="text-primary hover:underline">
                            Sign in
                        </Link>
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}