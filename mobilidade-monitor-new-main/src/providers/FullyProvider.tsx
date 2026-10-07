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
  const user = localStorage.getItem('@App:user')
  const userData = user ? JSON.parse(user) : null;
  const { signed } = useContextAuth();


  useEffect(() => {
    const fetchCities = async () => {
      try {
        const response = await api.get("/city/actives/fully", {
          headers: {
            userid: userData.idUser,
            token: userData.api_token,
          },
        });
        const data = response.data.response;
        setFullyList(data);
        localStorage.setItem("fully", JSON.stringify(data));
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
