import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import { locale } from "expo-localization";

import en from "./locales/en.json";
import ar from "./locales/ar.json";

const languageResoureces = {
  en: {
    translation: en,
  },
  ar: {
    translation: ar,
  },
};
i18next.use(initReactI18next).init({
  // fallbackLng: "en",
  // lng: locale[0] + locale[1],
  fallbackLng: "ar",
  lng: "ar",
  resources: languageResoureces,
  compatibilityJSON: "v3",
});

export default i18next;
