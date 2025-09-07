'use client';

import { useRef } from 'react';
import { 
  MessageCircle, 
  Phone, 
  Mail, 
  Users, 
  TrendingUp,
  Package,
  DollarSign,
  Star,
  CheckCircle,
  ArrowRight,
  Zap
} from 'lucide-react';
import gsap from 'gsap';
import PrivateLayout from '@/components/layouts/PrivateLayout';
import { cn } from '@/lib/utils';

export default function B2BPage() {
  const pricingTiers = [
    {
      name: 'Starter',
      price: '$299',
      period: '/month',
      description: 'Perfect for small businesses getting started',
      features: [
        'Up to 100 products',
        'Basic analytics',
        'Email support',
        '5% transaction fee',
        'Standard shipping rates'
      ],
      popular: false
    },
    {
      name: 'Professional',
      price: '$599',
      period: '/month',
      description: 'Ideal for growing businesses',
      features: [
        'Up to 1,000 products',
        'Advanced analytics',
        'Priority support',
        '3% transaction fee',
        'Discounted shipping rates',
        'Custom branding'
      ],
      popular: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      period: '',
      description: 'For large-scale operations',
      features: [
        'Unlimited products',
        'Custom analytics dashboard',
        'Dedicated account manager',
        '1% transaction fee',
        'Free shipping integration',
        'White-label solution',
        'API access'
      ],
      popular: false
    }
  ];

  const benefits = [
    {
      icon: TrendingUp,
      title: 'Increase Sales',
      description: 'Access to premium customer base with higher purchasing power'
    },
    {
      icon: Users,
      title: 'B2B Network',
      description: 'Connect with other verified sellers and build partnerships'
    },
    {
      icon: Package,
      title: 'Inventory Management',
      description: 'Advanced tools to manage your products and orders efficiently'
    },
    {
      icon: Zap,
      title: 'Fast Payments',
      description: 'Quick and secure payment processing with competitive rates'
    }
  ];

  const handleJoinTelegram = () => {
    // Replace with actual Telegram group link
    window.open('https://t.me/luxe_sellers', '_blank');
  };

  return (
    <PrivateLayout requiredRole="seller">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 pt-24 pb-16">
        <div className="space-y-16">
          {/* Hero Section */}
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Star className="w-6 h-6 text-luxury-gold" />
              <span className="text-luxury-gold font-medium">VERIFIED SELLER</span>
              <Star className="w-6 h-6 text-luxury-gold" />
            </div>
            <h1 className="text-4xl sm:text-6xl font-playfair font-bold">
              Welcome to B2B Portal
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Hello <span className="font-semibold text-luxury-gold">Seller</span>! 
              Join our exclusive seller network and access premium wholesale opportunities.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 max-w-2xl mx-auto">
            <button
              onClick={handleJoinTelegram}
              className="group bg-gradient-to-r from-blue-500 to-blue-600 text-white p-8 rounded-2xl hover:from-blue-600 hover:to-blue-700 transition-all duration-300 hover:scale-105"
            >
              <div className="flex items-center justify-center mb-4">
                <MessageCircle className="w-12 h-12 group-hover:scale-110 transition-transform" />
              </div>
              <h3 className="text-xl font-bold mb-2">Join Telegram Group</h3>
              <p className="text-blue-100">Connect with other sellers and get instant support</p>
              <div className="flex items-center justify-center mt-4 text-blue-200">
                <span className="mr-2">Join Now</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </button>

            <div className="bg-gradient-to-r from-luxury-sand to-luxury-gold/20 p-8 rounded-2xl">
              <div className="flex items-center justify-center mb-4">
                <Phone className="w-12 h-12 text-luxury-gold" />
              </div>
              <h3 className="text-xl font-bold mb-2">Direct Contact</h3>
              <p className="text-gray-600 mb-4">Speak with our B2B team for personalized assistance</p>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-luxury-gold" />
                  <span>+855 12 345 678</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-luxury-gold" />
                  <span>b2b@luxe.com</span>
                </div>
              </div>
            </div>
          </div>

          {/* Benefits Section */}
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-playfair font-bold mb-4">Why Choose FEMFIT B2B?</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Join thousands of successful sellers who trust FEMFIT for their wholesale business
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {benefits.map((benefit, index) => (
                <div key={benefit.title} className="text-center p-6 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                  <div className="w-16 h-16 bg-luxury-gold/10 rounded-full flex items-center justify-center mx-auto mb-4">
                    <benefit.icon className="w-8 h-8 text-luxury-gold" />
                  </div>
                  <h3 className="font-space-grotesk font-semibold mb-2">{benefit.title}</h3>
                  <p className="text-sm text-gray-600">{benefit.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Pricing Section */}
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-playfair font-bold mb-4">Seller Plans & Pricing</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Choose the perfect plan for your business needs. All plans include our core features.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {pricingTiers.map((tier, index) => (
                <div
                  key={tier.name}
                  className={cn(
                    "relative p-8 rounded-2xl border-2 transition-all duration-300 hover:scale-105",
                    tier.popular 
                      ? "border-luxury-gold bg-gradient-to-b from-luxury-gold/5 to-luxury-gold/10" 
                      : "border-gray-200 bg-white hover:border-gray-300"
                  )}
                >
                  {tier.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <span className="bg-luxury-gold text-black px-4 py-2 rounded-full text-sm font-bold">
                        MOST POPULAR
                      </span>
                    </div>
                  )}

                  <div className="text-center mb-6">
                    <h3 className="text-xl font-bold mb-2">{tier.name}</h3>
                    <div className="flex items-baseline justify-center mb-2">
                      <span className="text-3xl font-bold">{tier.price}</span>
                      <span className="text-gray-500 ml-1">{tier.period}</span>
                    </div>
                    <p className="text-gray-600 text-sm">{tier.description}</p>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {tier.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center space-x-3">
                        <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <button
                    className={cn(
                      "w-full py-3 px-6 rounded-lg font-medium transition-colors",
                      tier.popular
                        ? "bg-luxury-gold text-black hover:bg-yellow-500"
                        : "bg-black text-white hover:bg-gray-800"
                    )}
                  >
                    {tier.name === 'Enterprise' ? 'Contact Sales' : 'Get Started'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="bg-gradient-to-r from-luxury-charcoal to-black text-white p-12 rounded-2xl text-center">
            <h2 className="text-3xl font-playfair font-bold mb-4">
              Ready to Start Selling?
            </h2>
            <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
              Join our Telegram group to connect with our team and other sellers. 
              Get instant access to exclusive deals, market insights, and direct support.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={handleJoinTelegram}
                className="bg-blue-500 hover:bg-blue-600 text-white px-8 py-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
              >
                <MessageCircle className="w-5 h-5" />
                <span>Join Telegram Group</span>
              </button>
              <a
                href="mailto:b2b@luxe.com"
                className="bg-luxury-gold hover:bg-yellow-500 text-black px-8 py-4 rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
              >
                <Mail className="w-5 h-5" />
                <span>Contact Sales Team</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </PrivateLayout>
  );
}