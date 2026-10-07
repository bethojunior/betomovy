export interface ModalServiceSmtpProps {
  visible: boolean;
  setVisible: (data: boolean) => void;
  setLoading: (loading: boolean) => void;
  isSendingEmail: boolean;
}
