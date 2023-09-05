import { getDiscount } from "./getDiscount";

export default function mapToProducts(products) {
  return products.edges.map((item) => {
    let product = item.node;
    let firstImage = product.images.edges[0];
    let quantityAvailable =
      product.variants.edges[0].node.quantityAvailable ?? 0;
    let originalProductPrice = Number(
      product.variants.edges[0].node.compareAtPriceV2?.amount
    );

    let productPrice = Number(product.variants.edges[0].node.priceV2.amount);

    let { price, discount } = getDiscount(originalProductPrice, productPrice);

    return {
      id: product.id,
      cursor: item.cursor,
      images: [firstImage ? firstImage.node.transformedSrc : ""],
      title: product.title,
      productType: product.productType,
      price: price,
      discount: discount,
      handle: product.handle,
      availableForSale: product.availableForSale,
      quantityAvailable,
    };
  });
}
