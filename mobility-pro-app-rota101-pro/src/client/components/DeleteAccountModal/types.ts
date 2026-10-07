export interface DeleteAccountModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (reason: string, details: string) => void;
  loading?: boolean;
}
