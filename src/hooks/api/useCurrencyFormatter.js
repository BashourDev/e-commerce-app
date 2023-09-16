import { useCallback } from "react";
import { DECIMAL_CURRENCIES } from "../../constants/decimalCurrencies";

import formatNumber from "../../helpers/formatNumber";
import useDefaultCountry from "./useDefaultCountry";
import { useTranslation } from "react-i18next";

export default function useCurrencyFormatter() {
  let { data: selectedCountryCode } = useDefaultCountry();
  const { i18n } = useTranslation();
  const formatCurrency = useCallback(
    (value) => {
      let { currencyCode, currencySymbol } = selectedCountryCode;
      let decimalDigit = DECIMAL_CURRENCIES[currencyCode] || 2;
      // TODO: Need to find a way to give decimal digits based on country
      if (i18n.language !== "ar") {
        return formatNumber(value, decimalDigit) + " " + currencyCode;
      } else {
        return formatNumber(value, decimalDigit) + " " + currencySymbol;
      }
    },
    [selectedCountryCode]
  );

  return formatCurrency;
}
