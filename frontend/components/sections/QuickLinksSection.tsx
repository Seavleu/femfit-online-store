'use client';

import { useEffect, useRef } from 'react';
import { useSupabaseAuth } from '@/contexts/SupabaseAuthContext';
import { useTranslation } from '@/lib/i18n';
import { 
  ShoppingBag, 
  Heart, 
  User, 
  Package, 
  CreditCard, 
  Truck,
  Star,
  Shield
} from 'lucide-react';
import Link from 'next/link';

export default function QuickLinksSection() {
  const { user } = useSupabaseAuth();
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<(HTMLAnchorElement | null)[]>([]);

  useEffect(() => {
    if (!sectionRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
          }
        });
      },
      { threshold: 0.1 }
    );

    cardsRef.current.forEach((card) => {
      if (card) observer.observe(card);
    });

    return () => observer.disconnect();
  }, []);

  const { t } = useTranslation();

  const quickLinks = [
    {
      icon: ShoppingBag,
      title: t('quick_links.shop'),
      description: t('quick_links.shop_desc'),
      href: '/shop',
      color: 'bg-blue-500',
      iconColor: 'text-blue-500'
    },
    {
      icon: Heart,
      title: t('quick_links.wishlist'),
      description: t('quick_links.wishlist_desc'),
      href: user ? '/wishlist' : '/auth/signin',
      color: 'bg-pink-500',
      iconColor: 'text-pink-500'
    },
    {
      icon: User,
      title: t('quick_links.profile'),
      description: t('quick_links.profile_desc'),
      href: user ? '/profile' : '/auth/signin',
      color: 'bg-green-500',
      iconColor: 'text-green-500'
    },
    {
      icon: Package,
      title: t('quick_links.orders'),
      description: t('quick_links.orders_desc'),
      href: user ? '/orders' : '/auth/signin',
      color: 'bg-purple-500',
      iconColor: 'text-purple-500'
    },
    {
      icon: CreditCard,
      title: t('quick_links.payments'),
      description: t('quick_links.payments_desc'),
      href: '/checkout',
      color: 'bg-yellow-500',
      iconColor: 'text-yellow-500'
    },
    {
      icon: Truck,
      title: t('quick_links.shipping'),
      description: t('quick_links.shipping_desc'),
      href: '/shipping',
      color: 'bg-indigo-500',
      iconColor: 'text-indigo-500'
    },
    {
      icon: Star,
      title: t('quick_links.reviews'),
      description: t('quick_links.reviews_desc'),
      href: '/reviews',
      color: 'bg-orange-500',
      iconColor: 'text-orange-500'
    },
    {
      icon: Shield,
      title: t('quick_links.support'),
      description: t('quick_links.support_desc'),
      href: '/support',
      color: 'bg-red-500',
      iconColor: 'text-red-500'
    }
  ];

  return (
    <section ref={sectionRef} className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            {t('quick_links.title')}
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            {t('quick_links.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickLinks.map((link, index) => {
            const Icon = link.icon;
            return (
              <Link
                key={index}
                href={link.href}
                ref={(el) => {
                  if (el) cardsRef.current[index] = el;
                }}
                className="group bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-300 transform hover:-translate-y-1 border border-gray-100"
              >
                <div className={`w-12 h-12 ${link.color} rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <Icon className="w-6 h-6 text-white" />
                </div>
                
                <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-gray-700 transition-colors">
                  {link.title}
                </h3>
                
                <p className="text-sm text-gray-600 group-hover:text-gray-500 transition-colors">
                  {link.description}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}