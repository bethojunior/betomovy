export interface TripListDataPage {
  currentPage?: number;
  lastPage?: number;
}

export interface TripListFooterProps {
  selectedValue: string | null;
  setSelectedValue: (value: string | null) => void;
  page: number;
  dataPage: TripListDataPage;
  setPage: (value: number) => void;
}

export interface FilterOption {
  label: string;
  value: string | null;
}
