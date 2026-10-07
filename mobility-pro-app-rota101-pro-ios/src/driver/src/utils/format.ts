export const maskString = (value: string, pattern: string) => {
  if (!value || !pattern) {
    return '--';
  }
  let i = 0;
  const v = value.toString();
  return pattern.replace(/#/g, _ => v[i++]).replace(/undefined/g, '');
};

export const maskCpf = (value: string) => {
  if (!value) {
    return '';
  }
  const v = value.replace(/\D/g, '');
  return maskString(v, '###.###.###-##');
};
export const maskPhone = (value: string) => {
  if (!value) {
    return '';
  }
  const v = value.replace(/\D/g, '');
  return maskString(v, '(##) #####-####');
};

export const removeAllMask = (value: string) => {
  if (!value) {
    return '';
  }
  return value.replace(/\D/g, '');
};
