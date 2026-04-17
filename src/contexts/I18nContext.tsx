'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { Language } from '@/types';

type Translations = Record<string, Record<string, string>>;

interface I18nContextType {
  locale: Language;
  setLocale: (lang: Language) => void;
  t: (key: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

const translationsCache: Partial<Record<Language, Translations>> = {};

async function loadTranslations(lang: Language): Promise<Translations> {
  if (translationsCache[lang]) return translationsCache[lang]!;
  const res = await fetch(`/locales/${lang}.json`);
  const data = await res.json();
  translationsCache[lang] = data;
  return data;
}

export function I18nProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Language>('sq');
  const [translations, setTranslations] = useState<Translations>({});

  useEffect(() => {
    const saved = localStorage.getItem('fyt-locale') as Language;
    if (saved && ['sq', 'en', 'sr', 'de'].includes(saved)) {
      setLocaleState(saved);
    }
  }, []);

  useEffect(() => {
    loadTranslations(locale).then(setTranslations);
  }, [locale]);

  const setLocale = async (lang: Language) => {
    setLocaleState(lang);
    localStorage.setItem('fyt-locale', lang);
    
    // Set cookie via API for server components
    try {
      await fetch('/api/i18n', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ locale: lang }),
      });
      // Force refresh to update server-side translations
      window.location.reload();
    } catch (err) {
      console.error('Failed to sync locale:', err);
    }
  };

  const t = (key: string): string => {
    const parts = key.split('.');
    if (parts.length === 2) {
      return translations[parts[0]]?.[parts[1]] || key;
    }
    return key;
  };

  return (
    <I18nContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) throw new Error('useI18n must be used within I18nProvider');
  return context;
}
