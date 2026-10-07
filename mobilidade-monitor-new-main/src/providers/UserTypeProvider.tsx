import { ReactNode, useCallback, useEffect, useMemo, useState } from "react";
import api from "../services/api";
import { UserTypeContext } from "../contexts/dashboardData";
import { useContextAuth } from "../contexts/auth";

interface UserTypeProviderProps {
  children: ReactNode;
}

const USER_TYPES_STORAGE_KEY = "driverUserTypes";

export const UserTypeProvider = ({ children }: UserTypeProviderProps) => {
  const [userTypes, setUserTypes] = useState<DriverUserTypesProps[]>([]);
  const [loading, setLoading] = useState(false);
  const { signed } = useContextAuth();

  const refreshUserTypes = useCallback(async () => {
    setLoading(true);

    try {
      const response = await api.get("/userType/drivers");
      const data = Array.isArray(response.data?.response) ? response.data.response : [];

      setUserTypes(data);
      localStorage.setItem(USER_TYPES_STORAGE_KEY, JSON.stringify(data));
    } catch (error) {
      console.error("Erro ao buscar tipos de usuario:", error);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const cachedUserTypes = localStorage.getItem(USER_TYPES_STORAGE_KEY);

    if (cachedUserTypes) {
      try {
        const parsed = JSON.parse(cachedUserTypes);
        if (Array.isArray(parsed)) {
          setUserTypes(parsed);
        }
      } catch {
        localStorage.removeItem(USER_TYPES_STORAGE_KEY);
      }
    }
  }, []);

  useEffect(() => {
    if (!signed) {
      return;
    }

    refreshUserTypes();
  }, [refreshUserTypes, signed]);

  const userTypesById = useMemo(() => {
    return userTypes.reduce<Record<number, DriverUserTypesProps>>((acc, item) => {
      if (item?.idUserType != null) {
        acc[Number(item.idUserType)] = item;
      }

      return acc;
    }, {});
  }, [userTypes]);

  return (
    <UserTypeContext.Provider
      value={{
        userTypes,
        userTypesById,
        loading,
        refreshUserTypes,
      }}
    >
      {children}
    </UserTypeContext.Provider>
  );
};
