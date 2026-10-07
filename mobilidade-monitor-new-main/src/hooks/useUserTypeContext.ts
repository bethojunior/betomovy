import { useContext } from "react";
import { UserTypeContext } from "../contexts/dashboardData";
import { UserTypeContextData } from "../@types/context";

export const useUserTypeContext = (): UserTypeContextData => {
  const context = useContext(UserTypeContext);
  if (!context) {
    throw new Error("useUserTypeContext deve ser usado dentro do UserTypeProvider");
  }
  return context;
};
