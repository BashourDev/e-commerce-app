import React from "react";
import { StyleSheet, View } from "react-native";
import { RadioButton as PaperRadioButton } from "react-native-paper";

import { COLORS } from "../constants/colors";

import Text from "./Text";
import { useTranslation } from "react-i18next";

export default function RadioButton(props) {
  let { style, size, checked, textStyle, label, ...radioProps } = props;
  const { i18n } = useTranslation();
  return (
    <View
      style={[
        styles.container,
        style,
        i18n.language === "ar" && { flexDirection: "row-reverse" },
      ]}
    >
      <PaperRadioButton.Android
        {...radioProps}
        color={COLORS.primaryColor}
        uncheckedColor={COLORS.inactive}
        status={checked ? "checked" : "unchecked"}
      />
      <Text style={[styles.text, textStyle]}>{label}</Text>
    </View>
  );
}

RadioButton.Group = PaperRadioButton.Group;

const styles = StyleSheet.create({
  container: { flexDirection: "row", alignItems: "center" },
  text: { paddingLeft: 10 },
});
