import React, { useEffect, useState } from "react";
import {
  SafeAreaView,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { ActivityIndicator } from "react-native-paper";

import { useNavigation } from "@react-navigation/native";

import { ErrorPage, ProductList, SearchModal } from "../components";
import { COLORS } from "../constants/colors";
import { Carousel, CategoryList, SearchInput, Text } from "../core-ui";
// import { carouselData } from '../fixtures/carousel';
import { useColumns } from "../helpers/columns";
import { ScreenSize, useDimensions } from "../helpers/dimensions";
import { NetworkStateEnum, useNetwork } from "../helpers/useNetwork";
import { useProductsAndCategoriesQuery } from "../hooks/api/useCollection";
import useDefaultCountry from "../hooks/api/useDefaultCountry";
import { useTranslation } from "react-i18next";
import Footer from "../components/Footer";
import CategoryProducts from "../components/CategoryProducts";
import WebView from "react-native-webview";

export default function HomeScene() {
  let { navigate } = useNavigation();
  let { screenSize } = useDimensions();
  let numColumns = useColumns();
  let first = numColumns * 6;
  let { isConnected } = useNetwork();
  let [isSearchModalVisible, setSearchModalVisible] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const { t, i18n } = useTranslation();
  let {
    data: { countryCode },
    loading: loadingCountryCode,
  } = useDefaultCountry();

  let {
    loading: loadingHomeData,
    products,
    categories,
    refetch,
    hasMore,
    isFetchingMore,
    error,
  } = useProductsAndCategoriesQuery(first, i18n.language.toUpperCase());

  useEffect(() => {
    refetch("update", {
      first,
      after: null,
      country: countryCode,
      language: i18n.language.toUpperCase(),
    });
  }, [countryCode, i18n.language]); // eslint-disable-line react-hooks/exhaustive-deps

  let onItemPress = (product) => {
    navigate("ProductDetails", { productHandle: product.handle });
  };
  let onSubmit = (searchKeyword) => {
    navigate("SearchResults", {
      searchKeyword,
    });
  };

  let onProductsEndReached = () => {
    if (!isFetchingMore && hasMore) {
      refetch("scroll", {
        first,
        after: products[products.length - 1].cursor || null,
        country: countryCode,
        language: i18n.language.toUpperCase(),
      });
    }
  };

  if (isConnected === NetworkStateEnum.NOT_CONNECTED || error) {
    return (
      <ErrorPage
        onRetry={() =>
          refetch("update", {
            first,
            after: null,
            country: countryCode,
            language: i18n.language.toUpperCase(),
          })
        }
      />
    );
  }

  if ((loadingHomeData || loadingCountryCode || !products) && !isFetchingMore) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator />
      </View>
    );
  }

  let renderHeaderComponent = () => (
    <View style={{ marginBottom: 10 }}>
      {/* <Carousel
        data={carouselData}
        height={screenSize === ScreenSize.Small ? 180 : 384}
      /> */}

      <View>
        <Text
          style={[
            styles.subTitle,
            { textAlign: i18n.language === "en" ? "left" : "right" },
          ]}
        >
          {t("HomeScene.Browse By Category")}
        </Text>
        <CategoryList
          categories={categories}
          onSelect={(collection) => {
            navigate("ProductCollection", {
              collection,
            });
          }}
        />
      </View>
      {/* <Text
        style={[
          styles.subTitle,
          { textAlign: i18n.language === "en" ? "left" : "right" },
        ]}
      >
        {t("HomeScene.Featured Products")}
      </Text> */}
    </View>
  );

  return (
    <View style={styles.flex}>
      <TouchableOpacity
        onPress={() => setSearchModalVisible(true)}
        activeOpacity={1}
      >
        <View style={styles.searchInputContainer}>
          <SearchInput
            pointerEvents="none"
            placeholder={t("HomeScene.Search")}
            editable={false}
            style={styles.searchInput}
            iStyle={i18n.language !== "en" ? styles.searchInputFieldArabic : ""}
          />
        </View>
      </TouchableOpacity>
      <SearchModal
        onItemPress={onItemPress}
        onSubmit={onSubmit}
        isVisible={isSearchModalVisible}
        setVisible={setSearchModalVisible}
      />

      <ScrollView>
        <SafeAreaView style={[{ flex: 1 }, !loaded && { display: "none" }]}>
          <WebView
            javaScriptEnabled
            style={[{ minHeight: 630 }]}
            source={{
              uri: `https://sabahstyle.com/${
                i18n.language === "ar" ? "ar/" : ""
              }`,
            }}
            originWhitelist={["*"]}
            onLoad={() => setLoaded(true)}
            injectedJavaScript={`
                // remove all elements but MAIN from the body
                let bodyChildren = document.getElementsByTagName("body")[0].children;
                while(bodyChildren.length > 1){
                    for(let i = 0; i < bodyChildren.length; i++){
                        if(bodyChildren[i].tagName !== "MAIN") bodyChildren[i].remove();
                    }
                    bodyChildren = document.getElementsByTagName("body")[0].children;
                }

                // find the section to keep
                let currentDocument = document.getElementsByTagName("slideshow-component")[0];
                let keepId = "";
                let count = 0;
                while(keepId === "" && count < 100){
                  currentDocument = currentDocument.parentElement;
                  if(currentDocument && currentDocument.tagName === 'SECTION'){
                    keepId = currentDocument.id;
                  }
                  count++;
                }

                // remove all but the required sections from main's children
                let mainChildren = document.getElementsByTagName("main")[0].children;
                while(mainChildren.length > 1){
                    for(let i = 0; i < mainChildren.length; i++){
                        if(mainChildren[i].id !== keepId) mainChildren[i].remove();
                    }
                    mainChildren = document.getElementsByTagName("main")[0].children;
                }

                // remove all <a> tags
                let aTags = document.getElementsByTagName("a");
                while(aTags.length > 0){
                    for(let i = 0; i < aTags.length; i++){
                        aTags[i].remove();
                    }
                    aTags = document.getElementsByTagName("a");
                }
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
              style={[
                { flex: 1, justifyContent: "flex-start", alignItems: "center" },
                { marginBottom: 24 },
              ]}
            />
          )}
        </SafeAreaView>
        {renderHeaderComponent()}
        <Text weight="bold" style={[styles.subTitle, { textAlign: "center" }]}>
          {t("HomeScene.Featured Products")}
        </Text>
        <ProductList
          data={products}
          onItemPress={onItemPress}
          onEndReached={onProductsEndReached}
          onEndReachedThreshold={0.25}
          ListFooterComponent={() => {
            return hasMore ? (
              <ActivityIndicator style={styles.activityIndicator} />
            ) : null;
          }}
        />
        {categories.map((category) => (
          <CategoryProducts
            key={category.id}
            collectionHandleProp={category.handle}
            collectionTitle={category.title}
          />
        ))}
        <Footer />
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: COLORS.white,
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.white,
  },
  subTitle: {
    marginTop: 16,
    marginBottom: 12,
    marginHorizontal: 24,
  },
  itemWrapperStyle: {
    marginHorizontal: 12,
  },
  searchInputContainer: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.lightGrey,
    flexDirection: "row",
    alignItems: "center",
  },
  searchInput: {
    flex: 1,
    marginHorizontal: 24,
    marginTop: 8,
    marginBottom: 16,
  },
  searchInputFieldArabic: {
    textAlign: "right",
  },
  activityIndicator: {
    marginVertical: 24,
  },
});
