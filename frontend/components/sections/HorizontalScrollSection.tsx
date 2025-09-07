'use client';
import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HorizontalScrollSection(): JSX.Element {
  const ulRef = useRef<HTMLUListElement | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const router = useRouter();

  useEffect(() => {
    if (!ulRef.current) return;

    const items = document.querySelectorAll('li');
    if (items.length === 0) return;

    setIsAnimating(true);

    // Simple horizontal scroll animation
    const animateScroll = () => {
      if (!ulRef.current) return;
      
      let currentIndex = 0;
      const totalItems = items.length;
      
      const scrollToNext = () => {
        if (currentIndex < totalItems - 1) {
          currentIndex++;
          const translateX = -currentIndex * 100;
          ulRef.current.style.transform = `translateX(${translateX}vw)`;
          setTimeout(scrollToNext, 2000); // Change slide every 2 seconds
        }
      };

      // Start auto-scroll after initial delay
      setTimeout(scrollToNext, 3000);
    };

    animateScroll();
  }, []);

  const handleShopWithUs = () => {
    // Dispatch custom event to show main website
    const event = new CustomEvent('showMainWebsite');
    window.dispatchEvent(event);
  };

  return (
    <div id="horizontal-scroll-section" className="fixed inset-0 z-50 bg-black">
      <main className="h-full">
        <article className="h-full">
          <header className='text-white relative w-full bg-black grid place-content-center h-[80vh]'>
            <div className='absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:20px_20px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]'></div>

            <div className='text-center z-10'>
              <h1 className='text-7xl font-light tracking-wider mb-4'>
                FEMFIT
              </h1>
              <p className='text-lg font-light tracking-widest opacity-80'>
                PERFORMANCE • STYLE • CONFIDENCE
              </p>
            </div>
          </header>
          
          <section className='h-[500vh] relative'>
            <ul ref={ulRef} className='flex sticky top-0 horizontal-scroll-transition'>
              <li className='h-screen w-screen bg-white flex flex-col justify-center overflow-hidden items-center border-r border-black'>
                <h2 className='text-[18vw] font-light relative bottom-5 inline-block text-black tracking-widest'>
                  WOMEN
                </h2>
                <div className='absolute bottom-20 w-64 h-64 bg-black/5 border border-black/10'></div>
              </li>
              <li className='h-screen w-screen bg-black flex flex-col justify-center overflow-hidden items-center border-r border-white'>
                <h2 className='text-[18vw] font-light relative bottom-5 inline-block text-white tracking-widest'>
                  MEN
                </h2>
                <div className='absolute bottom-20 w-64 h-64 bg-white/5 border border-white/10'></div>
              </li>
              <li className='h-screen w-screen bg-white flex flex-col justify-center overflow-hidden items-center border-r border-black'>
                <h2 className='text-[16vw] font-light relative bottom-5 inline-block text-black tracking-widest'>
                  GYMNASTICS
                </h2>
                <div className='absolute bottom-20 w-64 h-64 bg-black/5 border border-black/10'></div>
              </li>
              <li className='h-screen w-screen bg-black flex flex-col justify-center overflow-hidden items-center border-r border-white'>
                <h2 className='text-[16vw] font-light relative bottom-5 inline-block text-white tracking-widest'>
                  ACTIVEWEAR
                </h2>
                <div className='absolute bottom-20 w-64 h-64 bg-white/5 border border-white/10'></div>
              </li>
              <li className='h-screen w-screen bg-white flex flex-col justify-center overflow-hidden items-center'>
                <h2 className='text-[16vw] font-light relative bottom-5 inline-block text-black tracking-widest'>
                  COLLECTION
                </h2>
                <div className='absolute bottom-20 w-64 h-64 bg-black/5 border border-black/10'></div>
              </li>
            </ul>
          </section>
          
          <footer className='bg-black text-white grid place-content-center h-[80vh]'>
            <div className='text-center'>
              <h3 className='text-2xl font-light tracking-widest mb-4'>FEMFIT</h3>
              <p className='font-light tracking-wider opacity-70 mb-8'>
                SHOP WITH US
              </p>
              <button 
                onClick={handleShopWithUs}
                className='bg-white text-black px-8 py-3 font-light tracking-widest hover:bg-gray-100 transition-colors duration-300'
              >
                ENTER STORE
              </button>
              <div className='mt-8 w-16 h-px bg-white mx-auto'></div>
            </div>
          </footer>
        </article>
        <div className='progress fixed left-0 right-0 h-1 bg-white bottom-[50px] scale-x-0'></div>
      </main>
    </div>
  );
}
