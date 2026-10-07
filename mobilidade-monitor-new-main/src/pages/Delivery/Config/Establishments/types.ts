export type AlertType = "success" | "info" | "warning" | "error";

export interface EstablishmentsList {
  id: number;
  name: string;
  description: string;
  statusId: number;
  created_at: Date;
  updated_at: Date;
}
