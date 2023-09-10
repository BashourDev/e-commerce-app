import React, { useState } from "react";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";

import { COLORS } from "../constants/colors";
import { FONT_SIZE } from "../constants/fonts";
import { outlinedTextInput } from "../constants/theme";
import { Text, TextInput } from "../core-ui";
import { valueBetweenZeroToMax } from "../helpers/valueBetweenZeroToMax";
import useCurrencyFormatter from "../hooks/api/useCurrencyFormatter";
import { useTranslation } from "react-i18next";
import { IconButton } from "react-native-paper";

export default function OrderItem(props) {
  let {
    title,
    variant,
    image,
    priceAfterDiscount,
    onRemovePress,
    variantID,
    originalPrice,
    quantityAvailable,
    onChangeQuantity,
  } = props.orderItem;
  let { containerStyle, cardType } = props;
  let [quantity, setQuantity] = useState(props.orderItem.quantity);
  let [itemPrice] = useState(originalPrice);
  let formatCurrency = useCurrencyFormatter();
  const { t, i18n } = useTranslation();
  return (
    <View style={[styles.container, containerStyle]}>
      <View style={styles.imageContainer}>
        <Image
          source={{
            uri: image,
          }}
          style={styles.image}
        />
      </View>

      <View style={styles.infoContainer}>
        <Text
          weight="normal"
          style={[
            styles.fontSmall,
            { textAlign: i18n.language === "en" ? "left" : "right" },
          ]}
        >
          {title} {cardType === "order" ? ` × ${quantity}` : ""}
        </Text>
        <View style={styles.price}>
          <View>
            <Text weight="bold" style={styles.fontMedium}>
              {priceAfterDiscount && priceAfterDiscount > 0
                ? formatCurrency(priceAfterDiscount * quantity)
                : formatCurrency(itemPrice * quantity)}
            </Text>
          </View>
          {priceAfterDiscount && priceAfterDiscount > 0 ? (
            <View style={styles.section2}>
              <Text
                weight="normal"
                style={[styles.discountText, styles.fontMedium]}
              >
                {formatCurrency(itemPrice * quantity)}
              </Text>
            </View>
          ) : null}
        </View>
        <Text
          style={[
            styles.greyText,
            styles.fontSmall,
            { textAlign: i18n.language === "en" ? "left" : "right" },
          ]}
        >
          {variant === "Title Default Title" ? "-----" : variant}
        </Text>
      </View>

      {cardType === "checkout" ? (
        <View style={styles.amountContainer}>
          <View style={styles.quantityButtonsContainer}>
            <IconButton
              icon="minus"
              iconColor={COLORS.primaryColor}
              size={14}
              onPress={() => {
                let newQuantity = quantity - 1;
                setQuantity(
                  valueBetweenZeroToMax(newQuantity, quantityAvailable)
                );
                onChangeQuantity
                  ? onChangeQuantity(
                      variantID,
                      newQuantity <= 0 ? 1 : newQuantity
                    )
                  : null;
              }}
              disabled={quantity === 1}
            />
            <Text style={styles.quantityTextVar}>{quantity}</Text>
            <IconButton
              icon="plus"
              iconColor={COLORS.primaryColor}
              size={14}
              onPress={() => {
                let newQuantity = quantity + 1;
                setQuantity(
                  valueBetweenZeroToMax(newQuantity, quantityAvailable)
                );
                onChangeQuantity
                  ? onChangeQuantity(
                      variantID,
                      newQuantity > quantityAvailable
                        ? quantityAvailable
                        : newQuantity
                    )
                  : null;
              }}
              disabled={quantity === quantityAvailable}
            />
          </View>
          {/* <TextInput
            keyboardType="number-pad"
            returnKeyType="done"
            value={quantity.toString()}
            onBlur={() => {
              if (quantity <= 0) {
                setQuantity(1);
              }
              onChangeQuantity
                ? onChangeQuantity(variantID, quantity <= 0 ? 1 : quantity)
                : null;
            }}
            onChangeText={(value) => {
              setQuantity(
                valueBetweenZeroToMax(parseInt(value, 10), quantityAvailable)
              );
            }}
            containerStyle={[outlinedTextInput, styles.amountInputWidth]}
            style={[outlinedTextInput, quantity < 999 && styles.amount]}
          /> */}
          <TouchableOpacity
            activeOpacity={0.5}
            style={styles.remove}
            onPress={() => {
              onRemovePress ? onRemovePress(variantID) : null;
            }}
          >
            <Text style={styles.redText}>{t("OrderItem.Remove")}</Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 6,
    flexDirection: "row",
  },
  imageContainer: {
    flex: 1,
    justifyContent: "center",
    maxWidth: 80,
  },
  image: {
    width: 72,
    height: 72,
  },
  infoContainer: {
    flex: 1,
    justifyContent: "space-evenly",
  },
  amountContainer: {
    flex: 1,
    alignItems: "flex-end",
    maxWidth: 70,
    marginHorizontal: 8,
  },
  amountInputWidth: {
    width: 50,
    paddingHorizontal: 5,
  },
  amount: {
    textAlign: "center",
  },
  price: {
    flexDirection: "row",
    alignItems: "center",
  },
  discountText: {
    color: COLORS.grey,
    textDecorationLine: "line-through",
  },
  remove: {
    alignSelf: "flex-end",
    bottom: 0,
    position: "absolute",
  },
  greyText: {
    color: COLORS.grey,
  },
  redText: {
    color: COLORS.red,
  },
  section2: {
    marginLeft: 8,
  },
  fontSmall: {
    fontSize: FONT_SIZE.small,
  },
  fontMedium: {
    fontSize: FONT_SIZE.medium,
  },
  quantityButton: {
    backgroundColor: "#fff",
    borderWidth: 0,
    paddingHorizontal: 3,
    paddingVertical: 1,
    width: 8,
    fontSize: 12,
    color: "#000000",
    textAlign: "center",
  },
  quantityTextVar: { alignSelf: "center", fontSize: 18 },
  quantityButtonsContainer: {
    display: "flex",
    flexDirection: "row",
    backgroundColor: "#fff",
    shadowColor: "#171717",
    elevation: 1,
    shadowOffset: { width: -2, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    borderRadius: 10,
    alignSelf: "flex-start",
    gap: 2,
  },
});
