const onlyDigits = (value = '') => value.replace(/\D/g, '');

/** Máscara de documento (SSN / ITIN americano com 9 dígitos ou documento bancário). */
export function maskCpfCnpj(value = ''): string {
  const digits = onlyDigits(value).slice(0, 14);

  // SSN / ITIN americano (9 dígitos: 000-00-0000)
  if (digits.length <= 9) {
    if (digits.length <= 3) return digits;
    if (digits.length <= 5) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5, 9)}`;
  }

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
