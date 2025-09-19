'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Home, Search } from 'lucide-react';

export default function NotFoundPage() {
  const router = useRouter();
  const numberRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Simple CSS animation will handle the styling
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 relative overflow-hidden">
      {/* Large 404 Number - Bottom Left */}
      <div 
        ref={numberRef}
        className="absolute bottom-0 left-0 text-[40rem] md:text-[50rem] lg:text-[60rem] xl:text-[70rem] font-playfair italic font-bold text-gray-200 select-none pointer-events-none leading-none"
        style={{ 
          lineHeight: '0.7',
          transform: 'translateY(20%)'
        }}
      >
        404
      </div>

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <div ref={contentRef} className="max-w-2xl mx-auto text-center">
          {/* Error Message */}
          <div className="mb-8">
            <h1 className="text-6xl sm:text-7xl lg:text-8xl font-playfair font-bold text-gray-900 mb-6">
              Oops!
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 font-light leading-relaxed">
              The page you're looking for seems to have vanished into the digital void.
            </p>
          </div>

          {/* Description */}
          <div className="mb-12">
            <p className="text-lg text-gray-500 leading-relaxed max-w-lg mx-auto">
              Don't worry, even the most luxurious experiences sometimes take an unexpected turn. 
              Let's get you back on track.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => router.back()}
              className="group flex items-center space-x-3 bg-black text-white px-8 py-4 rounded-lg font-medium hover:bg-gray-800 transition-all duration-300 hover:scale-105"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
              <span>Go Back</span>
            </button>

            <button
              onClick={() => router.push('/')}
              className="group flex items-center space-x-3 bg-white text-black border-2 border-black px-8 py-4 rounded-lg font-medium hover:bg-black hover:text-white transition-all duration-300 hover:scale-105"
            >
              <Home className="w-5 h-5 group-hover:scale-110 transition-transform" />
              <span>Home</span>
            </button>

            <button
              onClick={() => router.push('/shop')}
              className="group flex items-center space-x-3 bg-gray-100 text-gray-700 border border-gray-300 px-8 py-4 rounded-lg font-medium hover:bg-gray-200 transition-all duration-300 hover:scale-105"
            >
              <Search className="w-5 h-5 group-hover:rotate-12 transition-transform" />
              <span>Shop</span>
            </button>
          </div>

          {/* Additional Help */}
          <div className="mt-16 pt-8 border-t border-gray-200">
            <p className="text-sm text-gray-400 mb-4">
              Need assistance?
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm">
              <a 
                href="mailto:support@femfit.com" 
                className="text-gray-600 hover:text-black transition-colors"
              >
                support@femfit.com
              </a>
              <span className="hidden sm:block text-gray-300">•</span>
              <a 
                href="tel:+855123456789" 
                className="text-gray-600 hover:text-black transition-colors"
              >
                +855 12 345 6789
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-20 right-20 w-32 h-32 border border-gray-200 rounded-full opacity-20"></div>
      <div className="absolute bottom-20 right-32 w-24 h-24 border border-gray-200 rounded-full opacity-20"></div>
      <div className="absolute top-1/2 left-20 w-16 h-16 border border-gray-200 rounded-full opacity-20"></div>
    </div>
  );
}
