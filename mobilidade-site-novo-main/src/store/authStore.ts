import { create } from "zustand";

type PositionType = {
  latitude: number;
  longitude: number;
};

type useAuthStoreProps = {
  authenticated: boolean;
  setAuthenticated: (val: boolean) => void;
  devicePosition: PositionType;
  setDevicePosition: (position: PositionType) => void;
};

export const useAuthStore = create<useAuthStoreProps>((set) => ({
  authenticated: false,
  setAuthenticated: (val) => set(() => ({ authenticated: val })),
  devicePosition: {
    latitude: -3.7390887358876372,
    longitude: -38.53027147099403,
  },
  setDevicePosition: (val) => set(() => ({ devicePosition: val })),
}));
