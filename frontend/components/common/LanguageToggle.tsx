'use client';

import { useState, useEffect } from 'react';
import { Globe } from 'lucide-react';
import { Language, useTranslation } from '@/lib/i18n';
import { cn } from '@/lib/utils';

export default function LanguageToggle() {
  const { language, setLanguage } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const languages = [
    { code: 'en' as Language, name: 'English', flag: '🇺🇸' },
    { code: 'km' as Language, name: 'ខ្មែរ', flag: '🇰🇭' }
  ];

  const currentLanguage = languages.find(lang => lang.code === language);

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
    setIsOpen(false);
    
    // Store preference
    if (typeof window !== 'undefined') {
      localStorage.setItem('preferred_language', newLanguage);
    }

    // Track language change in Google Analytics
    if (window.gtag) {
      window.gtag('event', 'language_change', {
        event_category: 'User Interaction',
        event_label: newLanguage,
      });
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 p-2 hover:bg-gray-100 rounded-lg transition-colors"
        aria-label="Change language"
      >
        <Globe className="w-4 h-4" />
        <span className="text-sm font-medium">{currentLanguage?.flag}</span>
        {isOpen && (
          <span className="hidden sm:block text-sm">{currentLanguage?.name}</span>
        )}
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="py-2">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => handleLanguageChange(lang.code)}
                className={cn(
                  "w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-gray-50 transition-colors",
                  language === lang.code ? "bg-gray-50 text-black" : "text-gray-700"
                )}
              >
                <span className="text-lg">{lang.flag}</span>
                <span className="font-medium">{lang.name}</span>
                {language === lang.code && (
                  <span className="ml-auto text-green-600">✓</span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}