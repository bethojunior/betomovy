import { useRef, useState } from 'react';
import apiMain from '~/client/api/apiMain';
import { translate } from '~/client/locales';
import { DestinationFree } from '~/client/pages/Trip/types';
import { TIMEOUT_SHORT } from '~/common/constants/timeouts';

const DEBOUNCE_MS = 300;

type UseAddressGeocodingResult = {
  address: DestinationFree | undefined;
  loading: boolean;
  error: string;
  fetchAddress: (region: { latitude: number; longitude: number }) => void;
  cancelFetch: () => void;
  setAddress: (data: DestinationFree | undefined) => void;
};

export function useAddressGeocoding(): UseAddressGeocodingResult {
  const [address, setAddress] = useState<DestinationFree>();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const pendingRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const requestIdRef = useRef(0);

  const cancelFetch = () => {
    if (pendingRef.current) {
      clearTimeout(pendingRef.current);
      pendingRef.current = null;
    }
    requestIdRef.current++;
    setLoading(false);
  };

  const fetchAddress = (region: { latitude: number; longitude: number }) => {
    if (pendingRef.current) clearTimeout(pendingRef.current);
    const requestId = ++requestIdRef.current;

    pendingRef.current = setTimeout(async () => {
      setLoading(true);
      try {
        const {
          data: { data },
        } = await apiMain.get(
          `geocoding/search?latlng=${region.latitude},${region.longitude}`,
          { timeout: TIMEOUT_SHORT },
        );
        if (requestId !== requestIdRef.current) return;
        setError(data ? '' : translate('home.errorLocation'));
        setAddress(data);
      } catch (error) {
        if (requestId === requestIdRef.current) {
          setError(translate('home.errorLocation'));
        }
      } finally {
        if (requestId === requestIdRef.current) setLoading(false);
      }
    }, DEBOUNCE_MS);
  };

  return { address, loading, error, fetchAddress, cancelFetch, setAddress };
}
