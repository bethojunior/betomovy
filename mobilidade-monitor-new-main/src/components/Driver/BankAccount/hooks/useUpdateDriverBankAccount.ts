import { useCallback, useState } from "react";
import { notification } from "antd";

import api from "../../../../services/api";
import { DriverBankAccountPayload } from "../types";

// Junta as mensagens de validação do Laravel (422) numa só
const extractErrorMessage = (error: any) => {
  const data = error?.response?.data;
  const validationErrors = data?.errors ? Object.values<string[]>(data.errors).flat() : [];
  return validationErrors[0] ?? data?.message ?? "Erro ao salvar dados bancários";
};

export function useUpdateDriverBankAccount(driverId: number) {
  const [saving, setSaving] = useState(false);

  const save = useCallback(
    async (payload: DriverBankAccountPayload) => {
      setSaving(true);
      try {
        await api.put(`driver/${driverId}/bank-account`, payload);
        notification.success({ message: "Dados bancários atualizados" });
        return true;
      } catch (error) {
        notification.error({ message: extractErrorMessage(error) });
        return false;
      } finally {
        setSaving(false);
      }
    },
    [driverId]
  );

  return { save, saving };
}
