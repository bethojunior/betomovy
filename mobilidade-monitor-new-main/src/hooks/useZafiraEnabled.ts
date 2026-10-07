import { useEffect, useState } from "react";
import api from "../services/api";
import Session from "../utils/Session";

export const useZafiraEnabled = () => {
  const [enableZafiraValidationMonitor, setEnableZafiraValidationMonitor] = useState(false);

  useEffect(() => {
    const cityId = Session.getLocal("citySelected")?.cityId;
    if (!cityId) return;

    api
      .get(`city/${cityId}/config`)
      .then((result) => {
        const cityConfig: { attribute: string; value: string }[] =
          result.data?.response ?? [];
        const attr = cityConfig.find(
          (item) => item.attribute === "enableZafiraValidationMonitor"
        );
        setEnableZafiraValidationMonitor(attr?.value === "1");
      })
      .catch(() => {});
  }, []);

  return { enableZafiraValidationMonitor };
};
