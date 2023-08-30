import { GET_SHOPPING_CART } from "../client/shoppingCartQueries";

async function addToShoppingCartResolver(_, args, { cache }) {
  let { quantity, variantId } = args;

  let cartData = cache.readQuery({ query: GET_SHOPPING_CART });

  if (!cartData) {
    return;
  }

  let newItem = {
    __typename: "LineItem",
    quantity,
    variantId,
  };

  let alreadyInCart = false;

  let newItems = cartData.shoppingCart.items.map((item) => {
    if (item.variantId === variantId) {
      alreadyInCart = true;
      return { ...item, quantity: item.quantity + quantity };
    } else {
      return item;
    }
  });

  if (!alreadyInCart) {
    newItems.push(newItem);
  }
  let shoppingCart = {
    __typename: "ShoppingCart",
    id: cartData.shoppingCart.id,
    items: newItems,
  };

  cache.writeQuery({
    query: GET_SHOPPING_CART,
    data: {
      shoppingCart,
    },
  });

  return shoppingCart;
}

export { addToShoppingCartResolver };
