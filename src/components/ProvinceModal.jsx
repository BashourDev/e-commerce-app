import React, { useEffect, useState } from "react";
import {
  Animated,
  FlatList,
  Image,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Modal, Portal } from "react-native-paper";

import { checkAddressImage, searchImage } from "../../assets/images";
import { COLORS } from "../constants/colors";
import { COUNTRY_CODE } from "../constants/countryCode";
import { FONT_SIZE } from "../constants/fonts";
import { Text, TextInput } from "../core-ui";
import { useKeyboardListener } from "../helpers/keyboardListener";
import { useGetShop } from "../hooks/api/useCustomerAddress";
import { useTranslation } from "react-i18next";
import { provinces } from "../constants/provinces";

function EmptyProvinceList(searchProvince) {
  const { t, i18n } = useTranslation();
  return (
    <View style={styles.emptyContainer}>
      <Image source={searchImage} style={styles.searchImage} />
      {searchProvince !== "" ? (
        <>
          <View
            style={[
              styles.flexRow,
              i18n.language === "ar" && {
                flexDirection: "row-reverse",
                gap: 5,
              },
            ]}
          >
            <Text>{t("ProvinceModal.There's no result for")} </Text>
            <Text weight="medium">{searchProvince}</Text>
          </View>
          <Text>{t("ProvinceModal.Please try another word")}</Text>
        </>
      ) : (
        <>
          <Text>{t("ProvinceModal.No available selections")}</Text>
        </>
      )}
    </View>
  );
}

export default function ProvinceModal(props) {
  let { provinceVisible, toggleModal, onPressProvince, selectedCountry } =
    props;

  let { keyboardHeight } = useKeyboardListener();

  let [searchProvince, setSearchProvince] = useState("");
  let [selectedProvince, setSelectedProvince] = useState("");
  let [provinceList, setProvinceList] = useState([]);

  //   let { data } = useGetShop();
  const { t } = useTranslation();
  useEffect(() => {
    // if (data) {
    let provincesToDisplay = [];

    if (searchProvince === "") {
      provincesToDisplay = provinces[selectedCountry];
    } else {
      provincesToDisplay = provinces[selectedCountry].filter((item) =>
        item.includes(searchProvince)
      );
    }
    setProvinceList(provincesToDisplay);
    // }
  }, [selectedCountry, searchProvince]);

  let animatedViewStyle = () => {
    return [
      {
        transform: [
          {
            translateY: Animated.multiply(keyboardHeight, -1),
          },
        ],
      },
    ];
  };

  return (
    <Portal>
      <Modal
        contentContainerStyle={styles.modal}
        visible={provinceVisible}
        onDismiss={toggleModal}
      >
        <Animated.View style={[styles.defaultModal, animatedViewStyle()]}>
          <View style={styles.modalTitleContainer}>
            <Text weight="medium" style={styles.modalTitle}>
              {t("ProvinceModal.Select Province")}
            </Text>
            <TextInput
              placeholder={t("ProvinceModal.Find Province")}
              containerStyle={styles.textInputContainer}
              value={searchProvince}
              onChangeText={setSearchProvince}
              autoCapitalize="words"
              clearButtonMode="while-editing"
              autoFocus={true}
            />
          </View>
          <FlatList
            style={styles.countryList}
            data={provinceList}
            ListEmptyComponent={EmptyProvinceList(searchProvince)}
            keyboardShouldPersistTaps="always"
            renderItem={({ item }) => {
              let isActive = selectedProvince === item;

              return (
                <TouchableOpacity
                  style={styles.countryContainer}
                  onPress={() => {
                    setSelectedProvince(item);
                    onPressProvince(item);
                  }}
                >
                  {isActive ? (
                    <Text weight="medium" style={styles.textActive}>
                      {item}
                    </Text>
                  ) : (
                    <Text>{item}</Text>
                  )}
                  {isActive && (
                    <View style={styles.imageContainer}>
                      <Image
                        style={styles.checkImage}
                        source={checkAddressImage}
                      />
                    </View>
                  )}
                </TouchableOpacity>
              );
            }}
            keyExtractor={(item) => item}
          />
        </Animated.View>
      </Modal>
    </Portal>
  );
}

const styles = StyleSheet.create({
  flexRow: {
    flexDirection: "row",
  },
  defaultModal: {
    backgroundColor: COLORS.white,
  },
  emptyContainer: {
    height: 200,
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    backgroundColor: COLORS.white,
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalTitleContainer: {
    marginBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGrey,
  },
  modalTitle: {
    paddingVertical: 16,
    fontSize: FONT_SIZE.large,
    textAlign: "center",
  },
  textInputContainer: {
    height: 42,
    marginHorizontal: 24,
    marginBottom: 16,
    borderRadius: 8,
    backgroundColor: COLORS.darkWhite,
    borderColor: COLORS.darkWhite,
  },
  countryList: {
    height: 200,
    marginBottom: 16,
  },
  countryContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 8,
    marginHorizontal: 24,
  },
  textActive: {
    color: COLORS.primaryColor,
  },
  imageContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  checkImage: {
    width: 24,
    height: 24,
  },
  searchImage: {
    width: 84,
    height: 84,
  },
});
