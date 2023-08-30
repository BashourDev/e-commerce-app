import { ADD_TO_WISHLIST, GET_WISHLIST } from "../client/clientQueries";

function addToWishlistResolver(_, args, { cache }) {
  let { product } = args;

  let newWishlistProduct = {
    __typename: "WishlistProduct",
    ...product,
  };

  let wishlistData = cache.readQuery({
    query: GET_WISHLIST,
  });

  let wishlist = wishlistData ? wishlistData.wishlist : [];

  cache.writeQuery({
    query: GET_WISHLIST,
    data: {
      wishlist: [...wishlist, newWishlistProduct],
    },
  });

  return null;
}

export { addToWishlistResolver };
