import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Inter } from "next/font/google";
import { Toaster } from "sonner";
import { ThemeProvider } from "@/components/ui/theme-provider";
import { Providers } from "./Providers";
import "./globals.css";
const inter = Inter({
    subsets: ["latin"],
    display: "swap",
    variable: "--font-sans",
});
export const metadata = {
    title: "Auth System - Secure Authentication",
    description: "A modern, secure authentication system with multiple sign-in methods and robust password reset functionality.",
    keywords: ["authentication", "security", "login", "signin", "signup", "nextjs", "react"],
    authors: [{ name: "Auth System Team" }],
    creator: "Auth System",
};
export default function RootLayout({ children, }) {
    return (_jsx("html", { lang: "en", suppressHydrationWarning: true, children: _jsx("body", { className: `font-sans ${inter.variable}`, children: _jsx(Providers, { children: _jsxs(ThemeProvider, { attribute: "class", defaultTheme: "system", enableSystem: true, disableTransitionOnChange: true, children: [children, _jsx(Toaster, { position: "top-right", richColors: true, closeButton: true })] }) }) }) }));
}
