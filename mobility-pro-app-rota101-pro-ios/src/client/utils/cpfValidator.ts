const calculateCheckDigit = (cpf: string, length: number): number => {
  let sum = 0;
  for (let i = 0; i < length; i++) {
    sum += parseInt(cpf.charAt(i), 10) * (length + 1 - i);
  }
  const remainder = (sum * 10) % 11;
  return remainder === 10 ? 0 : remainder;
};

export const validateCPF = (cpf: string): boolean => {
  const cleanCPF = cpf.replace(/\D/g, '');

  if (cleanCPF.length !== 11 || /^(\d)\1{10}$/.test(cleanCPF)) {
    return false;
  }

  const firstDigit = parseInt(cleanCPF.charAt(9), 10);
  if (calculateCheckDigit(cleanCPF, 9) !== firstDigit) {
    return false;
  }

  const secondDigit = parseInt(cleanCPF.charAt(10), 10);
  if (calculateCheckDigit(cleanCPF, 10) !== secondDigit) {
    return false;
  }

  return true;
};
