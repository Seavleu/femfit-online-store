'use client';
import React, { FormEvent, useRef, useState } from 'react';
import Link from 'next/link';

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
      <div className='bg-gray-100 py-2.5 mt-2.5'>
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
            <Link href='/new-products' className='hover:text-gray-600'>NEW PRODUCTS</Link>
            <div className='w-px h-4 bg-gray-300'></div>
            <Link href='/shoes' className='hover:text-gray-600'>SHOES</Link>
            <div className='w-px h-4 bg-gray-300'></div>
            <Link href='/bags' className='hover:text-gray-600'>BAGS</Link>
            <div className='w-px h-4 bg-gray-300'></div>
            <Link href='/wallet' className='hover:text-gray-600'>WALLET</Link>
            <div className='w-px h-4 bg-gray-300'></div>
            <Link href='/accessories' className='hover:text-gray-600'>ACCESSORIES</Link>
            <div className='w-px h-4 bg-gray-300'></div>
            <Link href='/recommendations' className='hover:text-gray-600'>RECOMMENDATIONS FOR YOU</Link>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className='bg-white py-2.5'>
        <div className='sm:container px-4 mx-auto'>
          <div className='grid grid-cols-1 md:grid-cols-5 gap-8'>
            {/* NEED HELP? */}
            <div>
              <h3 className='font-bold text-black text-sm mb-4 tracking-wide'>NEED HELP?</h3>
              <ul className='space-y-2'>
                <li><Link href='/order-inquiry' className='text-sm text-gray-600 hover:text-black'>Order Inquiry</Link></li>
                <li><Link href='/faq' className='text-sm text-gray-600 hover:text-black'>Frequently Asked Questions</Link></li>
                <li><Link href='/contact' className='text-sm text-gray-600 hover:text-black'>Contact Us</Link></li>
                <li><Link href='/fraud-prevention' className='text-sm text-gray-600 hover:text-black'>Fraud Prevention</Link></li>
                <li><Link href='/privilege-membership' className='text-sm text-gray-600 hover:text-black'>Privilege Membership</Link></li>
                <li><Link href='/shipping-tracking' className='text-sm text-gray-600 hover:text-black'>Shipping and Tracking</Link></li>
                <li><Link href='/returns-exchanges' className='text-sm text-gray-600 hover:text-black'>Returns and Exchanges</Link></li>
                <li><Link href='/size-guide' className='text-sm text-gray-600 hover:text-black'>Size Guide</Link></li>
              </ul>
            </div>

            {/* ABOUT US */}
            <div>
              <h3 className='font-bold text-black text-sm mb-4 tracking-wide'>ABOUT US</h3>
              <ul className='space-y-2'>
                <li><Link href='/brand-profile' className='text-sm text-gray-600 hover:text-black'>Brand Profile</Link></li>
                <li><Link href='/femfit-group' className='text-sm text-gray-600 hover:text-black'>FEMFIT GROUP</Link></li>
                <li><Link href='/sustainability' className='text-sm text-gray-600 hover:text-black'>Sustainable Management</Link></li>
                <li><Link href='/influence-program' className='text-sm text-gray-600 hover:text-black'>Influence Program</Link></li>
                <li><Link href='/franchise-inquiry' className='text-sm text-gray-600 hover:text-black'>Franchise Inquiry</Link></li>
                <li><Link href='/partnership-inquiry' className='text-sm text-gray-600 hover:text-black'>Partnership Inquiry</Link></li>
              </ul>
            </div>

            {/* SHOPPING WITH US */}
            <div>
              <h3 className='font-bold text-black text-sm mb-4 tracking-wide'>SHOPPING WITH US</h3>
              <ul className='space-y-2'>
                <li><Link href='/store-location' className='text-sm text-gray-600 hover:text-black'>Store location</Link></li>
                <li><Link href='/ambassador' className='text-sm text-gray-600 hover:text-black'>Ambassador</Link></li>
                <li><Link href='/fashion-guide' className='text-sm text-gray-600 hover:text-black'>Fashion Guide</Link></li>
                <li><Link href='/promotion' className='text-sm text-gray-600 hover:text-black'>Promotion</Link></li>
              </ul>
            </div>

            {/* LEGAL */}
            <div>
              <h3 className='font-bold text-black text-sm mb-4 tracking-wide'>LEGAL</h3>
              <ul className='space-y-2'>
                <li><Link href='/terms' className='text-sm text-gray-600 hover:text-black'>Terms of Use</Link></li>
                <li><Link href='/privacy' className='text-sm text-gray-600 hover:text-black'>Privacy Policy</Link></li>
                <li><Link href='/cookies' className='text-sm text-gray-600 hover:text-black'>Cookie Policy</Link></li>
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
    </>
  );
};

export default Footer;