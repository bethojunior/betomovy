import { create } from "zustand";

type useTripStoreProps = {
  trip: any;
  tripAccepted: any;
  setTrip: (val: any) => void;
  setTripAccepted: (val: any) => void;
  clearTripAccepted: () => void;
  clearTrip: () => void;
  position: any;
  setPosition: (val: any) => void;
  clearPosition: () => void;
};

export const useTripStore = create<useTripStoreProps>((set) => ({
  trip: {},
  tripAccepted: {},
  position: [],
  setTrip: (val) => set(() => ({ trip: val })),
  setTripAccepted: (val) => set(() => ({ tripAccepted: val })),
  setPosition: (val) => set(() => ({ position: val })),
  clearTrip: () => set(() => ({ trip: {} })),
  clearTripAccepted: () => set(() => ({ tripAccepted: {} })),
  clearPosition: () => set(() => ({ position: [] })),
}));
