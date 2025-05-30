"use client";
import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect, useRef, Suspense } from "react";
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
const verifyOtpSchema = z.object({
    otp: z.string().length(6, { message: "OTP must be 6 digits" }).regex(/^\d+$/, {
        message: "OTP must contain only numbers",
    }),
});
function VerifyOtpForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isLoading, setIsLoading] = useState(false);
    const email = searchParams.get("email") || "";
    const [otpValues, setOtpValues] = useState(Array(6).fill(""));
    const [countdown, setCountdown] = useState(300); // 5 minutes in seconds
    const inputRefs = Array(6).fill(0).map(() => useRef(null));
    const form = useForm({
        resolver: zodResolver(verifyOtpSchema),
        defaultValues: {
            otp: "",
        },
    });
    // Countdown timer
    useEffect(() => {
        var _a;
        // Redirect to forgot-password page if no email is provided
        if (!email) {
            toast.error("Email is required for verification");
            router.push("/forgot-password");
            return;
        }
        // Focus the first input field when component mounts
        (_a = inputRefs[0].current) === null || _a === void 0 ? void 0 : _a.focus();
        // Initialize countdown timer
        const timer = setInterval(() => {
            setCountdown((prevCountdown) => {
                if (prevCountdown <= 1) {
                    clearInterval(timer);
                    return 0;
                }
                return prevCountdown - 1;
            });
        }, 1000);
        // Clean up interval on component unmount
        return () => clearInterval(timer);
    }, [email, router]);
    // Format the remaining time as MM:SS
    const formatTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    };
    // Auto-submit when all fields are filled
    useEffect(() => {
        const completeOtp = otpValues.join('');
        if (completeOtp.length === 6 && /^\d{6}$/.test(completeOtp)) {
            form.setValue("otp", completeOtp);
            // Add a small delay before auto-submitting
            const autoSubmitTimer = setTimeout(() => {
                form.handleSubmit(onSubmit)();
            }, 500);
            return () => clearTimeout(autoSubmitTimer);
        }
    }, [otpValues]);
    // Handle OTP input fields
    const handleChange = (index, value) => {
        var _a;
        if (value.length > 1) {
            // Only take the first character if someone pastes multiple digits
            value = value.slice(0, 1);
        }
        if (value && !/^\d$/.test(value)) {
            // Ignore non-numeric characters
            return;
        }
        const newOtpValues = [...otpValues];
        newOtpValues[index] = value;
        setOtpValues(newOtpValues);
        // Auto focus to next input field
        if (value && index < 5) {
            (_a = inputRefs[index + 1].current) === null || _a === void 0 ? void 0 : _a.focus();
        }
        // Update the form value with the complete OTP
        form.setValue("otp", newOtpValues.join(""));
    };
    const handleKeyDown = (index, e) => {
        var _a, _b, _c;
        // Handle backspace: clear current value and move focus to previous input
        if (e.key === "Backspace") {
            if (!otpValues[index]) {
                // If current field is empty, move to previous field
                if (index > 0) {
                    const newOtpValues = [...otpValues];
                    newOtpValues[index - 1] = '';
                    setOtpValues(newOtpValues);
                    (_a = inputRefs[index - 1].current) === null || _a === void 0 ? void 0 : _a.focus();
                }
            }
            else {
                // Clear current field
                const newOtpValues = [...otpValues];
                newOtpValues[index] = '';
                setOtpValues(newOtpValues);
            }
        }
        // Handle arrow keys for navigation
        else if (e.key === "ArrowLeft" && index > 0) {
            (_b = inputRefs[index - 1].current) === null || _b === void 0 ? void 0 : _b.focus();
        }
        else if (e.key === "ArrowRight" && index < 5) {
            (_c = inputRefs[index + 1].current) === null || _c === void 0 ? void 0 : _c.focus();
        }
    };
    const handlePaste = (e) => {
        var _a, _b;
        e.preventDefault();
        const pastedData = e.clipboardData.getData("text").trim();
        // Check if pasted data is numeric and has expected length
        if (/^\d+$/.test(pastedData)) {
            // Distribute pasted digits across input fields
            const pastedChars = pastedData.split("").slice(0, 6);
            const newOtpValues = [...otpValues];
            pastedChars.forEach((char, index) => {
                if (index < 6) {
                    newOtpValues[index] = char;
                }
            });
            setOtpValues(newOtpValues);
            form.setValue("otp", newOtpValues.join(""));
            // Focus the next empty field or the last field
            const nextEmptyIndex = newOtpValues.findIndex(val => !val);
            if (nextEmptyIndex !== -1) {
                (_a = inputRefs[nextEmptyIndex].current) === null || _a === void 0 ? void 0 : _a.focus();
            }
            else {
                (_b = inputRefs[5].current) === null || _b === void 0 ? void 0 : _b.focus();
            }
        }
    };
    const handleRequestNewCode = async () => {
        var _a;
        if (!email) {
            toast.error("Email is required");
            return;
        }
        setIsLoading(true);
        try {
            const response = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            if (!response.ok) {
                throw new Error("Failed to send new code");
            }
            toast.success("New verification code sent", {
                description: "Please check your email for the new code"
            });
            // Reset the timer
            setCountdown(300);
            // Clear the OTP fields
            setOtpValues(Array(6).fill(""));
            // Focus on first input
            (_a = inputRefs[0].current) === null || _a === void 0 ? void 0 : _a.focus();
        }
        catch (error) {
            toast.error("Failed to send new code", {
                description: "Please try again later"
            });
        }
        finally {
            setIsLoading(false);
        }
    };
    async function onSubmit(data) {
        var _a;
        setIsLoading(true);
        try {
            const response = await fetch("/api/auth/verify-otp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp: data.otp }),
            });
            const result = await response.json();
            if (!response.ok) {
                throw new Error(result.message || "Failed to verify OTP");
            }
            //After successful OTP verification
            toast.success("OTP verified", {
                description: "Your verification was successful.",
            });
            // Redirect to reset password page with the token
            router.push(`/reset-password?token=${encodeURIComponent(result.token)}&email=${encodeURIComponent(email)}`);
        }
        catch (error) {
            toast.error("Error", {
                description: error.message || "Invalid or expired OTP. Please try again.",
            });
            // Clear the OTP fields on error
            setOtpValues(Array(6).fill(""));
            // Focus on first input
            (_a = inputRefs[0].current) === null || _a === void 0 ? void 0 : _a.focus();
        }
        finally {
            setIsLoading(false);
        }
    }
    return (_jsx("div", { className: "flex items-center justify-center min-h-screen bg-gray-50 dark:bg-gray-900 px-4", children: _jsxs(Card, { className: "w-full max-w-md shadow-lg", children: [_jsxs(CardHeader, { className: "space-y-1 text-center", children: [_jsx("div", { className: "flex justify-center mb-2", children: _jsx("img", { src: "/logo.svg", alt: "Logo", className: "h-12 w-auto" }) }), _jsx("h1", { className: "text-2xl font-bold tracking-tight", children: "Enter verification code" }), _jsx("p", { className: "text-sm text-muted-foreground", children: email ? (_jsxs(_Fragment, { children: ["We've sent a 6-digit code to ", _jsx("span", { className: "font-medium", children: email })] })) : ("Enter the 6-digit code from your email") })] }), _jsxs(CardContent, { className: "space-y-4", children: [_jsxs("form", { onSubmit: form.handleSubmit(onSubmit), className: "space-y-4", children: [_jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex justify-between items-center", children: [_jsx(Label, { htmlFor: "otp-input", children: "Verification Code" }), _jsx("span", { className: `text-sm font-medium ${countdown < 60 ? 'text-red-500' : 'text-muted-foreground'}`, children: formatTime(countdown) })] }), _jsx("div", { className: "flex justify-between gap-2", children: Array(6).fill(0).map((_, index) => (_jsx(Input, { ref: inputRefs[index], className: "w-12 h-12 text-center text-xl", type: "text", inputMode: "numeric", autoComplete: "one-time-code", maxLength: 1, value: otpValues[index], onChange: (e) => handleChange(index, e.target.value), onKeyDown: (e) => handleKeyDown(index, e), onPaste: index === 0 ? handlePaste : undefined, disabled: isLoading || countdown === 0 }, index))) }), form.formState.errors.otp && (_jsx("p", { className: "text-sm text-red-500 mt-2", children: form.formState.errors.otp.message })), countdown === 0 && (_jsx("p", { className: "text-sm text-red-500 mt-2", children: "Code expired. Please request a new one." }))] }), _jsx(Button, { type: "submit", className: "w-full", disabled: isLoading || countdown === 0 || otpValues.join("").length !== 6, children: isLoading ? (_jsxs(_Fragment, { children: [_jsx(Loader2, { className: "mr-2 h-4 w-4 animate-spin" }), " Verifying"] })) : ("Verify code") })] }), _jsx("div", { className: "text-center text-sm", children: _jsxs("p", { className: "text-muted-foreground", children: ["Didn't receive a code?", " ", _jsx(Button, { variant: "link", className: "p-0 h-auto text-primary hover:underline", onClick: handleRequestNewCode, disabled: isLoading || countdown > 0, children: countdown > 0 ? `Request again in ${formatTime(countdown)}` : "Request again" })] }) })] }), _jsx(CardFooter, { className: "text-center", children: _jsxs("p", { className: "text-sm text-muted-foreground", children: ["Remember your password?", " ", _jsx(Link, { href: "/sign-in", className: "text-primary hover:underline", children: "Back to sign in" })] }) })] }) }));
}
// Main component with Suspense boundary
export default function VerifyOtp() {
    return (_jsx(Suspense, { fallback: _jsx("div", { className: "flex items-center justify-center min-h-screen", children: _jsx("div", { className: "w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" }) }), children: _jsx(VerifyOtpForm, {}) }));
}
