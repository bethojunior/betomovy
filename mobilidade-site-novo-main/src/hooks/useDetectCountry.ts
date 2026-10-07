import { useEffect, useState } from "react";
import { CountryCode, DEFAULT_COUNTRY, findCountryByIso2 } from "../utils/countryCodes";

// Detecta o país do usuário pelo IP (geolocalização de rede, não GPS) pra
// pré-selecionar o DDI no cadastro. Qualquer falha (rede, rate limit,
// resposta inesperada) cai no Brasil, nunca trava o formulário.
export function useDetectCountry(): { country: CountryCode; detecting: boolean } {
  const [country, setCountry] = useState<CountryCode>(DEFAULT_COUNTRY);
  const [detecting, setDetecting] = useState(true);

  useEffect(() => {
    let cancelled = false;

    fetch("https://ipapi.co/json/")
      .then(response => response.json())
      .then(data => {
        if (cancelled || !data?.country_code) return;
        setCountry(findCountryByIso2(data.country_code));
      })
      .catch(() => {
        // fica no Brasil (default)
      })
      .finally(() => {
        if (!cancelled) setDetecting(false);
      });

    return () => { cancelled = true; };
  }, []);

  return { country, detecting };
}
