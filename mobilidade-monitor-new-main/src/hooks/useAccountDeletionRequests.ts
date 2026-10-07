import { useCallback, useEffect, useState } from "react";
import api from "../services/api";
import {
  AccountDeletionRequestItem,
  AccountDeletionRequestType,
  PaginationMeta,
  UseAccountDeletionRequestsReturn,
} from "../components/Shared/AccountDeletionRequests/types";

/** Lista, aprova e cancela solicitações de exclusão de conta (cliente ou motorista). */
export function useAccountDeletionRequests(
  type: AccountDeletionRequestType
): UseAccountDeletionRequestsReturn {
  const [data, setData] = useState<AccountDeletionRequestItem[]>();
  const [pagination, setPagination] = useState<PaginationMeta>();
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);

  const fetchList = useCallback(async () => {
    setLoading(true);
    try {
      const { data: responseData } = await api.get(
        `user/removeAccountsRequest?type=${type}&page=${page}`
      );
      setPagination(responseData.response);
      setData(responseData.response.data);
    } finally {
      setLoading(false);
    }
  }, [type, page]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  const approve = useCallback(
    async (userId: number): Promise<boolean> => {
      setLoading(true);
      try {
        const { data: responseData } = await api.put(
          `user/${userId}/removeAccountUser`
        );
        if (responseData.status) await fetchList();
        return !!responseData.status;
      } finally {
        setLoading(false);
      }
    },
    [fetchList]
  );

  const cancel = useCallback(
    async (userId: number): Promise<boolean> => {
      setLoading(true);
      try {
        const { data: responseData } = await api.put(
          `user/${userId}/cancelRemoveAccountUser`
        );
        if (responseData.status) await fetchList();
        return !!responseData.status;
      } finally {
        setLoading(false);
      }
    },
    [fetchList]
  );

  const goToPage = useCallback((newPage: number) => {
    setPage(newPage);
  }, []);

  return { data, pagination, loading, page, goToPage, approve, cancel };
}
