import {
  GET_SHOPPING_CART,
  SET_SHOPPING_CART,
} from "../client/shoppingCartQueries";

function setShoppingCartResolver(_, args, { cache }) {
  let { items, id } = args;
  let newItems = items.map((item) => {
    return { ...item, __typename: "LineItem" };
  });

  cache.writeQuery({
    query: GET_SHOPPING_CART,
    data: {
      shoppingCart: {
        __typename: "ShoppingCart",
        id,
        items: newItems,
      },
    },
  });

  return null;
}

export { setShoppingCartResolver };
