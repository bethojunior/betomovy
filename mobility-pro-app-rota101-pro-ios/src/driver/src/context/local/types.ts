import * as Location from 'expo-location';

export interface LocalContextType {
  location: Location.LocationObject;
  getPosition: () => Promise<Location.LocationSubscription>;
  getLocal: (latitude: number, longitude: number) => Promise<any>;
  setLocation: (location: Location.LocationObject) => void;
}

export interface LocalContextChildren {
  children: React.ReactNode;
}
