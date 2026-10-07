const onlyDigits = (value = '') => value.replace(/\D/g, '');

/** Máscara progressiva de CPF/CNPJ — CPF até 11 dígitos, vira CNPJ a partir do 12º. */
export function maskCpfCnpj(value = ''): string {
  const digits = onlyDigits(value).slice(0, 14);

  if (digits.length <= 11) {
    return digits
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d)/, '$1.$2')
      .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
  }

  return digits
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d{1,2})$/, '$1-$2');
}

export const unmaskDocument = onlyDigits;
