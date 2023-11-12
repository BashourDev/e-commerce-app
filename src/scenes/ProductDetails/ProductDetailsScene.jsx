import React, { useCallback, useEffect, useState } from "react";
import {
  Linking,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  View,
} from "react-native";
import { ActivityIndicator } from "react-native-paper";

import { useFocusEffect, useRoute } from "@react-navigation/native";

import { ErrorPage } from "../../components";
import { COLORS } from "../../constants/colors";
import { Button, KeyboardAvoidingView, Text, Toast } from "../../core-ui";
import { ScreenSize, useDimensions } from "../../helpers/dimensions";
import { useAuth } from "../../helpers/useAuth";
import { useGetCustomerData } from "../../hooks/api/useCustomer";
import useDefaultCountry from "../../hooks/api/useDefaultCountry";
import { useGetProductDetails } from "../../hooks/api/useProduct";
import {
  useCheckoutCreate,
  useCheckoutCustomerAssociate,
  useCheckoutReplaceItem,
} from "../../hooks/api/useShopifyCart";
import {
  useAddToCart,
  useGetCart,
  useSetShoppingCartID,
} from "../../hooks/api/useShoppingCart";
import { useGetWishlistData } from "../../hooks/api/useWishlist";

import {
  BottomActionBar,
  ImageList,
  ImageModal,
  ProductInfo,
} from "./components";

import { useTranslation } from "react-i18next";
import { useGetProductDetailsEnglish } from "../../hooks/api/useProductEnglish";
import WebView from "react-native-webview";

