'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import gsap from 'gsap';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import SignInForm from '@/components/auth/SignInForm';

export default function SignInPage() {
  const router = useRouter();
  const { user, session, loading } = useSupabaseAuth();
  const formRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Redirect authenticated users to dashboard
    if (user && session && !loading) {
      router.push('/dashboard');
    }

    // Animate form on load
    if (formRef.current) {
      gsap.fromTo(formRef.current.children,
        { y: 30, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.15, ease: 'power3.out' }
      );
    }
  }, [user, session, loading, router]);

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white flex items-center justify-center">
        <div className="w-16 h-16 bg-white shadow-lg rounded-lg flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-gray-200 border-t-black"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-white">
      {/* Back Button */}
      <div className="absolute top-8 left-8 z-10">
        <Link
          href="/"
          className="w-12 h-12 bg-white shadow-lg rounded-lg flex items-center justify-center hover:shadow-xl transition-all duration-300 group"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600 group-hover:text-black transition-colors" />
        </Link>
      </div>

      {/* Main Content */}
      <div className="flex items-center justify-center min-h-screen px-6">
        <div className="w-full max-w-md">
          {/* Logo/Brand */}
          <div className="text-center mb-12">
            <div className="w-20 h-20 bg-black rounded-lg mx-auto mb-6 flex items-center justify-center">
              <span className="text-white font-bold text-xl">F&F</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
            <p className="text-gray-600">Sign in to your account</p>
          </div>

          {/* Form Container */}
          <div ref={formRef} className="bg-white shadow-2xl rounded-lg p-8">
            <SignInForm />
          </div>

          {/* Sign Up Link */}
          <div className="text-center mt-8">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link 
                href="/auth/signup" 
                className="text-black font-semibold hover:underline transition-colors"
              >
                Sign up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}