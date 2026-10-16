export interface ModalCancellationReasonsCustomerProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
}

export interface CancellationReason {
  idCancellationReasons: number;
  name: string;
}
