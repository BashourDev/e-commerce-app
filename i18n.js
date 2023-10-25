import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import { locale } from "expo-localization";
import * as SecureStore from "expo-secure-store";

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
let preferredLng = locale[0] + locale[1];
const getPreferredLng = async () => {
  let result = await SecureStore.getItemAsync("lng");
  if (result) {
    preferredLng = result;
  } else {
    setPreferredLng(preferredLng);
  }
};
getPreferredLng().then(() => {
  i18next.use(initReactI18next).init({
    fallbackLng: "en",
    lng: preferredLng,
    // fallbackLng: "ar",
    // lng: "ar",
    resources: languageResoureces,
    compatibilityJSON: "v3",
  });
});

// i18next.use(initReactI18next).init({
//   fallbackLng: "en",
//   lng: preferredLng,
//   // fallbackLng: "ar",
//   // lng: "ar",
//   resources: languageResoureces,
//   compatibilityJSON: "v3",
// });
export const setPreferredLng = async (value) => {
  await SecureStore.setItemAsync("lng", value);
};

export default i18next;
