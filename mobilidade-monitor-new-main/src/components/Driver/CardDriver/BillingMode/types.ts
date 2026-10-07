export interface BillingModeProps {
  idDriver: number;
  prepaid: number;
  setLoading: (data: boolean) => void;
  onAlert: (
    message: string,
    type: "success" | "info" | "warning" | "error"
  ) => void;
}
