import React from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";

import { COLORS } from "../constants/colors";
import { FONT_SIZE } from "../constants/fonts";
import { Surface, Text } from "../core-ui";
import { useTranslation } from "react-i18next";

export default function PaymentDetails(props) {
  let { data, containerStyle } = props;
  const { i18n } = useTranslation();
  return (
    <Surface containerStyle={[styles.surfacePaymentDetails, containerStyle]}>
      {data.map((item, index) => {
        let { name, value } = item;
        if (data.length - 1 === index) {
          return (
            <View
              style={[
                styles.innerPaymentDetailsContainer,
                styles.border,
                i18n.language === "ar" && { flexDirection: "row-reverse" },
              ]}
              key={name}
            >
              <Text style={styles.mediumText}>{name}</Text>
              <Text weight="medium" style={styles.mediumText}>
                {value}
              </Text>
            </View>
          );
        } else {
          return (
            <View
              style={[
                styles.innerPaymentDetailsContainer,
                i18n.language === "ar" && { flexDirection: "row-reverse" },
              ]}
              key={name}
            >
              <Text style={[styles.mediumText, styles.marginBottom]}>
                {name}
              </Text>
              <Text style={styles.mediumText}>{value}</Text>
            </View>
          );
        }
      })}
    </Surface>
  );
}

const styles = StyleSheet.create({
  innerPaymentDetailsContainer: {
    paddingVertical: 14,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  surfacePaymentDetails: {
    marginTop: 12,
    paddingHorizontal: 15,
    paddingVertical: 0,
  },

  mediumText: {
    fontSize: FONT_SIZE.medium,
  },
  border: {
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGrey,
  },
  marginBottom: {
    marginBottom: 6,
  },
});
