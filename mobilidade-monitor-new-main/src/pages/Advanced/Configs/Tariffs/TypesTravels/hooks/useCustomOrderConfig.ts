import { useState } from "react";

import api from "../../../../../../services/api";
import Session from "../../../../../../utils/Session";
import { CityConfigProps, CityConfigResponse } from "../types";

// Flag da cidade que habilita a ordenação customizada dos cards de tipo de viagem.
export const useCustomOrderConfig = () => {
  const [customOrderConfig, setCustomOrderConfig] = useState<boolean>(false);

  const getCustomOrderConfig = async () => {
    try {
      const city = Session.getLocal("citySelected").cityId;
      const response = await api.get<CityConfigResponse>(
        `city/${city}/config`
      );

      if (response.status === 200 && response.data.response) {
        const customOrderConfig = response.data.response.find(
          (config: CityConfigProps) =>
            config.attribute === "enableCustomOrderTripType"
        );

        const isEnabled = customOrderConfig?.value === "1";
        setCustomOrderConfig(isEnabled);
        return isEnabled;
      }
    } catch (error) {
      console.log("Erro ao buscar configuração da cidade:", error);
    }

    setCustomOrderConfig(false);
    return false;
  };

  return {
    customOrderConfig,
    getCustomOrderConfig,
  };
};
