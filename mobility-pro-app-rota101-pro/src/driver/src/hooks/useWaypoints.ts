import { useState, useCallback, useMemo } from 'react';
import { WaypointForApi, WaypointState } from './types';

export const useWaypoints = (cityConfig: { quantityTripWayPoints?: string }) => {
  const maxWaypoints = parseInt(cityConfig?.quantityTripWayPoints || '3', 10) || 3;
  const [waypoints, setWaypoints] = useState<WaypointState[]>([]);

  const showAddButton = waypoints.length < maxWaypoints;

  const addWaypoint = useCallback(() => {
    setWaypoints(prev => {
      if (prev.length >= maxWaypoints) return prev;
      return [
        ...prev,
        { id: `waypoint-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`, value: '', data: null, suggestions: [] },
      ];
    });
  }, [maxWaypoints]);

  const removeWaypoint = useCallback((id: string) => {
    setWaypoints(prev => prev.filter(wp => wp.id !== id));
  }, []);

  const updateValue = useCallback((id: string, value: string) => {
    setWaypoints(prev =>
      prev.map(wp => (wp.id === id ? { ...wp, value, data: null, suggestions: [] } : wp)),
    );
  }, []);

  const updateSuggestions = useCallback((id: string, suggestions: any[]) => {
    setWaypoints(prev =>
      prev.map(wp => (wp.id === id ? { ...wp, suggestions } : wp)),
    );
  }, []);

  const selectAddress = useCallback((id: string, addressData: Record<string, any>) => {
    setWaypoints(prev =>
      prev.map(wp =>
        wp.id === id
          ? { ...wp, value: addressData.address, data: addressData, suggestions: [] }
          : wp,
      ),
    );
  }, []);

  const reset = useCallback(() => setWaypoints([]), []);

  const waypointsForApi = useMemo<WaypointForApi[]>(
    () =>
      waypoints
        .filter((wp): wp is WaypointState & { data: Record<string, any> } => wp.data != null)
        .map(wp => ({
          address: wp.data.address,
          latitude: wp.data.latitude,
          longitude: wp.data.longitude,
          neighborhood: wp.data.neighborhood ?? null,
          cityId: wp.data.cityId ?? null,
        })),
    [waypoints],
  );

  return {
    waypoints,
    showAddButton,
    maxWaypoints,
    addWaypoint,
    removeWaypoint,
    updateValue,
    updateSuggestions,
    selectAddress,
    reset,
    waypointsForApi,
  };
};
