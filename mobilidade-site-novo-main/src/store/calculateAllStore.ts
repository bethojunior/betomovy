import { create } from "zustand";

type useCalculateStoreProps = {
  calculate: any;
  setCalculate: (val: any) => void;
  clearSearch: boolean;
  setClearSearch: (val: boolean) => void;
};

export const useCalculateStore = create<useCalculateStoreProps>((set) => ({
  calculate: {},
  setCalculate: (val) => set(() => ({ calculate: val })),
  clearSearch: false,
  setClearSearch: (val) => set(() => ({ clearSearch: val })),
}));
