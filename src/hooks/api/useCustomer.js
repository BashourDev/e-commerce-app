import { useEffect, useRef, useState } from "react";

import {
  MutationHookOptions,
  QueryHookOptions,
  useLazyQuery,
  useMutation,
  useQuery,
} from "@apollo/client";

import {
  CUSTOMER_CREATE_TOKEN,
  CUSTOMER_REGISTER,
  CUSTOMER_RENEW_TOKEN,
  GET_CUSTOMER_ADDRESSES,
  GET_CUSTOMER_DATA,
  REMOVE_ACCESS_TOKEN,
  UPDATE_CUSTOMER_DATA,
} from "../../graphql/server/auth";

function getCustomerAddresses(customerAddressData, update) {
  let oldAddressData = customerAddressData?.customer?.addresses;
  let defaultAddress = customerAddressData?.customer?.defaultAddress;
  let newAddresses = [];
  if (update && defaultAddress) {
    newAddresses.push({
      id: defaultAddress?.id ?? "",
      name: defaultAddress?.name ?? "",
      firstName: defaultAddress?.firstName ?? "",
      lastName: defaultAddress?.lastName ?? "",
      address1: defaultAddress?.address1 ?? "",
      country: defaultAddress?.country ?? "",
      province: defaultAddress?.province ?? "",
      city: defaultAddress?.city ?? "",
      zip: defaultAddress?.zip ?? "",
      phone: defaultAddress?.phone ?? "",
      default: true,
    });
  }
  if (oldAddressData) {
    oldAddressData.edges.forEach((item) => {
      let address = item.node;
      let { firstName, lastName } = address;
      if (address.id !== defaultAddress?.id) {
        newAddresses.push({
          id: address.id,
          cursor: item.cursor,
          name: address.name ?? "",
          firstName: firstName ?? "",
          lastName: lastName ?? "",
          address1: address.address1 ?? "",
          country: address.country ?? "",
          province: address.province ?? "",
          city: address.city ?? "",
          zip: address.zip ?? "",
          phone: address.phone ?? "",
          default: address.id === defaultAddress?.id,
        });
      }
    });
    return newAddresses;
  } else {
    return [];
  }
}

function useCustomerCreateToken(options) {
  let [createToken, { loading }] = useMutation(CUSTOMER_CREATE_TOKEN, {
    ...options,
  });
  return { createToken, loading };
}

function useCustomerRenewToken(options) {
  let [renewToken, { loading }] = useMutation(CUSTOMER_RENEW_TOKEN, {
    ...options,
  });
  return { renewToken, loading };
}

function useGetCustomerData(options) {
  let [getCustomer, { data, loading }] = useLazyQuery(GET_CUSTOMER_DATA, {
    fetchPolicy: "network-only",
    notifyOnNetworkStatusChange: true,
    ...options,
  });

  return {
    getCustomer,
    data,
    loading,
  };
}

function useGetCustomerAddresses(first, customerAccessToken, options) {
  let [isInitFetching, setInitFetching] = useState(true);
  let [addresses, setAddresses] = useState([]);
  let isFetchingMore = useRef(false);
  let hasMore = useRef(true);

  let {
    data,
    error,
    loading,
    refetch: refetchQuery,
  } = useQuery(GET_CUSTOMER_ADDRESSES, {
    variables: {
      first,
      customerAccessToken,
    },
    fetchPolicy: "network-only",
    notifyOnNetworkStatusChange: true,
    ...options,
  });

  let refetch = async (type, variables) => {
    isFetchingMore.current = type === "scroll";
    let { data } = await refetchQuery(variables);
    let moreAddress = getCustomerAddresses(data, type === "update");
    hasMore.current = !!data.customer?.addresses.pageInfo.hasNextPage;

    if (type === "update") {
      setAddresses(moreAddress);
    } else {
      setAddresses([...addresses, ...moreAddress]);
    }
  };

  useEffect(() => {
    if (!loading) {
      isFetchingMore.current = false;
    }
    if (isInitFetching && !!data) {
      let newAddresses = getCustomerAddresses(data, true);
      hasMore.current = !!data.customer?.addresses.pageInfo.hasNextPage;
      setAddresses(newAddresses);
      setInitFetching(false);
    }
  }, [loading, isInitFetching]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    addresses,
    error,
    loading,
    hasMore: hasMore.current,
    isFetchingMore: isFetchingMore.current,
    refetch,
  };
}

function useCustomerRegister(options) {
  let [register, { loading }] = useMutation(CUSTOMER_REGISTER, { ...options });
  return { register, loading };
}

function useUpdateCustomer(options) {
  let [updateCustomerData, { loading }] = useMutation(UPDATE_CUSTOMER_DATA, {
    ...options,
  });
  return { updateCustomerData, loading };
}

function useDeactivateCustomerToken(options) {
  let [deactivateCustomerToken, { loading }] = useMutation(
    REMOVE_ACCESS_TOKEN,
    { ...options }
  );
  return { deactivateCustomerToken, loading };
}

export {
  useCustomerCreateToken,
  useCustomerRegister,
  useGetCustomerData,
  useUpdateCustomer,
  useDeactivateCustomerToken,
  useGetCustomerAddresses,
  useCustomerRenewToken,
};
