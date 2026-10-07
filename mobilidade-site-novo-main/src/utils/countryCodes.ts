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

const BRAZIL_ISO2: LibIso2 = "BR";

// Brasil primeiro (país padrão), resto em ordem alfabética — DDI, formato e
// tamanho de cada país vêm do libphonenumber-js, não são mantidos aqui.
const otherCountries = getCountries()
  .filter((iso2) => iso2 !== BRAZIL_ISO2)
  .map(buildCountry)
  .sort((a, b) => a.name.localeCompare(b.name, "pt"));

export const COUNTRY_CODES: CountryCode[] = [buildCountry(BRAZIL_ISO2), ...otherCountries];

export const DEFAULT_COUNTRY = COUNTRY_CODES[0]; // Brasil

export function findCountryByIso2(iso2?: string | null): CountryCode {
  return COUNTRY_CODES.find(c => c.iso2 === iso2?.toUpperCase()) ?? DEFAULT_COUNTRY;
}
