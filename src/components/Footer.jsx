import { View, Text, StyleSheet, Image } from "react-native";
import React from "react";
import { COLORS } from "../constants/colors";
import { LinearGradient } from "expo-linear-gradient";
import { IconButton } from "react-native-paper";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { i18n, t } = useTranslation();
  return (
    <LinearGradient
      style={[
        styles.container,
        i18n.language === "ar" && {
          transform: [{ scaleX: -1 }],
        },
      ]}
      colors={[
        COLORS.primaryColor + "77",
        COLORS.primaryColor + "AA",
        COLORS.primaryColor,
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
          <IconButton icon={"facebook"} style={styles.socialIcon} size={20} />
          <IconButton icon={"instagram"} style={styles.socialIcon} size={20} />
          <IconButton icon={"twitter"} style={styles.socialIcon} size={20} />
        </View>
      </View>
      <Text style={styles.copyright}>
        © Copyright Sabah Style {new Date().getFullYear()}
      </Text>
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  container: {
    width: "100%",
    paddingTop: 20,
    paddingBottom: 10,
    paddingHorizontal: 10,
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
    color: "#181818",
    paddingTop: 2,
  },
  copyright: {
    fontSize: 10,
    color: "#181818",
  },
});

export default Footer;
