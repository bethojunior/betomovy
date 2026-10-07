export type AccountDeletionRequestType = "CUSTOMER" | "DRIVER";

export interface AccountDeletionRequestItem {
  cityId: number;
  cityName: string;
  created_at: string;
  details: string;
  id: number;
  ip: string;
  platform: string;
  reason: string;
  type: AccountDeletionRequestType;
  userId: number;
  userIdWhoDeleted: number | null;
  userName: string;
  userPhone: string;
}

export interface PaginationMeta {
  current_page: number;
  data: AccountDeletionRequestItem[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  next_page_url: string;
  path: string;
  per_page: string;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export interface UseAccountDeletionRequestsReturn {
  data: AccountDeletionRequestItem[] | undefined;
  pagination: PaginationMeta | undefined;
  loading: boolean;
  page: number;
  goToPage: (page: number) => void;
  approve: (userId: number) => Promise<boolean>;
  cancel: (userId: number) => Promise<boolean>;
}

export interface AccountDeletionRequestsProps {
  type: AccountDeletionRequestType;
}

export type AlertType = "success" | "info" | "warning" | "error";
