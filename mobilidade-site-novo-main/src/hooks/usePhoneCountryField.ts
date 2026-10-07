import { useEffect, useState } from "react";
import { CountryCode, DEFAULT_COUNTRY } from "../utils/countryCodes";
import { buildDialablePhone, maskPhoneByCountry, validatePhoneByCountry } from "../utils/UtilsPhone";
import { useDetectCountry } from "./useDetectCountry";

// Centraliza DDI + máscara + validação do telefone — usado em todo fluxo de
// cadastro (cliente normal, pré-cadastro, motorista) pra não duplicar essa
// lógica por página. Pré-seleciona o país pela geolocalização de rede, mas
// para de seguir a detecção assim que o usuário troca manualmente.
export function usePhoneCountryField() {
  const { country: detectedCountry } = useDetectCountry();
  const [country, setCountry] = useState<CountryCode>(DEFAULT_COUNTRY);
  const [touchedCountry, setTouchedCountry] = useState(false);

  useEffect(() => {
    if (!touchedCountry) setCountry(detectedCountry);
  }, [detectedCountry, touchedCountry]);

  const selectCountry = (next: CountryCode) => {
    setTouchedCountry(true);
    setCountry(next);
  };

  return {
    country,
    selectCountry,
    maskPhone: (value: string) => maskPhoneByCountry(value, country),
    isValidPhone: (value: string) => validatePhoneByCountry(value, country),
    toDialablePhone: (value: string) => buildDialablePhone(value, country),
  };
}
