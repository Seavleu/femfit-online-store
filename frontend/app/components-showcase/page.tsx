'use client';

import { useState } from 'react';
import PublicLayout from '@/components/layouts/PublicLayout';
import Marquee from '@/components/Marquee';
import RoundButton from '@/components/RoundButton';
import SquareButton from '@/components/SquareButton';
import SpotlightSection from '@/components/sections/SpotlightSection';
import { Button } from '@/components/ui';
import { TextHover, LinkHover } from '@/animation';

export default function ComponentsShowcase() {
  const [selectedStyle, setSelectedStyle] = useState('default');

  return (
    <PublicLayout>
      <div className="min-h-screen bg-gray-50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Component Showcase
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore our collection of reusable UI components and animations. 
              All components are built with TypeScript, Tailwind CSS, and modern React patterns.
            </p>
            <div className="mt-8">
              <a 
                href="/" 
                className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-black hover:bg-gray-800 transition-colors"
              >
                ← Back to Home
              </a>
            </div>
          </div>

          {/* Style Selector */}
          <div className="mb-12">
            <h2 className="text-2xl font-semibold text-gray-900 mb-6">Style Variants</h2>
            <div className="flex space-x-4">
              {['default', 'luxury', 'minimal', 'bold'].map((style) => (
                <button
                  key={style}
                  onClick={() => setSelectedStyle(style)}
                  className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                    selectedStyle === style
                      ? 'bg-black text-white'
                      : 'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  {style.charAt(0).toUpperCase() + style.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Components Grid */}
          <div className="space-y-16">
            
            {/* Button Components Section */}
            <section className="mb-16">
              <h2 className="text-2xl font-semibold text-gray-900 mb-8">Button Components</h2>
              
              {/* Shadcn UI Buttons */}
              <div className="bg-white rounded-lg shadow-md p-8 mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Shadcn UI Buttons</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="space-y-4">
                    <h4 className="text-lg font-medium">Default</h4>
                    <Button>Click me</Button>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-lg font-medium">Secondary</h4>
                    <Button variant="secondary">Secondary</Button>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-lg font-medium">Outline</h4>
                    <Button variant="outline">Outline</Button>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-lg font-medium">Ghost</h4>
                    <Button variant="ghost">Ghost</Button>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-lg font-medium">Destructive</h4>
                    <Button variant="destructive">Delete</Button>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-lg font-medium">Large</h4>
                    <Button size="lg">Large Button</Button>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-lg font-medium">Small</h4>
                    <Button size="sm">Small</Button>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-lg font-medium">Icon</h4>
                    <Button size="icon">🚀</Button>
                  </div>
                </div>
              </div>

              {/* Round Buttons */}
              <div className="bg-white rounded-lg shadow-md p-8 mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Round Buttons</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                  <div className="space-y-4">
                    <h4 className="text-lg font-medium">Default</h4>
                    <RoundButton 
                      href="/shop" 
                      title="Shop Now" 
                      bgcolor="#000000"
                      style={{ color: 'white' }}
                    />
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-lg font-medium">Gold</h4>
                    <RoundButton 
                      href="/about" 
                      title="Learn More" 
                      bgcolor="#D4AF37"
                      style={{ color: 'white' }}
                    />
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-lg font-medium">Pink</h4>
                    <RoundButton 
                      href="/contact" 
                      title="Contact" 
                      bgcolor="#EC4899"
                      style={{ color: 'white' }}
                    />
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-lg font-medium">Custom</h4>
                    <RoundButton 
                      href="/profile" 
                      title="Profile" 
                      bgcolor="#3B82F6"
                      style={{ color: 'white' }}
                    />
                  </div>
                </div>
              </div>

              {/* Square Buttons */}
              <div className="bg-white rounded-lg shadow-md p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Square Buttons</h3>
                <div className="grid grid-cols-2 md:grid-cols-6 gap-6">
                  <div className="space-y-4">
                    <h4 className="text-lg font-medium">Default</h4>
                    <SquareButton>Add</SquareButton>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-lg font-medium">Large</h4>
                    <SquareButton size="lg">Add</SquareButton>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-lg font-medium">Small</h4>
                    <SquareButton size="sm">Add</SquareButton>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-lg font-medium">Custom Style</h4>
                    <SquareButton className="bg-green-500 hover:bg-green-600 text-white">
                      Save
                    </SquareButton>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-lg font-medium">With Icon</h4>
                    <SquareButton>📝</SquareButton>
                  </div>
                  <div className="space-y-4">
                    <h4 className="text-lg font-medium">Disabled</h4>
                    <SquareButton disabled>Add</SquareButton>
                  </div>
                </div>
              </div>
            </section>

            {/* Marquee Component */}
            <section className="mb-16">
              <h2 className="text-2xl font-semibold text-gray-900 mb-8">Marquee Component</h2>
              <div className="bg-white rounded-lg shadow-md p-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-6">Text Marquee</h3>
                <div className="space-y-6">
                  <div>
                    <h4 className="text-lg font-medium mb-3">Default Marquee</h4>
                    <Marquee title="FEM & FIT • PREMIUM FASHION • ELEVATE YOUR STYLE • LUXURY BRAND" />
                  </div>
                  <div>
                    <h4 className="text-lg font-medium mb-3">Custom Styled Marquee</h4>
                    <Marquee 
                      title="NEW COLLECTION • PREMIUM QUALITY • LUXURY FASHION • ELEVATE YOUR STYLE"
                      className="text-2xl"
                    />
                  </div>
                </div>
              </div>
            </section>

            {/* SpotlightSection Section */}
            <section className="mb-16">
              <h2 className="text-2xl font-semibold text-gray-900 mb-8">SpotlightSection</h2>
              <div className="bg-gray-50 rounded-lg overflow-hidden">
                <SpotlightSection />
              </div>
            </section>

            {/* Animation Components Section */}
            <section className="mb-16">
              <h2 className="text-2xl font-semibold text-gray-900 mb-8">CSS Animation Components</h2>
              <div className="space-y-12">
                
                {/* Text Hover Animations */}
                <div className="bg-white rounded-lg shadow-md p-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">Text Hover Animations</h3>
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-medium mb-3">Basic Text Hover</h4>
                      <div className="space-y-4">
                        <TextHover titile1="Hover Me" titile2="Amazing!" />
                        <TextHover titile1="CSS Animation" titile2="Smooth Transition" />
                        <TextHover titile1="Pure CSS" titile2="No JavaScript" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Link Hover Animations */}
                <div className="bg-white rounded-lg shadow-md p-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-6">Link Hover Animations</h3>
                  <div className="space-y-6">
                    <div>
                      <h4 className="text-lg font-medium mb-3">Interactive Links</h4>
                      <div className="space-y-4">
                        <LinkHover href="/shop" title="Shop Now" />
                        <LinkHover href="/about" title="About Us" />     
                        <LinkHover href="/contact" title="Contact" />
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            </section>

            {/* Usage Guidelines */}
            <section className="mb-16">
              <h2 className="text-2xl font-semibold text-gray-900 mb-8">Usage Guidelines</h2>
              <div className="bg-white rounded-lg shadow-md p-8">
                <div className="prose max-w-none">
                  <h3 className="text-xl font-semibold mb-4">Component Standards</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>All components are built with TypeScript for type safety</li>
                    <li>Components use Tailwind CSS for consistent styling</li>
                    <li>Animation components use pure CSS for performance</li>
                    <li>All components are accessible and keyboard navigable</li>
                    <li>Components follow consistent naming conventions</li>
                  </ul>
                  
                  <h3 className="text-xl font-semibold mt-8 mb-4">Animation Principles</h3>
                  <ul className="list-disc list-inside space-y-2 text-gray-700">
                    <li>CSS-based animations for better performance</li>
                    <li>Consistent timing and easing functions</li>
                    <li>Accessible animations that respect user preferences</li>
                    <li>Lightweight and optimized for mobile devices</li>
                  </ul>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </PublicLayout>
  );
}