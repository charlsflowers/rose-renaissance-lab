import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { useLocation } from "react-router-dom";
import { en } from "./translations/en";
import { es } from "./translations/es";

export type Language = "en" | "es";

const translations: Record<Language, Record<string, any>> = { en, es };

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  tRaw: (key: string) => any;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

/** Strip `/es` prefix from a path. Returns the EN-equivalent path. */
export const stripLangPrefix = (pathname: string): string => {
  if (pathname === "/es") return "/";
  if (pathname.startsWith("/es/")) return pathname.slice(3);
  return pathname;
};

/** Detect language from a pathname. */
export const detectLangFromPath = (pathname: string): Language =>
  pathname === "/es" || pathname.startsWith("/es/") ? "es" : "en";

/** Build a URL for the given path in the given language. `path` should be EN-style (no /es prefix). */
export const localizePath = (path: string, lang: Language): string => {
  // Preserve query/hash
  const clean = stripLangPrefix(path);
  if (lang === "en") return clean;
  if (clean === "/") return "/es";
  return `/es${clean}`;
};

export const LanguageProvider = ({ children }: { children: ReactNode }) => {
  // Initial language: URL wins. Falls back to localStorage only if URL is ambiguous (it isn't).
  const [language, setLanguageState] = useState<Language>(() => {
    if (typeof window !== "undefined") {
      return detectLangFromPath(window.location.pathname);
    }
    return "en";
  });

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    try { localStorage.setItem("charls-lang", lang); } catch {}
    document.documentElement.lang = lang;
  }, []);

  const tRaw = useCallback((key: string): any => {
    const keys = key.split(".");
    let value: any = translations[language];
    for (const k of keys) {
      value = value?.[k];
      if (value === undefined) {
        let fallback: any = translations.en;
        for (const fk of keys) fallback = fallback?.[fk];
        return fallback ?? key;
      }
    }
    return value ?? key;
  }, [language]);

  const t = useCallback((key: string): string => {
    const result = tRaw(key);
    return typeof result === "string" ? result : key;
  }, [tRaw]);

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, tRaw }}>
      <UrlLanguageSync setLanguage={setLanguage} />
      {children}
    </LanguageContext.Provider>
  );
};

/** Listens to URL changes and keeps `language` in sync with the path prefix. URL is the source of truth. */
const UrlLanguageSync = ({ setLanguage }: { setLanguage: (l: Language) => void }) => {
  const location = useLocation();
  useEffect(() => {
    setLanguage(detectLangFromPath(location.pathname));
  }, [location.pathname, setLanguage]);
  return null;
};

export const useTranslation = () => {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error("useTranslation must be used within LanguageProvider");
  return ctx;
};
