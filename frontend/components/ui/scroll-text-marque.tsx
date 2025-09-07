'use client';

import React, { useEffect, useRef } from 'react';

interface ScrollBaseAnimationProps {
  children: React.ReactNode;
  delay?: number;
  baseVelocity?: number;
  clasname?: string;
}

const ScrollBaseAnimation: React.FC<ScrollBaseAnimationProps> = ({
  children,
  delay = 0,
  baseVelocity = 1,
  clasname = '',
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!containerRef.current || !contentRef.current) return;

    const container = containerRef.current;
    const content = contentRef.current;
    
    let animationId: number;
    let startTime: number | null = null;

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime;
      
      const elapsed = currentTime - startTime;
      
      if (elapsed < delay) {
        animationId = requestAnimationFrame(animate);
        return;
      }

      const progress = (elapsed - delay) / 1000; // Convert to seconds
      const translateX = progress * baseVelocity * 50; // Adjust speed multiplier
      
      content.style.transform = `translateX(${translateX}px)`;
      
      // Reset position when content moves completely out of view
      if (Math.abs(translateX) >= content.offsetWidth) {
        startTime = currentTime;
      }
      
      animationId = requestAnimationFrame(animate);
    };

    animationId = requestAnimationFrame(animate);

    return () => {
      if (animationId) {
        cancelAnimationFrame(animationId);
      }
    };
  }, [delay, baseVelocity]);

  return (
    <div ref={containerRef} className="overflow-hidden w-full">
      <div
        ref={contentRef}
        className={`whitespace-nowrap ${clasname}`}
        style={{ transform: 'translateX(0px)' }}
      >
        {children}
      </div>
    </div>
  );
};

export default ScrollBaseAnimation;
