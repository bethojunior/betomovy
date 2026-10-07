import React, { createContext, useContext, useState } from "react";

const TabbarContext = createContext({
  visible: true,
  setVisibleTabbar: () => {},
});

export const TabbarProvider = ({ children }) => {
  const [visible, setVisible] = useState(true);

  function setVisibleTabbar(status) {
    setVisible(status);
  }

  return (
    <TabbarContext.Provider
      value={{ visible, setVisibleTabbar: setVisibleTabbar }}
    >
      {children}
    </TabbarContext.Provider>
  );
};

export function useTabbar() {
  const context = useContext(TabbarContext);

  return context;
}
