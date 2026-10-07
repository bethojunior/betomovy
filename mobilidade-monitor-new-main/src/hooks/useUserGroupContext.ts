import { useContext } from "react";
import { UserGroupContext } from "../contexts/dashboardData";
import { UserGroupContextData } from "../@types/context";

export const useUserGroupContext = (): UserGroupContextData => {
  const context = useContext(UserGroupContext);
  if (!context) {
    throw new Error("useUserGroupContext deve ser usado dentro do UserGroupProvider");
  }
  return context;
};
