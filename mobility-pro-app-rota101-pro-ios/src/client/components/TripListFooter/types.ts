export interface TripListDataPage {
  currentPage?: number;
  lastPage?: number;
}

export interface TripListFooterProps {
  selectedValue: boolean | string;
  setSelectedValue: (value: boolean | string) => void;
  page: number;
  dataPage: TripListDataPage;
  setPage: (value: number) => void;
}

export interface FilterOption {
  label: string;
  value: boolean | string;
}
