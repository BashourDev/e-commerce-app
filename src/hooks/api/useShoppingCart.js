import { useMutation, useQuery } from "@apollo/client";

import {
  ADD_TO_SHOPPING_CART,
  GET_SHOPPING_CART,
  RESET_SHOPPING_CART,
  SET_SHOPPING_CART,
  SET_SHOPPING_CART_ID,
} from "../../graphql/client/shoppingCartQueries";

function useResetCart() {
  let [resetShoppingCart, { loading }] = useMutation(RESET_SHOPPING_CART);
  return { resetShoppingCart, loading };
}

function useAddToCart(options) {
  let [addToCart, { loading }] = useMutation(ADD_TO_SHOPPING_CART, {
    ...options,
  });
  return { addToCart, loading };
}

function useGetCart(options) {
  let { data, error, loading, refetch } = useQuery(GET_SHOPPING_CART, {
    ...options,
  });

  return { data, error, loading, refetch };
}

function useSetShoppingCartID() {
  let [setShoppingCartID, { loading }] = useMutation(SET_SHOPPING_CART_ID);
  return { setShoppingCartID, loading };
}
function useSetShoppingCart() {
  let [setShoppingCart, { loading }] = useMutation(SET_SHOPPING_CART);
  return { setShoppingCart, loading };
}

export {
  useResetCart,
  useAddToCart,
  useGetCart,
  useSetShoppingCart,
  useSetShoppingCartID,
};
