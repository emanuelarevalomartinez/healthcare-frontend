"use client";

import { createContext, useContext } from "react";

type TranslationDictionary = typeof import("../../../../messages/en.json");

interface LanguageContextType {
  dictionary: TranslationDictionary;
}

const LanguageContext = createContext<LanguageContextType | undefined>(
  undefined
);

export function LanguageProvider({
  dictionary,
  children,
}: {
  dictionary: TranslationDictionary;
  children: React.ReactNode;
}) {
  return (
    <LanguageContext.Provider value={{ dictionary }}>
      {children}
    </LanguageContext.Provider>
  );
}

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context)
    throw new Error("useLanguage must be used within LanguageProvider");
  return context;
};
