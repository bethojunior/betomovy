import { getCountries, getCountryCallingCode, CountryCode as LibIso2 } from "libphonenumber-js/mobile";

export interface CountryCode {
  iso2: string;
  name: string;
  dialCode: string;
  flag: string;
}

// Bandeira a partir do ISO2 (par de "regional indicator symbols" Unicode).
function flagFromIso2(iso2: string): string {
  return String.fromCodePoint(
    ...iso2
      .toUpperCase()
      .split("")
      .map((char) => 127397 + char.charCodeAt(0))
  );
}

// Nome do país em pt-BR via Intl nativo do browser — sem manter tradução na mão.
const countryDisplayNames = new Intl.DisplayNames(["pt"], { type: "region" });

function buildCountry(iso2: LibIso2): CountryCode {
  return {
    iso2,
    name: countryDisplayNames.of(iso2) ?? iso2,
    dialCode: getCountryCallingCode(iso2),
    flag: flagFromIso2(iso2),
  };
}

const US_ISO2: LibIso2 = "US";
export const US_COUNTRY = buildCountry(US_ISO2);
export const BR_COUNTRY = buildCountry(BRAZIL_ISO2);

// Estados Unidos (+1) como país padrão para a plataforma internacional
export const COUNTRY_CODES: CountryCode[] = [
  US_COUNTRY,
  BR_COUNTRY,
  ...otherCountries.filter((c) => c.iso2 !== "US" && c.iso2 !== "BR"),
];

export const DEFAULT_COUNTRY = US_COUNTRY;

export function findCountryByIso2(iso2?: string | null): CountryCode {
  return COUNTRY_CODES.find(c => c.iso2 === iso2?.toUpperCase()) ?? DEFAULT_COUNTRY;
}
