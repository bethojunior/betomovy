export interface PaginationApi {
  startRow: number;
  currentPage: number;
  lastPage: number;
  totalRows: string;
  previousPage: number;
  nextPage: number;
  startRange: number;
  endRange: number;
  showStartButton: boolean;
  showEndButton: boolean;
}

export interface ApiResponse<T> {
  status: boolean;
  message: string;
  data: T;
  errors: any | null;
}

export type ApiResponsePaginatedData<T, K extends string> = {
  paginate: PaginationApi;
} & Record<K, T[]>;

export type ApiResponsePaginated<T, K extends string> = ApiResponse<
  ApiResponsePaginatedData<T, K>
>;
