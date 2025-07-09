'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { FcGoogle } from "react-icons/fc"
import { signInWithGoogle as signInWithGoogleHelper } from "../lib/supabase"
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const router = useRouter();
  const signInWithGoogle = async () => {
    try {
      await signInWithGoogleHelper();
      // Supabase will handle redirect
    } catch (error) {
      // Optionally handle error
      console.error(error);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center relative">
      <div className="bg-white/90 backdrop-blur-md rounded-2xl p-8 shadow-2xl border border-purple-200/50 max-w-md w-full mx-4 relative z-10">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-purple-600 via-green-600 to-yellow-500 bg-clip-text text-transparent mb-2">
            Welcome Back
          </h2>
          <p className="text-gray-600">Sign in to your ScanCollect account</p>
        </div>
        
        <form className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
            <input 
              type="email" 
              className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/70 backdrop-blur-sm"
              placeholder="Enter your email"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
            <input 
              type="password" 
              className="w-full px-4 py-3 border border-purple-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white/70 backdrop-blur-sm"
              placeholder="Enter your password"
            />
          </div>
          
          <Button className="w-full bg-gradient-to-r from-purple-600 to-green-600 hover:from-purple-700 hover:to-green-700 text-white border-0 shadow-lg">
            Sign In
          </Button>
        </form>
        
        <div className="mt-6">
          <Button
            type="button"
            className="w-full flex items-center justify-center gap-2 border border-gray-200 bg-white text-gray-700 hover:bg-gray-50 shadow"
            onClick={signInWithGoogle}
          >
            <FcGoogle className="text-xl" /> Sign in with Google
          </Button>
        </div>
        
        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Don't have an account?{" "}
            <Link href="/register" className="text-purple-600 hover:text-purple-700 font-medium">
              Sign up
            </Link>
          </p>
        </div>
        
        <div className="mt-6 text-center">
          <Link href="/">
            <Button variant="outline" className="border-purple-200 text-purple-600 hover:bg-purple-50">
              ← Back to Home
            </Button>
          </Link>
        </div>
      </div>
    </main>
  );
}
  