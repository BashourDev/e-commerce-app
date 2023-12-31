import React from "react";
import { Image, StyleSheet, View } from "react-native";
import { IconButton, useTheme } from "react-native-paper";

import { getFocusedRouteNameFromRoute, Route } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

import { LocalizationPicker } from "../components";
import { COLORS } from "../constants/colors";
import { headerOptions } from "../constants/theme";
import { Text } from "../core-ui";
import { useCartFilled } from "../helpers/cartFilled";
import { useAuth } from "../helpers/useAuth";
import { useGetAuthenticatedUser } from "../hooks/api/useAuthenticatedUser";
import {
  AddEditAddressScene,
  AddressManagementScene,
  AuthScene,
  CheckoutScene,
  EditProfileScene,
  ForgotPasswordScene,
  OrderDetailsScene,
  OrderHistoryScene,
  OrderPlacedConfirmationScene,
  ProductCollectionScene,
  ProductDetailsScene,
  SearchResultsScene,
  ShoppingCartScene,
  WebViewScene,
} from "../scenes";

import TabNavigator from "./TabNavigator";
import { useTranslation } from "react-i18next";

const Stack = createStackNavigator();

function HeaderIconButton(props) {
  let { icon, onPress } = props;
  let { isFilled, numOfItems } = useCartFilled();
  if (icon === "cart" && isFilled) {
    return (
      <View style={styles.flex}>
        <IconButton
          icon={icon}
          onPress={onPress}
          color={COLORS.primaryColor}
          iconColor={COLORS.primaryColor}
          style={styles.headerButton}
        />
        <View style={styles.cartBadge}>
          <Text style={styles.badgeText}>{numOfItems}</Text>
        </View>
      </View>
    );
  }

  return (
    <IconButton
      icon={icon}
      onPress={onPress}
      color={COLORS.primaryColor}
      iconColor={COLORS.primaryColor}
      style={styles.headerButton}
    />
  );
}

