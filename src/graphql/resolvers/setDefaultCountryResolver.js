import { GET_DEFAULT_COUNTRY } from "../client/clientQueries";

function setDefaultCountryResolver(_, args, { cache }) {
  let { countryCode, currencyCode, currencySymbol } = args;

  cache.writeQuery({
    query: GET_DEFAULT_COUNTRY,
    data: {
      defaultCountry: {
        __typename: "DefaultCountry",
        countryCode,
        currencyCode,
        currencySymbol,
      },
    },
  });

  return null;
}

export { setDefaultCountryResolver };
