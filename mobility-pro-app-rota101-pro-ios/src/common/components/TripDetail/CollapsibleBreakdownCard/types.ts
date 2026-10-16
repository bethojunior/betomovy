export interface CollapsibleBreakdownRow {
  label: string;
  valueLabel: string;
  valueColor?: string;
}

export interface CollapsibleBreakdownCardProps {
  icon: string;
  title: string;
  rows: CollapsibleBreakdownRow[];
  totalLabel: string;
  totalValueLabel: string;
  totalValueColor?: string;
  defaultExpanded?: boolean;
  totalPosition?: 'top' | 'bottom';
  caption?: string;
  disclaimer?: string;
}
