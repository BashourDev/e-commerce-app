import React from "react";
import {
  FlatList,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";

import { COLORS } from "../constants/colors";
import { FONT_SIZE } from "../constants/fonts";

import Text from "./Text";
import { useTranslation } from "react-i18next";
import { LinearGradient } from "expo-linear-gradient";

function Separator() {
  return <View style={styles.separator} />;
}

export default function CategoryList(props) {
  let { containerStyle, textStyle, categories, onSelect, ...otherprops } =
    props;
  const { i18n } = useTranslation();
  return (
    <FlatList
      showsHorizontalScrollIndicator={false}
      horizontal={true}
      data={categories}
      inverted={i18n.language === "ar"}
      renderItem={({ item, index }) => (
        <TouchableOpacity
          style={[
            styles.categoryItemContainer,
            styles.borderRadius,
            !item.image && styles.color,
            containerStyle,
          ]}
          onPress={() => onSelect(item)}
        >
          {/* {item.image ? ( */}
          <ImageBackground
            source={{
              uri:
                item.image ||
                "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRsvXYx8VBAUf4zeJmbQRrSlAbhThWSTL6AVHjWisWT0U-8pyL_bCDhQNhg2Z6w1QfZTOw&usqp=CAU",
            }}
            imageStyle={styles.borderRadius}
            style={styles.categoryItemContainer}
          >
            <LinearGradient
              colors={["rgba(0, 0, 0, 0.7)", "rgba(0, 0, 0, 0.7)"]}
              style={{ minWidth: "100%", alignItems: "center" }}
            >
              <Text
                weight="medium"
                style={[styles.categoryItemText, textStyle]}
              >
                {item.title}
              </Text>
            </LinearGradient>
          </ImageBackground>
          {/* ) : (
            <Text weight="medium" style={[styles.categoryItemText, textStyle]}>
              {item.title}
            </Text>
          )} */}
        </TouchableOpacity>
      )}
      ItemSeparatorComponent={Separator}
      keyExtractor={(item) => item.id}
      contentContainerStyle={styles.flatlistContainer}
      {...otherprops}
    />
  );
}

const styles = StyleSheet.create({
  categoryItemContainer: {
    flex: 1,
    height: 70,
    minWidth: 120,
    justifyContent: "flex-end",
    alignItems: "flex-start",
  },
  borderRadius: {
    overflow: "hidden",
  },
  color: {
    backgroundColor: COLORS.primaryColor,
  },
  categoryItemText: {
    marginHorizontal: 22,
    paddingTop: 3,
    color: COLORS.white,
    fontSize: FONT_SIZE.medium,
    width: "100%",
    textAlign: "center",
  },
  separator: {
    marginHorizontal: 6,
  },
  flatlistContainer: {
    paddingStart: 24,
    paddingEnd: 24,
  },
});
