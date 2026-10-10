import { ReactNode, useEffect, useState } from "react";
import { FullyItem } from "../@types/context";
import { FullyContext } from "../contexts/dashboardData";
import api from "../services/api";
import { useContextAuth } from "../contexts/auth";


interface FullyProviderProps {
  children: ReactNode;
}

export const FullyProvider = ({ children }: FullyProviderProps) => {
  const [fullyList, setFullyList] = useState<FullyItem[]>([]);
  const { signed } = useContextAuth();

  const getUserData = () => {
    try {
      const user = localStorage.getItem("@App:user");
      if (user && user !== "undefined" && user !== "null") {
        return JSON.parse(user);
      }
    } catch {}
    return null;
  };

  useEffect(() => {
    const fetchCities = async () => {
      const cachedFully = localStorage.getItem("fully");
      if (cachedFully && cachedFully !== "undefined" && cachedFully !== "null") {
        try {
          const parsed = JSON.parse(cachedFully);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setFullyList(parsed);
          }
        } catch {
          localStorage.removeItem("fully");
        }
      }

      try {
        const userData = getUserData();
        const headers: Record<string, string> = {};
        if (userData?.idUser) headers.userid = userData.idUser;
        if (userData?.api_token) headers.token = userData.api_token;

        const response = await api.get("/city/actives/fully", { headers });
        const data = response.data?.response ?? response.data?.data ?? [];
        if (Array.isArray(data)) {
          setFullyList(data);
          localStorage.setItem("fully", JSON.stringify(data));
        }
      } catch (error: any) {
        console.error("Erro ao buscar cities:", error);
      }
    };
    if (signed) {
      fetchCities();
    }
  }, [signed]);

  return (
    <FullyContext.Provider
      value={{
        fullyList,
        setFullyList,
      }}
    >
      {children}
    </FullyContext.Provider>
  );
};
