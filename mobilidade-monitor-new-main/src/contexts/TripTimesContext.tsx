import React, { createContext, useContext, useState, useCallback, ReactNode } from 'react';

interface TripTimesContextData {
  getTripStartTime: (tripReference: string) => string | null;
  setTripStartTime: (tripReference: string, startTime: string) => void;
  removeTripStartTime: (tripReference: string) => void;
}

const TripTimesContext = createContext<TripTimesContextData>({} as TripTimesContextData);

interface TripTimesProviderProps {
  children: ReactNode;
}

export const TripTimesProvider: React.FC<TripTimesProviderProps> = ({ children }) => {
  const [tripStartTimes, setTripStartTimes] = useState<Record<string, string>>({});

  const getTripStartTime = useCallback((tripReference: string): string | null => {
    return tripStartTimes[tripReference] || null;
  }, [tripStartTimes]);

  const setTripStartTime = useCallback((tripReference: string, startTime: string): void => {
    setTripStartTimes(prev => {
      if (prev[tripReference] === startTime) {
        return prev;
      }
      return {
        ...prev,
        [tripReference]: startTime
      };
    });
  }, []);

  const removeTripStartTime = useCallback((tripReference: string): void => {
    setTripStartTimes(prev => {
      if (!(tripReference in prev)) {
        return prev;
      }
      const { [tripReference]: _, ...rest } = prev;
      return rest;
    });
  }, []);

  return (
    <TripTimesContext.Provider value={{
      getTripStartTime,
      setTripStartTime,
      removeTripStartTime
    }}>
      {children}
    </TripTimesContext.Provider>
  );
};

export const useTripTimes = (): TripTimesContextData => {
  const context = useContext(TripTimesContext);
  if (!context) {
    throw new Error('useTripTimes must be used within a TripTimesProvider');
  }
  return context;
};