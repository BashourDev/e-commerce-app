import gql from "graphql-tag";

export const GET_LOCALIZATION = gql`
  query GetLocalization($language: LanguageCode)
  @inContext(language: $language) {
    localization {
      availableCountries {
        currency {
          isoCode
          name
          symbol
        }
        isoCode
        name
        unitSystem
      }
      country {
        currency {
          isoCode
          name
          symbol
        }
        isoCode
        name
        unitSystem
      }
    }
  }
`;
