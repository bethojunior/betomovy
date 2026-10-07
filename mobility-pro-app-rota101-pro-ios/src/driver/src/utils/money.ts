export function convertMoney(number: string) {
  const amount = Number(number).toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });

  return amount;
}

export function getCoinType() {
  return 'R$';
}

export function coinTypePerApi(coin) {
  return coin;
}

export function moneyMask(value) {
  if (!value || value === undefined || value === Infinity) {
    return '0,00';
  }

  let isNegative = false;
  if (value < 0) {
    value *= -1;
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
export function maskMoney(value) {
  let number = value;
  number = number.toFixed(2).split('.');
  number[0] = number[0].split(/(?=(?:...)*$)/).join('.');
  return number.join(',');
}

export const diferenceBetweenNumber = (val1: number, val2: number) => {
  // retorna o numero positivo
  const diff = val1 - val2;
  return Math.abs(diff);
};
