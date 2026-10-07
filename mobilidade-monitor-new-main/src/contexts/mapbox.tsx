import { createContext, useContext, useEffect, useState } from "react";
import api from "../services/api";
import AuthContext from "./auth";

type MapboxContextType = {
  mapboxToken: string;
  loading: boolean;
  reloadToken: () => void;
};

const MapboxContext = createContext<MapboxContextType>({
  mapboxToken: "",
  loading: true,
  reloadToken: () => {},
});

export const MapboxProvider = ({ children }: { children: React.ReactNode }) => {
  const [mapboxToken, setMapboxToken] = useState("");
  const [loading, setLoading] = useState(true);

  const { responseDataUser } = useContext(AuthContext);

  const fetchToken = async () => {
    setLoading(true);
    try {
      if (!responseDataUser?.idUser) {
        console.warn("Usuário não autenticado ou idUser não disponível.");
        setLoading(false);
        return;
      }
      
      const response = await api.get("config/type/13", {
        headers: { userid: Number(responseDataUser.idUser) },
      });
      if (response.status) {
        const tokenObj = response.data.response.find(
          (item: any) => item.key === "mapbox_access_token_monitor"
        );
        if (tokenObj) {
          setMapboxToken(tokenObj.value);
        }
      }
    } catch (e) {
      console.error("Erro ao buscar token do Mapbox:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchToken();
  }, [responseDataUser?.idUser]);

  return (
    <MapboxContext.Provider
      value={{
        mapboxToken,
        loading,
        reloadToken: fetchToken,
      }}
    >
      {children}
    </MapboxContext.Provider>
  );
};

export const useMapbox = () => useContext(MapboxContext);