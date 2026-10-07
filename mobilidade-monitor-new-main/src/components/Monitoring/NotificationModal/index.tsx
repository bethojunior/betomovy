import { getCustomerPhotoUrl, getDriverPhotoUrl } from '@/utils/imageUtils'
import { message } from 'antd'
import { FC, useState, useEffect } from 'react'
import AvatarWoman from '@/assets/avatar.png'
import { NotificationModalProps } from './types'
import {
  FieldLabel,
  FormField,
  InfoUserNotification,
  MessageTextArea,
  ModalContent,
  NameUserNotify,
  NotifyPhoto,
  NotifyTargetInfo,
  NotifyTargetLabel,
  ProfileCustomerNotify,
  StyledModal,
  TitleInput
} from './styles'

const NotificationModal: FC<NotificationModalProps> = ({
  visible,
  target,
  targetName,
  targetPhoto,
  onCancel,
  onSend,
  loading = false
}) => {
  const [title, setTitle] = useState('')
  const [notificationMessage, setNotificationMessage] = useState('')

  useEffect(() => {
    if (!visible) {
      setTitle('')
      setNotificationMessage('')
    }
  }, [visible])

  const handleSend = async () => {
    if (!title.trim()) {
      message.warning('Informe o título da notificação')
      return
    }

    if (!notificationMessage.trim()) {
      message.warning('Informe a mensagem da notificação')
      return
    }

    try {
      await onSend(title.trim(), notificationMessage.trim())
      setTitle('')
      setNotificationMessage('')
    } catch (error) {
      // Error handled by parent component
    }
  }

  const getPhotoUrl = (): string => {
    if (!targetPhoto) return AvatarWoman
    const photoUrl = target === 'customer'
      ? getCustomerPhotoUrl(targetPhoto)
      : getDriverPhotoUrl(targetPhoto)
    return photoUrl || AvatarWoman
  }

  const getTargetLabel = () => {
    return target === 'customer' ? 'Cliente' : 'Motorista'
  }

  return (
    <StyledModal
      title={`Enviar Notificação para ${getTargetLabel()}`}
      visible={visible}
      onCancel={onCancel}
      onOk={handleSend}
      okText="Enviar"
      cancelText="Cancelar"
      confirmLoading={loading}
      destroyOnClose
    >
      <ModalContent>
        <InfoUserNotification>
          <ProfileCustomerNotify>
            <NotifyPhoto
              src={getPhotoUrl()}
              preview={false}
              onError={(e) => {
                e.currentTarget.onerror = null
                e.currentTarget.src = AvatarWoman
              }}
            />
          </ProfileCustomerNotify>
          <NotifyTargetInfo>
            <NotifyTargetLabel>Destinatário</NotifyTargetLabel>
            <NameUserNotify>{targetName}</NameUserNotify>
          </NotifyTargetInfo>
        </InfoUserNotification>

        <FormField>
          <FieldLabel htmlFor="notification-title">Título</FieldLabel>
          <TitleInput
            id="notification-title"
            placeholder="Ex: Atualização importante"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={100}
          />
        </FormField>

        <FormField>
          <FieldLabel htmlFor="notification-message">Mensagem</FieldLabel>
          <MessageTextArea
            id="notification-message"
            placeholder="Escreva a mensagem que será enviada"
            value={notificationMessage}
            onChange={(e) => setNotificationMessage(e.target.value)}
            autoSize={{ minRows: 4, maxRows: 6 }}
            maxLength={500}
            showCount
          />
        </FormField>
      </ModalContent>
    </StyledModal>
  )
}

export default NotificationModal

