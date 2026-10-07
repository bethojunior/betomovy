export interface WorkerListItem {
  email: string;
  idUser: number;
  name: string;
  phone: string;
}

export interface CompanyWorkerResponse {
  companyId: number;
  created_at: string;
  id: number;
  isBlocked: number;
  isManager: number;
  statusId: number;
  updated_at: string;
  user: WorkerListItem;
  userId: number;
}

export interface WorkersProps {
  companyId: number;
  whatsAppMessage: string;
  onSelectUser: (idUser: number) => void;
}
