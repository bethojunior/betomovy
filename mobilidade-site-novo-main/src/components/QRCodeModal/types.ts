export interface QRCodeModalProps {
  link: string;
  visible: boolean;
  setVisible: (val: boolean) => void;
  callback: () => void;
}
