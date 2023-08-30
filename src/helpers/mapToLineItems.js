function getEdges(i) {
  return i.edges;
}

export function mapToLineItems(lineItems) {
  return getEdges(lineItems).map(({ node }) => {
    let { quantity, title, variant } = node;
    let image = "";
    let priceAfterDiscount = 0;
    let originalPrice = 0;
    let variantID = "";
    let variants = "";
    let quantityAvailable = 0;
    if (variant) {
      let {
        id,
        selectedOptions,
        compareAtPriceV2,
        priceV2,
        quantityAvailable: stockAvailable,
      } = variant;
      quantityAvailable = stockAvailable ?? 0;
      let priceUsed = Number(priceV2.amount);
      let compareAtPriceUsed = Number(
        compareAtPriceV2 ? compareAtPriceV2.amount : 0
      );

      if (compareAtPriceV2) {
        priceAfterDiscount = compareAtPriceV2 ? priceUsed : 0;
        originalPrice = compareAtPriceUsed;
      } else {
        originalPrice = priceUsed;
      }

      variantID = id;
      let allVariants = selectedOptions.map(
        ({ name, value }) => `${name} ${value}`
      );
      variants = allVariants.join(", ");
      if (variant.image) {
        image = variant.image.transformedSrc;
      }
    }
    return {
      variant: variants,
      variantID,
      title,
      image,
      originalPrice,
      priceAfterDiscount,
      quantity,
      quantityAvailable,
    };
  });
}
