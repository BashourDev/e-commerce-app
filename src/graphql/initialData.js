export const initialData = {
  authenticatedUser: {
    __typename: "AuthenticatedUser",
    email: "",
    id: "",
    expiresAt: "",
    firstName: "",
    lastName: "",
  },
  wishlist: [],
  shoppingCart: {
    __typename: "ShoppingCart",
    id: "",
    items: [],
  },
  recentSearch: [],
  defaultCountry: {
    __typename: "DefaultCountry",
    countryCode: "",
    currencyCode: "",
    currencySymbol: "",
  },
};
