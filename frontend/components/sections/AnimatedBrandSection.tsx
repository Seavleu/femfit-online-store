'use client';

import ScrollBaseAnimation from '@/components/ui/scroll-text-marque';

const AnimatedBrandSection = () => {
  return (
    <div className='bg-black py-2.5 overflow-hidden w-full'>
      <div className='h-[250px] grid place-content-center space-y-2.5'>
        <ScrollBaseAnimation
          delay={500}
          baseVelocity={-3}
          clasname='font-bold tracking-[-0.07em] leading-[90%] text-2xl md:text-4xl text-white'
        >
          FEMFIT - Your Ultimate Fashion & Fitness Destination
        </ScrollBaseAnimation>
        <ScrollBaseAnimation
          delay={500}
          baseVelocity={3}
          clasname='font-bold tracking-[-0.07em] leading-[90%] text-2xl md:text-4xl text-white'
        >
          Shop Premium Quality - Style Meets Performance
        </ScrollBaseAnimation>
      </div>
    </div>
  );
};

export default AnimatedBrandSection;
