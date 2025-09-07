'use client';

import { useState } from 'react';
import { LogOut } from 'lucide-react';
import { toast } from 'sonner';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { useRouter } from 'next/navigation';

interface SignOutButtonProps {
  variant?: 'button' | 'dropdown';
  className?: string;
}

export default function SignOutButton({ variant = 'button', className = '' }: SignOutButtonProps) {
  const [isConfirming, setIsConfirming] = useState(false);
  const { signOut } = useSupabaseAuth();
  const router = useRouter();

  const handleSignOut = async () => {
    if (!isConfirming) {
      setIsConfirming(true);
      return;
    }

    try {
      await signOut();
      toast.success('Signed out successfully');
      router.push('/');
    } catch (error) {
      toast.error('Error signing out');
    } finally {
      setIsConfirming(false);
    }
  };

  const handleCancel = () => {
    setIsConfirming(false);
  };

  if (variant === 'dropdown') {
    if (isConfirming) {
      return (
        <div className="px-4 py-2">
          <p className="text-sm text-gray-600 mb-2">Are you sure you want to sign out?</p>
          <div className="flex space-x-2">
            <button
              onClick={handleSignOut}
              className="flex-1 bg-red-500 text-white text-xs py-1 px-2 rounded hover:bg-red-600 transition-colors"
            >
              Yes, Sign Out
            </button>
            <button
              onClick={handleCancel}
              className="flex-1 bg-gray-200 text-gray-700 text-xs py-1 px-2 rounded hover:bg-gray-300 transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      );
    }

    return (
      <button
        onClick={handleSignOut}
        className={`flex items-center space-x-2 w-full text-left px-4 py-2 text-sm hover:bg-gray-50 transition-colors ${className}`}
      >
        <LogOut className="w-4 h-4" />
        <span>Sign Out</span>
      </button>
    );
  }

  if (isConfirming) {
    return (
      <div className="flex items-center space-x-2">
        <button
          onClick={handleSignOut}
          className="bg-red-500 text-white px-3 py-1 text-sm rounded hover:bg-red-600 transition-colors"
        >
          Confirm Sign Out
        </button>
        <button
          onClick={handleCancel}
          className="bg-gray-200 text-gray-700 px-3 py-1 text-sm rounded hover:bg-gray-300 transition-colors"
        >
          Cancel
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={handleSignOut}
      className={`flex items-center space-x-2 text-gray-600 hover:text-black transition-colors ${className}`}
    >
      <LogOut className="w-4 h-4" />
      <span>Sign Out</span>
    </button>
  );
}