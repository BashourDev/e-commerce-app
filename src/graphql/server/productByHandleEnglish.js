import gql from "graphql-tag";

export const GET_PRODUCT_BY_HANDLE_ENGLISH = gql`
  query GetProductByHandleEnglish(
    $productHandle: String!
    $country: CountryCode!
    $language: LanguageCode
  ) @inContext(country: $country, language: $language) {
    productByHandle(handle: $productHandle) {
      id

      options(first: 5) {
        name
        values
      }
    }
  }
`;

// title
//       handle
//       availableForSale
//       description
//       onlineStoreUrl
// images(first: 5) {
//   edges {
//     node {
//       id
//       originalSrc
//       transformedSrc
//       altText
//     }
//   }
// }
// variants(first: 1) {
//   edges {
//     node {
//       id
//       quantityAvailable
//       compareAtPriceV2 {
//         amount
//         currencyCode
//       }
//       priceV2 {
//         amount
//         currencyCode
//       }
//     }
//   }
// }
