declare type ModalRefProps = {
  openModal: () => void;
  closeModal: () => void;
};

declare interface ModalProps {
  title: string;
  useLottie?: {
    animationData?: unknown;
    width?: string;
  };
  children?: React.ReactElement;
  description?: string;
  footer?: React.ReactNode;
  noDismissAutoClose?: boolean;
}
