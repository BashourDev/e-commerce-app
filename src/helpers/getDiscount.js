export function getDiscount(originalProductPrice, productPrice) {
  let isOriginalPrice = originalProductPrice && originalProductPrice > 0;
  let price = isOriginalPrice ? originalProductPrice : productPrice;
  let discount = 0;

  if (isOriginalPrice) {
    discount =
      ((originalProductPrice - productPrice) / originalProductPrice) * 100;
  }

  return { price, discount };
}
