import {useEffect, useRef, useState} from 'react';
import {
  ApiResponsePaginated,
  ApiResponsePaginatedData,
} from '../interfaces/api';

type Data<T, K extends string> = ApiResponsePaginatedData<T, K>;

export function usePaginatedList<T, K extends string>(
  fetcher: (page: number) => Promise<ApiResponsePaginated<T, K>>,
  key: K,
  initialData?: Data<T, K>,
  onDataChange?: (data: Data<T, K>) => void,
) {
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [isFetchingNextPage, setIsFetchingNextPage] = useState(false);

  const [data, setData] = useState<Data<T, K>>(
    initialData ??
      ({
        [key]: [] as T[],
        paginate: {
          startRow: 0,
          currentPage: 1,
          lastPage: 1,
          totalRows: '0',
          previousPage: 0,
          nextPage: 0,
          startRange: 0,
          endRange: 0,
          showStartButton: false,
          showEndButton: false,
        },
      } as Data<T, K>),
  );

  const isBusy = useRef(false);

  const hasNextPage = data.paginate.currentPage < data.paginate.lastPage;

  const updateData = (newData: Data<T, K>) => {
    setData(newData);
    onDataChange?.(newData);
  };

  const fetchTrips = async (pageNumber = 1, append = false) => {
    if (isBusy.current) return;
    isBusy.current = true;

    try {
      const response = await fetcher(pageNumber);
      if (response?.status) {
        const items = response.data[key];

        const nextData = {
          paginate: response.data.paginate,
          [key]: append ? [...data[key], ...items] : items,
        } as Data<T, K>;

        updateData(nextData);
      }
    } catch (error) {
      console.error('Falha ao carregar viagens', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
      setIsFetchingNextPage(false);
      isBusy.current = false;
    }
  };

  const refresh = () => {
    if (isLoading || isFetchingNextPage || isRefreshing) return;

    setIsRefreshing(true);
    fetchTrips(1, false);
  };

  const fetchNextPage = () => {
    if (isLoading || isRefreshing || isFetchingNextPage || !hasNextPage) return;

    setIsFetchingNextPage(true);
    fetchTrips(data.paginate.currentPage + 1, true);
  };

  useEffect(() => {
    if (!initialData || !data[key].length) setIsLoading(true);

    fetchTrips(1, false);
  }, []);

  return {
    data,
    isLoading,
    isRefreshing,
    isFetchingNextPage,
    hasNextPage,
    refresh,
    fetchNextPage,
  };
}
