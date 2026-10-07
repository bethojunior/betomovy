import { useState, useEffect, useRef, useCallback } from "react";
import api from "../services/api";
import swal from "sweetalert";
import { DriverData, DriverSearchBy, UseDriverListReturn } from "../pages/Driver/List/types";
import { useDebounce } from "./useDebounce";

export function useDriverList(): UseDriverListReturn {
  const [listDrivers, setListDrivers] = useState<DriverData[]>([]);
  const [filterLoading, setFilterLoading] = useState(false);
  const [hasMore, setHasMore] = useState(false);

  const [valueSearch, setValueSearchRaw] = useState("");
  const [debouncedValueSearch, setDebouncedValueSearch] = useState("");
  const [searchBy, setSearchBy] = useState<DriverSearchBy>("name");
  const [idStatusSearch, setIdStatusSearch] = useState(0);
  const [driverType, setDriverType] = useState(0);

  const pageRef = useRef(1);

  const debouncedSetSearch = useDebounce(setDebouncedValueSearch, 300);

  const setValueSearch = useCallback(
    (value: string) => {
      setValueSearchRaw(value);
      debouncedSetSearch(value);
    },
    [debouncedSetSearch]
  );

  const buildUrl = useCallback(
    (page: number, searchValue: string) => {
      const formattedSearch =
        searchBy === "document"
          ? searchValue.replace(/[.\-/]/g, "")
          : searchValue;
      const statusParam = idStatusSearch > 0 ? idStatusSearch : "";
      const typeParam = driverType > 0 ? driverType : "";
      return `driver?page=${page}&driverRegisterStatusId=${statusParam}&driverType=${typeParam}&${searchBy}=${formattedSearch}`;
    },
    [searchBy, idStatusSearch, driverType]
  );

  const getDrivers = useCallback(() => {
    setFilterLoading(true);
    pageRef.current = 1;
    api.get(buildUrl(1, debouncedValueSearch))
      .then((response) => {
        if (response.data?.status) {
          const { data, last_page, current_page } = response.data.response;
          setListDrivers(data);
          setHasMore(current_page < last_page);
        }
      })
      .catch(() => {
        swal({ title: "Erro ao pesquisar dados dos motoristas", icon: "error" });
      })
      .finally(() => setFilterLoading(false));
  }, [debouncedValueSearch, buildUrl]);

  const fetchMore = useCallback(() => {
    setFilterLoading(true);
    pageRef.current += 1;
    api.get(buildUrl(pageRef.current, debouncedValueSearch))
      .then((response) => {
        if (response.data?.status) {
          const { data, last_page, current_page } = response.data.response;
          setListDrivers((prev) => [...prev, ...data]);
          setHasMore(current_page < last_page);
        }
      })
      .catch(() => {
        swal({ title: "Erro ao pesquisar dados dos motoristas", icon: "error" });
        pageRef.current -= 1;
      })
      .finally(() => setFilterLoading(false));
  }, [buildUrl, debouncedValueSearch]);

  useEffect(() => {
    getDrivers();
  }, [getDrivers]);

  return {
    listDrivers,
    setListDirectly: setListDrivers,
    filterLoading,
    hasMore,
    filters: { valueSearch, searchBy, idStatusSearch, driverType },
    setValueSearch,
    setSearchBy,
    setIdStatusSearch,
    setDriverType,
    fetchMore,
    refresh: getDrivers,
  };
}
