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
          : searchValue.trim();

      const params = new URLSearchParams();
      params.set("page", String(page));
      params.set("per_page", "20");
      params.set("allCities", "1"); // Exibe todos os motoristas globalmente sem restringir por cidade

      // Só envia filtros preenchidos (evita empty→null quebrando no Laravel)
      if (idStatusSearch > 0) {
        params.set("driverRegisterStatusId", String(idStatusSearch));
      }
      if (driverType > 0) {
        params.set("driverType", String(driverType));
      }
      if (formattedSearch) {
        params.set(searchBy, formattedSearch);
      }

      // Endpoint paginado correto (findAll). allCities=1 garante todos os motoristas cadastrados
      return `driver?${params.toString()}`;
    },
    [searchBy, idStatusSearch, driverType]
  );

  const getDrivers = useCallback(() => {
    setFilterLoading(true);
    pageRef.current = 1;
    api.get(buildUrl(1, debouncedValueSearch), { headers: { cityid: "0", cityId: "0" } })
      .then((response) => {
        if (response.data?.status && (response.data?.response || response.data?.data)) {
          const resp = response.data.response ?? response.data.data;
          const data = Array.isArray(resp) ? resp : (Array.isArray(resp?.data) ? resp.data : []);
          const last_page = resp?.last_page || (resp?.total ? Math.ceil(resp.total / (resp.per_page || 10)) : 1);
          const current_page = resp?.current_page || 1;
          setListDrivers(data);
          setHasMore(current_page < last_page);
        } else {
          setListDrivers([]);
          setHasMore(false);
        }
      })
      .catch(() => {
        swal({ title: "Erro ao pesquisar dados dos motoristas", icon: "error" });
        setListDrivers([]);
      })
      .finally(() => setFilterLoading(false));
  }, [debouncedValueSearch, buildUrl]);

  const fetchMore = useCallback(() => {
    setFilterLoading(true);
    pageRef.current += 1;
    api.get(buildUrl(pageRef.current, debouncedValueSearch), { headers: { cityid: "0", cityId: "0" } })
      .then((response) => {
        if (response.data?.status && (response.data?.response || response.data?.data)) {
          const resp = response.data.response ?? response.data.data;
          const data = Array.isArray(resp) ? resp : (Array.isArray(resp?.data) ? resp.data : []);
          const last_page = resp?.last_page || (resp?.total ? Math.ceil(resp.total / (resp.per_page || 10)) : 1);
          const current_page = resp?.current_page || 1;
          setListDrivers((prev) => [...(Array.isArray(prev) ? prev : []), ...data]);
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
