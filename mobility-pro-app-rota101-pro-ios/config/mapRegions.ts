type Region = {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
};

export const initialRegions: Record<string, Region> = {
  pt: {
    // Brasil
    latitude: -14.235,
    longitude: -51.9253,
    latitudeDelta: 20,
    longitudeDelta: 20,
  },
  en: {
    // Estados Unidos
    latitude: 37.0902,
    longitude: -95.7129,
    latitudeDelta: 20,
    longitudeDelta: 20,
  },
  es: {
    // Espanha
    latitude: 40.4637,
    longitude: -3.7492,
    latitudeDelta: 10,
    longitudeDelta: 10,
  },
  fr: {
    // França
    latitude: 46.2276,
    longitude: 2.2137,
    latitudeDelta: 10,
    longitudeDelta: 10,
  },
};
