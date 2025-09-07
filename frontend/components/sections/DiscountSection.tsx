'use client';

import Link from 'next/link';

export default function DiscountSection() {
  return (
    <section className="h-[180px] bg-gradient-to-r from-luxury-charcoal via-black to-luxury-charcoal text-white relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 h-full">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-full items-center">
          {/* Column 1: Sale Image */}
          <div className="relative h-full flex items-center justify-center">
            <div className="w-full h-32 bg-gradient-to-r from-luxury-gold/20 to-luxury-gold/40 rounded-lg flex items-center justify-center">
              <div className="text-center">
                <div className="text-4xl font-bold text-luxury-gold mb-2">50%</div>
                <div className="text-sm text-white/80">OFF</div>
              </div>
            </div>
          </div>

          {/* Column 2: Discount Text */}
          <div className="text-center lg:text-left space-y-4">
            <h2 className="text-3xl lg:text-4xl font-playfair font-bold text-white">
              UP TO 50% OFF
            </h2>
            <p className="text-sm lg:text-base text-white/90 leading-relaxed">
              +EXTRA 15% OFF selected bags with purchase of min 2 items
            </p>
          </div>

          {/* Column 3: Shop Now Button */}
          <div className="flex flex-col items-center lg:items-end justify-center h-full">
            <Link
              href="/shop"
              className="group text-center"
            >
              <div className="text-2xl lg:text-3xl font-bold text-white mb-2 group-hover:text-luxury-gold transition-colors">
                SHOP NOW
              </div>
              <div className="w-full h-0.5 bg-white group-hover:bg-luxury-gold transition-colors"></div>
            </Link>
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="absolute bottom-4 right-6">
          <Link 
            href="#terms" 
            className="text-xs text-white/60 hover:text-white/80 transition-colors underline"
          >
            *T&Cs and Exclusion Apply
          </Link>
        </div>
      </div>

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="w-full h-full"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3Ccircle cx='53' cy='53' r='1'/%3E%3Ccircle cx='37' cy='23' r='1'/%3E%3Ccircle cx='23' cy='37' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '60px 60px'
          }}
        />
      </div>
    </section>
  );
}