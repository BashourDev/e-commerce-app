import React from "react";
import {
  Image,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import { COLORS } from "../constants/colors";
import { FONT_SIZE } from "../constants/fonts";
import { DiscountBadge, Text } from "../core-ui";
import { priceAfterDiscount } from "../helpers/priceAfterDiscount";
import useCurrencyFormatter from "../hooks/api/useCurrencyFormatter";
import { useTranslation } from "react-i18next";

export default function ProductItemV(props) {
  let {
    product: { title, images, price, discount, availableForSale },
    onPress,
    containerStyle,
    imageStyle,
  } = props;
  let afterDiscount = priceAfterDiscount(price, discount || 0);
  let formatCurrency = useCurrencyFormatter();
  const { t, i18n } = useTranslation();
  let renderImage = () => {
    return availableForSale ? (
      <View style={styles.imageContainer}>
        <Image style={[styles.image, imageStyle]} source={{ uri: images[0] }} />
      </View>
    ) : (
      <View style={styles.imageContainer}>
        <ImageBackground
          style={[styles.image, imageStyle]}
          source={{ uri: images[0] }}
        >
          <View style={styles.oosBackground}>
            <Text style={styles.oosText} weight="medium">
              {t("ProductItem.Out of Stock")}
            </Text>
          </View>
        </ImageBackground>
      </View>
    );
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        containerStyle,
        i18n.language === "ar" && { transform: [{ scaleX: -1 }] },
      ]}
      onPress={onPress}
    >
      {renderImage()}
      {discount && discount > 0 ? (
        <DiscountBadge value={discount} containerStyle={styles.discountBox} />
      ) : null}
      <Text
        numberOfLines={2}
        style={[
          styles.nameText,
          { textAlign: i18n.language === "en" ? "left" : "right" },
        ]}
      >
        {title}
      </Text>
      <View
        style={[
          styles.priceContainer,
          i18n.language === "ar" && { alignSelf: "flex-end" },
        ]}
      >
        <Text style={styles.priceText} weight="bold">
          {discount && discount > 0
            ? formatCurrency(afterDiscount)
            : formatCurrency(price)}
        </Text>
        {discount && discount > 0 ? (
          <Text style={styles.discountedPrice}>{formatCurrency(price)}</Text>
        ) : null}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    // overflow: "hidden",
  },
  image: {
    aspectRatio: 0.85,
    borderRadius: 5,
  },
  imageContainer: {
    marginBottom: 12,
  },
  discountBox: {
    position: "absolute",
    top: 14,
    right: 12,
  },
  nameText: {
    fontSize: FONT_SIZE.small,
    marginBottom: 6,
  },
  priceText: {
    marginRight: 0,
    fontSize: FONT_SIZE.small,
    color: COLORS.primaryColor,
  },
  discountedPrice: {
    fontSize: FONT_SIZE.small,
    color: COLORS.priceGrey,
    textDecorationLine: "line-through",
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  oosText: {
    color: COLORS.white,
  },
  oosBackground: {
    backgroundColor: COLORS.black,
    opacity: 0.6,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
  },
});
