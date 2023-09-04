import React, { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { IconButton, Menu } from "react-native-paper";

import { COLORS } from "../constants/colors";
import { FONT_SIZE } from "../constants/fonts";
import { Text } from "../core-ui";
import formatAddress from "../helpers/formatAddress";
import { getFullName } from "../helpers/getFullName";
import { useTranslation } from "react-i18next";

/**
 * { id, firstName, lastName, default: primary, phone } = data
 * @param {*} props
 * @returns
 */
export default function ManageAddress(props) {
  let { data, style, onPressSetPrimary, onPressEdit, onPressDelete } = props;
  let { id, firstName, lastName, default: primary, phone } = data;

  let fullName = getFullName(firstName, lastName);

  let [showMenu, setShowMenu] = useState(false);
  const { t, i18n } = useTranslation();
  return (
    <TouchableOpacity style={[styles.container, style]}>
      <View style={[styles.header, { direction: t("dir") }]}>
        <Text style={styles.label}>{fullName}</Text>
        <Menu
          style={[styles.menuBox, styles.padding]}
          visible={showMenu}
          onDismiss={() => setShowMenu(false)}
          anchor={
            <IconButton
              icon="dots-vertical"
              color={COLORS.primaryColor}
              onPress={() => {
                setShowMenu(true);
              }}
              style={styles.iconButton}
            />
          }
        >
          <TouchableOpacity
            onPress={() => {
              setShowMenu(false);
              onPressEdit();
            }}
          >
            <Text weight="medium" style={[styles.label, styles.padding]}>
              {t("ManageAddress.Edit")}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              setShowMenu(false);
              onPressDelete();
            }}
          >
            <Text style={[styles.deleteLabel, styles.padding]} weight="medium">
              {t("ManageAddress.Delete")}
            </Text>
          </TouchableOpacity>
        </Menu>
      </View>
      {formatAddress(data).map((item) =>
        item ? (
          <Text
            key={item}
            style={[
              styles.address,
              styles.opacity,
              { textAlign: i18n.language === "en" ? "left" : "right" },
            ]}
          >
            {item}
          </Text>
        ) : (
          <Text>{t("ManageAddress.No Addresses To Display")}</Text>
        )
      )}
      <Text
        style={[
          styles.opacity,
          styles.phone,
          { textAlign: i18n.language === "en" ? "left" : "right" },
        ]}
      >
        {t("ManageAddress.Phone")}
        {": "}
        {phone}
      </Text>
      <View style={[styles.indicatorContainer]}>
        {primary ? (
          <View
            style={[
              styles.primary,
              { flexDirection: i18n.language === "en" ? "row" : "row-reverse" },
            ]}
          >
            <IconButton
              icon="check"
              color={COLORS.primaryColor}
              disabled={true}
              style={styles.iconButton}
            />
            <Text
              style={[
                styles.label,
                styles.blueText,
                styles.opacity,
                { textAlign: i18n.language === "en" ? "left" : "right" },
              ]}
              weight="medium"
            >
              {t("ManageAddress.Primary Address")}
            </Text>
          </View>
        ) : (
          <TouchableOpacity
            style={[
              styles.setPrimary,
              { flexDirection: i18n.language === "en" ? "row" : "row-reverse" },
            ]}
            onPress={() => onPressSetPrimary(id)}
          >
            <Text style={[styles.label, styles.blueText]} weight="medium">
              {t("ManageAddress.Set as Primary Address")}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    borderWidth: 1,
    borderColor: COLORS.lightGrey,
    paddingHorizontal: 12,
    paddingTop: 6,
  },
  primary: {
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGrey,
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
  },
  setPrimary: {
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGrey,
    paddingVertical: 12,
    width: "100%",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  menuBox: {
    justifyContent: "space-between",
  },
  label: {
    fontSize: FONT_SIZE.medium,
    color: COLORS.black,
  },
  deleteLabel: {
    fontSize: FONT_SIZE.medium,
    color: COLORS.red,
    width: 100,
  },
  padding: { paddingHorizontal: 16, paddingVertical: 8 },
  indicatorContainer: {
    marginTop: 12,
    paddingRight: 12,
  },
  address: {
    fontSize: FONT_SIZE.small,
    color: COLORS.black,
    marginTop: 6,
  },
  phone: {
    marginTop: 6,
  },
  blueText: {
    color: COLORS.primaryColor,
  },
  opacity: {
    opacity: 0.6,
  },
  iconButton: { margin: 0 },
});
