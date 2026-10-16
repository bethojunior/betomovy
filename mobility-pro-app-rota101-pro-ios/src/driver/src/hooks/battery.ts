import * as Battery from 'expo-battery';
import * as Device from 'expo-device';
import {useEffect, useState} from 'react';

interface BatteryProps {
  level: number | null;
  state: Battery.BatteryState | null;
}

const LEVEL_MIN = 7;

const MOCK_BATTERY = {
  level: 100, // 🔁 muda aqui pra testar (ex: 15, 50, 5...)
  state: Battery.BatteryState.CHARGING,
};

export const useBattery = () => {
  const [levelBattery, setLevelBattery] = useState<BatteryProps>({
    level: null,
    state: null,
  });

  const getLevelBattery = async () => {
    try {
      if (!Device.isDevice) {
        setLevelBattery(MOCK_BATTERY);
        return;
      }

      const responseBattery = await Battery.getBatteryLevelAsync();
      const batteryState = await Battery.getBatteryStateAsync();

      if (responseBattery === -1) {
        console.warn('[useBattery] Nível de bateria indisponível');
        return;
      }

      setLevelBattery({
        state: batteryState,
        level: responseBattery * 100,
      });
    } catch (error) {
      console.warn('[useBattery] Erro ao obter bateria', error);
    }
  };

  useEffect(() => {
    getLevelBattery();

    if (!Device.isDevice) return;

    const listenerState = Battery.addBatteryStateListener(() => {
      getLevelBattery();
    });

    return () => {
      listenerState.remove();
    };
  }, []);

  return {battery: levelBattery, levelBatteryMin: LEVEL_MIN};
};
