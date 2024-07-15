export default function calculateDiscountAndPrice(originalPrice = 0, discountPercentage = 0) {
  originalPrice = Number(originalPrice);
  discountPercentage = Number(discountPercentage);

  if (discountPercentage > 100) {
    discountPercentage = 100;
  }

  const discountAmount = originalPrice * (discountPercentage / 100);
  const priceAfterDiscount = originalPrice - discountAmount;

  return { priceAfterDiscount, discountAmount };
}
