import { createContext, useState } from "react";
import { ChildrenTypeProps } from "../@types";
import { MenuOptionsData } from "../@types/context";

const StateMenuOptionsContext = createContext<MenuOptionsData>(
  {} as MenuOptionsData
);

export const StateMenuOptionsProvider = ({ children }: ChildrenTypeProps) => {
  const [showMenu, setShowMenu] = useState(true);

  function handleShowMenu(active: boolean) {
    setShowMenu(active);
  }

  return (
    <StateMenuOptionsContext.Provider
      value={{ active: showMenu, handleShowMenu }}
    >
      {children}
    </StateMenuOptionsContext.Provider>
  );
};

export default StateMenuOptionsContext;
