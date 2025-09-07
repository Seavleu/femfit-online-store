// @ts-nocheck
'use client';
import Image from 'next/image';
import { useEffect, useRef } from 'react';
import { animate, scroll, spring } from 'motion';
import { ReactLenis } from 'lenis/react';

export default function HorizontalScrollSection(): JSX.Element {
  const ulRef = useRef<HTMLUListElement | null>();
  const sectionRef = useRef<HTMLElement | null>();

  useEffect(() => {
    // Wait for component to be fully mounted
    const timer = setTimeout(() => {
      const items = document.querySelectorAll('li');
      const section = document.querySelector('section');

      if (ulRef.current && section && items.length > 0) {
        const controls = animate(
          ulRef.current,
          {
            transform: ['none', `translateX(-${items.length - 1}00vw)`],
          },
          { easing: spring() }
        );
        scroll(controls, { target: section });
      }

      const segmentLength = 1 / items.length;
      items.forEach((item, i) => {
        const header = item.querySelector('h2');

        if (header && section) {
          scroll(animate([header], { x: [800, -800] }), {
            target: section,
            offset: [
              [i * segmentLength, 1],
              [(i + 1) * segmentLength, 0],
            ],
          });
        }
      });
    }, 100);

    return () => clearTimeout(timer);
  }, []);

  return (
    <ReactLenis root>
      <main>
        <article>
          <header className='text-white relative w-full bg-black grid place-content-center h-[80vh]'>
            <div className='absolute bottom-0 left-0 right-0 top-0 bg-[linear-gradient(to_right,#ffffff2e_1px,transparent_1px),linear-gradient(to_bottom,#ffffff2e_1px,transparent_1px)] bg-[size:14px_24px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)]'></div>

            <div className='text-center'>
              <h1 className='text-6xl font-bold text-center tracking-tight mb-8'>
                Discover Your Style <br />
                Elevate Your Performance
              </h1>
              <div className='flex justify-center'>
                <div className='group relative flex h-12 w-[220px] items-center justify-between border-2 border-white rounded-lg bg-white/10 backdrop-blur-sm font-medium text-white hover:bg-white/20 transition-all duration-300'>
                  <span className='pl-4 text-white'>Explore Now</span>
                  <div className='relative h-9 w-9 overflow-hidden bg-white rounded-full mr-1'>
                    <div className='absolute top-[0.7em] left-[-0.1em] grid place-content-center transition-all w-full h-full duration-200 group-hover:-translate-y-5 group-hover:translate-x-4'>
                      <svg
                        width='15'
                        height='15'
                        viewBox='0 0 15 15'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'
                        className='h-5 w-5 fill-black'
                      >
                        <path
                          d='M3.64645 11.3536C3.45118 11.1583 3.45118 10.8417 3.64645 10.6465L10.2929 4L6 4C5.72386 4 5.5 3.77614 5.5 3.5C5.5 3.22386 5.72386 3 6 3L11.5 3C11.6326 3 11.7598 3.05268 11.8536 3.14645C11.9473 3.24022 12 3.36739 12 3.5L12 9.00001C12 9.27615 11.7761 9.50001 11.5 9.50001C11.2239 9.50001 11 9.27615 11 9.00001V4.70711L4.35355 11.3536C4.15829 11.5488 3.84171 11.5488 3.64645 11.3536Z'
                          fillRule='evenodd'
                          clipRule='evenodd'
                        />
                      </svg>
                      <svg
                        width='15'
                        height='15'
                        viewBox='0 0 15 15'
                        fill='none'
                        xmlns='http://www.w3.org/2000/svg'
                        className='h-5 w-5 mb-1 -translate-x-4 fill-black'
                      >
                        <path
                          d='M3.64645 11.3536C3.45118 11.1583 3.45118 10.8417 3.64645 10.6465L10.2929 4L6 4C5.72386 4 5.5 3.77614 5.5 3.5C5.5 3.22386 5.72386 3 6 3L11.5 3C11.6326 3 11.7598 3.05268 11.8536 3.14645C11.9473 3.24022 12 3.36739 12 3.5L12 9.00001C12 9.27615 11.7761 9.50001 11.5 9.50001C11.2239 9.50001 11 9.27615 11 9.00001V4.70711L4.35355 11.3536C4.15829 11.5488 3.84171 11.5488 3.64645 11.3536Z'
                          fillRule='evenodd'
                          clipRule='evenodd'
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </header>
          <section className='h-[500vh] relative'>
            <ul ref={ulRef} className='flex sticky top-0'>
              <li className='h-screen w-screen bg-white flex flex-col justify-center overflow-hidden items-center'>
                <h2 className='text-[20vw] font-semibold relative bottom-5 inline-block text-black'>
                  FASHION
                </h2>
                <Image
                  src='https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop&crop=center'
                  className='2xl:w-[550px] w-[380px] absolute bottom-0 rounded-lg shadow-2xl'
                  width={500}
                  height={500}
                  alt='Fashion Collection'
                />
              </li>
              <li className='h-screen w-screen bg-black flex flex-col justify-center overflow-hidden items-center'>
                <h2 className='text-[20vw] font-semibold relative bottom-5 inline-block text-white'>
                  FITNESS
                </h2>
                <Image
                  src='https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&crop=center'
                  className='2xl:w-[550px] w-[380px] absolute bottom-0 rounded-lg shadow-2xl'
                  width={500}
                  height={500}
                  alt='Fitness Equipment'
                />
              </li>
              <li className='h-screen w-screen bg-white flex flex-col justify-center overflow-hidden items-center'>
                <h2 className='text-[20vw] font-semibold relative bottom-5 inline-block text-black'>
                  LIFESTYLE
                </h2>
                <Image
                  src='https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop&crop=center'
                  className='2xl:w-[550px] w-[380px] absolute bottom-0 rounded-lg shadow-2xl'
                  width={500}
                  height={500}
                  alt='Lifestyle Products'
                />
              </li>
              <li className='h-screen w-screen bg-black flex flex-col justify-center overflow-hidden items-center'>
                <h2 className='text-[20vw] font-semibold relative bottom-5 inline-block text-white'>
                  QUALITY
                </h2>
                <Image
                  src='https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800&h=600&fit=crop&crop=center'
                  className='2xl:w-[550px] w-[380px] absolute bottom-0 rounded-lg shadow-2xl'
                  width={500}
                  height={500}
                  alt='Premium Quality'
                />
              </li>
              <li className='h-screen w-screen bg-white flex flex-col justify-center overflow-hidden items-center'>
                <h2 className='text-[20vw] font-semibold relative bottom-5 inline-block text-black'>
                  INNOVATION
                </h2>
                <Image
                  src='https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=600&fit=crop&crop=center'
                  className='2xl:w-[550px] w-[380px] absolute bottom-0 rounded-lg shadow-2xl'
                  width={500}
                  height={500}
                  alt='Innovation in Design'
                />
              </li>
            </ul>
          </section>
          <footer className='bg-white text-black grid place-content-center h-[80vh]'>
            <div className='text-center'>
              <h2 className='text-4xl font-bold mb-4'>Ready to Transform Your Style?</h2>
              <p className='text-xl mb-8'>Join thousands of satisfied customers who trust FEMFIT</p>
              <div className='group relative flex h-12 w-[220px] items-center justify-between border-2 border-black rounded-lg bg-black font-medium text-white hover:bg-gray-800 transition-all duration-300 mx-auto'>
                <span className='pl-4 text-white'>Shop Now</span>
                <div className='relative h-9 w-9 overflow-hidden bg-white rounded-full mr-1'>
                  <div className='absolute top-[0.7em] left-[-0.1em] grid place-content-center transition-all w-full h-full duration-200 group-hover:-translate-y-5 group-hover:translate-x-4'>
                    <svg
                      width='15'
                      height='15'
                      viewBox='0 0 15 15'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-5 w-5 fill-black'
                    >
                      <path
                        d='M3.64645 11.3536C3.45118 11.1583 3.45118 10.8417 3.64645 10.6465L10.2929 4L6 4C5.72386 4 5.5 3.77614 5.5 3.5C5.5 3.22386 5.72386 3 6 3L11.5 3C11.6326 3 11.7598 3.05268 11.8536 3.14645C11.9473 3.24022 12 3.36739 12 3.5L12 9.00001C12 9.27615 11.7761 9.50001 11.5 9.50001C11.2239 9.50001 11 9.27615 11 9.00001V4.70711L4.35355 11.3536C4.15829 11.5488 3.84171 11.5488 3.64645 11.3536Z'
                        fillRule='evenodd'
                        clipRule='evenodd'
                      />
                    </svg>
                    <svg
                      width='15'
                      height='15'
                      viewBox='0 0 15 15'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'
                      className='h-5 w-5 mb-1 -translate-x-4 fill-black'
                    >
                      <path
                        d='M3.64645 11.3536C3.45118 11.1583 3.45118 10.8417 3.64645 10.6465L10.2929 4L6 4C5.72386 4 5.5 3.77614 5.5 3.5C5.5 3.22386 5.72386 3 6 3L11.5 3C11.6326 3 11.7598 3.05268 11.8536 3.14645C11.9473 3.24022 12 3.36739 12 3.5L12 9.00001C12 9.27615 11.7761 9.50001 11.5 9.50001C11.2239 9.50001 11 9.27615 11 9.00001V4.70711L4.35355 11.3536C4.15829 11.5488 3.84171 11.5488 3.64645 11.3536Z'
                        fillRule='evenodd'
                        clipRule='evenodd'
                      />
                    </svg>
                  </div>
                </div>
              </div>
            </div>
          </footer>
        </article>
        <div className='progress fixed left-0 right-0 h-2 rounded-full bg-black bottom-[50px] scale-x-0'></div>
      </main>
    </ReactLenis>
  );
}
