import { parsePhoneNumberFromString } from "libphonenumber-js/mobile";
import Utils from "../utils/Utils";

class Mask {
  static createCodeDriver(nickname: string, idDriver: number): string {
    if (!nickname) {
      return "";
    }
    const name = Utils.removeAccent(nickname).split("");
    const type = "P";
    const characters =
      name[0].toUpperCase() + name[name.length - 1].toUpperCase();
    const code = `00000${idDriver}`;
    return characters + code.slice(-5) + type;
  }

  static setMaskPhoneValue(value: string): string {
    const digits = String(value).replace(/\D/g, "");

    // Cadastros novos (site) vêm com DDI+DDD+número concatenados — acima de
    // 11 dígitos não dá mais pra assumir que os 2 primeiros são um DDD
    // brasileiro, deixa a lib reconhecer o país e formatar certo.
    if (digits.length <= 11) {
      return digits.replace(/(\d{2})(\d{4,5})(\d{4})/g, "($1) $2-$3");
    }

    const phoneNumber = parsePhoneNumberFromString(`+${digits}`);
    if (!phoneNumber) return digits;

    // sempre com o "+DDI" (formatInternational), nunca formatNational —
    // esse valor é o que volta pro backend ao salvar (ver Modal/Edition e
    // Modal/Edit), formatar só o número nacional apagaria o DDI ao salvar
    return phoneNumber.formatInternational();
  }

  static toWhatsAppDialable(value: string): string {
    const digits = String(value || "").replace(/\D/g, "");
    if (!digits) return "";
    return digits.length > 11 ? digits : `55${digits}`;
  }

  static setMaskPhoneUniversal(value: string): string {
    let phone = String(value);
    phone = phone.replace(/\D/g, "");
    phone = phone.substr(0, 13);
    phone = phone.replace(/(\d{2})(\d{2})(\d{4,5})(\d{4})/g, "+$1 ($2) $3-$4");
    return phone;
  }

  static setMaskJustNumber(value: string): string {
    let number = String(value);
    number = number.replace(/\D/g, "");
    return number;
  }

  static setMaskNumberAndDot(value: string): string {
    let number = String(value);
    number = number.replace(/[a-z]/, "");
    number = number.replace(/[/*--+_@|=\\<>:;?]/, "");
    number = number.replace(/[/!-)]/, "");
    return number;
  }

  static setMaskRg(value: string): string {
    let cpf = value;
    cpf = cpf.replace(/[^0-9]+/, "");
    cpf = cpf.replace(/(\d{11})/g, "$1");
    cpf = cpf.replace(/(\d{11})(\d{1})/g, "$1$2");
    return cpf.replace(/(\d{11})(\d{1})/g, "$1-$2");
  }

  static setMaskCpf(value: string): string {
    let cpf = value;
    cpf = cpf.replace(/[^0-9]+/, "");
    cpf = cpf.replace(/(\d{3})/g, "$1");
    cpf = cpf.replace(/(\d{3})(\d{3})/g, "$1$2");
    cpf = cpf.replace(/(\d{3})(\d{3})(\d{3})/g, "$1$2$3");
    return cpf.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/g, "$1.$2.$3-$4");
  }

  static setRemoveMaskCpf(value: string): string {
    let remove = value;
    remove = value.replace(/\./g, "").replace(/-/g, "");
    return remove;
  }

  static setMaskMoney(value: string): string {
    if (!value) return "0,00";
    if (Number.isNaN(value)) return "0,00";

    let v = value.replace(/\D/g, "");
    v = String((parseInt(v) / 100).toFixed(2));

    if (isNaN(parseFloat(v))) {
      return "0,00";
    }

    v = v.replace(".", ",");
    v = v.replace(/(\d)(\d{3})(\d{3}),/g, "$1.$2.$3,");
    v = v.replace(/(\d)(\d{3}),/g, "$1.$2,");
    return v;
  }

  static setMaskMoneyAlternative(valor: any): string {
    const num = Number(valor);
    if (isNaN(num) || !num) return "0,00";
    return num.toLocaleString("pt-br", { minimumFractionDigits: 2 });
  }

  static setMaskMoneyNumber(valor: any): string {
    const num = Number(valor);
    if (isNaN(num)) return "R$ 0,00";
    return num.toLocaleString("pt-br", {
      style: "currency",
      currency: "BRL",
    });
  }

  // Corta em 2 casas sem arredondar, igual ao Helper.maskMoney do app (toFixed(4) remove o ruído do float)
  static setMaskMoneyTruncated(valor: number): string {
    const [integer, decimals = ""] = (Number(valor) || 0).toFixed(4).split(".");
    return Mask.setMaskMoneyNumber(Number(`${integer}.${decimals.slice(0, 2)}`));
  }

  static setMaskUSAFormatMoney(value: string): string {
    let remove = value;
    remove = value.replace(/\./g, "").replace(/,/g, ".");
    return remove;
  }

  static setOnlyNumber(value: string) {
    return value.replace(/\D/g, "");
  }

  static setRemoveMaskMoney(value: string): number {
    let remove = value;
    let firstValue = 0;
    let secondValue = 0;
    remove = value.replace(/\./g, "").replace(/,/g, "");
    firstValue = Number(remove);
    secondValue = firstValue / 100;
    return secondValue;
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
    return value
      .replace(/\D/g, "")
      .replace(/(\d{2})(\d)/, "$1/$2")
      .replace(/(\d{2})(\d)/, "$1/$2")
      .replace(/(\d{4})(\d)/, "$1");
  }

  static setMaskPlateVehicle(value: string): string {
    value = value.replace(/^([A-Z]{3})([0-9]{4})/, "$1-$2");

    if (value.length <= 3) {
      value = value.toLocaleUpperCase();
      value = value.replace(/[0-9!@#¨$%^&*)(+=._-]+/g, "");
    }

    return value;
  }

  static setMaskOnlyLetters(value: string): string {
    let letter = String(value);
    letter = letter.replace(/[0-9!@#¨$%^&*)(+=._-]+/g, "");

    return letter;
  }
  static setCustomPhoneMask(value: string): string {
    if (!value) {
      return "";
    }

    let cleanValue = value.replace(/[^\d+]/g, "");
    if (cleanValue.startsWith("+") && !cleanValue.startsWith("+55")) {
      return cleanValue;
    }

    const n = cleanValue.replace(/\D/g, "");

    if (n.startsWith("55")) {
      if (n.length === 13) {
        return n.replace(
          /^(\d{2})(\d{2})(\d)(\d{4})(\d{4})/,
          "+$1 ($2) $3 $4-$5"
        );
      }
      if (n.length === 12) {
        return n.replace(/^(\d{2})(\d{2})(\d{4})(\d{4})/, "+$1 ($2) $3-$4");
      }

      if (n.length > 4) {
        return n.replace(/^(\d{2})(\d{2})(\d*)/, "+$1 ($2) $3");
      }
      if (n.length > 2) {
        return n.replace(/^(\d{2})(\d*)/, "+$1 ($2");
      }
      return `+${n}`;
    }

    if (n.length === 11) {
      return n.replace(/^(\d{2})(\d)(\d{4})(\d{4})/, "+55 ($1) $2 $3-$4");
    }
    if (n.length === 10) {
      return n.replace(/^(\d{2})(\d{4})(\d{4})/, "+55 ($1) $2-$3");
    }

    return Mask.setMaskPhoneValue(value);
  }
}

export default Mask;
