import { useContext } from "react";
import { FullyContext } from "../contexts/dashboardData";
import { FullyContextData } from "../@types/context";

export const useFullyContext = (): FullyContextData => {
  const context = useContext(FullyContext);
  if (!context) {
    throw new Error("useFullyContext deve ser usado dentro do FullyProvider");
  }
  return context;
};
