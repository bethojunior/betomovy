import { useCallback } from "react";
import { message } from "antd";

export function useCopyToClipboard() {
  return useCallback(async (text: string, successMessage: string) => {
    try {
      await navigator.clipboard.writeText(text);
      message.success(successMessage);
    } catch {
      message.error("Não foi possível copiar");
    }
  }, []);
}
