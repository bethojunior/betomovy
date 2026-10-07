import {
  STATUS_BACK_OFF,
  STATUS_CANCELED,
  STATUS_NOT_ANSWERED,
  STATUS_PAYMENT_REFUSED
} from './TripStatus'

export type CanceledByValue = 'customer' | 'driver' | 'admin' | 'system'

export const CANCELED_BY_LABEL: Record<CanceledByValue, string> = {
  customer: 'Cliente',
  driver: 'Motorista',
  admin: 'Operador',
  system: 'Sistema'
}

const KNOWN_CANCELED_BY: CanceledByValue[] = ['customer', 'driver', 'admin']

// Status de encerramento sem um responsável humano conhecido (timeout de busca,
// pagamento recusado, etc.) — usado como fallback pra rotular como "Sistema".
function isAutoCancellationStatus(status?: string | null): boolean {
  return [STATUS_BACK_OFF, STATUS_NOT_ANSWERED, STATUS_PAYMENT_REFUSED, STATUS_CANCELED].includes(
    status ?? ''
  )
}

/**
 * `canceledBy` no banco só existe como 'customer'/'driver'/'admin' — nunca 'system'.
 * Cancelamentos automáticos (timeout de busca de motorista, no mobilidade-api-php)
 * hoje gravam `canceledBy='customer'` mesmo sendo automáticos, então esse fallback é
 * uma inferência de UI (canceledBy vazio/não reconhecido + status sem responsável
 * humano conhecido), não uma garantia do dado.
 */
export function resolveCanceledBy(
  canceledBy?: string | null,
  status?: string | null
): CanceledByValue | null {
  const normalized = canceledBy?.trim().toLowerCase()

  if (normalized && KNOWN_CANCELED_BY.includes(normalized as CanceledByValue)) {
    return normalized as CanceledByValue
  }

  if (isAutoCancellationStatus(status)) {
    return 'system'
  }

  return null
}
