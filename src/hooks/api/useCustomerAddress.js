import { useMutation, useQuery } from "@apollo/client";

import {
  CUSTOMER_ADD_NEW_ADDRESS,
  CUSTOMER_ADDRESS_DELETE,
  CUSTOMER_EDIT_ADDRESS,
  CUSTOMER_SET_DEFAULT_ADDRESS,
} from "../../graphql/server/customerAddress";
import { GET_SHOP } from "../../graphql/server/shop";

function useCustomerAddNewAddress(options) {
  let [addNewAddress, { loading }] = useMutation(CUSTOMER_ADD_NEW_ADDRESS, {
    ...options,
  });

  return { addNewAddress, loading };
}

function useCustomerEditAddress(options) {
  let [editAddress, { loading }] = useMutation(CUSTOMER_EDIT_ADDRESS, {
    ...options,
  });

  return { editAddress, loading };
}

function useCustomerAddressDelete(options) {
  let [customerAddressDelete, { loading }] = useMutation(
    CUSTOMER_ADDRESS_DELETE,
    { ...options }
  );

  return { customerAddressDelete, loading };
}

function useCustomerSetDefaultAddress(options) {
  let [setDefaultAddress, { loading }] = useMutation(
    CUSTOMER_SET_DEFAULT_ADDRESS,
    { ...options }
  );

  return { setDefaultAddress, loading };
}

function useGetShop(options) {
  let { data, error, loading, refetch } = useQuery(GET_SHOP, {
    ...options,
    fetchPolicy: "no-cache",
  });

  return { data, error, loading, refetch };
}

export {
  useCustomerAddNewAddress,
  useCustomerEditAddress,
  useCustomerAddressDelete,
  useCustomerSetDefaultAddress,
  useGetShop,
};
