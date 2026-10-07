import { useCallback, useState } from "react";

import api from "../../../../services/api";
import { DriverBankAccount } from "../types";

// GET driver/{id} devolve o motorista inteiro; aqui fica só a parte bancária
const toBankAccount = (driver: Record<string, any>): DriverBankAccount => ({
  holderName: driver.holderName ?? null,
  document: driver.bankAccountDocument ?? null,
  bankId: driver.bankId ?? null,
  bankName: driver.bankName ?? null,
  bankNumber: driver.bankNumber ?? null,
  typeAccount: driver.typeAccount ?? null,
  agency: driver.agency ?? null,
  agencyDigit: driver.agencyDigit ?? null,
  numberAccount: driver.numberAccount ?? null,
  numberAccountDigit: driver.numberAccountDigit ?? null,
  op: driver.op ?? null,
  pix: driver.pix ?? null,
  pixType: driver.pixType ?? null,
});

export function useDriverBankAccount(driverId: number) {
  const [account, setAccount] = useState<DriverBankAccount | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(false);
    try {
      const { data } = await api.get(`driver/${driverId}`);
      setAccount(toBankAccount(data.response ?? {}));
      return true;
    } catch {
      setError(true);
      return false;
    } finally {
      setLoading(false);
    }
  }, [driverId]);

  const clear = useCallback(() => setAccount(null), []);

  return { account, loading, error, load, clear };
}
