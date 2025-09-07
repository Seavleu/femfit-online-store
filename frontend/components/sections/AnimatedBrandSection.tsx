'use client';

import { useEffect, useRef } from 'react';

const AnimatedBrandSection = () => {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;

    const textPath = svg.querySelector('textPath');
    if (!textPath) return;

    let offset = 0;
    const speed = 0.5;

    const animate = () => {
      offset += speed;
      textPath.setAttribute('startOffset', `${offset}%`);
      requestAnimationFrame(animate);
    };

    animate();
  }, []);

  return (
    <div className='curved-loop-jacket bg-black'>
      <svg
        ref={svgRef}
        className='curved-loop-svg'
        viewBox='0 0 100 12'
        xmlns='http://www.w3.org/2000/svg'
      >
        <defs>
          <path
            id='curved-path'
            d='M 0,6 Q 25,0 50,6 T 100,6'
            fill='none'
          />
        </defs>
        <text>
          <textPath
            href='#curved-path'
            startOffset='0%'
            className='font-bold font-futura-pt tracking-[-0.07em] leading-[90%] text-white'
          >
            ✦ FEMFIT - Your Ultimate Fashion & Fitness Destination ✦ Shop Premium Quality - Style Meets Performance ✦ Discover Your Style - Elevate Your Performance ✦
          </textPath>
        </text>
      </svg>
    </div>
  );
};

export default AnimatedBrandSection;
