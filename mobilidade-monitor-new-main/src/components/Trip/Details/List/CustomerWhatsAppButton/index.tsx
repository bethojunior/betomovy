import { Button } from 'antd'
import { FC } from 'react'
import { IoLogoWhatsapp } from 'react-icons/io'
import { generateWhatsAppUrl, isValidBrazilianPhone } from '../../../../../utils/whatsappUtils'
import { getFirstName } from '../../../../../utils/formatters'
import { TitleChatButton } from '../styles'

interface CustomerWhatsAppButtonProps {
  phone?: string | null
  customerName?: string | null
  hideLabel?: boolean
}

export const CustomerWhatsAppButton: FC<CustomerWhatsAppButtonProps> = ({ phone, customerName, hideLabel }) => {
  if (!isValidBrazilianPhone(phone)) return null

  const firstName = getFirstName(customerName ?? undefined)
  const message = firstName ? `Olá, ${firstName}!` : 'Olá'

  return (
    <Button
      type="text"
      title="Conversar no WhatsApp"
      style={{ height: '100%' }}
      target="_blank"
      rel="noopener noreferrer"
      href={generateWhatsAppUrl(phone, message)}
    >
      <IoLogoWhatsapp style={{ fontSize: 30, color: '#25D366' }} />
      {!hideLabel && <TitleChatButton>WhatsApp</TitleChatButton>}
    </Button>
  )
}
