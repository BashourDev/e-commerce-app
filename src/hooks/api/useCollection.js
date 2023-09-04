import { useEffect, useRef, useState } from "react";

import { useQuery } from "@apollo/client";

import { GET_FEATURED_PRODUCTS_AND_CATEGORIES } from "../../graphql/server/categoriesAndFeaturedProducts";
import { GET_COLLECTION } from "../../graphql/server/productCollection";
import mapToProducts from "../../helpers/mapToProducts";

import useDefaultCountry from "./useDefaultCountry";
import { ProductCollectionSortKeys } from "../../helpers/enums";

function filterProducts(collectionProducts, priceRange) {
  let [minPrice, maxPrice] = priceRange;
  let { minVariantPrice } = collectionProducts.node.priceRange;
  if (
    Number(minVariantPrice.amount) <= maxPrice &&
    Number(minVariantPrice.amount) >= minPrice
  ) {
    return collectionProducts.node;
  }
}

function getProducts(collectionData, priceRange) {
  if (collectionData && collectionData.collectionByHandle) {
    let filtered = {
      edges: collectionData.collectionByHandle.products.edges.filter(
        (product) => filterProducts(product, priceRange)
      ),
    };
    return mapToProducts(filtered);
  }
  return [];
}

function useCollectionQuery(collectionHandle, first, priceRange, language) {
  let [isInitFetching, setInitFetching] = useState(true);
  let [isReloading, setIsReloading] = useState(true);
  let [collection, setCollection] = useState([]);
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
  } = useQuery(GET_COLLECTION, {
    variables: {
      collectionHandle,
      first,
      sortKey: ProductCollectionSortKeys.BEST_SELLING,
      country: countryCode,
      language: language,
    },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "no-cache",
  });

  let getMoreUntilTarget = async (targetAmount, cursor, handle, filter) => {
    let result = [];
    let moreData = [];

    let { data } = await refetchQuery({
      first,
      collectionHandle: handle,
      after: cursor,
      country: countryCode,
    });

    let productsData = getProducts(data, filter);
    hasMore.current = !!data.collectionByHandle?.products.pageInfo.hasNextPage;
    let nextCursor = cursor;
    if (productsData[productsData.length - 1]) {
      nextCursor = productsData[productsData.length - 1].cursor || cursor;
    }
    if (hasMore.current === false && productsData.length <= 0) {
      return result;
    }
    if (productsData.length < targetAmount) {
      moreData = await getMoreUntilTarget(
        targetAmount - productsData.length,
        nextCursor,
        handle,
        filter
      );
      productsData.push(...moreData);
      result = productsData;
    } else {
      result = productsData.slice(0, targetAmount);
    }
    return result;
  };

  let refetch = async (type, variables, values) => {
    isFetchingMore.current = type === "scroll";
    if (!isFetchingMore.current) {
      setIsReloading(true);
    }
    let { data } = await refetchQuery(variables);
    let moreCollection = getProducts(data, values || priceRange);

    hasMore.current = !!data.collectionByHandle?.products.pageInfo.hasNextPage;
    let cursor = null;
    if (moreCollection[moreCollection.length - 1]) {
      cursor = moreCollection[moreCollection.length - 1].cursor || null;
    }

    if (moreCollection.length < first && hasMore.current) {
      let newCollection = await getMoreUntilTarget(
        first - moreCollection.length,
        cursor,
        data.collectionByHandle ? data.collectionByHandle.handle : "",
        values || priceRange
      );
      moreCollection.push(...newCollection);
    }

    if (type === "sort") {
      setCollection(moreCollection);
      setIsReloading(false);
    } else {
      setCollection([...collection, ...moreCollection]);
    }
  };

  useEffect(() => {
    if (!loading) {
      isFetchingMore.current = false;
    }
    if (isInitFetching && !!data && !!data.collectionByHandle) {
      let newCollection = mapToProducts(data.collectionByHandle.products);
      hasMore.current =
        !!data.collectionByHandle?.products.pageInfo.hasNextPage;
      setCollection(newCollection);
      setIsReloading(false);
      setInitFetching(false);
    }
  }, [loading, isInitFetching]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    collection,
    error,
    loading: isReloading,
    hasMore: hasMore.current,
    isFetchingMore: isFetchingMore.current,
    refetch,
  };
}

function useProductsAndCategoriesQuery(first, language) {
  let [categories, setCategories] = useState([]);
  let [products, setProducts] = useState([]);
  let [isInitFetching, setInitFetching] = useState(true);
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
  } = useQuery(GET_FEATURED_PRODUCTS_AND_CATEGORIES, {
    variables: {
      first,
      country: countryCode,
      language: language,
    },
    notifyOnNetworkStatusChange: true,
    fetchPolicy: "no-cache",
  });

  let refetch = async (type, variables) => {
    isFetchingMore.current = type === "scroll";
    let { data } = await refetchQuery(variables);
    let moreProducts = mapToProducts(data.products);
    hasMore.current = !!data.products.pageInfo.hasNextPage;

    if (type === "update") {
      setProducts(moreProducts);
      let categories = data.collections.edges.map((item) => ({
        id: item.node.id,
        title: item.node.title,
        handle: item.node.handle,
        cursor: item.cursor,
        image: item.node.image?.transformedSrc || undefined,
      }));
      setCategories(categories);
    } else {
      setProducts([...products, ...moreProducts]);
    }
  };

  useEffect(() => {
    if (!loading) {
      isFetchingMore.current = false;
    }
    if (isInitFetching && !!data) {
      let products = mapToProducts(data.products);
      hasMore.current = !!data.products.pageInfo.hasNextPage;

      let categories = data.collections.edges.map((item) => ({
        id: item.node.id,
        title: item.node.title,
        handle: item.node.handle,
        cursor: item.cursor,
        image: item.node.image?.transformedSrc || undefined,
      }));
      setCategories(categories);

      setProducts(products);
      setInitFetching(false);
    }
  }, [loading, isInitFetching]); // eslint-disable-line react-hooks/exhaustive-deps

  return {
    products,
    error,
    loading,
    categories,
    refetch,
    hasMore: hasMore.current,
    isFetchingMore: isFetchingMore.current,
  };
}

export { useCollectionQuery, useProductsAndCategoriesQuery };
