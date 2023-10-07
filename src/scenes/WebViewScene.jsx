import React, { useEffect, useState } from "react";
import { SafeAreaView, StyleSheet } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { WebView } from "react-native-webview";

import { useNavigation, useRoute } from "@react-navigation/native";

import { Text } from "../core-ui";
import { useResetCart } from "../hooks/api/useShoppingCart";
import { useTranslation } from "react-i18next";

export default function WebScene() {
  let {
    params: { type, webUrl },
  } = useRoute();
  const { t, i18n } = useTranslation();
  let { navigate, setOptions } = useNavigation();
  let { resetShoppingCart } = useResetCart();
  if (type !== "payment" && i18n.language === "ar") {
    webUrl = webUrl.replace("locale=en", "locale=ar");
  }
  const [webUrlState, setWebUrlState] = useState(webUrl);
  let title;
  switch (type) {
    case "policy":
      title = t("WebViewScene.Privacy Policy");
      break;
    case "terms":
      title = t("WebViewScene.Terms & Conditions");
      break;
    default:
      title = t("WebViewScene.Payment");
  }
  useEffect(() => {
    setOptions({
      title,
    });
  });

  return webUrlState ? (
    <SafeAreaView style={styles.flex}>
      <WebView
        style={styles.container}
        source={{ uri: webUrlState }}
        originWhitelist={["*"]}
        onNavigationStateChange={(webviewState) => {
          if (type !== "payment" || i18n.language === "en") return;
          if (
            webviewState.url.startsWith(
              "https://e48d9c-2.myshopify.com/checkouts/co/"
            ) &&
            !webviewState.url.endsWith("?locale=ar-AE")
          ) {
            setWebUrlState(webviewState.url + "?locale=ar-AE");
          }
        }}
        onShouldStartLoadWithRequest={({ url }) => {
          if (url.endsWith("thank_you")) {
            resetShoppingCart();
            navigate("OrderPlacedConfirmation", { orderNumber: "" });
            return false;
          }
          return true;
        }}
        startInLoadingState={true}
        renderLoading={() => <ActivityIndicator style={styles.center} />}
      />
    </SafeAreaView>
  ) : (
    <SafeAreaView style={styles.text}>
      <Text>{t("WebViewScene.Please check your connection.")}</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  container: {
    marginVertical: 24,
    opacity: 0.99,
  },
  center: {
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
  },
  text: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
