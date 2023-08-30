import { getSeparators } from "./formatNumber";
import { LOCALE } from "./translate";

// Wrap this in a function for testing.
export function createParser(locale = LOCALE) {
  let { decimalSep, thousandsSep } = getSeparators(locale);
  const parseNumber = (input) => {
    let trimmed = input.replace(/^\D+/, "");
    let value = trimmed.split(thousandsSep).join("").replace(decimalSep, ".");
    return Number(value);
  };
  return parseNumber;
}

export default createParser();
