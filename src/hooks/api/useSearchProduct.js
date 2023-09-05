import { useEffect, useRef, useState } from "react";

import { useLazyQuery, useMutation, useQuery } from "@apollo/client";
import {
  GET_RECENT_SEARCH,
  SET_RECENT_SEARCH,
} from "../../graphql/client/clientQueries";
import { SEARCH_RESULTS } from "../../graphql/server/searchProduct";
import mapToProducts from "../../helpers/mapToProducts.js";

export default function getProducts(searchData) {
  if (searchData) {
    return mapToProducts(searchData.search);
  }
  return [];
}

function useSearchProductsQuery(language) {
  let [results, setResults] = useState([]);
  let [isSearching, setIsSearching] = useState(true);
  let isFetchingMore = useRef(false);
  let hasMore = useRef(true);

  let [searchProducts, { data, loading, refetch: refetchQuery, error }] =
    useLazyQuery(SEARCH_RESULTS, {
      notifyOnNetworkStatusChange: true,
      fetchPolicy: "network-only",
      language: language,
    });
  console.log("====================================");
  console.log("useSearchProduct", data, loading, error);
  console.log("====================================");
  let refetch = async (type, variables) => {
    setIsSearching(false);
    isFetchingMore.current = type === "scroll";
    let { data } = await refetchQuery(variables);
    let moreResults = mapToProducts(data.search);
    hasMore.current = !!data.search.pageInfo.hasNextPage;

    if (type === "update") {
      setResults(moreResults);
    } else {
      setResults([...results, ...moreResults]);
    }
  };

  useEffect(() => {
    if (!loading && !isSearching) {
      isFetchingMore.current = false;
      setIsSearching(true);
    }
    if (isSearching && !!data) {
      let products = mapToProducts(data.search);
      hasMore.current = !!data.search.pageInfo.hasNextPage;

      setResults(products);
    }
  }, [loading]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    searchProducts,
    results,
    loading,
    refetch,
    isFetchingMore: isFetchingMore.current,
    hasMore: hasMore.current,
    error,
  };
}

function useGetRecentSearch() {
  let { data, error, loading, refetch } = useQuery(GET_RECENT_SEARCH);
  return { data, error, loading, refetch };
}

function useSetRecentSearch() {
  let [setRecentSearch, { data, loading }] = useMutation(SET_RECENT_SEARCH);
  return { setRecentSearch, data, loading };
}

export { useSearchProductsQuery, useGetRecentSearch, useSetRecentSearch };
