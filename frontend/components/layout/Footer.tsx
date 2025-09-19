'use client';
import React, { FormEvent, useRef, useState } from 'react';
import Link from 'next/link';
import { LinkHover } from '@/animation';

const Footer = () => {
  const container = useRef<HTMLDivElement>(null);
  const [openPopup, setOpenPopUp] = useState(false);

  const handleNewsLetterData = (e: FormEvent) => {
    e.preventDefault();
    const target = e.target as HTMLFormElement;
    const formData = new FormData(target);

    const clientEmail = formData.get('newsletter_email')!;

    setOpenPopUp(true);
    target.reset();
    if (setOpenPopUp) {
      setTimeout(() => {
        setOpenPopUp(false);
      }, 2000);
    }
  };

  return (
    <>
      {/* Top Information Bar */}
      <div className='bg-white py-2.5 mt-2.5'>
        <div className='sm:container px-4 mx-auto'>
          <div className='grid grid-cols-1 md:grid-cols-3 gap-6'>
            <div className='flex items-center space-x-3'>
              <div className='w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm'>
                <svg className='w-6 h-6 text-gray-700' fill='currentColor' viewBox='0 0 20 20'>
                  <path d='M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z'/>
                  <path d='M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1V8a1 1 0 00-1-1h-3z'/>
                </svg>
              </div>
              <div>
                <p className='font-semibold text-sm'>Free standard shipping</p>
                <p className='text-xs text-gray-600'>When ordering over the minimum purchase amount*</p>
              </div>
            </div>
            <div className='flex items-center space-x-3'>
              <div className='w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm'>
                <svg className='w-6 h-6 text-gray-700' fill='currentColor' viewBox='0 0 20 20'>
                  <path fillRule='evenodd' d='M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z' clipRule='evenodd'/>
                </svg>
                </div>
                <div>
                <p className='font-semibold text-sm'>Returns and Exchanges</p>
                <p className='text-xs text-gray-600'>Within 7 days after delivery</p>
              </div>
            </div>
            <div className='flex items-center space-x-3'>
              <div className='w-10 h-10 bg-white rounded-full flex items-center justify-center shadow-sm'>
                <svg className='w-6 h-6 text-gray-700' fill='currentColor' viewBox='0 0 20 20'>
                  <path fillRule='evenodd' d='M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z' clipRule='evenodd'/>
                </svg>
                </div>
              <div>
                <p className='font-semibold text-sm'>Privilege Membership Eligibility Requirements</p>
                <p className='text-xs text-gray-600'>Minimum purchase amount: $200 or more</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Bar */}
      <div className='border-t border-gray-200'>
        <div className='sm:container px-4 mx-auto'>
          <div className='flex flex-wrap items-center justify-center py-4 space-x-6 text-sm font-medium'>
            <LinkHover href='/new-products' title='NEW PRODUCTS' className='hover:text-gray-600' />
            <div className='w-px h-4 bg-gray-300'></div>
            <LinkHover href='/shoes' title='SHOES' className='hover:text-gray-600' />
            <div className='w-px h-4 bg-gray-300'></div>
            <LinkHover href='/bags' title='BAGS' className='hover:text-gray-600' />
            <div className='w-px h-4 bg-gray-300'></div>
            <LinkHover href='/wallet' title='WALLET' className='hover:text-gray-600' />
            <div className='w-px h-4 bg-gray-300'></div>
            <LinkHover href='/accessories' title='ACCESSORIES' className='hover:text-gray-600' />
            <div className='w-px h-4 bg-gray-300'></div>
            <LinkHover href='/recommendations' title='RECOMMENDATIONS FOR YOU' className='hover:text-gray-600' />
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className='bg-white py-2.5 animate-fade-in'>
        <div className='sm:container px-4 mx-auto'>
          <div className='grid grid-cols-1 md:grid-cols-5 gap-8'>
            {/* NEED HELP? */}
            <div>
              <h3 className='font-bold text-black text-sm mb-4 tracking-wide'>NEED HELP?</h3>
              <ul className='space-y-2'>
                <li><LinkHover href='/order-inquiry' title='Order Inquiry' className='text-sm text-gray-600 hover:text-black' /></li>
                <li><LinkHover href='/faq' title='Frequently Asked Questions' className='text-sm text-gray-600 hover:text-black' /></li>
                <li><LinkHover href='/contact' title='Contact Us' className='text-sm text-gray-600 hover:text-black' /></li>
                <li><LinkHover href='/fraud-prevention' title='Fraud Prevention' className='text-sm text-gray-600 hover:text-black' /></li>
                <li><LinkHover href='/privilege-membership' title='Privilege Membership' className='text-sm text-gray-600 hover:text-black' /></li>
                <li><LinkHover href='/shipping-tracking' title='Shipping and Tracking' className='text-sm text-gray-600 hover:text-black' /></li>
                <li><LinkHover href='/returns-exchanges' title='Returns and Exchanges' className='text-sm text-gray-600 hover:text-black' /></li>
                <li><LinkHover href='/size-guide' title='Size Guide' className='text-sm text-gray-600 hover:text-black' /></li>
              </ul>
            </div>

            {/* ABOUT US */}
            <div>
              <h3 className='font-bold text-black text-sm mb-4 tracking-wide'>ABOUT US</h3>
              <ul className='space-y-2'>
                <li><LinkHover href='/brand-profile' title='Brand Profile' className='text-sm text-gray-600 hover:text-black' /></li>
                <li><LinkHover href='/femfit-group' title='FEMFIT GROUP' className='text-sm text-gray-600 hover:text-black' /></li>
                <li><LinkHover href='/sustainability' title='Sustainable Management' className='text-sm text-gray-600 hover:text-black' /></li>
                <li><LinkHover href='/influence-program' title='Influence Program' className='text-sm text-gray-600 hover:text-black' /></li>
                <li><LinkHover href='/franchise-inquiry' title='Franchise Inquiry' className='text-sm text-gray-600 hover:text-black' /></li>
                <li><LinkHover href='/partnership-inquiry' title='Partnership Inquiry' className='text-sm text-gray-600 hover:text-black' /></li>
              </ul>
            </div>

            {/* SHOPPING WITH US */}
            <div>
              <h3 className='font-bold text-black text-sm mb-4 tracking-wide'>SHOPPING WITH US</h3>
              <ul className='space-y-2'>
                <li><LinkHover href='/store-location' title='Store location' className='text-sm text-gray-600 hover:text-black' /></li>
                <li><LinkHover href='/ambassador' title='Ambassador' className='text-sm text-gray-600 hover:text-black' /></li>
                <li><LinkHover href='/fashion-guide' title='Fashion Guide' className='text-sm text-gray-600 hover:text-black' /></li>
                <li><LinkHover href='/promotion' title='Promotion' className='text-sm text-gray-600 hover:text-black' /></li>
              </ul>
            </div>

            {/* LEGAL */}
            <div>
              <h3 className='font-bold text-black text-sm mb-4 tracking-wide'>LEGAL</h3>
              <ul className='space-y-2'>
                <li><LinkHover href='/terms' title='Terms of Use' className='text-sm text-gray-600 hover:text-black' /></li>
                <li><LinkHover href='/privacy' title='Privacy Policy' className='text-sm text-gray-600 hover:text-black' /></li>
                <li><LinkHover href='/cookies' title='Cookie Policy' className='text-sm text-gray-600 hover:text-black' /></li>
              </ul>
            </div>

            {/* Newsletter Signup */}
            <div>
              <h3 className='font-bold text-black text-sm mb-4 tracking-wide'>NEWSLETTER</h3>
              <div className='pt-2 pb-6 md:w-99'> 
                <div className='hover-button relative bg-black flex justify-between items-center border-2 overflow-hidden border-black text-white hover:text-black md:text-2xl'>
                  <form
                    onSubmit={(e) => handleNewsLetterData(e)}
                    className='relative z-2 grid grid-cols-6 w-full h-full'
                  >
                    <input
                      type='email'
                      name='newsletter_email'
                      className='border-none bg-transparent py-3 px-6 col-span-5 focus:bg-white focus:text-black placeholder-white focus:placeholder-gray-500'
                      placeholder='Your Email *'
                    />
                    <button
                      type='submit'
                      className='cursor-pointer w-full hover:bg-primaryColor bg-white text-white h-full cols-span-1'
                    >
                      <svg
                        width='15'
                        height='15'
                        viewBox='0 0 15 15'
                        fill='none'
                        className='w-full h-[80%]'
                        xmlns='http://www.w3.org/2000/svg'
                      >
                        <path
                          d='M8.14645 3.14645C8.34171 2.95118 8.65829 2.95118 8.85355 3.14645L12.8536 7.14645C13.0488 7.34171 13.0488 7.65829 12.8536 7.85355L8.85355 11.8536C8.65829 12.0488 8.34171 12.0488 8.14645 11.8536C7.95118 11.6583 7.95118 11.3417 8.14645 11.1464L11.2929 8H2.5C2.22386 8 2 7.77614 2 7.5C2 7.22386 2.22386 7 2.5 7H11.2929L8.14645 3.85355C7.95118 3.65829 7.95118 3.34171 8.14645 3.14645Z'
                          fill='#000'
                          fillRule='evenodd'
                          clipRule='evenodd'
                        />
                      </svg>
                    </button>
                  </form>
                </div>
              </div>
              
              {/* Payment Icons */}
              <div className='mt-4'>
                <p className='text-xs text-gray-500 mb-2'>We accept:</p>
                <div className='flex space-x-2'>
                  <img
                    src='https://logos-world.net/wp-content/uploads/2020/04/Visa-Logo.png'
                    alt='Visa'
                    className='h-4 w-auto filter brightness-0 saturate-100 opacity-60'
                  />
                  <img
                    src='https://logos-world.net/wp-content/uploads/2020/04/Mastercard-Logo.png'
                    alt='Mastercard'
                    className='h-4 w-auto filter brightness-0 saturate-100 opacity-60'
                  />
                  <img
                    src='https://logos-world.net/wp-content/uploads/2020/04/American-Express-Logo.png'
                    alt='American Express'
                    className='h-4 w-auto filter brightness-0 saturate-100 opacity-60'
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className='bg-black h-5 flex items-center'>
          <div className='sm:container px-4 mx-auto w-full'>
            <div className='flex md:flex-row flex-col-reverse gap-3 justify-between items-center'>
              <span className='font-medium text-xs text-white'>
                &copy; 2025 FEMFIT. All Rights Reserved.
              </span>
              <a href='#' className='font-semibold text-xs text-white'>
                Privacy Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Footer;