import React from "react";
import {
  StyleProp,
  StyleSheet,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";

import { COLORS } from "../constants/colors";

import Text from "./Text";
import { useTranslation } from "react-i18next";

export default function DiscountBadge(props) {
  let { containerStyle, textStyle, value, ...otherProps } = props;
  const { t } = useTranslation();
  let discount = Math.round(value);
  return (
    <View style={[styles.discountContainer, containerStyle]}>
      <Text
        weight="medium"
        style={[styles.discount, textStyle]}
        {...otherProps}
      >
        {discount}
        {"% "}
        {t("DiscountBadge.off")}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  discountContainer: {
    padding: 6,
    backgroundColor: COLORS.orange,
    justifyContent: "center",
    alignItems: "center",
  },
  discount: {
    color: COLORS.white,
  },
});
