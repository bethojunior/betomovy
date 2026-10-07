declare type ApiResponse<T> = {
  status: boolean;
  response: T;
  message: string;
};
