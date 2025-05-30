"use client";
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, User, Mail } from "lucide-react";
export default function DashboardPage() {
    var _a, _b, _c, _d;
    const { data: session, status } = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/sign-in");
        }
        else if (status === "authenticated") {
            setLoading(false);
        }
    }, [status, router]);
    if (loading) {
        return (_jsx("div", { className: "flex items-center justify-center min-h-screen", children: _jsx("div", { className: "w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin" }) }));
    }
    const handleSignOut = async () => {
        await signOut({ redirect: false });
        router.push("/sign-in");
    };
    // Get initials from name or email for avatar fallback
    const getInitials = () => {
        var _a, _b;
        if ((_a = session === null || session === void 0 ? void 0 : session.user) === null || _a === void 0 ? void 0 : _a.name) {
            return session.user.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase();
        }
        else if ((_b = session === null || session === void 0 ? void 0 : session.user) === null || _b === void 0 ? void 0 : _b.email) {
            return session.user.email[0].toUpperCase();
        }
        return "U";
    };
    return (_jsxs("div", { className: "flex min-h-screen bg-gray-50", children: [_jsxs("div", { className: "w-64 bg-white border-r border-gray-200 p-4 hidden md:block", children: [_jsx("div", { className: "flex items-center justify-center mb-8", children: _jsx("h1", { className: "text-xl font-bold", children: "App Dashboard" }) }), _jsxs("nav", { className: "space-y-1", children: [_jsx("a", { href: "#", className: "flex items-center px-4 py-2 text-sm font-medium rounded-md bg-gray-100 text-gray-900", children: "Dashboard" }), _jsx("a", { href: "#", className: "flex items-center px-4 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900", children: "Profile" }), _jsx("a", { href: "#", className: "flex items-center px-4 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900", children: "Settings" })] }), _jsx("div", { className: "absolute bottom-4 w-56", children: _jsxs(Button, { variant: "outline", className: "w-full justify-start", onClick: handleSignOut, children: [_jsx(LogOut, { className: "mr-2 h-4 w-4" }), "Sign out"] }) })] }), _jsxs("div", { className: "flex-1 flex flex-col", children: [_jsx("header", { className: "bg-white border-b border-gray-200 p-4 md:hidden", children: _jsxs("div", { className: "flex items-center justify-between", children: [_jsx("h1", { className: "text-xl font-bold", children: "App Dashboard" }), _jsx(Button, { variant: "ghost", size: "sm", onClick: handleSignOut, children: _jsx(LogOut, { className: "h-5 w-5" }) })] }) }), _jsxs("main", { className: "flex-1 p-6", children: [_jsx("h1", { className: "text-2xl font-bold mb-6", children: "Welcome to Your Dashboard" }), _jsxs("div", { className: "grid grid-cols-1 md:grid-cols-3 gap-6 mb-6", children: [_jsxs(Card, { children: [_jsxs(CardHeader, { className: "pb-2", children: [_jsx(CardTitle, { children: "Your Profile" }), _jsx(CardDescription, { children: "Account information" })] }), _jsx(CardContent, { className: "pt-4 pb-2", children: _jsxs("div", { className: "flex items-center space-x-4", children: [_jsxs(Avatar, { className: "h-16 w-16", children: [_jsx(AvatarImage, { src: ((_a = session === null || session === void 0 ? void 0 : session.user) === null || _a === void 0 ? void 0 : _a.image) || "", alt: "User Avatar" }), _jsx(AvatarFallback, { className: "text-lg", children: getInitials() })] }), _jsxs("div", { children: [_jsx("p", { className: "text-lg font-medium", children: ((_b = session === null || session === void 0 ? void 0 : session.user) === null || _b === void 0 ? void 0 : _b.name) || ((_c = session === null || session === void 0 ? void 0 : session.user) === null || _c === void 0 ? void 0 : _c.username) || "User" }), _jsxs("div", { className: "flex items-center text-sm text-muted-foreground", children: [_jsx(Mail, { className: "h-3.5 w-3.5 mr-1" }), (_d = session === null || session === void 0 ? void 0 : session.user) === null || _d === void 0 ? void 0 : _d.email] })] })] }) }), _jsx(CardFooter, { children: _jsxs(Button, { variant: "outline", size: "sm", className: "w-full", children: [_jsx(User, { className: "h-4 w-4 mr-2" }), "Edit Profile"] }) })] }), _jsxs(Card, { children: [_jsxs(CardHeader, { className: "pb-2", children: [_jsx(CardTitle, { children: "Statistics" }), _jsx(CardDescription, { children: "Your account stats" })] }), _jsx(CardContent, { children: _jsxs("div", { className: "space-y-2", children: [_jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-muted-foreground", children: "Login streak" }), _jsx("span", { className: "font-medium", children: "1 day" })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-muted-foreground", children: "Last login" }), _jsx("span", { className: "font-medium", children: "Today" })] }), _jsxs("div", { className: "flex justify-between", children: [_jsx("span", { className: "text-muted-foreground", children: "Member since" }), _jsx("span", { className: "font-medium", children: "May 2025" })] })] }) })] }), _jsxs(Card, { children: [_jsxs(CardHeader, { className: "pb-2", children: [_jsx(CardTitle, { children: "Quick Actions" }), _jsx(CardDescription, { children: "Common tasks" })] }), _jsx(CardContent, { className: "pt-4 pb-2", children: _jsxs("div", { className: "space-y-2", children: [_jsx(Button, { variant: "outline", size: "sm", className: "w-full justify-start", children: "Update profile" }), _jsx(Button, { variant: "outline", size: "sm", className: "w-full justify-start", children: "Change password" }), _jsx(Button, { variant: "outline", size: "sm", className: "w-full justify-start", children: "Privacy settings" })] }) })] })] }), _jsxs(Card, { children: [_jsxs(CardHeader, { children: [_jsx(CardTitle, { children: "Recent Activity" }), _jsx(CardDescription, { children: "Your latest account activity" })] }), _jsx(CardContent, { children: _jsxs("div", { className: "space-y-4", children: [_jsxs("div", { className: "border-l-4 border-green-500 pl-4 py-2", children: [_jsx("p", { className: "font-medium", children: "Successful login" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "Just now" })] }), _jsxs("div", { className: "border-l-4 border-blue-500 pl-4 py-2", children: [_jsx("p", { className: "font-medium", children: "Account created" }), _jsx("p", { className: "text-sm text-muted-foreground", children: "May 8, 2025" })] })] }) })] })] })] })] }));
}
