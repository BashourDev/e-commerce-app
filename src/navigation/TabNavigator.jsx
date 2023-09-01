import React from "react";
import { IconButton } from "react-native-paper";

import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";

import { FONT_SIZE } from "../constants/fonts";
import { tabBarOptions } from "../constants/theme";
import { Text } from "../core-ui";
import { useAuth } from "../helpers/useAuth";
import { HomeScene, LockScene, ProfileScene, WishlistScene } from "../scenes";
import { useTranslation } from "react-i18next";

const Tab = createBottomTabNavigator();

function TabLabel(props) {
  let { focused, color, label } = props;
  return (
    <Text
      {...(focused && { weight: "medium" })}
      style={{ color, fontSize: FONT_SIZE.extraSmall, marginTop: 10 }}
    >
      {label}
    </Text>
  );
}

export default function TabNavigator() {
  let { authToken } = useAuth();
  const { t } = useTranslation();
  return (
    <Tab.Navigator initialRouteName="HomeTab" tabBarOptions={tabBarOptions}>
      <Tab.Screen
        name="HomeTab"
        component={HomeScene}
        options={() => {
          return {
            title: t("TabNavigator.Home"),
            tabBarLabel: ({ focused, color }) => (
              <TabLabel
                focused={focused}
                color={color}
                label={t("TabNavigator.Home")}
              />
            ),
            tabBarIcon: ({ color }) => <IconButton icon="home" color={color} />,
          };
        }}
      />
      <Tab.Screen
        name="WishlistTab"
        component={WishlistScene}
        options={() => {
          return {
            title: t("TabNavigator.Wishlist"),
            tabBarLabel: ({ focused, color }) => (
              <TabLabel
                focused={focused}
                color={color}
                label={t("TabNavigator.Wishlist")}
              />
            ),
            tabBarIcon: ({ color }) => (
              <IconButton icon="heart" color={color} />
            ),
          };
        }}
      />
      <Tab.Screen
        name="ProfileTab"
        component={authToken ? ProfileScene : LockScene}
        options={() => {
          return {
            title: t("TabNavigator.Profile"),
            tabBarVisible: !!authToken,
            tabBarLabel: ({ focused, color }) => (
              <TabLabel
                focused={focused}
                color={color}
                label={t("TabNavigator.My Profile")}
              />
            ),
            tabBarIcon: ({ color }) => (
              <IconButton icon="account" color={color} />
            ),
          };
        }}
      />
    </Tab.Navigator>
  );
}
