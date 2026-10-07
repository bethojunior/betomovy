const getAppName = (user?: { key_app_partner?: string }) => {
  return user?.key_app_partner || import.meta.env.PROJECT_NAME
}

export const buildAbandonedTripMessage = (customerName?: string, user?: { key_app_partner?: string }) => {
  const name = customerName ? customerName.split(' ')[0] : 'cliente'
  const appName = getAppName(user)

  const message = `Olá, ${name}! Vimos que você simulou uma viagem em nosso app ${appName}, mas não finalizou o pedido. Temos um desconto especial para esse percurso! Se ainda estiver interessado(a), é só nos chamar por aqui.`

  return encodeURIComponent(message)
}

export const buildCanceledTripMessage = (customerName?: string, cancelReason?: string) => {
  const name = customerName ? customerName.split(' ')[0] : 'cliente'
  const reasonText = cancelReason ? `Motivo informado: ${cancelReason}.` : ''

  const message = `Olá, ${name}! Sentimos muito, mas o pedido precisou ser cancelado. ${reasonText} Se ainda precisar de uma viagem, estou por aqui para te ajudar!`

  return encodeURIComponent(message)
}

export const buildUnattendedTripMessage = (customerName?: string) => {
  const name = customerName ? customerName.split(' ')[0] : 'cliente'

  const message = `Olá, ${name}! Vimos que você começou um pedido mas não finalizou. Posso te ajudar a concluir agora mesmo?`

  return encodeURIComponent(message)
}
