import React, { forwardRef, Ref, useImperativeHandle, useState } from "react";
import { StyleSheet, View } from "react-native";
// import MultiSlider from "react-native-multi-slider";

import { defaultButton, defaultButtonLabel } from "../../../constants/theme";
import { Button, TextInput } from "../../../core-ui";
import { ScreenSize, useDimensions } from "../../../helpers/dimensions";
import formatNumber from "../../../helpers/formatNumber";
import parseNumber from "../../../helpers/parseNumber";

import { useTranslation } from "react-i18next";

function PriceSlider(props, ref) {
  let {
    minPrice,
    maxPrice,
    initialSliderValues,
    sliderStep = 1,
    onSubmit,
    submitButtonText,
    onValuesChangeStart = () => {},
    onValuesChangeFinish = () => {},
  } = props;

  let [sliderLength, setSliderLength] = useState(280); // default slider length
  let [priceRange, setPriceRange] = useState(initialSliderValues);
  let { screenSize } = useDimensions();

  useImperativeHandle(ref, () => ({
    clear: () => {
      setPriceRange([minPrice, maxPrice]);
    },
  }));

  let clampMinValue = (value) => {
    if (value === 0) {
      return 0;
    }
    if (value < minPrice) {
      return minPrice;
    }
    if (value >= priceRange[1]) {
      if (priceRange[1] <= sliderStep) {
        return 0;
      }
      return priceRange[1] - sliderStep;
    }
    return value;
  };

  let clampMaxValue = (value) => {
    if (value === 0) {
      return 0;
    }
    if (value > maxPrice) {
      return maxPrice;
    }
    return value;
  };
  const { t, i18n } = useTranslation();
  return (
    <View
      style={{ flex: 1 }}
      onLayout={({
        nativeEvent: {
          layout: { width },
        },
      }) => {
        setSliderLength(width);
      }}
    >
      {/* <MultiSlider
        sliderLength={sliderLength}
        values={[
          priceRange[0],
          priceRange[1] < priceRange[0] ? priceRange[0] + 1 : priceRange[1],
        ]}
        min={minPrice}
        max={maxPrice}
        step={sliderStep}
        onValuesChangeStart={onValuesChangeStart}
        onValuesChangeFinish={(values) => {
          setPriceRange(values);
          onValuesChangeFinish();
        }}
        containerStyle={{
          ...styles.sliderContainer,
          marginVertical: screenSize === ScreenSize.Small ? 8 : 24,
        }}
      /> */}
      <View
        style={[
          styles.textInputContainer,
          { gap: 12 },
          i18n.language === "ar" && { flexDirection: "row-reverse" },
        ]}
      >
        <TextInput
          mode="outlined"
          label={t("PriceSlider.Min Price")}
          keyboardType="number-pad"
          containerStyle={[styles.textInput, styles.margin]}
          iStyle={{
            textAlign: i18n.language === "en" ? "left" : "right",
          }}
          value={formatNumber(priceRange[0])}
          onChangeText={(text) => {
            setPriceRange([clampMinValue(parseNumber(text)), priceRange[1]]);
          }}
        />
        <TextInput
          mode="outlined"
          label={t("PriceSlider.Max Price")}
          containerStyle={styles.textInput}
          iStyle={{
            textAlign: i18n.language === "en" ? "left" : "right",
          }}
          keyboardType="number-pad"
          value={formatNumber(priceRange[1])}
          onChangeText={(text) => {
            setPriceRange([priceRange[0], clampMaxValue(parseNumber(text))]);
          }}
          onBlur={() => {
            if (priceRange[1] === 0) {
              setPriceRange([priceRange[0], maxPrice]);
            }
          }}
        />
      </View>
      <Button
        style={defaultButton}
        labelStyle={defaultButtonLabel}
        onPress={() => onSubmit(priceRange)}
        disabled={!(priceRange[1] >= priceRange[0])}
      >
        {submitButtonText}
      </Button>
    </View>
  );
}

export default forwardRef(PriceSlider);

const styles = StyleSheet.create({
  sliderContainer: {
    alignItems: "center",
    flex: 1,
  },
  textInputContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  textInput: {
    flex: 1,
    height: 60,
  },
  margin: {
    // marginHorizontal: 16,
  },
});
