import { ReactNode } from "react";

export interface ContextBatteryProviderProps{
    children: ReactNode;
}

export interface ContextBatteryProps{
    levelBattery: number | null;
    levelBatteryMin: number;
    setLevelBattery: (data: number | null) => void;
    getLevelBattery: () => void;
}