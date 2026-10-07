import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect, useState } from 'react';
import { useNetwork } from '~/context/ConfigGlobal';
import api from '~/driver/src/api/apiMain';
import { Trip } from '~/interfaces/trip';
import { TripActive } from '~/interfaces/tripActive';
import { isNetworkError } from '~/utils/network';

type ActiveTripParams = {
  field: 'user' | 'driver';
  id: string;
};

export function useActiveTrips(params: ActiveTripParams) {
  const [data, setData] = useState<TripActive[]>([]);
  const [offlineData, setOfflineData] = useState<Trip | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const { itsNetwork } = useNetwork();

  const getTripsActives = async (params: ActiveTripParams) => {
    const response = await api.post<ApiResponse<TripActive[]>>(
      'Trip/Actives',
      { stdObject: [params] },
      { timeout: 30000 },
    );

    return response.data;
  };

  const fetchTripsActives = async (params: ActiveTripParams) => {
    if (!params?.field || !params?.id) return;

    try {
      const response = await getTripsActives(params);

      if (response.status) {
        if (error) setError(null);
        setData(response.data);
      } else {
        setError(response.message);
      }
    } catch (err) {
      if (isNetworkError(err)) {
        await getActiveTripsinCache();
      } else {
        setError((err as any)?.message || 'Erro desconhecido');
      }
    } finally {
      setLoading(false);
    }
  };

  const getActiveTripsinCache = async () => {
    try {
      const raw = await AsyncStorage.getItem('tripDriver');
      if (!raw) return;
      const trip: Trip = JSON.parse(raw);
      setData([{ tripReference: trip.tripReference, status: trip.status }]);
      setOfflineData(trip);
    } catch (err) {
      setError((err as any)?.message || 'Erro desconhecido');
    } finally {
      setLoading(false);
    }
  };

  const reload = () => fetchTripsActives(params);
  const update = (data: TripActive[]) => setData(data ?? []);

  useEffect(() => {
    if (!itsNetwork) {
      getActiveTripsinCache();
    } else {
      fetchTripsActives(params);
    }
  }, [itsNetwork]);

  return { data, offlineData, loading, reload, error, update };
}