export default function ProductDetailsScene() {
  let {
    params: { productHandle },
  } = useRoute();
  const { t, i18n } = useTranslation();

  let [isToastVisible, setIsToastVisible] = useState(false);
  let [isWishlistActive, setWishlistActive] = useState(false);
  let [quantity, setQuantity] = useState(1);
  let [selectedOptions, setSelectedOptions] = useState({});
  let [isImageModalVisible, setIsImageModalVisible] = useState(false);
  let [activeIndex, setActiveIndex] = useState(0);
  let [bottomButtonHeight, setBottomButtonHeight] = useState(0);
  const [loaded, setLoaded] = useState(false);
  let { authToken } = useAuth();
  let { setShoppingCartID } = useSetShoppingCartID();
  let { shoppingCartCustomerAssociate } = useCheckoutCustomerAssociate();
  let {
    data: { countryCode },
  } = useDefaultCountry();

  let onPressImage = (index) => {
    setIsImageModalVisible(!isImageModalVisible);
    setActiveIndex(index);
  };

  let { createCheckout } = useCheckoutCreate({
    onCompleted: async ({ checkoutCreate }) => {
      if (checkoutCreate && checkoutCreate.checkout) {
        await setShoppingCartID({
          variables: { id: checkoutCreate.checkout.id },
        });
        if (authToken) {
          await shoppingCartCustomerAssociate({
            variables: {
              checkoutId: checkoutCreate.checkout.id,
              customerAccessToken: authToken,
            },
          });
        }
      }
    },
    language: i18n.language.toUpperCase(),
  });

  let { getCustomer } = useGetCustomerData({
    onCompleted: async ({ customer }) => {
      if (customer && customer.lastIncompleteCheckout == null) {
        await createCheckout({
          variables: {
            checkoutCreateInput: {
              lineItems: [],
            },
            country: countryCode,
          },
        });
      }
    },
  });

  useFocusEffect(
    useCallback(() => {
      if (authToken) {
        getCustomer({ variables: { accessToken: authToken } });
      }
      return undefined;
    }, []) // eslint-disable-line react-hooks/exhaustive-deps
  );
  useGetCart({
    fetchPolicy: "cache-only",
    notifyOnNetworkStatusChange: true,
    onCompleted: async ({ shoppingCart }) => {
      if (shoppingCart.id === "") {
        createCheckout({
          variables: {
            checkoutCreateInput: {
              lineItems: [],
            },
            country: countryCode,
          },
        });
      }
    },
  });
  let showToast = (duration) => {
    setIsToastVisible(true);
    setTimeout(() => {
      setIsToastVisible(false);
    }, duration);
  };

  let hideToast = () => {
    setIsToastVisible(false);
  };

  let extractOptionsData = (optionsData) => {
    let result = [];

    for (let option in optionsData) {
      if (option) {
        let processedForm = {
          name: option,
          value: optionsData[option],
        };
        result.push(processedForm);
      }
    }
    return result;
  };

  let changeSelectedOptions = (key, value) => {
    setSelectedOptions({ ...selectedOptions, [key]: value });
  };

  let { shoppingCartReplaceItems, loading: shoppingCartLoading } =
    useCheckoutReplaceItem(i18n.language.toUpperCase());

  let { addToCart, loading: addToCartLoading } = useAddToCart({
    onCompleted: async ({ addToShoppingCart }) => {
      let shoppingCartItems = addToShoppingCart.items.map(
        ({ variantId, quantity }) => {
          return { variantId, quantity };
        }
      );
      await shoppingCartReplaceItems({
        variables: {
          checkoutID: addToShoppingCart.id,
          lineItems: shoppingCartItems,
          country: countryCode,
        },
      });
      showToast(11000);
    },
  });

  let {
    getVariant,
    data: productDetails,
    loading: getProductDetailsLoading,
    error: getProductDetailsError,
    refetch: getProductDetailsRefetch,
  } = useGetProductDetails({
    variables: {
      productHandle,
      country: countryCode,
      language: i18n.language.toUpperCase(),
    },
    fetchPolicy: "no-cache",

    // onCompleted(value) {
    //   let defaultOptions = {};
    //   value.productByHandle?.options.map(({ name, values }) => {
    //     return (defaultOptions[name] = values[0]);
    //   });
    //   setSelectedOptions(defaultOptions);
    // },
  });
  let {
    data: productDetailsEnglish,
    loading: getProductDetailsLoadingEnglish,
    error: getProductDetailsErrorEnglish,
    refetch: getProductDetailsRefetchEnglish,
  } = useGetProductDetailsEnglish({
    variables: {
      productHandle,
      country: countryCode,
      // language: "EN",
    },
    fetchPolicy: "no-cache",

    onCompleted(value) {
      let defaultOptions = {};
      value.productByHandle?.options.map(({ name, values }) => {
        return (defaultOptions[name] = values[0]);
      });
      setSelectedOptions(defaultOptions);
    },
  });
  useEffect(() => {
    let queryVariantID = extractOptionsData(selectedOptions);
    getVariant({
      variables: {
        selectedOptions: queryVariantID,
        handle: productHandle,
        country: countryCode,
        language: i18n.language.toUpperCase(),
      },
    });
  }, [selectedOptions, getVariant]); // eslint-disable-line react-hooks/exhaustive-deps

  let isLoading =
    getProductDetailsLoading ||
    addToCartLoading ||
    shoppingCartLoading ||
    getProductDetailsLoadingEnglish;

  let { data: wishlistData } = useGetWishlistData({
    onCompleted: ({ wishlist }) => {
      if (wishlist.find((item) => item.handle === productHandle)) {
        setWishlistActive(true);
      }
    },
  });
  let onAddToCart = async () => {
    addToCart({ variables: { variantId: productDetails.id, quantity } });
  };

  let isFirstLoading = !wishlistData || !productDetails.id;

  let { screenSize } = useDimensions();
  let isLandscape = screenSize === ScreenSize.Large;
  if (getProductDetailsError) {
    return <ErrorPage onRetry={getProductDetailsRefetch} />;
  }

  return isFirstLoading && isLoading ? (
    <ActivityIndicator style={styles.centered} />
  ) : (
    <KeyboardAvoidingView keyboardVerticalOffset={bottomButtonHeight}>
      <View
        style={[
          styles.flex,
          isLandscape && styles.flexRow,
          // { direction: t("dir") },
        ]}
      >
        {isLandscape && (
          <ImageList product={productDetails} onImagePress={onPressImage} />
        )}
        <View style={styles.flex}>
          <ScrollView style={styles.flex} overScrollMode="never">
            {!isLandscape && (
              <ImageList product={productDetails} onImagePress={onPressImage} />
            )}
            <ProductInfo
              selectedOptions={selectedOptions}
              onSelectionOptionChange={changeSelectedOptions}
              quantity={quantity}
              onChangeQuantity={setQuantity}
              product={productDetails}
              options={productDetails.options ? productDetails.options : []}
              optionsOriginal={
                getProductDetailsLoadingEnglish
                  ? []
                  : productDetailsEnglish.productByHandle.options
              }
            />

            {/* A button that opens the product's page in the browser to write a review */}
            {/* <Button
              style={[styles.flex]}
              disabled={false}
              loading={false}
              onPress={() => {
                Linking.openURL(
                  "https://sabahstyle.com/products/" + productHandle
                );
              }}
            >
              {"Rate this product"}
            </Button> */}

            {/* the webview that only displays the review section */}
            <SafeAreaView style={[styles.flex, !loaded && { display: "none" }]}>
              <WebView
                javaScriptEnabled
                nestedScrollEnabled
                scrollEnabled
                style={[styles.container, { minHeight: 350 }]}
                source={{
                  uri: `https://sabahstyle.com/${
                    i18n.language === "ar" ? "ar/" : ""
                  }products/${productHandle}`,
                }}
                originWhitelist={["*"]}
                onLoad={() => setLoaded(true)}
                injectedJavaScript={`
                // find the section to keep
                let currentDocument = document.getElementById("judgeme_product_reviews");
                let keepId = "";
                let count = 0;
                while(keepId === "" && count < 10){
                  currentDocument = currentDocument.parentElement;
                  if(currentDocument.tagName === 'SECTION'){
                    keepId = currentDocument.id;
                  }
                  count++;
                }

                // remove other sections
                let sections = document.getElementsByTagName("section");
                for(let i=0; i< sections.length; i++){
                  if(sections[i].id !== keepId){
                    sections[i].remove()
                  }
                }

                // check if the body has children other than (main, links, scripts and styles)
                let count2 = 0;
                let shouldKeepLooping = ()=>{
                  let children = document.getElementsByTagName("body")[0].children;
                  for(let i=0; i < children.length; i++){
                    if(count2 < 10 && children[i].tagName !== "MAIN" && children[i].tagName !== "LINK" && children[i].tagName !== "SCRIPT" && children[i].tagName !== "STYLE"){

                      return true;
                    }
                    return false;
                  }
                }

                // remove elements which are not (main, links, scripts and styles)
                while(shouldKeepLooping()){
                  let bodyChildren = document.getElementsByTagName("body")[0].children;
                  for(let i=0; i < bodyChildren.length; i++){
                    if(bodyChildren[i].tagName !== "MAIN" && bodyChildren[i].tagName !== "LINK" && bodyChildren[i].tagName !== "SCRIPT" && bodyChildren[i].tagName !== "STYLE"){

                      bodyChildren[i].remove();
                    }
                  }
                }

                // missing style link (should be added automatically, keep commented for now)
                // let linkElement = document.createElement("LINK");
                // linkElement.rel = "stylesheet";
                // linkElement.setAttribute('class','jdgm-stylesheet');
                // linkElement.media = "all";
                // linkElement.href = "https://cdn.judge.me/widget_v3/form.css";
                // document.getElementsByTagName("body")[0].appendChild(linkElement);

                // styling the background of the review section
                document.getElementsByTagName("body")[0].style = "background-color:#FFFFFF;"
                document.getElementsByTagName("body")[0].setAttribute('class','');
                `}
                // startInLoadingState={true}
                // renderLoading={() => (
                //   <ActivityIndicator style={styles.center} />
                // )}
              />
            </SafeAreaView>
            <SafeAreaView>
              {!loaded && (
                <ActivityIndicator
                  style={[styles.center, { marginBottom: 24 }]}
                />
              )}
            </SafeAreaView>
          </ScrollView>
          <View
            style={[
              styles.bottomContainer,
              isLandscape && styles.bottomLandscapeContainer,
            ]}
            onLayout={({ nativeEvent }) =>
              setBottomButtonHeight(nativeEvent.layout.height)
            }
          >
            <BottomActionBar
              isButtonDisabled={!productDetails.availableForSale}
              onAddToCartPress={onAddToCart}
              product={productDetails}
              isLoading={isLoading}
              isWishlistActive={isWishlistActive}
              onWishlistPress={(isActive) => {
                setWishlistActive(isActive);
              }}
            />
          </View>
        </View>
      </View>
      <Toast
        data={{
          message: t("ProductDetailsScene.Item successfully added"),
          isVisible: isToastVisible,
          hideToast,
        }}
      />
      <ImageModal
        activeIndex={activeIndex}
        images={productDetails.images}
        isVisible={isImageModalVisible}
        setVisible={setIsImageModalVisible}
      />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  flexRow: {
    flexDirection: "row",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  bottomContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderTopWidth: 1,
    borderTopColor: COLORS.lightGrey,
    marginBottom: 12,
  },
  bottomLandscapeContainer: {
    marginHorizontal: 36,
    marginBottom: 24,
  },
  container: {
    marginVertical: 24,
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
