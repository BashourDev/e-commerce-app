import { getLocales } from "expo-localization";
// export const LOCALE = getLocales()[0].;

// This matches words inside curly braces.
const PLACEHOLDER = /\{(\w+)\}/g;

export function t(input, params) {
  if (params) {
    return input.replace(PLACEHOLDER, (match, word) => {
      return params[word] != null ? String(params[word]) : match;
    });
  } else {
    return input;
  }
}
