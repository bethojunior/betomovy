export interface ReasonsCancellationsProps {
  cancellationReasonsTypeId: number;
  cancellation_reasons_type?: {
    id: number;
    name: string;
  };
  reports?: boolean;
  monetized?: boolean;
  created_at: string;
  idCancellationReasons: number;
  name: string;
  statusId: number;
  updated_at: string;
}

export type CheckMethodRef = {
  openModal: () => void;
};
