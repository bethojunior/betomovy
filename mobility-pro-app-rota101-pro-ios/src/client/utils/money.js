export function getCoinType() {
  return 'R$';
}

export function coinTypePerApi(coin) {
  return coin;
}

export function maskMoney(value) {
  if (!value || value == 0 || value === undefined || value === Infinity) {
    return '0,00';
  }

  let isNegative = false;
  if (value < 0) {
    value = value * -1;
    isNegative = true;
  }
  if (value === 0) return '0,00';

  let number = value.toFixed(4).split('.');

  number = parseFloat(`${number[0]}.${number[1].slice(0, 2)}`);

  number = number.toFixed(2).split('.');
  number[0] = number[0].split(/(?=(?:...)*$)/).join('.');

  if (isNegative) return `-${number.join(',')}`;

  return number.join(',');
}

// mask Money with new intl
export function maskMoneyIntl(value) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);
}

export function formatPrice(
  offerInDriver,
  selectedOptionTravel,
  item,
  cityConfig,
  turbined
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
