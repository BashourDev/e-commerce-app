export function priceAfterDiscount(itemPrice, discountPercent) {
  let discountDecimal = Math.min(Math.max(discountPercent, 0), 100) / 100;
  return itemPrice * (1 - discountDecimal);
}
