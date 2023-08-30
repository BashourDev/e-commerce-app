import React from "react";
import { FlatList, View } from "react-native";

import ProductItem from "./ProductItem";

export default function ProductList(props) {
  let { numColumns, data, onItemPress, ...otherProps } = props;
  let itemRemainder = data.length % numColumns;

  return (
    <FlatList
      data={data}
      keyExtractor={(item) => item.id}
      numColumns={numColumns}
      key={numColumns}
      renderItem={({ item, index }) => {
        let productItem = (
          <ProductItem product={item} onPress={() => onItemPress(item)} />
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
