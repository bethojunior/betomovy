import { useState, useEffect, useCallback, useRef } from "react";
import swal from "sweetalert";
import api from "../services/api";
import { Data, LegalSearchBy, UseClientLegalListReturn } from "../pages/Client/Legal/type";
import { useDebounce } from "./useDebounce";

export function useClientLegalList(cityId: number): UseClientLegalListReturn {
  const [listLegalPerson, setListLegalPerson] = useState<Data[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);

  const [valueSearchRaw, setValueSearchRaw] = useState("");
  const [valueSearch, setValueSearchDebounced] = useState("");
  const [filter, setFilter] = useState<LegalSearchBy>("fantasyName");

  const pageRef = useRef(1);

  const debouncedSetSearch = useDebounce(setValueSearchDebounced, 300);

  const setValueSearch = useCallback(
    (value: string) => {
      setValueSearchRaw(value);
      debouncedSetSearch(value);
    },
    [debouncedSetSearch]
  );

  const buildUrl = useCallback(
    (page: number, searchValue: string) => {
      const filterParam = searchValue ? `&${filter}=${searchValue}` : "";
      return `company?cityId=${cityId}&paginate=1&page=${page}${filterParam}`;
    },
    [cityId, filter]
  );

  const getCompanies = useCallback(() => {
    setLoading(true);
    pageRef.current = 1;
    api.get(buildUrl(1, valueSearch))
      .then((response) => {
        if (response.data?.status) {
          const resp = response.data?.response ?? response.data?.data;
          const items = Array.isArray(resp) ? resp : (resp?.data ?? []);
          const lastPage = typeof resp?.last_page === "number" ? resp.last_page : 1;
          const currentPage = typeof resp?.current_page === "number" ? resp.current_page : 1;
          setListLegalPerson(items);
          setHasMore(currentPage < lastPage);
        } else {
          setListLegalPerson([]);
          setHasMore(false);
        }
      })
      .catch(() => {
        swal({ title: "Erro ao pesquisar clientes jurídicos", icon: "error" });
      })
      .finally(() => setLoading(false));
  }, [buildUrl, valueSearch]);

  const fetchMore = useCallback(() => {
    setLoading(true);
    pageRef.current += 1;
    api.get(buildUrl(pageRef.current, valueSearch))
      .then((response) => {
        if (response.data?.status) {
          const resp = response.data?.response ?? response.data?.data;
          const items = Array.isArray(resp) ? resp : (resp?.data ?? []);
          const lastPage = typeof resp?.last_page === "number" ? resp.last_page : 1;
          const currentPage = typeof resp?.current_page === "number" ? resp.current_page : pageRef.current;
          setListLegalPerson((prev) => [...prev, ...items]);
          setHasMore(currentPage < lastPage);
        }
      })
      .catch(() => {
        swal({ title: "Erro ao pesquisar clientes jurídicos", icon: "error" });
        pageRef.current -= 1;
      })
      .finally(() => setLoading(false));
  }, [buildUrl, valueSearch]);

  useEffect(() => {
    getCompanies();
  }, [getCompanies]);

  return {
    listLegalPerson,
    loading,
    hasMore,
    filters: { valueSearch: valueSearchRaw, filter },
    setValueSearch,
    setFilter,
    fetchMore,
    refresh: getCompanies,
    setListLegalPerson,
  };
}
