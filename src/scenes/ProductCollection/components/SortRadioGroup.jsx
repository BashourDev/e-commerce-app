import React from "react";
import { StyleSheet } from "react-native";

import { COLORS } from "../../../constants/colors";
import { FONT_FAMILY, FONT_SIZE } from "../../../constants/fonts";
import {
  PRODUCT_SORT_VALUES,
  PRODUCT_SORT_VALUES_ARABIC,
} from "../../../constants/values";
import { RadioButton } from "../../../core-ui";
import { useTranslation } from "react-i18next";

export default function SortRadioGroup(props) {
  let { radioButtonValue, onValueChange } = props;

  let textStyle = (label) => [
    styles.radioButtonText,
    radioButtonValue === label
      ? styles.activeTextStyle
      : styles.inactiveTextStyle,
  ];
  const { t, i18n } = useTranslation();
  return (
    <RadioButton.Group
      value={
        !!radioButtonValue
          ? radioButtonValue
          : i18n.language === "en"
          ? PRODUCT_SORT_VALUES.POPULARITY
          : PRODUCT_SORT_VALUES_ARABIC.POPULARITY
      }
      onValueChange={onValueChange}
    >
      <RadioButton
        value={
          i18n.language === "en"
            ? PRODUCT_SORT_VALUES.POPULARITY
            : PRODUCT_SORT_VALUES_ARABIC.POPULARITY
        }
        label={
          i18n.language === "en"
            ? PRODUCT_SORT_VALUES.POPULARITY
            : PRODUCT_SORT_VALUES_ARABIC.POPULARITY
        }
        {...(!radioButtonValue && { checked: true })}
        style={[styles.radioButton]}
        textStyle={
          !radioButtonValue
            ? [styles.radioButtonText, styles.activeTextStyle]
            : textStyle(
                i18n.language === "en"
                  ? PRODUCT_SORT_VALUES.POPULARITY
                  : PRODUCT_SORT_VALUES_ARABIC.POPULARITY
              )
        }
      />
      <RadioButton
        value={
          i18n.language === "en"
            ? PRODUCT_SORT_VALUES.PRICE_HIGH_TO_LOW
            : PRODUCT_SORT_VALUES_ARABIC.PRICE_HIGH_TO_LOW
        }
        label={
          i18n.language === "en"
            ? PRODUCT_SORT_VALUES.PRICE_HIGH_TO_LOW
            : PRODUCT_SORT_VALUES_ARABIC.PRICE_HIGH_TO_LOW
        }
        style={[styles.radioButton]}
        textStyle={textStyle(
          i18n.language === "en"
            ? PRODUCT_SORT_VALUES.PRICE_HIGH_TO_LOW
            : PRODUCT_SORT_VALUES_ARABIC.PRICE_HIGH_TO_LOW
        )}
      />
      <RadioButton
        value={
          i18n.language === "en"
            ? PRODUCT_SORT_VALUES.PRICE_LOW_TO_HIGH
            : PRODUCT_SORT_VALUES_ARABIC.PRICE_LOW_TO_HIGH
        }
        label={
          i18n.language === "en"
            ? PRODUCT_SORT_VALUES.PRICE_LOW_TO_HIGH
            : PRODUCT_SORT_VALUES_ARABIC.PRICE_LOW_TO_HIGH
        }
        style={[styles.radioButton]}
        textStyle={textStyle(
          i18n.language === "en"
            ? PRODUCT_SORT_VALUES.PRICE_LOW_TO_HIGH
            : PRODUCT_SORT_VALUES_ARABIC.PRICE_LOW_TO_HIGH
        )}
      />
    </RadioButton.Group>
  );
}

const styles = StyleSheet.create({
  radioButton: {
    paddingVertical: 17,
  },
  radioButtonText: {
    marginLeft: 15,
    fontSize: FONT_SIZE.medium,
  },
  activeTextStyle: {
    fontFamily: FONT_FAMILY.MEDIUM,
    color: COLORS.primaryColor,
  },
  inactiveTextStyle: {
    fontFamily: FONT_FAMILY.REGULAR,
    color: COLORS.black,
    opacity: 0.6,
  },
});
