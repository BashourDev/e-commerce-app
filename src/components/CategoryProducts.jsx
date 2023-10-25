import React from "react";
import { Text } from "../core-ui";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { useTranslation } from "react-i18next";
import { useColumns } from "../helpers/columns";
import useDefaultCountry from "../hooks/api/useDefaultCountry";
import { useCollectionQuery } from "../hooks/api/useCollection";
import ProductList from "./ProductList";
import { ActivityIndicator } from "react-native-paper";
import { useNavigation } from "@react-navigation/native";
import { COLORS } from "../constants/colors";
export default function CategoryProducts({
  collectionHandleProp,
  collectionTitle,
}) {
  const { t, i18n } = useTranslation();
  const collectionHandle = collectionHandleProp;
  let numColumns = useColumns();
  let first = numColumns * 6;
  let {
    data: { countryCode },
  } = useDefaultCountry();
  let { navigate } = useNavigation();

  let { collection, loading, hasMore, refetch, isFetchingMore, error } =
    useCollectionQuery(
      collectionHandle,
      first,
      [0, 1000000],
      i18n.language.toUpperCase()
    );
  let onItemPress = (product) => {
    navigate("ProductDetails", { productHandle: product.handle });
  };

  let onViewAll = () => {
    navigate("ProductCollection", {
      collection: { handle: collectionHandle, title: collectionTitle },
    });
  };
  let onEndReached = () => {
    if (!isFetchingMore && hasMore) {
      refetch("scroll", {
        collectionHandle,
        first,
        after: collection[collection.length - 1]?.cursor || null,
        country: countryCode,
      });
    }
  };
  if (loading && !isFetchingMore) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator />
      </View>
    );
  }
  if (collection.length === 0) return <></>;
  return (
    <>
      <View
        style={[
          styles.subTitle,
          {
            flexDirection: i18n.language === "en" ? "row" : "row-reverse",
            justifyContent: "space-between",
          },
          // { textAlign: i18n.language === "en" ? "left" : "right" },
        ]}
      >
        <View style={{ width: 20 }}></View>
        <Text weight="bold">{collectionTitle}</Text>
        <TouchableOpacity onPress={() => onViewAll()} style={{ width: 20 }}>
          <Text style={{ color: COLORS.primaryColor }}>
            {t("CategoryProducts.View All")}
          </Text>
        </TouchableOpacity>
      </View>
      <ProductList
        data={collection}
        onItemPress={onItemPress}
        onEndReached={onEndReached}
        onEndReachedThreshold={0.25}
        ListFooterComponent={() => {
          return hasMore ? (
            <ActivityIndicator style={styles.activityIndicator} />
          ) : null;
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  subTitle: {
    marginTop: 16,
    marginBottom: 12,
    marginHorizontal: 24,
  },
  activityIndicator: {
    marginVertical: 24,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.white,
  },
});
