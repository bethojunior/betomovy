import {
  BatteryState,
  addBatteryLevelListener,
  addBatteryStateListener,
  getBatteryLevelAsync,
  getBatteryStateAsync,
} from 'expo-battery';
import {useEffect, useState} from 'react';

interface BatteryProps {
  level: number | null;
  state: BatteryState | null;
}

export const useBattery = () => {
  const [levelBattery, setLevelBattery] = useState<BatteryProps>({
    level: null,
    state: null,
  } as BatteryProps);

  const getLevelBattery = async () => {
    try {
      const responseBattery = await getBatteryLevelAsync();
      const batteryState = await getBatteryStateAsync();
      setLevelBattery({
        state: batteryState,
        level: responseBattery * 100,
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getLevelBattery();

    const listenerState = addBatteryStateListener(() => {
      getLevelBattery();
    });

    return () => {
      listenerState.remove();
    };
  }, []);

  return {battery: levelBattery};
};
