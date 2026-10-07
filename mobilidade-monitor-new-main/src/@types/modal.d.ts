declare type ModalRefProps = {
  openModal: () => void;
  closeModal: () => void;
};

declare type ModalProps = {
  width?: string;
  title?: string;
  useLottie?: {
    animationData?: unknown;
    loop?: boolean;
    autoplay?: boolean;
    width?: string;
  };
  children?: React.ReactNode;
  description?: string;
  footer?: ModalFooterRender | React.ReactNode;
  noDismissAutoClose?: boolean;
};
