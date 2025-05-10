import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-16 flex flex-col items-center">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <Image src="/logo.svg" alt="Logo" width={120} height={120} priority />
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600">
            Secure Authentication
          </h1>
          <p className="text-lg md:text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
            A modern, secure authentication system with multiple sign-in methods and robust password reset functionality.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/sign-in">
              <Button size="lg" className="w-full sm:w-auto">
                Sign In
              </Button>
            </Link>
            <Link href="/sign-up">
              <Button variant="outline" size="lg" className="w-full sm:w-auto">
                Create Account
              </Button>
            </Link>
          </div>
        </div>

        {/* Features Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 w-full max-w-6xl">
          <Card className="bg-white dark:bg-gray-800/50 border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="rounded-full bg-blue-100 dark:bg-blue-900/30 p-3 w-12 h-12 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-blue-600 dark:text-blue-400">
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Secure Authentication</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Industry-standard security practices including password hashing and JWT-based sessions.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800/50 border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="rounded-full bg-purple-100 dark:bg-purple-900/30 p-3 w-12 h-12 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-purple-600 dark:text-purple-400">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Multiple Sign-in Options</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Sign in with email, Google, or GitHub accounts for a seamless authentication experience.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-white dark:bg-gray-800/50 border-0 shadow-md hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="rounded-full bg-green-100 dark:bg-green-900/30 p-3 w-12 h-12 flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6 text-green-600 dark:text-green-400">
                  <rect width="20" height="14" x="2" y="5" rx="2" />
                  <line x1="2" x2="22" y1="10" y2="10" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Password Recovery</h3>
              <p className="text-gray-600 dark:text-gray-300">
                Secure password reset flow with verification codes and email notifications.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center mb-16 max-w-3xl">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Ready to get started?</h2>
          <p className="text-gray-600 dark:text-gray-300 mb-6">
            Create an account today and experience our secure authentication system.
          </p>
          <Link href="/sign-up">
            <Button size="lg">
              Create Your Account
            </Button>
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-700 py-8">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500 dark:text-gray-400">
          <p>© {new Date().getFullYear()} Auth System. All rights reserved.</p>
          <div className="flex justify-center gap-6 mt-4">
            <Link href="/terms" className="hover:text-gray-700 dark:hover:text-gray-300">Terms</Link>
            <Link href="/privacy" className="hover:text-gray-700 dark:hover:text-gray-300">Privacy</Link>
            <Link href="#" className="hover:text-gray-700 dark:hover:text-gray-300">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}