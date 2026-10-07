class Mask {
  static setMaskPhoneValue(value: string): string {
    let phone = String(value);
    phone = phone.replace(/\D/g, "");
    phone = phone.substr(0, 11);
    phone = phone.replace(/(\d{2})(\d{4,5})(\d{4})/g, "($1) $2-$3");
    return phone;
  }

  static setMaskOnlyNumber(value: string): string {
    let number = String(value);
    number = number.replace(/\D/g, "");
    return number;
  }

  static setMaskCpf(value: string): string {
    let cpf = value.replace(/\D/g, "");
    cpf = cpf.substr(0, 11);
    cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2");
    cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2");
    cpf = cpf.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    return cpf;
  }

  static setMoneyMask(val: string): string {
    if (!val) return "0000000000000";
    const num = parseFloat(val).toFixed(2);
    const parts = num.split(".");
    parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    return parts.join(",");
  }

  static setMaskCPFCNPJ(v: string): string {
    v = v.replace(/\D/g, "");
    v = v.substr(0, 14);
    if (v.length < 14) {
      v = v.replace(/(\d{3})(\d)/, "$1.$2");
      v = v.replace(/(\d{3})(\d)/, "$1.$2");
      v = v.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    } else {
      v = v.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})/, "$1.$2.$3/$4-$5");
    }
    return v;
  }

  static setMaskDate(value: string): string {
    let date = value.replace(/\D/g, "");
    date = date.substr(0, 8);
    if (date.length <= 2) return date;
    if (date.length <= 4) return date.replace(/(\d{2})(\d{1,2})/, "$1/$2");
    return date.replace(/(\d{2})(\d{2})(\d{1,4})/, "$1/$2/$3");
  }

  static setMaskPlateVehicle(value: string) {
    value = value.replace(/[^a-zA-Z0-9]/g, "");

    if (value.length <= 3) {
      return value.toUpperCase().replace(/[^A-Z]/g,"");
    } else if (value.length <= 7) {
      return `${value.slice(0, 3).toUpperCase()}-${value.slice(3).toLocaleUpperCase()}`;
    } else {
      return `${value.slice(0, 3).toUpperCase()}-${value.slice(4).toLocaleUpperCase()}`;
    }
  }
}

export default Mask;
