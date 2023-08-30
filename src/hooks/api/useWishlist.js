import { useMutation, useQuery } from "@apollo/client";

import {
  ADD_TO_WISHLIST,
  GET_WISHLIST,
  REMOVE_FROM_WISHLIST,
} from "../../graphql/client/clientQueries";

function useAddItemToWishlist() {
  let [addToWishlist, { loading }] = useMutation(ADD_TO_WISHLIST);
  return { addToWishlist, loading };
}

function useRemoveItemFromWishlist() {
  let [removeFromWishlist, { loading }] = useMutation(REMOVE_FROM_WISHLIST);

  return { removeFromWishlist, loading };
}

function useGetWishlistData(options) {
  let { data, error, loading, refetch } = useQuery(GET_WISHLIST, {
    ...options,
  });
  return { data, error, loading, refetch };
}

export { useAddItemToWishlist, useRemoveItemFromWishlist, useGetWishlistData };
