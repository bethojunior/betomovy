import { useEffect, useState } from "react";
import { CountryCode, DEFAULT_COUNTRY, findCountryByIso2 } from "../utils/countryCodes";
import { isBrazilActive } from "../utils/languageConfig";

// Detecta o país do usuário pelo IP pra pré-selecionar o DDI no cadastro.
export function useDetectCountry(): { country: CountryCode; detecting: boolean } {
  const [country, setCountry] = useState<CountryCode>(DEFAULT_COUNTRY);
  const [detecting, setDetecting] = useState(true);

  useEffect(() => {
    let cancelled = false;

    fetch("https://ipapi.co/json/")
      .then(response => response.json())
      .then(data => {
        if (cancelled || !data?.country_code) return;
        if (data.country_code === "BR" && !isBrazilActive()) {
          setCountry(DEFAULT_COUNTRY);
          return;
        }
        setCountry(findCountryByIso2(data.country_code));
      })
      .catch(() => {
        // Fallback seguro para DEFAULT_COUNTRY (US)
      })
      .finally(() => {
        if (!cancelled) setDetecting(false);
      });

    return () => { cancelled = true; };
  }, []);

  return { country, detecting };
}
