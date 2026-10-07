export interface NegativeBalanceModalProps {
  visible: boolean;
  onClose: () => void;
  title: string;
  description: string;
  balanceValue: number;
  showPrepaidOption: boolean;
  onPressPay: () => void;
  onPressPrepaid: () => void;
}
