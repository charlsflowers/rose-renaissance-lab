import { createContext, useContext, useState, useCallback, type ReactNode } from "react";
import { en } from "./translations/en";
import { es } from "./translations/es";

export type Language = "en" | "es";

const translations: Record<Language, Record<string, any>> = { en, es };

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  const [language, setLanguageState] = useState<Language>(() => {
    try {
      const saved = localStorage.getItem("charls-lang");
      return (saved === "es" ? "es" : "en") as Language;
    } catch {
      return "en";
    }
  });

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    try { localStorage.setItem("charls-lang", lang); } catch {}
    document.documentElement.lang = lang;
  }, []);

  const t = useCallback((key: string): string => {
    const keys = key.split(".");
    let value: any = translations[language];
    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) {
        // Fallback to English
        let fallback: any = translations.en;
        for (const fk of keys) fallback = fallback?.[fk];
        return typeof fallback === "string" ? fallback : key;
      }
    }
    return typeof value === "string" ? value : key;
  }, [language]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useTranslation = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useTranslation must be used within LanguageProvider");
  return ctx;
};
