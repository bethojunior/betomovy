import { useCallback, useState } from 'react';
import apiMain from '../api/apiMain';

export interface TripReportType {
  idTripReportType: string;
  name: string;
}

export const useTripReportTypes = () => {
  const [tripReportTypes, setTripReportTypes] = useState<TripReportType[]>([]);
  const [loading, setLoading] = useState(false);

  const getTripReportTypes = useCallback(async () => {
    setLoading(true);
    try {
      const response = await apiMain.get('/TripReportType/GetAll');
      setTripReportTypes(response?.data?.data ?? []);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }, []);

  return { tripReportTypes, loading, getTripReportTypes };
};
