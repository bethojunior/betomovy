export interface DriverInfoProps {
  name: string;
  document: string;
  phone: string;
  email: string;
  city: string;
  registerStatus: string;
  created_at: string;
  carModel: string;
  carBrand: string;
  carPlate: string;
  carColor?: string;
  carYear?: string;
  enableZafiraValidationMonitor?: boolean;
  zafiraValidated?: number;
}