export default function StackNavigator() {
  let { authToken } = useAuth();
  let { data: userData } = useGetAuthenticatedUser();
  let { isRTL } = useTheme();
  const { t, i18n } = useTranslation();

  function getTabSceneName(route) {
    const routeName = getFocusedRouteNameFromRoute(route) || "HomeTab";
    return routeName;
  }

  return (
    <Stack.Navigator
      screenOptions={{ ...headerOptions, animationEnabled: false }}
      headerMode="screen"
      initialRouteName={"Home"}
    >
      <Stack.Screen
        name="Home"
        component={TabNavigator}
        options={({ navigation, route }) => {
          let tabScene = getTabSceneName(route);
          if (tabScene === "HomeTab") {
            return {
              headerTitle: () => (
                // authToken && userData?.authenticatedUser.firstName
                //   ? `${t("StackNavigator.Hello")}${
                //       i18n.language === "en" ? "," : " "
                //     } ${userData.authenticatedUser.firstName}`
                //   : t("StackNavigator.Hello")

                <Image
                  source={require("../../assets/images/logo-header.png")}
                  resizeMode="contain"
                  style={{ zIndex: 999, width: 65, height: 55 }}
                />
              ),
              headerLeft: () => {
                return i18n.language === "en" ? (
                  <LocalizationPicker />
                ) : (
                  <HeaderIconButton
                    icon="cart"
                    onPress={() => navigation.navigate("ShoppingCart")}
                  />
                );
              },
              headerRight: () => {
                return i18n.language === "ar" ? (
                  <LocalizationPicker />
                ) : (
                  <HeaderIconButton
                    icon="cart"
                    onPress={() => navigation.navigate("ShoppingCart")}
                  />
                );
              },
              headerStyle: {
                shadowColor: COLORS.transparent,
                backgroundColor: "#000",
                elevation: 0,
              },
            };
          } else if (tabScene === "WishlistTab") {
            return {
              headerLeft: () => null,
              title: (
                <Text style={{ color: COLORS.primaryColor }}>
                  {t("StackNavigator.Wishlist")}
                </Text>
              ),
              headerStyle: {
                backgroundColor: "#000",
              },
            };
          } else {
            return authToken
              ? {
                  headerLeft: () => null,
                  title: (
                    <Text style={{ color: COLORS.primaryColor }}>
                      {t("StackNavigator.My Profile")}
                    </Text>
                  ),
                }
              : {
                  headerLeft: () =>
                    !authToken && (
                      <HeaderIconButton
                        icon={isRTL ? "chevron-right" : "chevron-left"}
                        onPress={() => navigation.navigate("HomeTab")}
                      />
                    ),
                  title: (
                    <Text style={{ color: COLORS.primaryColor }}>
                      {t("StackNavigator.My Profile")}
                    </Text>
                  ),
                  headerStyle: {
                    shadowColor: COLORS.transparent,
                    backgroundColor: "#000",
                    elevation: 0,
                  },
                };
          }
        }}
      />
      <Stack.Screen
        name="Auth"
        component={AuthScene}
        options={() => ({
          title: t("StackNavigator.Welcome"),
          headerStyle: {
            shadowColor: COLORS.transparent,
            elevation: 0,
          },
        })}
      />
      <Stack.Screen
        name="ForgotPassword"
        component={ForgotPasswordScene}
        options={() => ({
          title: t("StackNavigator.Forgot Password"),
          cardStyle: {
            backgroundColor: COLORS.white,
          },
        })}
      />
      <Stack.Screen
        name="AddressManagement"
        component={AddressManagementScene}
        options={() => ({
          title: t("StackNavigator.Manage Addresses"),
        })}
      />
      <Stack.Screen name="AddEditAddress" component={AddEditAddressScene} />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScene}
        options={() => ({
          title: t("StackNavigator.Edit Profile"),
        })}
      />
      <Stack.Screen
        name="OrderHistory"
        component={OrderHistoryScene}
        options={() => ({
          title: t("StackNavigator.Order History"),
          cardStyle: {
            backgroundColor: COLORS.darkWhite,
          },
        })}
      />
      <Stack.Screen
        name="OrderDetails"
        component={OrderDetailsScene}
        options={() => ({
          title: t("StackNavigator.Order Details"),
        })}
      />
      <Stack.Screen
        name="ProductDetails"
        component={ProductDetailsScene}
        options={({ navigation }) => ({
          animationEnabled: false,
          title: t("StackNavigator.Product Details"),
          headerRight: () => (
            <HeaderIconButton
              icon="cart"
              onPress={() => navigation.navigate("ShoppingCart")}
            />
          ),
        })}
      />
      <Stack.Screen
        name="ShoppingCart"
        component={ShoppingCartScene}
        options={() => ({
          title: t("StackNavigator.Shopping Cart"),
        })}
      />
      <Stack.Screen
        name="ProductCollection"
        component={ProductCollectionScene}
        options={({ route }) => ({
          animationEnabled: false,
          title: route.params.collection.title,
        })}
      />
      <Stack.Screen
        name="SearchResults"
        component={SearchResultsScene}
        options={() => ({
          title: t("StackNavigator.Search Results"),
        })}
      />
      <Stack.Screen
        name="Checkout"
        component={CheckoutScene}
        options={() => ({
          title: t("StackNavigator.Checkout"),
        })}
      />
      <Stack.Screen
        name="WebView"
        component={WebViewScene}
        options={({ navigation }) => ({
          animationEnabled: false,
        })}
      />

      <Stack.Screen
        name="OrderPlacedConfirmation"
        component={OrderPlacedConfirmationScene}
        options={() => ({
          title: t("StackNavigator.Order Placed"),
          headerLeft: () => null,
        })}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  headerButton: {
    marginRight: 8,
  },
  cartBadge: {
    width: 14,
    height: 14,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.red,
    borderRadius: 7,
    position: "absolute",
    top: 5,
    right: 12,
  },
  badgeText: {
    fontSize: 10,
    color: COLORS.white,
  },
});
