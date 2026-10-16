import axios from 'axios';

/**
 * Identifica falhas de comunicação entre o cliente e o servidor.
 *
 * Considera como erro de rede apenas erros do Axios em que não houve uma
 * resposta HTTP do servidor (ex.: perda de conexão, DNS, timeout ou
 * requisição interrompida), além do código `ERR_NETWORK`.
 *
 * Erros de aplicação ou respostas HTTP com status de erro (4xx/5xx) não são
 * considerados erros de rede, pois o servidor chegou a processar a requisição
 * e retornou uma resposta.
 */
export function isNetworkError(error: unknown): boolean {
  if (!axios.isAxiosError(error)) return false;
  return !error.response || error.code === 'ERR_NETWORK';
}

/**
 * Resultado de uma operação crítica enviada ao servidor.
 *
 * `delivered: false` significa que não houve resposta HTTP (timeout, queda de
 * conexão, requisição abortada). Nesse caso o cliente NÃO sabe se o servidor
 * processou a operação — ela não deve ser tratada como falha definitiva, e sim
 * como pendente de sincronização.
 */
export type CriticalRequestResult<T> =
  | { delivered: true; response: T }
  | { delivered: false };

/**
 * Executa uma requisição crítica diferenciando "falha de negócio" de "sem
 * resposta do servidor".
 *
 * Quando não há resposta, existem três possibilidades que o cliente não
 * consegue distinguir: o servidor nunca recebeu a requisição; recebeu e
 * processou, mas a resposta se perdeu; ou ainda está processando. Por isso
 * timeout/erro de rede retorna `delivered: false` em vez de lançar — o
 * chamador decide como persistir a operação para sincronização posterior.
 * Erros com resposta HTTP (4xx/5xx) são propagados normalmente.
 */
export async function sendCriticalRequest<T>(
  request: () => Promise<T>,
): Promise<CriticalRequestResult<T>> {
  try {
    return { delivered: true, response: await request() };
  } catch (error) {
    if (isNetworkError(error)) {
      return { delivered: false };
    }
    throw error;
  }
}
