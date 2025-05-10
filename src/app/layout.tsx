import { Metadata } from "next";
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

export const metadata: Metadata = {
  title: "Auth System - Secure Authentication",
  description: "A modern, secure authentication system with multiple sign-in methods and robust password reset functionality.",
  keywords: ["authentication", "security", "login", "signin", "signup", "nextjs", "react"],
  authors: [{ name: "Auth System Team" }],
  creator: "Auth System",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`font-sans ${inter.variable}`}>
        <Providers>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster position="top-right" richColors closeButton />
        </ThemeProvider>
        
        </Providers>
      </body>
    </html>
  );
}