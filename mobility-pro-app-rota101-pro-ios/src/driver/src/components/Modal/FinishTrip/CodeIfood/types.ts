export interface DeliveryCodeModalProps {
  visible: boolean;
  onClose: () => void;
  onCodeValidated: () => void;
  tripReference: string;
}
