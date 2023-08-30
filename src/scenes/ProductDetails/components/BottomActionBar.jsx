import React from "react";
import { Share, StyleSheet, View } from "react-native";
import { IconButton } from "react-native-paper";

import { useQuery } from "@apollo/client";

import { COLORS } from "../../../constants/colors";
import { defaultButton, defaultButtonLabel } from "../../../constants/theme";
import { Button } from "../../../core-ui";
import { GET_SHOP } from "../../../graphql/server/shop";
import {
  useAddItemToWishlist,
  useRemoveItemFromWishlist,
} from "../../../hooks/api/useWishlist";
import { t } from "../../../helpers/translate";

export default function BottomActionBar(props) {
  let { addToWishlist } = useAddItemToWishlist();
  let { removeFromWishlist } = useRemoveItemFromWishlist();
  let {
    isWishlistActive,
    onWishlistPress,
    onAddToCartPress,
    product,
    isLoading,
    isButtonDisabled,
  } = props;

  let { data: shopData } = useQuery(GET_SHOP);
  let shareMessage = shopData
    ? t("Check out this product from {shopName}", {
        shopName: shopData.shop.name,
      })
    : t("Check out this product");

  let onPressWishlist = () => {
    onWishlistPress(!isWishlistActive);

    if (isWishlistActive === false) {
      addToWishlist({ variables: { product } });
    } else {
      removeFromWishlist({ variables: { productHandle: product.handle } });
    }
  };

  let onShare = () => {
    Share.share({
      message: `${shareMessage}: ${product.title} ${product.url}`,
    });
  };

  let buttonLabel = () => {
    if (isLoading) {
      return null;
    }
    if (!product.id) {
      return t("Unavailable");
    }
    if (product.availableForSale) {
      return t("Add to Cart");
    }
    return t("Out of Stock");
  };

  let addButtonAction = !isLoading ? onAddToCartPress : () => {};

  return (
    <View style={styles.bottomIconContainer}>
      <IconButton
        icon="share-variant"
        color={COLORS.primaryColor}
        onPress={onShare}
        style={styles.icon}
      />
      {isWishlistActive ? (
        <IconButton
          icon="heart"
          color={COLORS.wishlist}
          onPress={onPressWishlist}
          style={styles.icon}
        />
      ) : (
        <IconButton
          icon="heart-outline"
          onPress={onPressWishlist}
          style={styles.icon}
        />
      )}
      <Button
        style={[
          defaultButton,
          styles.flex,
          isButtonDisabled && styles.disabledButton,
        ]}
        labelStyle={[
          defaultButtonLabel,
          isButtonDisabled && styles.disabledLabel,
        ]}
        disabled={isButtonDisabled}
        loading={isLoading}
        onPress={addButtonAction}
      >
        {buttonLabel()}
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  bottomIconContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  icon: {
    marginRight: 14,
  },
  disabledButton: {
    backgroundColor: COLORS.black,
    opacity: 0.2,
  },
  disabledLabel: {
    color: COLORS.white,
  },
});
