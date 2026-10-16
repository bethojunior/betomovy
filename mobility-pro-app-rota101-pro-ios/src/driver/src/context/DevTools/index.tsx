import { createContext, ReactNode, useCallback, useContext, useEffect, useRef, useState } from 'react';
import * as Location from 'expo-location';
import { useLocalProvider } from '../local';
import {
  calculateBearing,
  calculateDistanceFromLatLonInMeters,
} from '../../../../client/utils/position';

type Coord = { latitude: number; longitude: number };

const STEP_METERS = 20;
const SIMULATION_INTERVAL_MS = 1500;

const RAW_ROUTE: Coord[] = [
  { latitude: -20.91541, longitude: -48.50250 },
  { latitude: -20.91507, longitude: -48.50125 },
  { latitude: -20.92840, longitude: -48.49705 },
  { latitude: -20.93054, longitude: -48.49506 },
  { latitude: -20.93032, longitude: -48.49484 },
  { latitude: -20.93210, longitude: -48.49401 },
  { latitude: -20.93686, longitude: -48.49583 },
  { latitude: -20.94188, longitude: -48.49081 },
  { latitude: -20.94293, longitude: -48.49100 },
  { latitude: -20.94791, longitude: -48.49380 },
  { latitude: -20.94997, longitude: -48.49450 },
  { latitude: -20.95004, longitude: -48.49393 },
  { latitude: -20.95072, longitude: -48.49311 },
  { latitude: -20.95537, longitude: -48.48756 },
  { latitude: -20.95468, longitude: -48.48691 },
  { latitude: -20.95452, longitude: -48.48709 },
];

const interpolateRoute = (route: Coord[], stepMeters: number): Coord[] => {
  const result: Coord[] = [];
  for (let i = 0; i < route.length - 1; i++) {
    const from = route[i];
    const to = route[i + 1];
    const dist = calculateDistanceFromLatLonInMeters(from, to) ?? 0;
    const steps = Math.max(1, Math.round(dist / stepMeters));
    for (let s = 0; s < steps; s++) {
      const t = s / steps;
      result.push({
        latitude: from.latitude + (to.latitude - from.latitude) * t,
        longitude: from.longitude + (to.longitude - from.longitude) * t,
      });
    }
  }
  result.push(route[route.length - 1]);
  return result;
};

export const SIMULATION_ROUTE: Coord[] = interpolateRoute(RAW_ROUTE, STEP_METERS);

type SimulationState = {
  active: boolean;
  index: number;
};

type DevToolsContextType = {
  simulation: SimulationState;
  startSimulation: () => void;
  stopSimulation: () => void;
};

const DevToolsContext = createContext<DevToolsContextType>({
  simulation: { active: false, index: 0 },
  startSimulation: () => {},
  stopSimulation: () => {},
});

export const DevToolsProvider = ({ children }: { children: ReactNode }) => {
  const { setLocation } = useLocalProvider();
  const [simulation, setSimulation] = useState<SimulationState>({ active: false, index: 0 });
  const stopRef = useRef(true);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const setLocationRef = useRef(setLocation);

  useEffect(() => {
    setLocationRef.current = setLocation;
  }, [setLocation]);

  useEffect(() => () => {
    stopRef.current = true;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
  }, []);

  const stopSimulation = useCallback(async () => {
    stopRef.current = true;
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    setSimulation({ active: false, index: 0 });

    try {
      const real = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });
      setLocationRef.current?.(real);
    } catch (_) {}
  }, []);

  const startSimulation = useCallback(() => {
    stopRef.current = true;
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    stopRef.current = false;
    let index = 0;

    const restoreRealLocation = async () => {
      try {
        const real = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
        setLocationRef.current?.(real);
      } catch (_) {}
    };

    const tick = () => {
      if (stopRef.current || index >= SIMULATION_ROUTE.length) {
        setSimulation({ active: false, index: 0 });
        if (!stopRef.current) restoreRealLocation();
        return;
      }

      const current = SIMULATION_ROUTE[index];
      const prev = SIMULATION_ROUTE[Math.max(0, index - 1)];
      const heading = calculateBearing(prev, current);
      const distMeters = calculateDistanceFromLatLonInMeters(prev, current) ?? 0;
      const speed = distMeters / (SIMULATION_INTERVAL_MS / 1000);

      setLocationRef.current?.({
        coords: {
          latitude: current.latitude,
          longitude: current.longitude,
          altitude: 0,
          accuracy: 5,
          altitudeAccuracy: 0,
          heading,
          speed,
        },
        timestamp: Date.now(),
      } as any);

      setSimulation({ active: true, index });
      index += 1;
      timeoutRef.current = setTimeout(tick, SIMULATION_INTERVAL_MS);
    };

    tick();
  }, []);

  return (
    <DevToolsContext.Provider value={{ simulation, startSimulation, stopSimulation }}>
      {children}
    </DevToolsContext.Provider>
  );
};

export const useDevTools = () => useContext(DevToolsContext);
