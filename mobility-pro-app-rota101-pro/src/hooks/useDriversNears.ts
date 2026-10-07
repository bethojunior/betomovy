import { useEffect, useMemo, useState } from 'react';
import apiMain from '~/client/api/apiMain';
import { DriverNear } from '~/interfaces/driverNear';

interface DriversNearsOptions {
  latitude: number;
  longitude: number;
}

export const useDriversNears = (options?: DriversNearsOptions) => {
  const [data, setData] = useState<DriverNear[]>([]);
  const [canGetDriversNear, setCanGetDriversNear] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const latitude = useMemo(() => options?.latitude ?? null, [options?.latitude]);
  const longitude = useMemo(() => options?.longitude ?? null, [options?.longitude]);

  const getDriversOnline = async (latitude: number, longitude: number) => {
    try {
      const responseDriversOnline = await apiMain.get(
        `DriverClose/Get?lat=${latitude}&lng=${longitude}`,
      );

      if (responseDriversOnline.status) {
        setData(responseDriversOnline?.data?.data);
        setCanGetDriversNear(false);

        if (error) setError(null);
      } else {
        setError(responseDriversOnline?.data?.message);
      }

    } catch (error) {
      setError(error?.response?.message || error?.message || error);
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!latitude || !longitude) return;

    getDriversOnline(latitude, longitude);
  }, [latitude, longitude]);

  return {
    canGetDriversNear,
    getDriversOnline,
    data,
    loading,
    error,
  };
};
