'use client';

import { useEffect, useRef } from 'react';

export default function CustomCursor() {
  const cursorBigRef = useRef<HTMLDivElement>(null);
  const cursorSmallRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const cursorBig = cursorBigRef.current;
    const cursorSmall = cursorSmallRef.current;

    if (!cursorBig || !cursorSmall) return;

    // Get all interactive elements
    const links = document.getElementsByTagName('a');
    const buttons = document.getElementsByTagName('button');
    const hoverableElements = document.querySelectorAll('[data-cursor-hover]');
    const withHover = [...Array.from(links), ...Array.from(buttons), ...Array.from(hoverableElements)];

    // Event Handlers
    const onMouseMove = (e: MouseEvent) => {
      if (!cursorSmall) return;
      
      cursorSmall.style.opacity = '1';
      
      // Use CSS transforms instead of GSAP
      cursorBig.style.transform = `translate(${e.clientX - 18}px, ${e.clientY - 18}px)`;
      cursorSmall.style.transform = `translate(${e.clientX - 4}px, ${e.clientY - 4}px)`;
    };

    const onMouseHover = () => {
      cursorBig.style.transform += ' scale(3)';
    };

    const onMouseHoverOut = () => {
      cursorBig.style.transform = cursorBig.style.transform.replace(' scale(3)', '');
    };

    const onMouseDown = () => {
      cursorBig.style.transform += ' scale(0.8)';
    };

    const onMouseUp = () => {
      cursorBig.style.transform = cursorBig.style.transform.replace(' scale(0.8)', '');
    };

    const onMouseEnter = () => {
      cursorBig.style.opacity = '1';
      cursorSmall.style.opacity = '1';
    };

    const onMouseLeave = () => {
      cursorBig.style.opacity = '0';
      cursorSmall.style.opacity = '0';
    };

    // Event Listeners
    document.addEventListener('mousemove', onMouseMove);
    document.addEventListener('mousedown', onMouseDown);
    document.addEventListener('mouseup', onMouseUp);
    document.addEventListener('mouseenter', onMouseEnter);
    document.addEventListener('mouseleave', onMouseLeave);

    // Add hover effects to interactive elements
    withHover.forEach((element) => {
      element.addEventListener('mouseover', onMouseHover);
      element.addEventListener('mouseout', onMouseHoverOut);
    });

    // Cleanup
    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      document.removeEventListener('mousedown', onMouseDown);
      document.removeEventListener('mouseup', onMouseUp);
      document.removeEventListener('mouseenter', onMouseEnter);
      document.removeEventListener('mouseleave', onMouseLeave);
      
      withHover.forEach((element) => {
        element.removeEventListener('mouseover', onMouseHover);
        element.removeEventListener('mouseout', onMouseHoverOut);
      });
    };
  }, []);

  return (
    <div className="custom-cursor">
      <div 
        ref={cursorBigRef}
        id="cursor-big" 
        className="custom-cursor__ball custom-cursor__ball--big"
      />
      <div 
        ref={cursorSmallRef}
        id="cursor-small" 
        className="custom-cursor__ball custom-cursor__ball--small"
      />
    </div>
  );
}
