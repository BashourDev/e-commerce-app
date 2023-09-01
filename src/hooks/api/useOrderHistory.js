import { useEffect, useRef, useState } from "react";

import { QueryHookOptions, useQuery } from "@apollo/client";

import { emptyAddress } from "../../constants/defaultValues";

import { GET_ORDER_HISTORY } from "../../graphql/server/orderHistory";
import { mapToLineItems } from "../../helpers/mapToLineItems";

import useDefaultCountry from "./useDefaultCountry";

function getOrders(customerData) {
  if (customerData) {
    if (customerData.customer) {
      return customerData.customer.orders.edges.map((order) => {
        let {
          shippingAddress,
          lineItems,
          orderNumber,
          totalPriceV2,
          processedAt,
          subtotalPriceV2,
          totalShippingPriceV2,
          id,
        } = order.node;
        let address = emptyAddress;
        let newLineItems = mapToLineItems(lineItems);
        if (shippingAddress) {
          let {
            address1,
            city,
            country,
            id,
            name,
            phone,
            province,
            zip,
            firstName,
            lastName,
          } = shippingAddress;

          address = {
            address1: address1 ?? "",
            city: city ?? "",
            country: country ?? "",
            id: id,
            name: name ?? "",
            firstName: firstName ?? "",
            lastName: lastName ?? "",
            phone: phone ?? "",
            province: province ?? "",
            zip: zip ?? "",
          };
        }
        let subtotalPaymentAmount = subtotalPriceV2
          ? subtotalPriceV2.amount
          : "0.00";
        return {
          subtotalPayment: Number(subtotalPaymentAmount),
          shippingPrice: Number(totalShippingPriceV2.amount),
          orderID: id,
          cursor: order.cursor,
          orderNumber: `#${orderNumber.toString()}`,
          orderTime: processedAt,
          totalPayment: Number(totalPriceV2.amount),
          lineItems: newLineItems,
          address,
        };
      });
    }
  }
  return [];
}

function useOrderHistory(first, language, customerAccessToken, options) {
  let [isInitFetching, setInitFetching] = useState(true);
  let [orderHistory, setOrderHistory] = useState([]);
  let isFetchingMore = useRef(false);
  let hasMore = useRef(true);
  let {
    data: { countryCode },
  } = useDefaultCountry();

  let {
    data,
    error,
    loading,
    refetch: refetchQuery,
  } = useQuery(GET_ORDER_HISTORY, {
    variables: {
      customerAccessToken,
      first,
      country: countryCode,
      language: language,
    },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "network-only",
    ...options,
  });

  let refetch = async (variables) => {
    isFetchingMore.current = true;
    let { data } = await refetchQuery(variables);
    let moreOrderHistory = getOrders(data);

    hasMore.current = !!data.customer?.orders.pageInfo.hasNextPage;
    setOrderHistory([...orderHistory, ...moreOrderHistory]);
  };

  useEffect(() => {
    if (!loading) {
      isFetchingMore.current = false;
    }
    if (isInitFetching && !!data) {
      let newOrderHistory = getOrders(data);
      hasMore.current = !!data.customer?.orders.pageInfo.hasNextPage;
      setOrderHistory(newOrderHistory);
      setInitFetching(false);
    }
  }, [loading, isInitFetching]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    orderHistory,
    error,
    loading,
    refetch,
    isFetchingMore: isFetchingMore.current,
    hasMore: hasMore.current,
  };
}

export { useOrderHistory };
