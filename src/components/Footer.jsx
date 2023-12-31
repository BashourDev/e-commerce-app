import { View, Text, StyleSheet, Image } from "react-native";
import React from "react";
import { COLORS } from "../constants/colors";
import { LinearGradient } from "expo-linear-gradient";
import { IconButton } from "react-native-paper";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { i18n, t } = useTranslation();
  return (
    <View
      style={[
        styles.container,
        // i18n.language === "ar" && {
        //   transform: [{ scaleX: -1 }],
        // },
      ]}
    >
      <View
        style={[
          styles.upperContainer,
          i18n.language === "ar" && { flexDirection: "row-reverse" },
        ]}
      >
        <View
          style={[
            styles.logoContainer,
            i18n.language === "ar" && { alignItems: "flex-end" },
          ]}
        >
          <Image
            source={require("../../assets/images/logo-footer.png")}
            style={styles.logo}
            resizeMode="contain"
          />
          <Text style={styles.motto}>{t("Footer.Motto")}</Text>
        </View>
        <View style={styles.socialContainer}>
          <IconButton
            icon={"facebook"}
            style={styles.socialIcon}
            size={20}
            iconColor={COLORS.primaryColor}
          />
          <IconButton
            icon={"instagram"}
            style={styles.socialIcon}
            size={20}
            iconColor={COLORS.primaryColor}
          />
          <IconButton
            icon={"twitter"}
            style={styles.socialIcon}
            size={20}
            iconColor={COLORS.primaryColor}
          />
        </View>
      </View>
      <Text style={styles.copyright}>
        © Copyright Sabah Style {new Date().getFullYear()}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingTop: 20,
    paddingBottom: 10,
    paddingHorizontal: 10,
    backgroundColor: "#000",
  },
  upperContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  logoContainer: {
    paddingBottom: 15,
  },
  socialContainer: {
    display: "flex",
    flexDirection: "row",
  },
  socialIcon: {
    margin: 0,
  },
  logo: {
    width: 50,
    height: 50,
    borderRadius: 5,
  },
  motto: {
    fontSize: 12,
    color: COLORS.primaryColor,
    paddingTop: 2,
  },
  copyright: {
    fontSize: 10,
    color: COLORS.primaryColor,
  },
});

export default Footer;
