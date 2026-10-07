import {
  AsYouType,
  isPossiblePhoneNumber,
  parsePhoneNumberFromString,
  CountryCode as LibIso2,
} from "libphonenumber-js/mobile";
import { CountryCode } from "./countryCodes";

// Máscara/validação/número discável por país delegadas pro libphonenumber-js
// (base de números da Google) em vez de regra própria por país — evita
// manter uma tabela de formato/tamanho na mão pra cada um dos países da lista.

// AsYouType.input() não trava sozinho no tamanho máximo do país — passado
// isso, ele desiste de formatar e devolve dígito cru sem separador. Por isso
// alimenta um dígito por vez e para assim que a lib sinaliza TOO_LONG, em
// vez de jogar a string inteira de uma vez.
export function maskPhoneByCountry(value: string, country: CountryCode): string {
  const digits = value.replace(/\D/g, "");
  if (!digits) return "";

  const formatter = new AsYouType(country.iso2 as LibIso2);
  let formatted = "";
  for (const digit of digits) {
    const next = formatter.input(digit);
    if (formatter.validateLength() === "TOO_LONG") break;
    formatted = next;
  }
  return formatted;
}

// isPossiblePhoneNumber (só tamanho) em vez de isValidPhoneNumber (padrão
// exato do país): planos de numeração mudam com o tempo, validação estrita
// demais rejeitaria número novo e válido que a lib ainda não conhece.
export function validatePhoneByCountry(value: string, country: CountryCode): boolean {
  const digits = value.replace(/\D/g, "");
  if (!digits) return false;
  return isPossiblePhoneNumber(digits, country.iso2 as LibIso2);
}

// Número completo pra salvar/enviar: DDI + número, só dígitos, sem "+" —
// é o mesmo formato que o backend já espera no campo phone existente.
export function buildDialablePhone(value: string, country: CountryCode): string {
  const digits = value.replace(/\D/g, "");
  const parsed = parsePhoneNumberFromString(digits, country.iso2 as LibIso2);
  return (parsed ? parsed.number : country.dialCode + digits).replace(/\D/g, "");
}
