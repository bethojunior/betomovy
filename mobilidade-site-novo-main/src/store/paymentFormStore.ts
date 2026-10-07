import { create } from "zustand";

type usePaymentFormStoreProps = {
  paymentForm: any;
  paymentSelected: string;
  setPaymentForm: (val: any) => void;
  setPaymentSelected: (val: string) => void;
};

export const usePaymentFormStore = create<usePaymentFormStoreProps>((set) => ({
  paymentForm: [],
  paymentSelected: "",
  setPaymentForm: (val) => set(() => ({ paymentForm: val })),
  setPaymentSelected: (val) => set(() => ({ paymentSelected: val })),
}));
