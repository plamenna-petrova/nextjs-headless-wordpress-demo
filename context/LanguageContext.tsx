"use client";

import { createContext, useContext, useState } from "react";
import { Locale, defaultLocale } from "@/lib/i18n";

const LanguageContext = createContext<{
  locale: Locale;
  setLocale: (locale: Locale) => void;  
}>({ locale: defaultLocale, setLocale: () => { } });

export const LanguageProvider = ({ children }: { children: React.ReactNode }) => {
  const [locale, setLocale] = useState<Locale>(defaultLocale);

  return (
    <LanguageContext.Provider value={{ locale, setLocale }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => useContext(LanguageContext);