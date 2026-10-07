import { useState } from "react";

import api from "../../../../../../services/api";

// Config da cidade que habilita o fluxo "chamado só por oferta" (InDriver).
export const useInDriverConfig = () => {
  const [isInDriverEnabled, setIsInDriverEnabled] = useState<boolean>(false);

  const getInDriverConfig = async () => {
    try {
      const response = await api.get("config/travel_only_by_offer");
      if (response.status === 200 && response.data?.status) {
        const configValue = response.data.response;
        const isEnabled =
          configValue === "1" ||
          configValue === 1 ||
          configValue === true;
        setIsInDriverEnabled(isEnabled);
        return;
      }
    } catch (error) {
      console.log("Erro ao buscar configuração do InDriver:", error);
    }
    setIsInDriverEnabled(false);
  };

  return {
    isInDriverEnabled,
    getInDriverConfig,
  };
};
