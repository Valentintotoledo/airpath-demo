"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { dictionaries, type Dict } from "./dictionary";

export type Lang = "es" | "en";

type I18nValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  toggleLang: () => void;
  t: Dict;
};

const I18nContext = createContext<I18nValue | null>(null);
const STORAGE_KEY = "airpath.lang";

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("es");

  useEffect(() => {
    const stored = window.localStorage.getItem(STORAGE_KEY) as Lang | null;
    if (stored === "es" || stored === "en") setLangState(stored);
  }, []);

  const setLang = useCallback((next: Lang) => {
    setLangState(next);
    window.localStorage.setItem(STORAGE_KEY, next);
    document.documentElement.lang = next;
  }, []);

  const toggleLang = useCallback(() => {
    setLangState((prev) => {
      const next = prev === "es" ? "en" : "es";
      window.localStorage.setItem(STORAGE_KEY, next);
      document.documentElement.lang = next;
      return next;
    });
  }, []);

  const value = useMemo<I18nValue>(
    () => ({ lang, setLang, toggleLang, t: dictionaries[lang] }),
    [lang, setLang, toggleLang],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n(): I18nValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within LanguageProvider");
  return ctx;
}

/** Shorthand: returns the active dictionary. */
export function useT(): Dict {
  return useI18n().t;
}

/** Pick a localized value from an { es, en } pair. */
export function pick<T>(lang: Lang, pair: { es: T; en: T }): T {
  return pair[lang];
}
