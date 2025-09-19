'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import SignInForm from '@/components/auth/SignInForm';
import { FormCard, PageHeader, LoadingState } from '@/components/design-system';

export default function SignInPage() {
  const router = useRouter();
  const { user, session, loading } = useSupabaseAuth();

  useEffect(() => {
    // Redirect authenticated users to dashboard
    if (user && session && !loading) {
      router.push('/dashboard');
    }
  }, [user, session, loading, router]);

  // Show loading state while checking authentication
  if (loading) {
    return <LoadingState text="Checking authentication..." fullScreen />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page Header */}
      <PageHeader
        title="Sign In"
        description="Welcome back! Please sign in to your account"
        showBackButton
        backHref="/"
        className="bg-white"
      />

      {/* Main Content */}
      <div className="max-w-md mx-auto px-4 py-12">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-black rounded-lg mx-auto mb-6 flex items-center justify-center">
            <span className="text-white font-bold text-xl">F&F</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
          <p className="text-gray-600">Sign in to your account</p>
        </div>

        {/* Form Container */}
        <FormCard
          title="Sign In"
          description="Enter your credentials to access your account"
          padding="lg"
        >
          <SignInForm />
        </FormCard>

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
  );
}