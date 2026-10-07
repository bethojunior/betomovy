export interface ClientInfoProps {
  name: string;
  document: string;
  rg: number;
  phone: string;
  email: string;
  dateOfBirth: number;
  status: string;
  created_at: string;
  city: string;
  enableZafiraValidationMonitor?: boolean;
  zafiraValidated?: number;
}
