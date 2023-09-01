import React from "react";
import { Image, SafeAreaView, StyleSheet, View } from "react-native";

import { defaultButton, defaultButtonLabel } from "../constants/theme";
import { Button, Text } from "../core-ui";
import { ERRORS, ERRORS_ARABIC } from "../constants/values";
import { FONT_SIZE } from "../constants/fonts";
import { COLORS } from "../constants/colors";
import { NetworkStateEnum, useNetwork } from "../helpers/useNetwork";
import { useTranslation } from "react-i18next";

export default function ErrorPage(props) {
  let { isConnected, retryConnection } = useNetwork();
  let { onRetry } = props;
  const { i18n } = useTranslation();
  let errorType =
    isConnected === NetworkStateEnum.CONNECTED ? "data" : "noInternet";
  let { title, message, image } =
    i18n.language === "en" ? ERRORS[errorType] : ERRORS_ARABIC[errorType];
  const { t } = useTranslation();
  return (
    <SafeAreaView style={styles.flex}>
      <View style={styles.center}>
        <Image
          source={image}
          width={100}
          height={100}
          style={styles.emptyCartImage}
        />
        <Text weight="bold" style={styles.title}>
          {title}
        </Text>
        <Text style={styles.message}>{message}</Text>
        <Button
          style={[defaultButton, styles.buttonStyle]}
          labelStyle={defaultButtonLabel}
          onPress={() => {
            isConnected === NetworkStateEnum.NOT_CONNECTED && retryConnection();
            onRetry();
          }}
        >
          {t("ErrorPage.Try Again")}
        </Button>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  buttonStyle: {
    marginTop: 16,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 48,
  },
  emptyCartImage: {
    maxWidth: 360,
    maxHeight: 270,
    marginBottom: 24,
  },
  flex: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  title: {
    fontSize: FONT_SIZE.large,
    marginBottom: 8,
    textAlign: "center",
  },
  message: {
    fontSize: FONT_SIZE.small,
    opacity: 0.6,
    textAlign: "center",
  },
});
