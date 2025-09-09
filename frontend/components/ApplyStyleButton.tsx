'use client';

import { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import LinkHover from '@/animation/LinkHover';

interface ApplyStyleButtonProps {
  href: string;
  title: string;
  className?: string;
}

export default function ApplyStyleButton({ href, title, className = "" }: ApplyStyleButtonProps) {
  const buttonRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const button = buttonRef.current;
    const line = lineRef.current;

    if (!button || !line) return;

    const handleMouseEnter = () => {
      gsap.to(line, {
        scaleX: 1,
        duration: 0.6,
        ease: "power2.out"
      });
    };

    const handleMouseLeave = () => {
      gsap.to(line, {
        scaleX: 0,
        duration: 0.4,
        ease: "power2.out"
      });
    };

    button.addEventListener('mouseenter', handleMouseEnter);
    button.addEventListener('mouseleave', handleMouseLeave);

    return () => {
      button.removeEventListener('mouseenter', handleMouseEnter);
      button.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, []);

  return (
    <div 
      ref={buttonRef}
      className={`relative inline-block bg-black px-8 py-4 cursor-pointer group ${className}`}
    >
      <LinkHover
        href={href}
        title={title}
        className="relative z-10 text-white font-bold uppercase tracking-wider"
      />
      
      {/* Horizontal line that expands on hover */}
      <div
        ref={lineRef}
        className="absolute bottom-0 left-0 h-0.5 bg-white origin-left scale-x-0"
        style={{ transform: 'scaleX(0)' }}
      />
    </div>
  );
}

