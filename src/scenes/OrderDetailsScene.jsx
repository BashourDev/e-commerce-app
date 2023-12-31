import React from "react";
import { SafeAreaView, ScrollView, StyleSheet, View } from "react-native";

import { useRoute } from "@react-navigation/native";

import { OrderItem, PaymentDetails } from "../components";
import { FONT_SIZE } from "../constants/fonts";
import { Surface, Text } from "../core-ui";
import { ScreenSize, useDimensions } from "../helpers/dimensions";
import formatDateTime from "../helpers/formatDateTime";
import useCurrencyFormatter from "../hooks/api/useCurrencyFormatter";
import { useTranslation } from "react-i18next";

export default function OrderDetailsScene() {
  let {
    params: {
      order: {
        address: { address1, city, country, name, phone, province, zip },
        lineItems,
        orderNumber,
        orderTime,
        totalPayment,
        shippingPrice,
        subtotalPayment,
      },
    },
  } = useRoute();
  let { screenSize } = useDimensions();
  const { t, i18n } = useTranslation();
  let formatCurrency = useCurrencyFormatter();

  let paymentData = [
    {
      name: t("OrderDetailsScene.Subtotal"),
      value: formatCurrency(subtotalPayment),
    },
    {
      name: t("OrderDetailsScene.Shipping"),
      value:
        shippingPrice === 0
          ? t("OrderDetailsScene.Free")
          : formatCurrency(shippingPrice),
    },
    {
      name: t("OrderDetailsScene.Total"),
      value: formatCurrency(totalPayment),
    },
  ];

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ScrollView
        overScrollMode="never"
        contentContainerStyle={
          screenSize === ScreenSize.Small
            ? styles.container
            : styles.containerWide
        }
      >
        <View style={styles.orderInfoSection}>
          <Surface
            containerStyle={[
              styles.surfaceOrderContainer,
              i18n.language === "ar" && { flexDirection: "row-reverse" },
            ]}
          >
            <Text weight="medium" style={styles.mediumText}>
              {t("OrderDetailsScene.Order No.")}
            </Text>
            <Text style={styles.mediumText}>{orderNumber}</Text>
          </Surface>
          <Surface
            containerStyle={[
              styles.surfaceOrderContainer,
              i18n.language === "ar" && { flexDirection: "row-reverse" },
            ]}
          >
            <Text weight="medium" style={styles.mediumText}>
              {t("OrderDetailsScene.Ordered")}
            </Text>
            <Text style={styles.mediumText}>{formatDateTime(orderTime)}</Text>
          </Surface>
        </View>
        <View style={styles.productDetailsContainer}>
          <Text
            style={[
              styles.greyText,
              i18n.language === "ar" && { textAlign: "right" },
            ]}
          >
            {t("OrderDetailsScene.Product Details")}
          </Text>
          <View style={styles.orderItemContainer}>
            {lineItems.map((item) => (
              <OrderItem
                cardType="order"
                orderItem={item}
                containerStyle={styles.orderItem}
                key={item.variantID}
              />
            ))}
          </View>
        </View>
        <View style={styles.shippingAddressContainer}>
          <Text
            style={[
              styles.greyText,
              i18n.language === "ar" && { textAlign: "right" },
            ]}
          >
            {t("OrderDetailsScene.Shipping Address")}
          </Text>
          <Surface containerStyle={styles.surfaceShippingContainer}>
            <Text
              style={[
                styles.mediumText,
                styles.marginBottom,
                i18n.language === "ar" && { textAlign: "right" },
              ]}
            >
              {name}
            </Text>
            <Text
              style={[
                styles.greyText,
                i18n.language === "ar" && { textAlign: "right" },
              ]}
            >
              {address1}
            </Text>
            <Text
              style={[
                styles.greyText,
                i18n.language === "ar" && { textAlign: "right" },
              ]}
            >{`${city}, ${province} ${zip}`}</Text>
            <Text
              style={[
                styles.greyText,
                i18n.language === "ar" && { textAlign: "right" },
              ]}
            >
              {country}
            </Text>
            <Text
              style={[
                styles.greyText,
                i18n.language === "ar" && { textAlign: "right" },
              ]}
            >
              {t("OrderDetailsScene.Phone:")} {phone}
            </Text>
          </Surface>
        </View>
        <Text
          style={[
            styles.greyText,
            i18n.language === "ar" && { textAlign: "right" },
          ]}
        >
          {t("OrderDetailsScene.Payment Details")}
        </Text>
        <PaymentDetails
          data={paymentData}
          containerStyle={styles.surfacePaymentDetails}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 24,
    paddingBottom: 24,
  },
  containerWide: {
    marginHorizontal: 36,
    paddingBottom: 24,
  },
  orderInfoSection: {
    marginVertical: 16,
  },
  shippingAddressContainer: {
    marginBottom: 16,
  },
  productDetailsContainer: {
    marginBottom: 9,
  },
  orderItemContainer: {
    marginTop: 11,
  },
  surfaceOrderContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 12,
    paddingVertical: 14,
  },
  surfaceShippingContainer: {
    marginTop: 12,
    padding: 12,
  },
  surfacePaymentDetails: {
    marginTop: 12,
    paddingHorizontal: 15,
    paddingVertical: 0,
  },
  orderItem: {
    paddingVertical: 7,
  },
  greyText: {
    opacity: 0.6,
  },
  mediumText: {
    fontSize: FONT_SIZE.medium,
  },
  marginBottom: {
    marginBottom: 6,
  },
});
