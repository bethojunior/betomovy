export function calculateDiscountByCoupon(price, coupon) {
  let discount = 0;
  if (coupon.valueType === '%') {
    discount = price * (parseFloat(coupon.value) / 100);
    if (discount > parseFloat(coupon.maxDiscountValue))
      discount = parseFloat(coupon.maxDiscountValue);
  } else {
    discount = coupon.value;
  }

  if (discount >= parseFloat(coupon.limitedTo))
    discount = parseFloat(coupon.limitedTo);

  const newValue = price - discount;

  if (newValue <= 0) return 0;

  return newValue;
}