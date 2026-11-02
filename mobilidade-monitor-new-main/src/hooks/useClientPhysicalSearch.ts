import { useState, useEffect, useCallback, useRef } from "react";
import { SelectValue } from "antd/lib/select";
import swal from "sweetalert";
import api from "../services/api";
import {
  ClientPhysicalSearchBy,
  UseClientPhysicalSearchReturn,
} from "../pages/Client/Physical/types";
import { ListClient } from "../components/Client/PhysicalPerson/Modal/Edition/type";
import { useDebounce } from "./useDebounce";

// "documents" (busca ampla) manda o mesmo parâmetro que "document" — o backend
// (CustomerRepository::findAll) já faz OR entre document/rg/om/texto do doc pra essa chave.
const SEARCH_PARAM_BY_RADIO: Record<ClientPhysicalSearchBy, string> = {
  name: "name",
  email: "email",
  document: "document",
  documents: "document",
  phone: "phone",
};

export function useClientPhysicalSearch(): UseClientPhysicalSearchReturn {
  const [infosListClient, setInfosListClient] = useState<ListClient[]>();
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState("");
  const [thisPage, setThisPage] = useState(1);
  const lastRequestId = useRef(0);

  const [searchRaw, setSearchRaw] = useState("");
  const [search, setSearchDebounced] = useState("");
  const [radio, setRadio] = useState<ClientPhysicalSearchBy>("name");
  const [status, setStatus] = useState<SelectValue>("");
  const [forceSelected, setForceSelected] = useState("");
  const [patentSelected, setPatentSelected] = useState("");

  const debouncedSetSearch = useDebounce(setSearchDebounced, 300);

  const setSearch = useCallback(
    (value: string) => {
      setSearchRaw(value);
      debouncedSetSearch(value);
    },
    [debouncedSetSearch]
  );

  const buildUrl = useCallback(
    (page: number) => {
      const searchParam = search ? `&${SEARCH_PARAM_BY_RADIO[radio]}=${encodeURIComponent(search)}` : "";
      return `customer?page=${page}&customerRegisterStatusId=${status}&militaryForceId=${forceSelected}&militaryGraduationId=${patentSelected}${searchParam}`;
    },
    [radio, search, status, forceSelected, patentSelected]
  );

  const onSearch = useCallback(
    (page = 1) => {
      const requestId = ++lastRequestId.current;
      setLoading(true);
      api
        .get(buildUrl(page))
        .then((values) => {
          if (requestId !== lastRequestId.current) return;
          setThisPage(page);
          if (!values.data.status) {
            swal({ title: values.data?.message || "Erro ao pesquisar clientes", icon: "error" });
            return;
          }

          const raw = values.data?.response?.data ?? values.data?.response ?? values.data?.data;
          const list = Array.isArray(raw) ? raw : [];

          const deduplicateList = (items: ListClient[]) => {
            const seen = new Set<number>();
            return items.filter((item) => {
              const id = item.idCustomer || item.idUser;
              if (seen.has(id)) return false;
              seen.add(id);
              return true;
            });
          };

          setPagination(values.data?.response?.next_page_url || "");
          if (page !== 1) {
            setInfosListClient((prev) => deduplicateList([...(prev ?? []), ...list]));
            return;
          }
          setInfosListClient(deduplicateList(list));
        })
        .catch(() => {
          if (requestId !== lastRequestId.current) return;
          swal({ title: "Erro ao pesquisar clientes", icon: "error" });
        })
        .finally(() => {
          if (requestId === lastRequestId.current) setLoading(false);
        });
    },
    [buildUrl]
  );

  const fetchMore = useCallback(() => {
    onSearch(thisPage + 1);
  }, [onSearch, thisPage]);

  useEffect(() => {
    onSearch();
  }, [onSearch]);

  return {
    infosListClient,
    loading,
    hasPagination: !!pagination,
    filters: { search: searchRaw, radio, status, forceSelected, patentSelected },
    setSearch,
    setRadio,
    setStatus,
    setForceSelected,
    setPatentSelected,
    onSearch,
    fetchMore,
    setInfosListClient,
  };
}
