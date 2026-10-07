import { ReactNode } from 'react';

export interface FilterFooterDataPage {
  currentPage?: number | string;
  lastPage?: number;
}

export interface FilterFooterProps {
  filterButtonLabel: string;
  filterTitle: string;
  paginationSeparator?: string;
  page: number;
  dataPage: FilterFooterDataPage;
  setPage: (value: number) => void;
  renderFilterContent: (close: () => void) => ReactNode;
}

export interface FilterOption<T> {
  label: string;
  value: T;
}
