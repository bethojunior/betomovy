import { create } from "zustand";

type Location = {
  address: string;
  lat: string;
  lng: string;
};

type RouteProps = {
  origin: Location;
  destination: Location;
  polyline: [][];
};

type useRouteStoreProps = {
  route: any;
  setRoute: (val: any) => void;
  clearRoute: () => void;
};

export const useRouteStore = create<useRouteStoreProps>((set) => ({
  route: {},
  setRoute: (val) => set(() => ({ route: val })),
  clearRoute: () => set(() => ({ route: {} })),
}));
