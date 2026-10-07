import api from "../services/api";

const BILLING_PORTAL_URL = "https://checkout.prod.704apps.com.br";
const BILLING_PATH = "/faturas-mensais";

/**
 * Busca um token de autenticação temporário no endpoint auth/admin.
 * Retorna o token ou null em caso de falha.
 */
export const getAdminBillingToken = async (): Promise<string | null> => {
  try {
    const { data } = await api.post("auth/admin");
    if (!data?.response?.token) return null;
    return data.response.token;
  } catch {
    return null;
  }
};

/**
 * Abre o portal de faturas em uma nova aba.
 * A janela é aberta de forma síncrona para preservar o contexto do gesto do
 * usuário — sem isso, browsers modernos bloqueiam o window.open após um await.
 */
export const openBillingPortal = async (): Promise<void> => {
  // Abre janela vazia imediatamente (contexto de clique ainda ativo)
  const newWindow = window.open("", "_blank");

  const token = await getAdminBillingToken();

  if (!token) {
    newWindow?.close();
    return;
  }

  const url = `${BILLING_PORTAL_URL}${BILLING_PATH}?token=${token}`;

  if (newWindow) {
    newWindow.location.href = url;
  } else {
    // fallback caso o browser tenha bloqueado mesmo assim
    window.open(url, "_blank");
  }
};
