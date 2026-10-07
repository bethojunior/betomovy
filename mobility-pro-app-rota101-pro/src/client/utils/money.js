export function getCoinType() {
  return 'R$';
}

export function coinTypePerApi(coin) {
  return coin;
}

export function maskMoney(value = 0) {
  const num = Number(value);

  if (!Number.isFinite(num)) {
    return '0,00';
  }

  const isNegative = num < 0;
  const absValue = Math.abs(num);

  const [intPart, decPart] = absValue.toFixed(2).split('.');

  const formattedInt = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, '.');

  const result = `${formattedInt},${decPart}`;

  return isNegative ? `-${result}` : result;
}

// mask Money with new intl
export function maskMoneyIntl(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}
export function aplyDiscount(price, discount, discountType) {
  if (!discount || !discountType) return price;
  if (discountType === '%') {
    const percentage = parseFloat(discount);
    const discountValue = (price * percentage) / 100;
    return price - discountValue;
  } else if (discountType === '$') {
    const discountValue = parseFloat(discount);
    return price - discountValue;
  } else {
    return price;
  }
}

export function formatPrice(
  offerInDriver,
  selectedOptionTravel,
  item,
  cityConfig,
  turbined,
) {
  if (!item) return;
  const formattedPrice = coinTypePerApi(cityConfig?.typeMoney) + ' ';
  if (item?.turbinedPrice && turbined)
    return formattedPrice + maskMoney(parseFloat(item?.turbinedPrice));

  if (offerInDriver && selectedOptionTravel?.tripTypeId === item?.tripTypeId) {
    return formattedPrice + maskMoney(parseFloat(offerInDriver));
  }

  return formattedPrice + maskMoney(parseFloat(item?.price));
}
