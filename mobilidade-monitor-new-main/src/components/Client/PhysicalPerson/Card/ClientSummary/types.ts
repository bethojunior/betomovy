export interface ClientSummaryProps {
  platform?: string | null;
  appVersion: string;
  quantityTripsFinished: number;
  quantityTripsCancelled: number | null;
  voucherBalance: number | null;
  comission: number | null;
}
