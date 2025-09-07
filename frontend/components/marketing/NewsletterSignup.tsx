'use client';

import { useState, useRef } from 'react';
import { Mail, Check, Loader2 } from 'lucide-react';
import gsap from 'gsap';

interface NewsletterSignupProps {
  variant?: 'inline' | 'modal' | 'footer';
  className?: string;
}

export default function NewsletterSignup({ variant = 'inline', className = '' }: NewsletterSignupProps) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || status === 'loading') return;

    setStatus('loading');
    setMessage('');

    try {
      // Simulate Mailchimp API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // In production, replace with actual Mailchimp API call:
      // const response = await fetch('/api/newsletter', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email })
      // });

      setStatus('success');
      setMessage('Thank you for subscribing!');
      setEmail('');

      // Success animation
      if (successRef.current) {
        gsap.fromTo(successRef.current,
          { scale: 0, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.5, ease: 'back.out(1.7)' }
        );
      }

      // Reset after 3 seconds
      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 3000);

    } catch (error) {
      setStatus('error');
      setMessage('Something went wrong. Please try again.');
      
      setTimeout(() => {
        setStatus('idle');
        setMessage('');
      }, 3000);
    }
  };

  if (variant === 'footer') {
    return (
      <div className={className}>
        <p className="text-sm text-luxury-gold mb-4 tracking-wide uppercase">Subscribe to our newsletter</p>
        
        {status === 'success' ? (
          <div ref={successRef} className="flex items-center space-x-3 py-4">
            <div className="w-8 h-8 bg-luxury-gold rounded-full flex items-center justify-center">
              <Check className="w-5 h-5 text-black" />
            </div>
            <span className="text-luxury-gold font-medium">{message}</span>
          </div>
        ) : (
          <form ref={formRef} onSubmit={handleSubmit} className="flex space-x-3">
            <div className="relative flex-1">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                disabled={status === 'loading'}
                className="w-full px-6 py-4 bg-gray-900 border border-gray-700 rounded-full focus:outline-none focus:border-white transition-all duration-300 text-white placeholder-gray-400 disabled:opacity-50"
              />
            </div>
            <button
              type="submit"
              disabled={status === 'loading' || !email}
              className="px-8 py-4 bg-luxury-gold text-black font-medium rounded-full transition-all duration-300 whitespace-nowrap disabled:opacity-50 hover:bg-white flex items-center space-x-2"
            >
              {status === 'loading' ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Subscribing...</span>
                </>
              ) : (
                <span>Subscribe</span>
              )}
            </button>
          </form>
        )}
        
        {status === 'error' && (
          <p className="text-red-400 text-sm mt-2">{message}</p>
        )}
      </div>
    );
  }

  return (
    <div className={`bg-luxury-sand p-8 rounded-2xl ${className}`}>
      <div className="text-center mb-6">
        <Mail className="w-12 h-12 text-luxury-gold mx-auto mb-4" />
        <h3 className="text-2xl font-playfair font-bold mb-2">Stay in the Loop</h3>
        <p className="text-gray-600">Get exclusive access to new collections and special offers.</p>
      </div>

      {status === 'success' ? (
        <div ref={successRef} className="text-center">
          <div className="w-16 h-16 bg-luxury-gold rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="w-8 h-8 text-white" />
          </div>
          <h4 className="font-space-grotesk font-semibold mb-2">Welcome to FEMFIT!</h4>
          <p className="text-gray-600">{message}</p>
        </div>
      ) : (
        <form ref={formRef} onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              disabled={status === 'loading'}
              className="w-full pl-12 pr-4 py-4 border border-gray-200 rounded-lg focus:outline-none focus:border-luxury-gold transition-colors disabled:opacity-50"
            />
          </div>
          
          <button
            type="submit"
            disabled={status === 'loading' || !email}
            className="w-full bg-black text-white py-4 px-6 font-medium hover:bg-luxury-gold hover:text-black transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            {status === 'loading' ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Subscribing...</span>
              </>
            ) : (
              <span>Subscribe to Newsletter</span>
            )}
          </button>
          
          {status === 'error' && (
            <p className="text-red-600 text-sm text-center">{message}</p>
          )}
          
          <p className="text-xs text-gray-500 text-center">
            By subscribing, you agree to our Privacy Policy and Terms of Service.
          </p>
        </form>
      )}
    </div>
  );
}