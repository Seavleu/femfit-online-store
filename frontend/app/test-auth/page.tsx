'use client';

import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { useState } from 'react';

export default function TestAuthPage() {
  const { user, loading, signIn, signOut } = useSupabaseAuth();
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      await signIn('google');
      // Supabase OAuth will handle the redirect automatically
    } catch (error) {
      // Handle sign-in error
      console.error('Sign-in error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Authentication Test Page</h1>
        
        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Current Session Status</h2>
          <div className="space-y-2">
            <p><strong>Status:</strong> {loading ? 'Loading...' : (user ? 'Authenticated' : 'Not authenticated')}</p>
            <p><strong>Authenticated:</strong> {user ? 'Yes' : 'No'}</p>
            {user && (
              <>
                <p><strong>User ID:</strong> {user.id}</p>
                <p><strong>Email:</strong> {user.email}</p>
                <p><strong>Name:</strong> {user.user_metadata?.name || 'N/A'}</p>
                <p><strong>Role:</strong> {user.user_metadata?.role || 'N/A'}</p>
              </>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Actions</h2>
          <div className="space-y-4">
            {!user ? (
              <button
                onClick={handleGoogleSignIn}
                disabled={isLoading}
                className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {isLoading ? 'Signing in...' : 'Test Google Sign-In'}
              </button>
            ) : (
              <div className="space-y-2">
                <button
                  onClick={() => signOut()}
                  className="w-full bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700"
                >
                  Sign Out
                </button>
                <a
                  href="/dashboard"
                  className="block w-full bg-green-600 text-white py-2 px-4 rounded hover:bg-green-700 text-center"
                >
                  Go to Dashboard
                </a>
              </div>
            )}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Debug Information</h2>
          <div className="space-y-2 text-sm">
            <p><strong>NEXTAUTH_URL:</strong> {process.env.NEXTAUTH_URL || 'Not set'}</p>
            <p><strong>NEXTAUTH_SECRET:</strong> {process.env.NEXTAUTH_SECRET ? 'Set' : 'Not set'}</p>
            <p><strong>GOOGLE_CLIENT_ID:</strong> {process.env.GOOGLE_CLIENT_ID ? 'Set' : 'Not set'}</p>
            <p><strong>GOOGLE_CLIENT_SECRET:</strong> {process.env.GOOGLE_CLIENT_SECRET ? 'Set' : 'Not set'}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
