import React from "react";

import { useRoute } from "@react-navigation/native";

import { TabView } from "../core-ui";
import LoginScene from "./LoginScene";
import RegisterScene from "./RegisterScene";
import { useTranslation } from "react-i18next";

export default function AuthScene() {
  let {
    params: { initialRouteKey },
  } = useRoute();
  const { t } = useTranslation();
  const routes = [
    { key: "Login", title: t("AuthScene.Login"), scene: LoginScene },
    { key: "Register", title: t("AuthScene.Register"), scene: RegisterScene },
  ];
  return (
    <TabView
      isScrollEnabled={false}
      routes={routes}
      initialRouteKey={initialRouteKey}
    />
  );
}
