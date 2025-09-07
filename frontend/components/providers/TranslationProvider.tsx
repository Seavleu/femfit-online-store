'use client';

import { useState, useEffect, ReactNode } from 'react';
import { TranslationContext, getTranslation, type Language } from '@/lib/i18n';

interface TranslationProviderProps {
  children: ReactNode;
  defaultLanguage?: Language;
}

export function TranslationProvider({ children, defaultLanguage = 'km' }: TranslationProviderProps) {
  const [language, setLanguageState] = useState<Language>(defaultLanguage);

  useEffect(() => {
    // Load saved language preference
    const savedLanguage = localStorage.getItem('appLanguage');
    if (savedLanguage === 'en' || savedLanguage === 'km') {
      setLanguageState(savedLanguage);
      document.documentElement.lang = savedLanguage;
    } else {
      // Default to Khmer for Cambodian users
      setLanguageState('km');
      document.documentElement.lang = 'km';
    }
  }, []);

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('appLanguage', lang);
    document.documentElement.lang = lang;
  };

  const t = (key: string, fallback?: string) => {
    return getTranslation(key, language, fallback);
  };

  const changeLanguage = (lang: Language) => {
    setLanguage(lang);
  };

  const contextValue = {
    language,
    setLanguage,
    t,
    changeLanguage
  };

  return (
    <TranslationContext.Provider value={contextValue}>
      {children}
    </TranslationContext.Provider>
  );
}