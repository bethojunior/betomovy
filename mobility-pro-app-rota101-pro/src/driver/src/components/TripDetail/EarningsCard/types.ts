export interface EarningsRow {
  label: string;
  valueLabel: string;
  valueColor?: string;
}

export interface EarningsCardProps {
  title: string;
  rows: EarningsRow[];
  totalLabel: string;
  totalValueLabel: string;
  viewFullCalculationLabel: string;
  onViewFullCalculation: () => void;
}
