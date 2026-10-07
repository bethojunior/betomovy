const formatedCPF = (cpf: string) => {
  const cpfWithoutPoints = cpf.replaceAll(".", "");
  const cpfFormated = cpfWithoutPoints.replace("-", "");

  return cpfFormated;
};

function onlyDigits(value: string) {
  return value.replace(/\D/g, '');
}

export const validatorCpf = (cpf: string) => {
  const val = cpf.replace(/\D/g, '');

  if (val.length === 11) {
    if (/^(\d)\1{10}$/.test(val)) return false;
    
    let sum = 0;
    let rest: number;

    for (let i = 1; i <= 9; i++)
      sum += Number(val[i - 1]) * (11 - i);

    rest = (sum * 10) % 11;
    if (rest === 10 || rest === 11) rest = 0;
    if (rest !== Number(val[9])) return false;

    sum = 0;
    for (let i = 1; i <= 10; i++)
      sum += Number(val[i - 1]) * (12 - i);

    rest = (sum * 10) % 11;
    if (rest === 10 || rest === 11) rest = 0;
    if (rest !== Number(val[10])) return false;

    return true;
  }

  if (val.length === 14) {
    if (/^(\d)\1{13}$/.test(val)) return false;

    let length = val.length - 2;
    let numbers = val.substring(0, length);
    let digits = val.substring(length);
    let sum = 0;
    let pos = length - 7;

    for (let i = length; i >= 1; i--) {
      sum += Number(numbers.charAt(length - i)) * pos--;
      if (pos < 2) pos = 9;
    }

    let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (result !== Number(digits.charAt(0))) return false;

    length = length + 1;
    numbers = val.substring(0, length);
    sum = 0;
    pos = length - 7;

    for (let i = length; i >= 1; i--) {
      sum += Number(numbers.charAt(length - i)) * pos--;
      if (pos < 2) pos = 9;
    }

    result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
    if (result !== Number(digits.charAt(1))) return false;

    return true;
  }

  return false;
};

