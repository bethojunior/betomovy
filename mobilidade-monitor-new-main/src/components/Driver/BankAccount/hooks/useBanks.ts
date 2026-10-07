import { useEffect, useState } from "react";

import api from "../../../../services/api";
import { Bank } from "../types";

// Lista de bancos só é buscada quando o formulário abre
export function useBanks(enabled: boolean) {
  const [banks, setBanks] = useState<Bank[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!enabled || banks.length > 0) return;

    setLoading(true);
    api
      .get("bank")
      .then(({ data }) => setBanks(data.response ?? []))
      .catch(() => setBanks([]))
      .finally(() => setLoading(false));
  }, [enabled, banks.length]);

  return { banks, loading };
}
