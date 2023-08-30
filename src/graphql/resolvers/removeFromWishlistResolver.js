import {
  GET_WISHLIST,
  REMOVE_FROM_WISHLIST,
  SET_WISH_LIST,
} from "../client/clientQueries";

function removeFromWishlistResolver(_, args, { cache }) {
  let { productHandle } = args;

  let wishlistData = cache.readQuery({
    query: GET_WISHLIST,
  });

  let newWishlist = wishlistData
    ? wishlistData.wishlist.filter((item) => item.handle !== productHandle)
    : [];

  cache.writeQuery({
    query: GET_WISHLIST,
    data: {
      wishlist: newWishlist,
    },
  });

  return null;
}

export { removeFromWishlistResolver };
