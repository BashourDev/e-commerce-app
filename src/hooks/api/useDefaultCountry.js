import { useEffect } from "react";

import { useMutation, useQuery } from "@apollo/client";
import {
  GET_DEFAULT_COUNTRY,
  SET_DEFAULT_COUNTRY,
} from "../../graphql/client/clientQueries";
import useLocalization from "./useLocalization";

export default function useDefaultCountry() {
  let { data: localizationData } = useLocalization();

  let { data, loading, refetch, error } = useQuery(GET_DEFAULT_COUNTRY);

  let initCountryCode = {
    countryCode: localizationData?.localization.country.isoCode || "US",
    currencyCode:
      localizationData?.localization.country.currency.isoCode || "USD",
    currencySymbol:
      localizationData?.localization.country.currency.symbol || "$",
  };

  let selectedCountryCode = {
    countryCode:
      data?.defaultCountry.countryCode || initCountryCode.countryCode,
    currencyCode:
      data?.defaultCountry.currencyCode || initCountryCode.currencyCode,
    currencySymbol:
      data?.defaultCountry.currencySymbol || initCountryCode.currencySymbol,
  };

  let [setDefaultCountryCode] = useMutation(SET_DEFAULT_COUNTRY);

  useEffect(() => {
    if (!selectedCountryCode) {
      setDefaultCountryCode({
        variables: initCountryCode,
      });
    }
  }, [selectedCountryCode, initCountryCode]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    setDefaultCountryCode,
    data: {
      countryCode: selectedCountryCode.countryCode,
      currencyCode: selectedCountryCode.currencyCode,
      currencySymbol: selectedCountryCode.currencySymbol,
    },
    loading,
    refetch,
    error,
  };
}
