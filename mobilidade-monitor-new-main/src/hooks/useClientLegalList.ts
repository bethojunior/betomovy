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
          const { data, last_page, current_page } = response.data.response;
          setListLegalPerson(data);
          setHasMore(current_page < last_page);
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
          const { data, last_page, current_page } = response.data.response;
          setListLegalPerson((prev) => [...prev, ...data]);
          setHasMore(current_page < last_page);
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
