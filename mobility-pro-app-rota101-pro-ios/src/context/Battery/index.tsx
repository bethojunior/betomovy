import {createContext, useState, useContext} from 'react';
import {getBatteryLevelAsync} from 'expo-battery';

import {ContextBatteryProps, ContextBatteryProviderProps} from './types';

const ContextBattery = createContext<ContextBatteryProps | undefined>(
  undefined,
);

export const ContextBatteryProvider = ({
  children,
}: ContextBatteryProviderProps) => {
  const [levelBattery, setLevelBattery] = useState<number | null>(null);
  const [levelBatteryMin, setLevelBatteryMin] = useState<number | null>(7);

  const getLevelBattery = async () => {
    try {
      const responseBattery = await getBatteryLevelAsync();
      setLevelBattery(responseBattery * 100);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <ContextBattery.Provider
      value={{levelBattery, levelBatteryMin, setLevelBattery, getLevelBattery}}
    >
      {children}
    </ContextBattery.Provider>
  );
};

export const UseContextBattery = () => {
  const response = useContext(ContextBattery);

  if (response === undefined) {
    throw new Error(
      'UseContextBattery needs to be used inside the ContextBatteryProvider',
    );
  }

  return response;
};
