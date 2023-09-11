import React from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";

import { COLORS } from "../constants/colors";
import { FONT_SIZE } from "../constants/fonts";

import Text from "./Text";
import { useTranslation } from "react-i18next";

let defaultNameExtractor = (item) => String(item);

export default function RichRadioGroup(props) {
  let {
    containerStyle,
    buttonStyle,
    buttonTextStyle,
    name,
    values,
    onSelect,
    selectedValue,
    originalValues,
    originalValuesProvided = false,
    nameExtractor = defaultNameExtractor,
  } = props;

  let textStyle = [
    styles.text,
    name === "Color" && styles.capitalText,
    buttonTextStyle,
  ];
  const { i18n } = useTranslation();
  return (
    <View
      style={[
        styles.container,
        containerStyle,
        i18n.language === "ar" && { alignSelf: "flex-end" },
      ]}
    >
      <Text
        style={[
          styles.categoryTitle,
          { textAlign: i18n.language === "en" ? "left" : "right" },
        ]}
      >
        {name}
      </Text>
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.categoryContainer}
      >
        {values.map((item, index) => {
          let isItemSelected =
            (originalValuesProvided ? originalValues[index] : item) ===
            selectedValue;
          let marginHorizontal =
            index === (i18n.language === "ar" ? values.length - 1 : 0) ? 0 : 16;
          return (
            <TouchableOpacity
              key={index}
              style={[
                styles.buttonContainer,
                isItemSelected && styles.activeButton,
                buttonStyle,
                { marginHorizontal },
              ]}
              onPress={() =>
                onSelect(originalValuesProvided ? originalValues[index] : item)
              }
            >
              <Text style={textStyle}>{nameExtractor(item)}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 24,
    maxHeight: 100,
  },
  buttonContainer: {
    minWidth: 48,
    height: 48,
    paddingHorizontal: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderRadius: 1,
    borderColor: COLORS.lightGrey,
    justifyContent: "center",
    alignItems: "center",
  },
  activeButton: {
    borderColor: COLORS.primaryColor,
  },
  text: {
    fontSize: FONT_SIZE.medium,
  },
  capitalText: {
    textTransform: "capitalize",
  },
  categoryTitle: {
    opacity: 0.6,
    marginBottom: 12,
  },
  categoryContainer: {
    flexDirection: "row",
  },
});
