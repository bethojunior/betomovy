export interface IConfirmationAccountAppPartnerProps {
  visible: boolean;
  setVisible: (data: boolean) => void;
}

export interface IUseConfirmationAccountAppPartnerProps {
  setVisible: (data: boolean) => void;
  showToast: (message: string, type: 'warning' | 'danger') => void;
}
