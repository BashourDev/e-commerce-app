import React, { useState } from "react";
import {
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { ActivityIndicator } from "react-native-paper";

import { useNavigation } from "@react-navigation/native";

import { cartPlaceholder } from "../../../assets/images";
import { ErrorPage, OrderItem } from "../../components";
import { COLORS } from "../../constants/colors";
import { KeyboardAvoidingView, Text, Toast } from "../../core-ui";
import { ScreenSize, useDimensions } from "../../helpers/dimensions";
import { mapToLineItems } from "../../helpers/mapToLineItems.js";
import { useAuth } from "../../helpers/useAuth";
import {
  useCheckoutCreate,
  useCheckoutCustomerAssociate,
  useCheckoutDiscountApply,
  useCheckoutDiscountRemove,
  useCheckoutReplaceItem,
} from "../../hooks/api/useShopifyCart";
import {
  useGetCart,
  useSetShoppingCart,
  useSetShoppingCartID,
} from "../../hooks/api/useShoppingCart";

import { BottomButton, ShoppingCartPayment } from "./components";
import useDefaultCountry from "../../hooks/api/useDefaultCountry";

import { useTranslation } from "react-i18next";

function extractDataCheckout(checkout) {
  let {
    id,
    lineItems: checkoutLineItems,
    lineItemsSubtotalPrice,
    subtotalPriceV2,
    paymentDueV2,
  } = checkout;
  let lineItemsPrice = Number(lineItemsSubtotalPrice.amount);
  let subtotalPrice = Number(subtotalPriceV2.amount);
  let totalPrice = Number(paymentDueV2.amount);
  let lineItems = mapToLineItems(checkoutLineItems);

  return {
    id,
    lineItems,
    lineItemsPrice,
    subtotalPrice,
    totalPrice,
  };
}

function mapLineItemsToOrder(items, onChangeQuantity, onRemovePress) {
  let result = items.map((item) => {
    return { ...item, onChangeQuantity, onRemovePress };
  });
  return result;
}

export default function ShoppingCartScene() {
  const { t, i18n } = useTranslation();
  let { authToken } = useAuth();
  let { screenSize } = useDimensions();
  let { navigate } = useNavigation();
  let shoppingCartItems = [];
  let [cartData, setCartData] = useState({
    id: "",
    lineItemsPrice: 0,
    subtotalPrice: 0,
    totalPrice: 0,
    lineItems: [],
  });
  let [cartID, setCartID] = useState("");
  let [firstLoading, setFirstLoading] = useState(true);
  let [voucherCode, setVoucherCode] = useState("");
  let [isToastVisible, setIsToastVisible] = useState(false);
  let [isVoucherCodeValid, setIsVoucherCodeValid] = useState(true);
  let {
    data: { countryCode, currencyCode },
  } = useDefaultCountry();

  let setVoucherCodeValue = (value) => {
    setVoucherCode(value);
  };

  let { shoppingCartDiscountApply, loading: DiscountCodeApplyLoading } =
    useCheckoutDiscountApply({
      language: i18n.language.toUpperCase(),
      onCompleted: ({ checkoutDiscountCodeApplyV2 }) => {
        if (
          checkoutDiscountCodeApplyV2 &&
          checkoutDiscountCodeApplyV2.checkout
        ) {
          setCartData(
            extractDataCheckout(checkoutDiscountCodeApplyV2.checkout)
          );
        }
      },
    });

  let { shoppingCartDiscountRemove, error: discountError } =
    useCheckoutDiscountRemove({
      onError: () => {
        setFirstLoading(false);
      },
    });

  let onAddVoucherCode = async () => {
    let result = await shoppingCartDiscountApply({
      variables: {
        checkoutId: cartID,
        discountCode: voucherCode,
        country: countryCode,
      },
    });

    let checkoutUserErrors =
      result.data?.checkoutDiscountCodeApplyV2?.checkoutUserErrors;

    if (checkoutUserErrors && checkoutUserErrors.length > 0) {
      if (checkoutUserErrors[0].code === CheckoutErrorCode.DISCOUNT_NOT_FOUND) {
        setIsVoucherCodeValid(false);
      }
    }
  };

  let paymentData = {
    subtotal: cartData.lineItemsPrice,
    total: cartData.subtotalPrice,
  };

  let showToast = (duration) => {
    setIsToastVisible(true);
    setTimeout(() => {
      setIsToastVisible(false);
    }, duration);
  };

  let hideToast = () => {
    setIsToastVisible(false);
  };

  let changeItemQuantity = (variantIDSearched, amount) => {
    let newLineItemsData = cartData.lineItems.map((item) => {
      if (item.variantID === variantIDSearched) {
        return { ...item, quantity: amount };
      } else {
        return item;
      }
    });
    let newCartData = { ...cartData, lineItems: newLineItemsData };
    setCartData(newCartData);
    shoppingCartItems = newCartData.lineItems.map(({ variantID, quantity }) => {
      return { variantId: variantID, quantity };
    });
    setShoppingCart({ variables: { items: shoppingCartItems, id: cartID } });
    shoppingCartReplaceItems({
      variables: {
        lineItems: shoppingCartItems,
        checkoutID: cartID,
        country: countryCode,
      },
    });
  };

  let removeSelectedItem = async (variantID) => {
    if (replaceLoading) {
      return;
    }
    shoppingCartItems = cartData.lineItems
      .filter((item) => item.variantID !== variantID)
      .map(({ variantID, quantity }) => {
        return { variantId: variantID, quantity };
      });
    await shoppingCartReplaceItems({
      variables: {
        lineItems: shoppingCartItems,
        checkoutID: cartID,
        country: countryCode,
      },
    });
    setShoppingCart({ variables: { items: shoppingCartItems, id: cartID } });
    showToast(1100);
  };

  let associateCustomerWithCart = async (id) => {
    if (authToken) {
      await shoppingCartCustomerAssociate({
        variables: { checkoutId: id, customerAccessToken: authToken },
      });
    }
  };

  let { refetch, loading: getCartLoading } = useGetCart({
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
    onCompleted: async ({ shoppingCart }) => {
      setCartID(shoppingCart?.id);
      if (shoppingCart?.id === "") {
        createCheckout();
      } else {
        shoppingCartItems = shoppingCart.items.map(
          ({ variantId, quantity }) => {
            return { variantId, quantity };
          }
        );
        await shoppingCartDiscountRemove({
          variables: { checkoutId: shoppingCart.id },
        });
        await shoppingCartReplaceItems({
          variables: {
            checkoutID: shoppingCart.id,
            lineItems: shoppingCartItems,
            country: countryCode,
          },
        });
      }
    },
    onError: () => {
      setFirstLoading(false);
    },
  });

  let { setShoppingCart } = useSetShoppingCart();
  let { setShoppingCartID } = useSetShoppingCartID();

  let {
    shoppingCartReplaceItems,
    loading: replaceLoading,
    error: replaceError,
  } = useCheckoutReplaceItem({
    language: i18n.language.toUpperCase(),
    fetchPolicy: "no-cache",
    onCompleted: async ({ checkoutLineItemsReplace }) => {
      if (checkoutLineItemsReplace && checkoutLineItemsReplace.checkout) {
        let shoppingCartItems =
          checkoutLineItemsReplace.checkout.lineItems.edges.map(({ node }) => {
            let { variant, quantity } = node;
            let variantId = variant ? variant.id : "";
            return {
              quantity,
              variantId,
            };
          });

        if (checkoutLineItemsReplace.checkout.currencyCode !== currencyCode) {
          await createCheckout({
            variables: {
              checkoutCreateInput: {
                lineItems: shoppingCartItems,
              },
              country: countryCode,
            },
          });
          return;
        }
        setCartData(extractDataCheckout(checkoutLineItemsReplace.checkout));
        setFirstLoading(false);
      }
    },
    onError: () => {
      setFirstLoading(false);
    },
  });

  let { shoppingCartCustomerAssociate } = useCheckoutCustomerAssociate();

  let {
    createCheckout,
    error: checkoutCreateError,
    loading: checkoutCreateLoading,
  } = useCheckoutCreate({
    variables: {
      checkoutCreateInput: { lineItems: shoppingCartItems },
      country: countryCode,
      language: i18n.language.toUpperCase(),
    },
    onCompleted: async ({ checkoutCreate }) => {
      if (checkoutCreate && checkoutCreate.checkout) {
        let { id } = checkoutCreate.checkout;
        setCartID(id);
        await associateCustomerWithCart(id);
        setCartData(extractDataCheckout(checkoutCreate.checkout));
        await setShoppingCartID({
          variables: { id },
        });
        setFirstLoading(false);
      }
    },
    onError: () => {
      setFirstLoading(false);
    },
  });

  let renderCartView = () => {
    return mapLineItemsToOrder(
      cartData.lineItems,
      changeItemQuantity,
      removeSelectedItem
    ).map((item, index) => {
      return (
        <OrderItem
          cardType="checkout"
          orderItem={item}
          containerStyle={[styles.orderItem, index > 0 && styles.border]}
          key={item.variantID}
        />
      );
    });
  };

  let renderPaymentView = () => (
    <ShoppingCartPayment
      data={paymentData}
      onVoucherCodeChange={setVoucherCodeValue}
      voucherCode={voucherCode}
      onAddCode={onAddVoucherCode}
      applyLoading={DiscountCodeApplyLoading}
      isVoucherCodeValid={isVoucherCodeValid}
    />
  );

  if (
    firstLoading ||
    getCartLoading ||
    checkoutCreateLoading ||
    replaceLoading
  ) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator />
      </SafeAreaView>
    );
  }

  if (checkoutCreateError || discountError || replaceError) {
    return (
      <ErrorPage
        onRetry={() => {
          refetch();
          setFirstLoading(true);
        }}
      />
    );
  }

  if (cartData.lineItems.length <= 0) {
    return (
      <SafeAreaView style={styles.flex}>
        <View style={styles.center}>
          <Image
            source={cartPlaceholder}
            width={100}
            height={100}
            style={styles.emptyCartImage}
          />
          <Text style={styles.opacity}>
            {t(
              "ShoppingCartScene.Shopping cart is empty. Please add item to the cart."
            )}
          </Text>
        </View>
        <View
          style={
            screenSize === ScreenSize.Small
              ? styles.scrollContentSmall
              : styles.scrollContentMedium
          }
        >
          <BottomButton
            label={t("ShoppingCartScene.Back To Home")}
            onPressAction={() => navigate("Home")}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <>
      {screenSize === ScreenSize.Large ? (
        <KeyboardAvoidingView style={styles.horizontalLayout}>
          <ScrollView
            style={styles.flex}
            contentContainerStyle={styles.horizontalCart}
            contentInsetAdjustmentBehavior="automatic"
          >
            {renderCartView()}
          </ScrollView>
          <View style={styles.horizontalPaymentView}>
            {renderPaymentView()}
            <BottomButton
              label={t("ShoppingCartScene.Checkout")}
              onPressAction={() => navigate("Checkout", { cartData })}
            />
          </View>
        </KeyboardAvoidingView>
      ) : (
        <KeyboardAvoidingView style={styles.flex}>
          <ScrollView
            style={styles.flex}
            contentContainerStyle={[
              screenSize === ScreenSize.Small
                ? styles.scrollContentSmall
                : styles.scrollContentMedium,
              styles.flexGrow,
            ]}
          >
            {renderCartView()}
            <View style={styles.verticalPaymentView}>
              {renderPaymentView()}
              <BottomButton
                label={t("ShoppingCartScene.Checkout")}
                onPressAction={() => navigate("Checkout", { cartData })}
              />
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      )}
      <Toast
        data={{
          message: t("ShoppingCartScene.Item successfully removed"),
          isVisible: isToastVisible,
          hideToast,
        }}
      />
    </>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  flexGrow: {
    flexGrow: 1,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  opacity: {
    opacity: 0.6,
  },
  horizontalLayout: {
    flexDirection: "row",
    marginHorizontal: 36,
  },
  horizontalCart: {
    marginRight: 24,
  },
  horizontalPaymentView: {
    flex: 1,
    paddingTop: 24,
  },
  scrollContentSmall: {
    paddingHorizontal: 24,
  },
  scrollContentMedium: {
    paddingHorizontal: 36,
    paddingBottom: 24,
  },
  border: {
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGrey,
  },
  verticalPaymentView: {
    justifyContent: "flex-end",
    flex: 1,
  },
  emptyCartImage: {
    maxWidth: 360,
    maxHeight: 270,
    marginBottom: 24,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  orderItem: {
    paddingVertical: 24,
  },
});
