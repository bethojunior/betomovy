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
  const user = localStorage.getItem('@App:user')
  const userData = user ? JSON.parse(user) : null;
  const { signed } = useContextAuth();

  useEffect(() => {
    const fetchUserGroup = async () => {
      const cachedUserGroup = localStorage.getItem("userGroup");

      if (cachedUserGroup) {
        setUserGroupList(JSON.parse(cachedUserGroup));
      } else {
        try {
          const response = await api.get("/userGroup", {
            headers: {
              userid: userData.idUser,
              token: userData.api_token,
            },
          });
          const data = response.data.response;
          setUserGroupList(data);
          localStorage.setItem("userGroup", JSON.stringify(data));
        } catch (error: any) {
          console.error("Erro ao buscar cities:", error);
        }
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
