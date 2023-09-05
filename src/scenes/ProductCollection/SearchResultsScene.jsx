import React, { useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet } from "react-native";

import { useNavigation, useRoute } from "@react-navigation/native";

import { ErrorPage, SearchModal } from "../../components";
import {
  PRODUCT_SORT_VALUES,
  PRODUCT_SORT_VALUES_ARABIC,
} from "../../constants/values";
import { useColumns } from "../../helpers/columns";
import useDefaultCountry from "../../hooks/api/useDefaultCountry";
import { useGetHighestPrice } from "../../hooks/api/useHighestPriceProduct";
import { useSearchProductsQuery } from "../../hooks/api/useSearchProduct";

import { ProductsView } from "./components";
import { IconButton } from "react-native-paper";
import { COLORS } from "../../constants/colors";
import { ProductSortKeys } from "../../helpers/enums";
import { useTranslation } from "react-i18next";

export default function SearchResultsScene() {
  let {
    data: { countryCode },
  } = useDefaultCountry();
  let { navigate, setOptions } = useNavigation();
  let numColumns = useColumns();
  let first = numColumns * 6;
  let [isSearchModalVisible, setSearchModalVisible] = useState(false);
  let [radioButtonValue, setRadioButtonValue] = useState("");
  let [maxPriceValue, setMaxPrice] = useState(0);
  let [priceRange, setPriceRange] = useState([0, maxPriceValue]);
  let {
    params: { searchKeyword },
  } = useRoute();
  const { i18n } = useTranslation();
  let { loading: maxPriceLoading } = useGetHighestPrice({
    onCompleted: (value) => {
      setMaxPrice(value);
      setPriceRange([0, value]);
    },
    language: i18n.language.toUpperCase(),
    skip: maxPriceValue !== 0,
  });

  let {
    searchProducts,
    results,
    refetch,
    isFetchingMore,
    hasMore,
    error,
    loading,
  } = useSearchProductsQuery(i18n.language.toUpperCase());

  let getSortKeys = (value) => {
    let sortKey = ProductSortKeys.RELEVANCE;
    let reverse = false;

    if (
      value ===
      (i18n.language === "en"
        ? PRODUCT_SORT_VALUES.PRICE_LOW_TO_HIGH
        : PRODUCT_SORT_VALUES_ARABIC.PRICE_LOW_TO_HIGH)
    ) {
      sortKey = ProductSortKeys.PRICE;
    } else if (
      value ===
      (i18n.language === "en"
        ? PRODUCT_SORT_VALUES.PRICE_HIGH_TO_LOW
        : PRODUCT_SORT_VALUES_ARABIC.PRICE_HIGH_TO_LOW)
    ) {
      sortKey = ProductSortKeys.PRICE;
      reverse = true;
    }

    return { sortKey, reverse };
  };

  useEffect(() => {
    setOptions({
      headerRight: () => (
        <IconButton
          icon="magnify"
          onPress={() => setSearchModalVisible(true)}
          color={COLORS.primaryColor}
        />
      ),
    });
  }, [setOptions]);

  useEffect(() => {
    let { sortKey, reverse } = getSortKeys(radioButtonValue);
    if (priceRange[1] > 0) {
      searchProducts({
        variables: {
          first,
          searchText: `${searchKeyword}`,
          sortKey: sortKey,
          reverse,
          country: countryCode,
          // productFilters: `[{ "variants.price": >=${priceRange[0]} },{ "variants.price": <=${priceRange[1]} }]`,
          productFilters: [
            { price: { min: priceRange[0], max: priceRange[1] } },
          ],
          language: i18n.language.toUpperCase(),
        },
      });
    }
  }, [
    countryCode,
    first,
    priceRange,
    radioButtonValue,
    searchKeyword,
    searchProducts,
    i18n.language,
  ]);

  let onClearFilter = () => setPriceRange([0, maxPriceValue]);
  let onSetFilter = (values) => {
    setPriceRange(values);
  };
  let onPressRadioButton = (newValue) => {
    setRadioButtonValue(newValue);
  };
  let onSubmit = (searchKeyword) =>
    navigate("SearchResults", {
      searchKeyword,
    });
  let onItemPress = (product) => {
    navigate("ProductDetails", { productHandle: product.handle });
  };

  let onEndReached = () => {
    if (!isFetchingMore && hasMore) {
      refetch("scroll", {
        searchText: `${searchKeyword} variants.price:>=${priceRange[0]} variants.price:<=${priceRange[1]}`,
        first,
        after: results[results.length - 1].cursor || null,
        country: countryCode,
        language: i18n.language.toUpperCase(),
      });
    }
  };

  if (error) {
    return (
      <ErrorPage
        onRetry={() =>
          refetch("update", {
            first,
            searchText: `${searchKeyword}`,
            country: countryCode,
            language: i18n.language.toUpperCase(),
          })
        }
      />
    );
  }

  if (isFetchingMore || maxPriceLoading || loading) {
    return <ActivityIndicator style={[styles.container, styles.center]} />;
  }

  return (
    <>
      <ProductsView
        products={results}
        onItemPress={onItemPress}
        hasMore={false}
        onEndReached={onEndReached}
        sortProps={{ radioButtonValue, onPressRadioButton }}
        filterProps={{
          maxPrice: maxPriceValue,
          priceRange,
          onClearFilter,
          onSetFilter,
        }}
      />
      <SearchModal
        onItemPress={onItemPress}
        onSubmit={onSubmit}
        isVisible={isSearchModalVisible}
        setVisible={setSearchModalVisible}
      />
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
});
