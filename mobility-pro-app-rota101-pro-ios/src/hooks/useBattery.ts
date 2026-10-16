import {BatteryState, getBatteryLevelAsync, getBatteryStateAsync} from 'expo-battery';

interface BatteryInfo {
  level: number | null;
  state: BatteryState | null;
}

export const useBattery = () => {
  const levelBatteryMin = 15;

  const getBatteryInfo = async (): Promise<BatteryInfo> => {
    try {
      const [responseBattery, batteryState] = await Promise.all([
        getBatteryLevelAsync(),
        getBatteryStateAsync(),
      ]);

      return {
        level: responseBattery * 100,
        state: batteryState,
      };
    } catch (error) {
      console.log(error);
      return {
        level: null,
        state: null,
      };
    }
  };

  const getLevelBattery = async () => {
    const {level} = await getBatteryInfo();
    return level;
  };

  const hasLowBattery = async (): Promise<boolean> => {
    const {level, state} = await getBatteryInfo();

    if (level === null) {
      return false;
    }

    if (state === BatteryState.CHARGING || state === BatteryState.FULL) {
      return false;
    }

    if (level < levelBatteryMin) {
      return true;
    }

    return false;
  };

  return {
    levelBatteryMin,
    getBatteryInfo,
    getLevelBattery,
    hasLowBattery,
  };
};
