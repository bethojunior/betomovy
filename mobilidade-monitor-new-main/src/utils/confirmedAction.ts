import swal from "sweetalert";

export interface ConfirmedActionOptions {
  title: string;
  text?: string;
  confirmButtonText?: string;
  dangerMode?: boolean;
}

/**
 * Pede confirmação via swal e, se aceito, roda `action` garantindo que
 * `setLoading(false)` sempre execute (sucesso, erro ou exceção) — sem isso,
 * uma tela que usa esse `loading` pra travar a UI fica presa até um F5.
 *
 * Retorna o resultado de `action`, ou `undefined` se o usuário cancelar.
 * Erros de `action` são relançados após liberar o loading, pra quem chamar
 * decidir como tratar (alerta de erro etc).
 */
export async function runConfirmedAction<T>(
  options: ConfirmedActionOptions,
  setLoading: (loading: boolean) => void,
  action: () => Promise<T>
): Promise<T | undefined> {
  const confirmed = await swal({
    title: options.title,
    text: options.text,
    icon: "warning",
    buttons: ["Cancelar", options.confirmButtonText ?? "Confirmar"],
    dangerMode: options.dangerMode ?? true,
  });

  if (!confirmed) return undefined;

  setLoading(true);
  try {
    return await action();
  } finally {
    setLoading(false);
  }
}
