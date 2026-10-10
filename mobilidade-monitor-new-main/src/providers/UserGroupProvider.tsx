// src/providers/UserGroupProvider.tsx
import { ReactNode, useEffect, useState } from "react";
import { UserGroupItem } from "../@types/context";
import { UserGroupContext } from "../contexts/dashboardData";
import api from "../services/api";
import { useContextAuth } from "../contexts/auth";

interface UserGroupProviderProps {
  children: ReactNode;
}

export const UserGroupProvider = ({ children }: UserGroupProviderProps) => {
  const [userGroupList, setUserGroupList] = useState<UserGroupItem[]>([]);
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
    const fetchUserGroup = async () => {
      const cachedUserGroup = localStorage.getItem("userGroup");

      if (cachedUserGroup && cachedUserGroup !== "undefined" && cachedUserGroup !== "null") {
        try {
          const parsed = JSON.parse(cachedUserGroup);
          if (Array.isArray(parsed)) {
            setUserGroupList(parsed);
            return;
          }
        } catch {
          localStorage.removeItem("userGroup");
        }
      }

      try {
        const userData = getUserData();
        const response = await api.get("/userGroup", {
          headers: {
            userid: userData?.idUser,
            token: userData?.api_token,
          },
        });
        const data = response.data?.response ?? response.data?.data ?? [];
        if (Array.isArray(data)) {
          setUserGroupList(data);
          localStorage.setItem("userGroup", JSON.stringify(data));
        }
      } catch (error: any) {
        console.error("Erro ao buscar userGroup:", error);
      }
    };

    if (signed) {
      fetchUserGroup();
    }
  }, [signed]);

  const setUserGroupData = (data: UserGroupItem[]) => {
    setUserGroupList(data);
  };

  return (
    <UserGroupContext.Provider
      value={{
        userGroupList,
        setUserGroupData,
      }}
    >
      {children}
    </UserGroupContext.Provider>
  );
};
