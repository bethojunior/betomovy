export interface DriverSummaryProps {
  rating: number;
  blockedBalance: number | null;
  balance: number | null;
  maximumAmountNegativeBalanceDriver: number | null;
  appVersion: string;
  platform: string | null;
  hours_worked: number | null;
  hours_open: number | null;
}
