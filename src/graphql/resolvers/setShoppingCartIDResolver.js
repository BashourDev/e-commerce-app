import { GET_SHOPPING_CART } from "../client/shoppingCartQueries";

function setShoppingCartIDResolver(_, args, { cache }) {
  let { id } = args;
  let cartData = cache.readQuery({ query: GET_SHOPPING_CART });

  if (!cartData) {
    return;
  }

  let { shoppingCart } = cartData;

  cache.writeQuery({
    query: GET_SHOPPING_CART,
    data: {
      shoppingCart: {
        ...shoppingCart,
        id,
      },
    },
  });

  return null;
}

export { setShoppingCartIDResolver };
