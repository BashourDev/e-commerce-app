import { useQuery } from "@apollo/client";

import { GET_HIGHEST_PRICE } from "../../graphql/server/searchProduct";
import useDefaultCountry from "./useDefaultCountry";

function useGetHighestPrice(options) {
  let { onCompleted, ...otherOptions } = options;
  let { countryCode } = useDefaultCountry().data;
  let { data, error, loading, refetch } = useQuery(GET_HIGHEST_PRICE, {
    variables: { country: countryCode },
    ...otherOptions,
    onCompleted: ({ products }) => {
      let formattedPrice = Math.ceil(
        Number(products.edges[0]?.node.priceRange.maxVariantPrice.amount || 0)
      );
      onCompleted(formattedPrice);
    },
  });

  let formattedPrice = Math.ceil(
    Number(data?.products.edges[0]?.node.priceRange.maxVariantPrice.amount || 0)
  );

  return { formattedPrice, error, loading, refetch };
}

export { useGetHighestPrice };
