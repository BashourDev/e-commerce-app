import React from "react";
import { FlatList, View } from "react-native";

import ProductItem from "./ProductItem";
import { useTranslation } from "react-i18next";

export default function ProductList(props) {
  let { numColumns, data, onItemPress, ...otherProps } = props;
  let itemRemainder = data.length % numColumns;
  const { i18n } = useTranslation();
  return (
    <FlatList
      data={data}
      horizontal
      keyExtractor={(item) => item.id}
      // numColumns={numColumns}
      inverted={i18n.language === "ar"}
      key={numColumns}
      renderItem={({ item, index }) => {
        let productItem = (
          <ProductItem product={item} onPress={() => onItemPress(item)} />
        );
        if (index >= data.length - itemRemainder) {
          return (
            <View style={{ flex: 1 / numColumns, width: 150, height: 200 }}>
              {productItem}
            </View>
          );
        }
        return productItem;
      }}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      {...otherProps}
    />
  );
}
