import swal from "sweetalert";
import { breadCrumble } from "./translation/breadCrumble";
import { openBillingPortal } from "./billing";

// ─── helpers ────────────────────────────────────────────────────────────────

const t = (key: string): string => breadCrumble(key) as string;

const BTN_BACK = () => t("login.button.back_to_monitor");
const BTN_PAY  = () => t("login.button.pay");

// ─── modals ─────────────────────────────────────────────────────────────────

/** Credenciais inválidas — exibido no catch do speedmobLogin e do signIn. */
export const showInvalidCredentialsModal = (): void => {
  swal({
    title: t("login.error.title"),
    text: t("login.error.invalid_credentials"),
    icon: "error",
    className: "swal-centered-text",
  });
};

/** Localização negada pelo usuário. */
export const showLocationDeniedModal = (): void => {
  swal({
    title: t("login.error.location.title"),
    text: "",
    icon: "error",
  });
};

/**
 * Conta com fatura em atraso (statusPay.id === 2).
 * Oferece acesso ao portal de faturas ou continua no monitor.
 * @param onContinue - callback chamado quando o usuário escolhe continuar no monitor
 */
export const showOverdueModal = async (onContinue: () => void): Promise<void> => {
  const goToBilling = await swal({
    title: t("login.warning.overdue.title"),
    text: t("login.warning.overdue.text"),
    icon: "warning",
    buttons: [BTN_BACK(), BTN_PAY()],
  });

  if (goToBilling) {
    await openBillingPortal();
  } else {
    onContinue();
  }
};

/**
 * Conta bloqueada por inadimplência.
 * Oferece acesso ao portal de faturas ou retorna ao login.
 */
export const showBlockedAccountModal = async (): Promise<void> => {
  const goToBilling = await swal({
    title: t("login.error.blocked_account.title"),
    text: t("login.error.blocked_account.text"),
    icon: "warning",
    buttons: [BTN_BACK(), BTN_PAY()],
  });

  if (goToBilling) {
    await openBillingPortal();
  }
};
