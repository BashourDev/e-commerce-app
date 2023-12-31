import React, { useEffect } from "react";
import { StyleSheet, View } from "react-native";

import { COLORS } from "../../../constants/colors";
import { FONT_SIZE } from "../../../constants/fonts";
import { outlinedTextInput } from "../../../constants/theme";
import { RichRadioGroup, Text, TextInput } from "../../../core-ui";
import { priceAfterDiscount } from "../../../helpers/priceAfterDiscount";
import { valueBetweenZeroToMax } from "../../../helpers/valueBetweenZeroToMax";
import useCurrencyFormatter from "../../../hooks/api/useCurrencyFormatter";

import { useTranslation } from "react-i18next";
import { IconButton } from "react-native-paper";

export default function ProductInfo(props) {
  let {
    product: { title, description, price, discount, quantityAvailable = 0 },
    options,
    quantity,
    selectedOptions,
    onChangeQuantity,
    onSelectionOptionChange,
    optionsOriginal,
  } = props;
  let formatCurrency = useCurrencyFormatter();
  let afterDiscount = priceAfterDiscount(price, discount || 0);
  let radioGroupRenderView = null;
  if (
    !(
      options.length === 1 &&
      options[0].name === "Title" &&
      options[0].values[0] === "Default Title"
    )
  ) {
    radioGroupRenderView = options.map(({ name, values }, index) => {
      return (
        <RichRadioGroup
          key={name}
          name={name}
          values={values}
          originalValues={optionsOriginal[index]?.values || []}
          originalValuesProvided={optionsOriginal ? true : false}
          selectedValue={selectedOptions[optionsOriginal[index]?.name || name]}
          onSelect={(value) => {
            onSelectionOptionChange(optionsOriginal[index].name, value);
          }}
        />
      );
    });
  }

  useEffect(() => {
    if (quantity === 0) {
      onChangeQuantity(1);
    } else if (quantity > quantityAvailable) {
      onChangeQuantity(quantityAvailable);
    }
  }, [quantityAvailable]); // eslint-disable-line react-hooks/exhaustive-deps
  const { t, i18n } = useTranslation();
  return (
    <>
      <View style={styles.padding}>
        <Text
          style={[
            styles.productInfoTitle,
            { textAlign: t("dir") === "ltr" ? "left" : "right" },
          ]}
        >
          {title}
        </Text>
        {discount > 0 ? (
          <View style={styles.flexRow}>
            <Text
              weight="bold"
              style={[
                styles.productInfoPrice,
                { textAlign: t("dir") === "ltr" ? "left" : "right" },
              ]}
            >
              {formatCurrency(afterDiscount)}
            </Text>
            <Text
              weight="bold"
              style={[
                styles.productInfoOriginalPrice,
                { textAlign: t("dir") === "ltr" ? "left" : "right" },
              ]}
            >
              {formatCurrency(price)}
            </Text>
          </View>
        ) : (
          <Text
            weight="bold"
            style={[
              styles.productInfoPrice,
              { textAlign: t("dir") === "ltr" ? "left" : "right" },
            ]}
          >
            {formatCurrency(price)}
          </Text>
        )}
      </View>
      {radioGroupRenderView}
      <View style={styles.paddingHorizontal}>
        <Text
          style={[
            styles.quantityText,
            { textAlign: t("dir") === "ltr" ? "left" : "right" },
          ]}
        >
          {t("ProductInfo.Quantity")}
        </Text>
        <View
          style={[
            styles.quantityButtonsContainer,
            i18n.language === "ar" && { alignSelf: "flex-end" },
          ]}
        >
          <IconButton
            icon="minus"
            iconColor={COLORS.primaryColor}
            size={24}
            onPress={() =>
              onChangeQuantity(
                valueBetweenZeroToMax(quantity - 1, quantityAvailable)
              )
            }
            disabled={quantity === 1}
          />
          <Text style={styles.quantityTextVar}>{quantity}</Text>
          <IconButton
            icon="plus"
            iconColor={COLORS.primaryColor}
            size={24}
            onPress={() =>
              onChangeQuantity(
                valueBetweenZeroToMax(quantity + 1, quantityAvailable)
              )
            }
            disabled={quantity === quantityAvailable}
          />
        </View>
        {/* <TextInput
          containerStyle={[outlinedTextInput, styles.textInputWidth]}
          style={outlinedTextInput}
          value={quantity.toString()}
          onBlur={() => {}}
          onChangeText={(value) =>
            onChangeQuantity(
              valueBetweenZeroToMax(parseInt(value, 10), quantityAvailable)
            )
          }
          keyboardType="numeric"
        /> */}
      </View>
      <View style={[styles.paddingHorizontal, styles.description, ,]}>
        <Text
          style={[
            styles.labelStyle,
            { textAlign: t("dir") === "ltr" ? "left" : "right" },
          ]}
        >
          {t("ProductInfo.Description")}
        </Text>
        <Text style={{ textAlign: t("dir") === "ltr" ? "left" : "right" }}>
          {description || t("ProductInfo.No description")}
        </Text>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  padding: {
    padding: 24,
  },
  paddingHorizontal: {
    paddingHorizontal: 24,
  },
  productInfoTitle: {
    marginBottom: 8,
    fontSize: FONT_SIZE.medium,
  },
  productInfoPrice: {
    fontSize: FONT_SIZE.large,
  },
  quantityText: {
    opacity: 0.6,
    fontSize: FONT_SIZE.small,
    marginBottom: 12,
  },
  textInputWidth: {
    width: 60,
  },
  flexRow: {
    flexDirection: "row",
  },
  productInfoOriginalPrice: {
    paddingLeft: 8,
    color: COLORS.priceGrey,
    fontSize: FONT_SIZE.large,
    textDecorationLine: "line-through",
  },
  labelStyle: {
    opacity: 0.6,
    marginBottom: 12,
  },
  description: {
    marginTop: 16,
    marginBottom: 24,
  },
  quantityButton: {
    backgroundColor: "#fff",
    borderWidth: 0,
    paddingHorizontal: 3,
    paddingVertical: 1,
    width: 10,
    fontSize: 16,
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
    gap: 3,
  },
});
