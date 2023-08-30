import {
  GET_SHOPPING_CART,
  SET_SHOPPING_CART,
} from "../client/shoppingCartQueries";
import { initialData } from "../initialData";

function resetShoppingCartResolver(_, __, { cache }) {
  cache.writeQuery({
    query: GET_SHOPPING_CART,
    data: {
      shoppingCart: initialData.shoppingCart,
    },
  });

  return null;
}

export { resetShoppingCartResolver };
