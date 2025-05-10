"use client";

import { useState, useEffect } from "react";
import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, User, Mail } from "lucide-react";

export default function DashboardPage() {
    const { data: session, status } = useSession();
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (status === "unauthenticated") {
            router.push("/sign-in");
        } else if (status === "authenticated") {
            setLoading(false);
        }
    }, [status, router]);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    const handleSignOut = async () => {
        await signOut({ redirect: false });
        router.push("/sign-in");
    };

    // Get initials from name or email for avatar fallback
    const getInitials = () => {
        if (session?.user?.name) {
            return session.user.name
                .split(" ")
                .map((n) => n[0])
                .join("")
                .toUpperCase();
        } else if (session?.user?.email) {
            return session.user.email[0].toUpperCase();
        }
        return "U";
    };

    return (
        <div className="flex min-h-screen bg-gray-50">
            {/* Sidebar */}
            <div className="w-64 bg-white border-r border-gray-200 p-4 hidden md:block">
                <div className="flex items-center justify-center mb-8">
                    <h1 className="text-xl font-bold">App Dashboard</h1>
                </div>
                <nav className="space-y-1">
                    <a
                        href="#"
                        className="flex items-center px-4 py-2 text-sm font-medium rounded-md bg-gray-100 text-gray-900"
                    >
                        Dashboard
                    </a>
                    <a
                        href="#"
                        className="flex items-center px-4 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    >
                        Profile
                    </a>
                    <a
                        href="#"
                        className="flex items-center px-4 py-2 text-sm font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    >
                        Settings
                    </a>
                </nav>
                <div className="absolute bottom-4 w-56">
                    <Button
                        variant="outline"
                        className="w-full justify-start"
                        onClick={handleSignOut}
                    >
                        <LogOut className="mr-2 h-4 w-4" />
                        Sign out
                    </Button>
                </div>
            </div>

            {/* Main content */}
            <div className="flex-1 flex flex-col">
                {/* Mobile header */}
                <header className="bg-white border-b border-gray-200 p-4 md:hidden">
                    <div className="flex items-center justify-between">
                        <h1 className="text-xl font-bold">App Dashboard</h1>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={handleSignOut}
                        >
                            <LogOut className="h-5 w-5" />
                        </Button>
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 p-6">
                    <h1 className="text-2xl font-bold mb-6">Welcome to Your Dashboard</h1>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                        {/* User Profile Card */}
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle>Your Profile</CardTitle>
                                <CardDescription>Account information</CardDescription>
                            </CardHeader>
                            <CardContent className="pt-4 pb-2">
                                <div className="flex items-center space-x-4">
                                    <Avatar className="h-16 w-16">
                                        <AvatarImage src={session?.user?.image || ""} alt="User Avatar" />
                                        <AvatarFallback className="text-lg">{getInitials()}</AvatarFallback>
                                    </Avatar>
                                    <div>
                                        <p className="text-lg font-medium">{session?.user?.name || session?.user?.username || "User"}</p>
                                        <div className="flex items-center text-sm text-muted-foreground">
                                            <Mail className="h-3.5 w-3.5 mr-1" />
                                            {session?.user?.email}
                                        </div>
                                    </div>
                                </div>
                            </CardContent>
                            <CardFooter>
                                <Button variant="outline" size="sm" className="w-full">
                                    <User className="h-4 w-4 mr-2" />
                                    Edit Profile
                                </Button>
                            </CardFooter>
                        </Card>

                        {/* Statistics Cards */}
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle>Statistics</CardTitle>
                                <CardDescription>Your account stats</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-2">
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Login streak</span>
                                        <span className="font-medium">1 day</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Last login</span>
                                        <span className="font-medium">Today</span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="text-muted-foreground">Member since</span>
                                        <span className="font-medium">May 2025</span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Quick Actions Card */}
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle>Quick Actions</CardTitle>
                                <CardDescription>Common tasks</CardDescription>
                            </CardHeader>
                            <CardContent className="pt-4 pb-2">
                                <div className="space-y-2">
                                    <Button variant="outline" size="sm" className="w-full justify-start">
                                        Update profile
                                    </Button>
                                    <Button variant="outline" size="sm" className="w-full justify-start">
                                        Change password
                                    </Button>
                                    <Button variant="outline" size="sm" className="w-full justify-start">
                                        Privacy settings
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Recent Activity Card */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Recent Activity</CardTitle>
                            <CardDescription>Your latest account activity</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="border-l-4 border-green-500 pl-4 py-2">
                                    <p className="font-medium">Successful login</p>
                                    <p className="text-sm text-muted-foreground">Just now</p>
                                </div>
                                <div className="border-l-4 border-blue-500 pl-4 py-2">
                                    <p className="font-medium">Account created</p>
                                    <p className="text-sm text-muted-foreground">May 8, 2025</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </main>
            </div>
        </div>
    );
}