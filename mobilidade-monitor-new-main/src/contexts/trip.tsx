import { createContext, useCallback, useRef, useState } from "react";
import { TripContextValues, TripProviderProps } from "../@types/context";

const TRIP_REMOVE_ANIMATION_MS = 350;

const TripContext = createContext<TripContextValues>({} as TripContextValues);

export const TripProvider = ({ children }: TripProviderProps) => {
  const [trips, setTrips] = useState<TripDto[]>([]);
  const [removingTripReferences, setRemovingTripReferences] = useState<Set<string>>(new Set());
  const removalTimeoutsRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const reviveTrip = useCallback((tripReference: string) => {
    const timeoutId = removalTimeoutsRef.current.get(tripReference);
    if (timeoutId) {
      clearTimeout(timeoutId);
      removalTimeoutsRef.current.delete(tripReference);
    }

    setRemovingTripReferences(prev => {
      if (!prev.has(tripReference)) return prev;
      const next = new Set(prev);
      next.delete(tripReference);
      return next;
    });
  }, []);

  function handleSetTrips(trips: TripDto[]) {
    if (removalTimeoutsRef.current.size > 0) {
      const presentRefs = new Set(trips.map(trip => trip.tripReference));
      Array.from(removalTimeoutsRef.current.keys())
        .filter(ref => presentRefs.has(ref))
        .forEach(reviveTrip);
    }

    setTrips(trips);
  }

  function handleRemoveTrip(tripReference: string) {
    reviveTrip(tripReference);

    setRemovingTripReferences(prev => {
      const next = new Set(prev);
      next.add(tripReference);
      return next;
    });

    const timeoutId = setTimeout(() => {
      setTrips(prevTrips => prevTrips.filter(trip => trip.tripReference !== tripReference));
      reviveTrip(tripReference);
    }, TRIP_REMOVE_ANIMATION_MS);

    removalTimeoutsRef.current.set(tripReference, timeoutId);
  }

  function handleUpdateTrip(updatedTrip: TripDto) {
    reviveTrip(updatedTrip.tripReference);

    setTrips(prevTrips => {
      const tripIndex = prevTrips.findIndex(trip => trip.tripReference === updatedTrip.tripReference);

      if (tripIndex === -1) {
        // Se a trip não existe, adiciona ela
        return [...prevTrips, updatedTrip];
      } else {
        // Se a trip existe, atualiza ela
        const newTrips = [...prevTrips];
        newTrips[tripIndex] = updatedTrip;
        return newTrips;
      }
    });
  }

  return (
    <TripContext.Provider
      value={{
        trips,
        removingTripReferences,
        handleSetTrips,
        handleUpdateTrip,
        handleRemoveTrip,
      }}
    >
      {children}
    </TripContext.Provider>
  );
};

export default TripContext;
