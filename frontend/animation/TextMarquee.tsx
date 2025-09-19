'use client';

import { useEffect, useRef } from 'react';

interface TextMarqueeProps {
  children: React.ReactNode;
  baseVelocity?: number;
  className?: string;
}

export default function TextMarquee({ 
  children, 
  baseVelocity = 0.7, 
  className = '' 
}: TextMarqueeProps) {
  const marqueeRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!marqueeRef.current) return;

    const marquee = marqueeRef.current;
    const marqueeContent = marquee.querySelector('.marquee-content');
    
    if (!marqueeContent) return;

    // Simple CSS animation for marquee
    const duration = 20 / baseVelocity; // Adjust duration based on velocity
    
    // Apply CSS animation
    (marqueeContent as HTMLElement).style.animation = `marquee ${duration}s linear infinite`;
  }, [baseVelocity]);

  return (
    <div 
      ref={marqueeRef}
      className={`overflow-hidden whitespace-nowrap ${className}`}
      style={{ willChange: 'transform' }}
    >
      <div className="marquee-content flex">
        {children}
      </div>
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-100%); }
        }
        .marquee-content {
          display: flex;
          animation: marquee ${20 / baseVelocity}s linear infinite;
        }
      `}</style>
    </div>
  );
}
