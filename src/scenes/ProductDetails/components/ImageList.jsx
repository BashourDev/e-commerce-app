import React from "react";
import {
  FlatList,
  Image,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from "react-native";

import { FONT_SIZE } from "../../../constants/fonts";
import { DiscountBadge } from "../../../core-ui";
import { ScreenSize, useDimensions } from "../../../helpers/dimensions";

export default function ImageList(props) {
  let { product, onImagePress, style, contentContainerStyle } = props;
  let { screenSize, width } = useDimensions();

  let isPhone = screenSize === ScreenSize.Small;
  let isTabletPortrait = screenSize === ScreenSize.Medium;
  let isLandscape = screenSize === ScreenSize.Large;

  let imageSize = isLandscape
    ? {
        width: width / 2,
        height: "100%",
      }
    : {
        width,
        height: isPhone ? 320 : 576,
      };

  let renderProductImage = ({ item, index }) => {
    return (
      <TouchableOpacity style={styles.flex} onPress={() => onImagePress(index)}>
        <Image source={{ uri: item }} style={imageSize} resizeMode="cover" />
        {product.discount > 0 ? (
          <DiscountBadge
            value={product.discount}
            containerStyle={
              isPhone
                ? [styles.discountBox, styles.discountBoxTablet]
                : styles.discountBox
            }
            textStyle={isTabletPortrait && styles.discountBoxTabletText}
          />
        ) : null}
      </TouchableOpacity>
    );
  };

  return (
    <FlatList
      style={[styles.flex, style]}
      horizontal
      pagingEnabled
      data={product.images}
      renderItem={renderProductImage}
      keyExtractor={(item) => item}
      contentContainerStyle={contentContainerStyle}
    />
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  discountBox: {
    position: "absolute",
    top: 24,
    right: 0,
  },
  discountBoxTablet: {
    top: 36,
    height: 42,
    paddingHorizontal: 12,
  },
  discountBoxTabletText: {
    fontSize: FONT_SIZE.large,
  },
});
