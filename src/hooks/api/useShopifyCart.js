import { MutationHookOptions, useMutation } from "@apollo/client";
import {
  SHOPPING_CART_CREATE,
  SHOPPING_CART_CUSTOMER_ASSOCIATE,
  SHOPPING_CART_DISCOUNT_CODE_APPLY,
  SHOPPING_CART_DISCOUNT_CODE_REMOVE,
  SHOPPING_CART_REPLACE_ITEMS,
  SHOPPING_CART_UPDATE_ADDRESS,
} from "../../graphql/server/shoppingCart";

function useCheckoutReplaceItem(options) {
  let [shoppingCartReplaceItems, { loading, error }] = useMutation(
    SHOPPING_CART_REPLACE_ITEMS,
    {
      fetchPolicy: "no-cache",
      notifyOnNetworkStatusChange: true,
      ...options,
    }
  );
  return { shoppingCartReplaceItems, loading, error };
}

function useCheckoutCreate(options) {
  let [createCheckout, { loading, error }] = useMutation(SHOPPING_CART_CREATE, {
    fetchPolicy: "no-cache",
    notifyOnNetworkStatusChange: true,
    ...options,
  });
  return { createCheckout, loading, error };
}

function useCheckoutUpdateAddress(options) {
  let [updateCartAddress, { data, loading, error }] = useMutation(
    SHOPPING_CART_UPDATE_ADDRESS,
    { ...options }
  );
  console.log(error);
  return { updateCartAddress, data, loading };
}
function useCheckoutCustomerAssociate(options) {
  let [shoppingCartCustomerAssociate, { data, loading }] = useMutation(
    SHOPPING_CART_CUSTOMER_ASSOCIATE,
    { ...options }
  );

  return {
    shoppingCartCustomerAssociate,
    data,
    loading,
  };
}

function useCheckoutDiscountApply(options) {
  let [shoppingCartDiscountApply, { data, loading }] = useMutation(
    SHOPPING_CART_DISCOUNT_CODE_APPLY,
    {
      ...options,
    }
  );

  return {
    shoppingCartDiscountApply,
    data,
    loading,
  };
}

function useCheckoutDiscountRemove(options) {
  let [shoppingCartDiscountRemove, { data, loading, error }] = useMutation(
    SHOPPING_CART_DISCOUNT_CODE_REMOVE,
    {
      ...options,
    }
  );

  return {
    shoppingCartDiscountRemove,
    data,
    loading,
    error,
  };
}

export {
  useCheckoutCreate,
  useCheckoutCustomerAssociate,
  useCheckoutDiscountApply,
  useCheckoutDiscountRemove,
  useCheckoutReplaceItem,
  useCheckoutUpdateAddress,
};
