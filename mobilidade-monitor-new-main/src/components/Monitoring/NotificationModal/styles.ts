import { Image, Input, Modal } from 'antd'
import styled from 'styled-components'

export const StyledModal = styled(Modal)`
  .ant-modal-body {
    padding: 24px;
  }
`

export const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
`

export const InfoUserNotification = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding-bottom: 1.25rem;
  border-bottom: 1px solid #f0f0f0;
`

export const ProfileCustomerNotify = styled.div`
  width: 52px;
  height: 52px;
  min-width: 52px;
  border-radius: 50%;
  overflow: hidden;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f5f5;
  border: 1px solid #f0f0f0;
`

export const NotifyPhoto = styled(Image)`
  width: 100%;
  height: 100%;
  object-fit: cover;
`

export const NotifyTargetInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
  overflow: hidden;
`

export const NotifyTargetLabel = styled.span`
  font-size: 11px;
  font-weight: 600;
  color: #8c8c8c;
  text-transform: uppercase;
  letter-spacing: 0.02em;
`

export const NameUserNotify = styled.span`
  font-size: 15px;
  font-weight: 600;
  color: #262626;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`

export const FormField = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
`

export const FieldLabel = styled.label`
  font-size: 13px;
  font-weight: 500;
  color: #595959;
`

export const TitleInput = styled(Input)``

export const MessageTextArea = styled(Input.TextArea)``
