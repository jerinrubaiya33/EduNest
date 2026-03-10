// src/context/lang-context.jsx
import { createContext, useContext, useEffect, useState } from "react";

const LangContext = createContext();

export function LangProvider({ children }) {
  const [lang, setLang] = useState(
    localStorage.getItem("lang") || "EN"
  );
  const [translations, setTranslations] = useState({});

  useEffect(() => {
    async function loadLanguage() {
      try {
        // Dynamically import the JSON file
        let data;
        if (lang === "BN") {
          data = await import("@/i18n/BN.json");
        } else {
          data = await import("@/i18n/EN.json");
        }
        setTranslations(data.default || data);
        localStorage.setItem("lang", lang);
        
        // Also update the HTML lang attribute
        document.documentElement.lang = lang === "BN" ? "bn" : "en";
      } catch (error) {
        console.error("Failed to load language file:", error);
        // Fallback to English
        const fallback = await import("@/i18n/EN.json");
        setTranslations(fallback.default || fallback);
      }
    }
    loadLanguage();
  }, [lang]);

  function t(key) {
    return translations[key] || key;
  }

  return (
    <LangContext.Provider value={{ lang, setLang, t }}>
      {children}
    </LangContext.Provider>
  );
}

export function useLang() {
  const context = useContext(LangContext);
  if (!context) {
    throw new Error("useLang must be used within a LangProvider");
  }
  return context;
}