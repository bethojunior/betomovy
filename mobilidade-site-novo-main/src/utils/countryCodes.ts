import { getCountries, getCountryCallingCode, CountryCode as LibIso2 } from "libphonenumber-js/mobile";

export interface CountryCode {
  iso2: string;
  name: string;
  dialCode: string;
  flag: string;
}

// Bandeira a partir do ISO2 (par de "regional indicator symbols" Unicode).
function flagFromIso2(iso2: string): string {
  try {
    return String.fromCodePoint(
      ...iso2
        .toUpperCase()
        .split("")
        .map((char) => 127397 + char.charCodeAt(0))
    );
  } catch (e) {
    return "🌐";
  }
}

// Nome do país via Intl nativo do browser
const countryDisplayNames = typeof Intl !== "undefined" && Intl.DisplayNames
  ? new Intl.DisplayNames(["en", "pt"], { type: "region" })
  : null;

function buildCountry(iso2: LibIso2): CountryCode {
  return {
    iso2,
    name: countryDisplayNames ? (countryDisplayNames.of(iso2) ?? iso2) : iso2,
    dialCode: getCountryCallingCode(iso2),
    flag: flagFromIso2(iso2),
  };
}

const US_ISO2: LibIso2 = "US";
const BRAZIL_ISO2: LibIso2 = "BR";

export const US_COUNTRY = buildCountry(US_ISO2);
export const BR_COUNTRY = buildCountry(BRAZIL_ISO2);

const allOtherCountries = getCountries()
  .filter((iso2) => iso2 !== US_ISO2 && iso2 !== BRAZIL_ISO2)
  .map(buildCountry)
  .sort((a, b) => a.name.localeCompare(b.name));

// Estados Unidos (+1) como país padrão para a plataforma internacional
export const COUNTRY_CODES: CountryCode[] = [
  US_COUNTRY,
  BR_COUNTRY,
  ...allOtherCountries,
];

export const DEFAULT_COUNTRY = US_COUNTRY;

export function findCountryByIso2(iso2?: string | null): CountryCode {
  return COUNTRY_CODES.find((c) => c.iso2 === iso2?.toUpperCase()) ?? DEFAULT_COUNTRY;
}
