'use client';

import { useState } from 'react';
import { X, Truck, RotateCcw, Shield } from 'lucide-react';

export default function TopBanner() {
  const [isVisible, setIsVisible] = useState(true);

  const announcements = [
    "Free Standard Delivery On all orders with min. spend*",
    "Easy Returns Within 30 days of order", 
    "Qualify for Privilege Membership With any purchase"
  ];

  const [currentAnnouncement, setCurrentAnnouncement] = useState(0);

  if (!isVisible) return null;

  return (
    <div className="bg-secondary text-black text-center py-2 px-4 relative">
      <div className="flex items-center justify-center space-x-8 text-sm">
        <div className="hidden md:flex items-center space-x-2">
          <Truck className="w-4 h-4" />
          <span>{announcements[0]}</span>
        </div>
        
        <div className="hidden md:flex items-center space-x-2">
          <RotateCcw className="w-4 h-4" />
          <span>{announcements[1]}</span>
        </div>
        
        <div className="hidden md:flex items-center space-x-2">
          <Shield className="w-4 h-4" />
          <span>{announcements[2]}</span>
        </div>

        {/* Mobile - Rotating announcements */}
        <div className="md:hidden flex items-center space-x-2">
          <span>{announcements[currentAnnouncement]}</span>
        </div>
      </div>
      
      <button
        onClick={() => setIsVisible(false)}
        className="absolute right-4 top-1/2 transform -translate-y-1/2 hover:bg-black/10 rounded-full p-1 transition-colors"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}
