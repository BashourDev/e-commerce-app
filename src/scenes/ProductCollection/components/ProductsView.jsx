import React, { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { ActivityIndicator } from "react-native-paper";

import { ProductList } from "../../../components";
import { COLORS } from "../../../constants/colors";
import { FONT_FAMILY, FONT_SIZE } from "../../../constants/fonts";
import { Button, Text } from "../../../core-ui";
import { useColumns } from "../../../helpers/columns";
import { ScreenSize, useDimensions } from "../../../helpers/dimensions";
import { formatSliderValue } from "../../../helpers/formatSliderValue";

import FilterModal from "./FilterModal";
import PriceSlider from "./PriceSlider";
import SortModal from "./SortModal";
import SortRadioGroup from "./SortRadioGroup";

import { useTranslation } from "react-i18next";

export default function ProductsView(props) {
  let { onItemPress, products, sortProps, filterProps, onEndReached, hasMore } =
    props;

  let { sliderStep, maxPriceValue } = formatSliderValue(filterProps.maxPrice);
  let { radioButtonValue, onPressRadioButton } = sortProps;
  let {
    priceRange,
    onClearFilter,
    onSetFilter,
    onValuesChangeStart,
    onValuesChangeFinish,
  } = filterProps;

  let [isSortModalVisible, setSortModalVisible] = useState(false);
  let [isFilterModalVisible, setFilterModalVisible] = useState(false);
  let { screenSize } = useDimensions();
  let numColumns = useColumns();

  let toggleSortModal = () => setSortModalVisible(!isSortModalVisible);
  let toggleFilterModal = () => setFilterModalVisible(!isFilterModalVisible);

  let isScreenSizeLarge = screenSize === ScreenSize.Large;
  let containerStyle = [
    styles.flex,
    isScreenSizeLarge && styles.containerLandscape,
  ];
  const { t } = useTranslation();
  let SideBarMenu = () => {
    return (
      <ScrollView style={styles.sideBarMenu}>
        <View style={[styles.menuContainer, styles.menuBorder]}>
          <Text style={styles.menuTitle}>{t("ProductView.Sort By")}</Text>
          <SortRadioGroup
            radioButtonValue={radioButtonValue}
            onValueChange={(value) => {
              onPressRadioButton(value);
              toggleSortModal();
            }}
          />
        </View>
        <View style={styles.menuContainer}>
          <View style={styles.titleContainer}>
            <Text style={styles.menuTitle}>{t("ProductView.Price")}</Text>
            <TouchableOpacity onPress={onClearFilter}>
              <Text style={styles.clearButton}>{t("ProductView.Clear")}</Text>
            </TouchableOpacity>
          </View>
          <PriceSlider
            minPrice={0}
            maxPrice={maxPriceValue}
            initialSliderValues={priceRange}
            onSubmit={(values) => {
              onSetFilter(values);
              toggleFilterModal();
            }}
            submitButtonText={t("ProductView.Set Filter")}
            onValuesChangeStart={onValuesChangeStart}
            onValuesChangeFinish={onValuesChangeFinish}
            sliderStep={sliderStep}
          />
        </View>
      </ScrollView>
    );
  };

  let TopBarMenu = () => {
    return (
      <View style={styles.buttonContainer}>
        <Button
          icon="filter-variant"
          preset="invisible"
          style={[styles.flex, styles.filter]}
          contentStyle={styles.center}
          labelStyle={styles.buttonLabel}
          onPress={toggleFilterModal}
        >
          {t("ProductView.Filter")}
        </Button>
        <Button
          icon="swap-vertical"
          preset="invisible"
          style={styles.flex}
          labelStyle={styles.buttonLabel}
          onPress={toggleSortModal}
        >
          {t("ProductView.Sort By")}
        </Button>
      </View>
    );
  };

  return (
    <View style={containerStyle}>
      {isScreenSizeLarge ? <SideBarMenu /> : <TopBarMenu />}
      <View style={styles.productsContainer}>
        <Text
          style={[
            styles.count,
            { textAlign: t("dir") === "ltr" ? "left" : "right" },
          ]}
        >
          {t("ProductView.Showing") + " "}

          {products.length}

          {" " + t("ProductView.item(s)")}
        </Text>
        <ProductList
          data={products}
          numColumns={numColumns}
          contentContainerStyle={[
            {
              transform: [{ scaleX: -1 }],
            },
            styles.productList,
          ]}
          onItemPress={onItemPress}
          onEndReached={onEndReached}
          onEndReachedThreshold={0.25}
          ListFooterComponent={() => {
            return hasMore ? (
              <ActivityIndicator style={styles.activityIndicator} />
            ) : null;
          }}
        />
      </View>
      {!isScreenSizeLarge && (
        <>
          <SortModal
            isModalVisible={isSortModalVisible}
            toggleModal={toggleSortModal}
            radioButtonValue={radioButtonValue}
            onValueChange={(value) => {
              onPressRadioButton(value);
              toggleSortModal();
            }}
          />
          <FilterModal
            minPrice={0}
            maxPrice={maxPriceValue}
            initialSliderValues={priceRange}
            isModalVisible={isFilterModalVisible}
            toggleModal={toggleFilterModal}
            onSubmit={(values) => {
              onSetFilter(values);
              toggleFilterModal();
            }}
            onClear={onClearFilter}
            sliderStep={sliderStep}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  containerLandscape: {
    flexDirection: "row",
  },
  productsContainer: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 16,
  },
  buttonContainer: {
    flexDirection: "row",
    borderBottomColor: COLORS.lightGrey,
    borderBottomWidth: 1,
  },
  buttonLabel: {
    color: COLORS.black,
    fontFamily: FONT_FAMILY.MEDIUM,
    fontSize: FONT_SIZE.medium,
  },
  filter: {
    borderRightWidth: 1,
    borderRightColor: COLORS.lightGrey,
  },
  count: {
    marginLeft: 12,
    marginBottom: 16,
  },
  productList: {
    marginBottom: 16,
  },
  sideBarMenu: {
    width: 320,
    maxWidth: 320,
    borderRightColor: COLORS.lightGrey,
    borderRightWidth: 1,
    paddingHorizontal: 36,
    paddingVertical: 16,
  },
  menuContainer: {
    marginBottom: 16,
  },
  menuBorder: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGrey,
  },
  menuTitle: {
    fontFamily: FONT_FAMILY.MEDIUM,
    fontSize: FONT_SIZE.large,
  },
  titleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  clearButton: {
    fontFamily: FONT_FAMILY.MEDIUM,
    color: COLORS.primaryColor,
    fontSize: FONT_SIZE.medium,
  },
  activityIndicator: {
    marginVertical: 24,
  },
});
