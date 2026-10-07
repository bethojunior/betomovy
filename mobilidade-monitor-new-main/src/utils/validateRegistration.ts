import api from "../services/api";

const CPF_INVALID_USER_MESSAGE =
  "O CPF informado é inválido. Confira os 11 dígitos e tente novamente.";

const pickApiMessage = (response: unknown): string | undefined => {
  if (Array.isArray(response)) {
    const first = response[0];
    return typeof first === "string" ? first : undefined;
  }
  if (response && typeof response === "object" && "message" in response) {
    const msg = (response as { message?: unknown }).message;
    if (typeof msg === "string") {
      return msg;
    }
  }
  return typeof response === "string" ? response : undefined;
};

const mapFriendlyZafiraErrorMessage = (message: string): string => {
  if (/cpf\s+inv[aá]lido/i.test(message)) {
    return CPF_INVALID_USER_MESSAGE;
  }
  return message;
};

export const handleValidateRegistration = async (
  id: number,
  type: "driver" | "customer",
  onSuccess: (message: string) => void,
  onError: (message: string) => void,
  setLoading: (loading: boolean) => void
): Promise<void> => {
  setLoading(true);

  try {
    const endpoint =
      type === "driver"
        ? `driver/${id}/validate-registration`
        : `customer/${id}/validate-registration`;

    const res = await api.post(endpoint);

    if (res.data.status) {
      onSuccess(res.data.response?.message ?? "Cadastro validado com sucesso.");
      return;
    }

    const rawMessage =
      res.data.message ??
      pickApiMessage(res.data.response) ??
      "Erro ao validar cadastro.";
    onError(mapFriendlyZafiraErrorMessage(String(rawMessage)));
  } catch (err: unknown) {
    const error = err as {
      response?: { data?: { response?: unknown; message?: string } };
      message?: string;
    };
    const responseData = error?.response?.data?.response;
    const rawMessage =
      pickApiMessage(responseData) ??
      error?.response?.data?.message ??
      error?.message ??
      "Erro ao validar cadastro.";
    onError(mapFriendlyZafiraErrorMessage(String(rawMessage)));
  } finally {
    setLoading(false);
  }
};
