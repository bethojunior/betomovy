import { ReactNode } from 'react';

export interface CollapsibleSectionProps {
  title: string;
  icon: ReactNode;
  expanded: boolean;
  onToggle: () => void;
  children: ReactNode;
}
