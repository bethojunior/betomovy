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
      const meta = responseData?.response || responseData?.data;
      if (meta && typeof meta === "object" && Array.isArray(meta.data)) {
        setPagination(meta);
        setData(meta.data);
      } else if (Array.isArray(meta)) {
        setPagination(undefined);
        setData(meta);
      } else {
        setPagination(undefined);
        setData([]);
      }
    } catch (error) {
      console.error("Erro ao buscar solicitações de exclusão:", error);
      setData([]);
      setPagination(undefined);
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
