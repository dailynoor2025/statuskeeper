"use client";

import { useState, useEffect } from 'react';
import { translations, type Language } from '@/lib/translations';

export function useTranslation() {
  const [lang, setLang] = useState<Language>('en');

  useEffect(() => {
    // Detect system language or use saved preference
    const savedLang = localStorage.getItem('app_language') as Language;
    if (savedLang && translations[savedLang]) {
      setLang(savedLang);
    } else {
      const systemLang = navigator.language.split('-')[0] as Language;
      if (translations[systemLang]) {
        setLang(systemLang);
      }
    }
  }, []);

  const t = translations[lang] || translations.en;

  const changeLanguage = (newLang: Language) => {
    setLang(newLang);
    localStorage.setItem('app_language', newLang);
    window.location.reload(); // Refresh to apply throughout
  };

  return { t, lang, changeLanguage };
}
