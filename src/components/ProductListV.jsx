import React from "react";
import { FlatList, View } from "react-native";

import ProductItem from "./ProductItem";
import { useTranslation } from "react-i18next";
import ProductItemV from "./ProductItemV";

export default function ProductListV(props) {
  let { numColumns, data, onItemPress, ...otherProps } = props;
  let itemRemainder = data.length % numColumns;
  const { t, i18n } = useTranslation();
  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      numColumns={numColumns}
      key={numColumns}
      renderItem={({ item, index }) => {
        let productItem = (
          <ProductItemV product={item} onPress={() => onItemPress(item)} />
        );
        if (index >= data.length - itemRemainder) {
          return <View style={{ flex: 1 / numColumns }}>{productItem}</View>;
        }
        return productItem;
      }}
      showsVerticalScrollIndicator={false}
      {...otherProps}
    />
  );
}
