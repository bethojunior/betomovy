export const maskString = (value: string, pattern: string) => {
  if (!value || !pattern) {
    return '--';
  }
  let i = 0;
  const v = value.toString();
  return pattern.replace(/#/g, _ => v[i++]).replace(/undefined/g, '');
};

export const maskCpf = (value: string): string => {
  if (!value) return '';
  const d = value.replace(/\D/g, '').slice(0, 11);
  const n = d.length;
  if (n <= 3) return d;
  if (n <= 6) return `${d.slice(0, 3)}.${d.slice(3)}`;
  if (n <= 9) return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6)}`;
  return `${d.slice(0, 3)}.${d.slice(3, 6)}.${d.slice(6, 9)}-${d.slice(9)}`;
};
export const maskPhone = (value: string): string => {
  if (!value) return '';
  const d = value.replace(/\D/g, '').slice(0, 11);
  const n = d.length;

  if (n === 0) return '';
  if (n <= 2) return `(${d}`;
  if (n <= 6) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  if (n <= 10) return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
};

export const removeAllMask = (value: string) => {
  if (!value) {
    return '';
  }
  return value.replace(/\D/g, '');
};

export const cpfMask = (text: string) => {
  let cleanedText = text.replace(/\D/g, '');

  let maskedText = '';
  for (let i = 0; i < cleanedText.length; i++) {
    if (i === 3 || i === 6) {
      maskedText += '.';
    }
    if (i === 9) {
      maskedText += '-';
    }
    if (i === 11) {
      break;
    }
    maskedText += cleanedText[i];
  }

  return maskedText;
};
