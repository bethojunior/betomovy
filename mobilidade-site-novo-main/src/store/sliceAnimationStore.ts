import { create } from "zustand";

type useSliceAnimationStoreProps = {
  sliceValue: boolean;
  sliceIn: () => void;
  sliceOut: () => void;
};

export const useSliceAnimationStore = create<useSliceAnimationStoreProps>(
  (set) => ({
    sliceValue: false,
    sliceIn: () => set(() => ({ sliceValue: true })),
    sliceOut: () => set(() => ({ sliceValue: false })),
  })
);
