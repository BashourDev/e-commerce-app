import React from "react";
import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

import { COLORS } from "../constants/colors";
import { FONT_SIZE } from "../constants/fonts";
import { Text } from "../core-ui";
import formatDateTime from "../helpers/formatDateTime";
import useCurrencyFormatter from "../hooks/api/useCurrencyFormatter";
import { useTranslation } from "react-i18next";

export default function OrderHistoryItem(props) {
  let { order, containerStyle, onPress } = props;
  let formatCurrency = useCurrencyFormatter();
  const { t, i18n } = useTranslation();
  return (
    <TouchableOpacity
      style={[styles.container, containerStyle]}
      onPress={onPress}
    >
      <Text
        weight="medium"
        style={[
          styles.orderNumber,
          i18n.language === "ar" && { textAlign: "right" },
        ]}
      >
        {t("OrderHistoryItem.Order")} {order.orderNumber}
      </Text>
      <View
        style={[
          styles.textStyle,
          i18n.language === "ar" && { flexDirection: "row-reverse" },
        ]}
      >
        <Text>{t("OrderHistoryItem.Ordered")}</Text>
        <Text>{formatDateTime(order.orderTime)}</Text>
      </View>
      <View
        style={[
          styles.textStyle,
          i18n.language === "ar" && { flexDirection: "row-reverse" },
        ]}
      >
        <Text>{t("OrderHistoryItem.Total")}</Text>
        <Text>{formatCurrency(order.totalPayment)}</Text>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 2,
    borderColor: COLORS.lightGrey,
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
  },
  orderNumber: {
    fontSize: FONT_SIZE.medium,
    color: COLORS.primaryColor,
    marginBottom: 8,
  },
  textStyle: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
});
