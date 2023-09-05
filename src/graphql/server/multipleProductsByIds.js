import { gql } from "@apollo/client";

export const MULTIPLE_PRODUCTS_BY_ID = (idsQuery) => {
  return gql`
    query MyQuery(
    $country: CountryCode!
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
      products(query: ${idsQuery}) {
        edges {
          node {
            title
            id
          }
        }
      }
    }
  `;
};
