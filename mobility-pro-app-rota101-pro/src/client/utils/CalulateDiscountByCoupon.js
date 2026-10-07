export function verifyCardOnCoupon(selectedOptionTravel, selectedCoupon) {
  return (
    parseFloat(String(selectedOptionTravel.price)) >=
      parseFloat(selectedCoupon.fromValue) &&
    parseFloat(String(selectedOptionTravel.price)) <=
      parseFloat(selectedCoupon.limitedTo)
  );
}

export function changePriceByDiscount(price, coupon, selectedOptionTravel) {
  if (verifyCardOnCoupon(selectedOptionTravel, coupon)) {
    return calculateDiscountByCoupon(price, coupon);
  }
  return price || selectedOptionTravel.price;
}

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

/** Valor efetivo do desconto (preço original - preço com cupom), sempre consistente com calculateDiscountByCoupon. */
export function calculateDiscountAmount(price, coupon) {
  return price - calculateDiscountByCoupon(price, coupon);
}