export interface NotificationModalProps {
  visible: boolean
  target: 'customer' | 'driver'
  targetName: string
  targetPhoto?: string
  onCancel: () => void
  onSend: (title: string, message: string) => Promise<void>
  loading?: boolean
}


