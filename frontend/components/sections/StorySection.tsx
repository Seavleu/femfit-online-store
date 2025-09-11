'use client';

import { useEffect, useRef, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

export default function StorySection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const textRef = useRef<HTMLDivElement>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const counterRef = useRef<HTMLSpanElement>(null);
  const [currentYear, setCurrentYear] = useState(1985);

  useEffect(() => {
    if (!sectionRef.current || !textRef.current || !imageRef.current) return;

    // Text animation - slide in from left
    gsap.fromTo(textRef.current.children,
      { x: -100, opacity: 0 },
      {
        x: 0,
        opacity: 1,
        duration: 1.2,
        stagger: 0.15,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: sectionRef.current,
          start: 'top 75%',
          end: 'bottom 25%',
          toggleActions: 'play none none reverse'
        }
      }
    );

    // Image animation - slide in from right with scale
    gsap.fromTo(imageRef.current,
      { x: 100, opacity: 0, scale: 0.9 },
      {
        x: 0,
        opacity: 1,
        scale: 1,
        duration: 1.4,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: imageRef.current,
          start: 'top 80%',
          toggleActions: 'play none none reverse'
        }
      }
    );

    // Counter animation
    if (counterRef.current) {
      const currentYearValue = new Date().getFullYear();
      const yearsInBusiness = currentYearValue - 1985;
      
      gsap.fromTo(counterRef.current,
        { textContent: 1985 },
        {
          textContent: currentYearValue,
          duration: 2,
          ease: 'power2.out',
          snap: { textContent: 1 },
          scrollTrigger: {
            trigger: counterRef.current,
            start: 'top 85%',
            toggleActions: 'play none none reverse'
          },
          onUpdate: function() {
            if (counterRef.current) {
              const year = Math.round(this.targets()[0].textContent);
              setCurrentYear(year);
              counterRef.current.textContent = `${Math.round(year - 1985)}+`;
            }
          }
        }
      );
    }

    // Parallax effect for the overlapping elements
    gsap.to(imageRef.current, {
      y: -50,
      ease: 'none',
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top bottom',
        end: 'bottom top',
        scrub: 1,
      }
    });

  }, []);

  return (
    <>
      {/* Section Divider */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
      
      <section ref={sectionRef} id="about" className="py-32 sm:py-40 relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start relative">
            {/* Text Content - Overlapping Layout */}
            <div ref={textRef} className="lg:w-1/2 space-y-8 relative z-20 lg:pr-16">
              <div className="overflow-hidden">
                <p className="text-sm font-medium tracking-[0.2em] text-luxury-gold uppercase">
                  Our Story
                </p>
              </div>
              
              <div className="overflow-hidden">
                <h2 className="text-5xl sm:text-6xl lg:text-7xl font-playfair font-bold tracking-tight leading-[0.85]">
                  Crafting
                  <br />
                  Excellence
                </h2>
              </div>
              
              <div className="overflow-hidden">
                <div className="flex items-baseline space-x-3 mb-6">
                  <span className="body-text text-lg text-gray-600">Since</span>
                  <span className="text-4xl font-playfair font-bold">1985</span>
                </div>
              </div>
              
              <div className="overflow-hidden">
                <p className="body-text text-lg text-gray-600 leading-relaxed max-w-xl">
                  Born from a vision to redefine luxury, our brand represents the perfect 
                  marriage of traditional craftsmanship and contemporary innovation. Each piece 
                  tells a story of meticulous attention to detail and unwavering commitment to quality.
                </p>
              </div>
              
              <div className="overflow-hidden">
                <p className="body-text text-lg text-gray-600 leading-relaxed max-w-xl">
                  From our atelier to your wardrobe, we create timeless pieces that transcend 
                  fleeting trends, ensuring you invest in pieces that will remain relevant for years to come.
                </p>
              </div>

              {/* Overlapping Stats Card */}
              <div className="overflow-hidden">
                <div className="bg-luxury-charcoal text-white p-8 max-w-xs relative z-30 lg:translate-x-32 lg:-translate-y-8">
                  <div className="text-center">
                    <div className="text-3xl font-playfair font-bold mb-2">
                      <span ref={counterRef}>40+</span>
                    </div>
                    <p className="text-sm tracking-wider uppercase opacity-90 text-luxury-gold">
                      Years of Excellence
                    </p>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Image Container - Overlapping Layout */}
            <div ref={imageRef} className="lg:col-span-6 relative lg:-ml-16">
              <div className="relative">
                {/* Main Image */}
                <div className="aspect-[4/5] bg-white overflow-hidden relative z-10">
                  <img
                    src="https://images.pexels.com/photos/1488463/pexels-photo-1488463.jpeg"
                    alt="Luxury craftsmanship"
                    className="w-full h-full object-cover"
                  />
                </div>
                
                {/* Decorative Elements */}
                <div className="absolute -top-8 -left-8 w-24 h-24 border border-gray-300 z-0"></div>
                <div className="absolute -bottom-8 -right-8 w-32 h-32 bg-white z-0"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Background Texture */}
        <div className="absolute inset-0 opacity-[0.02] pointer-events-none">
          <div 
            className="w-full h-full"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.4'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3Ccircle cx='53' cy='53' r='1'/%3E%3Ccircle cx='37' cy='23' r='1'/%3E%3Ccircle cx='23' cy='37' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              backgroundSize: '60px 60px'
            }}
          />
        </div>
      </section>

      {/* Bottom Section Divider */}
      <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-300 to-transparent"></div>
    </>
  );
}