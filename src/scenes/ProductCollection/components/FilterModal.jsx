import React, { useRef } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import { COLORS } from "../../../constants/colors";
import { FONT_FAMILY, FONT_SIZE } from "../../../constants/fonts";
import { ModalBottomSheet, Text } from "../../../core-ui";
import PriceSlider from "./PriceSlider";
import { t } from "../../../helpers/translate";

export default function FilterModal(props) {
  let {
    isModalVisible,
    toggleModal,
    onSubmit,
    minPrice,
    maxPrice,
    initialSliderValues,
    onClear,
    sliderStep,
  } = props;

  let priceSliderRef = useRef(null);
  let onClearPress = () => {
    onClear();
    priceSliderRef.current && priceSliderRef.current.clear();
  };

  return (
    <ModalBottomSheet
      isModalVisible={isModalVisible}
      toggleModal={toggleModal}
      title={t("Price")}
      height={284}
      width={360}
      headerRight={
        <TouchableOpacity onPress={onClearPress}>
          <Text style={styles.clearButton}>{t("Clear")}</Text>
        </TouchableOpacity>
      }
    >
      <View style={styles.content}>
        <PriceSlider
          sliderStep={sliderStep}
          ref={priceSliderRef}
          minPrice={minPrice}
          maxPrice={maxPrice}
          initialSliderValues={initialSliderValues}
          onSubmit={onSubmit}
          submitButtonText={t("Set Filter")}
        />
      </View>
    </ModalBottomSheet>
  );
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    paddingTop: 8,
    paddingBottom: 28,
    marginHorizontal: 24,
  },
  clearButton: {
    fontFamily: FONT_FAMILY.MEDIUM,
    color: COLORS.primaryColor,
    fontSize: FONT_SIZE.medium,
  },
});
