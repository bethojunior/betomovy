import { useEffect, useRef, useState } from 'react';
import apiMain from '../client/api/apiMain';
import { storage } from '../common/services/mmkv/storage';
import { calculateDistance } from '../utils/geolocation';
import { isNetworkError } from '../utils/network';
import { CityConfig, Position } from '../context/auth/types';
import { ApiResponse } from '../interfaces/api';

export const CACHE_KEY_CITY_CONFIG = '@App:cityConfig';
export const MIN_DISTANCE_KM = 1;

const CONFIG_TIMEOUT_MS = 10000;

export function loadCache(): CityConfig | null {
  return storage.getItem(CACHE_KEY_CITY_CONFIG, 'json') as CityConfig | null;
}

export function saveCache(config: CityConfig): void {
  storage.setItem(CACHE_KEY_CITY_CONFIG, config, 'json');
}

export function clearCache(): void {
  storage.removeItem(CACHE_KEY_CITY_CONFIG);
}

export function useCityConfig(position: Position) {
  const [data, setData] = useState<CityConfig | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const isBusy = useRef(false);
  const lastPosition = useRef<Position | null>(null);

  useEffect(() => {
    fetchCityConfig(position);
  }, []);

  function movedEnough(pos: Position): boolean {
    if (!lastPosition.current) return true;
    const km = calculateDistance(
      lastPosition.current.latitude,
      lastPosition.current.longitude,
      pos.latitude,
      pos.longitude,
    );
    return km >= MIN_DISTANCE_KM;
  }

  async function fetchCityConfig(position: Position): Promise<void> {
    if (!position.latitude || !position.longitude) return null;
    if (isBusy.current) return null;
    if (!movedEnough(position)) return null;

    isBusy.current = true;
    lastPosition.current = position;
    setIsLoading(true);
    setError(null);

    const cachedConfig = loadCache();
    if (cachedConfig && !data) {
      setData(cachedConfig);
    }

    try {
      const response = await apiMain.post<ApiResponse<CityConfig>>(
        'City/getConfig',
        {
          lat: position.latitude,
          lng: position.longitude,
        },
        { timeout: CONFIG_TIMEOUT_MS },
      );

      if (!response?.data?.status) {
        throw new Error(response?.data?.message || 'Falha ao buscar config da cidade');
      }

      const config = response.data.data;
      if (!config?.typeMoney) config.typeMoney = 'R$';

      if (JSON.stringify(config) !== JSON.stringify(cachedConfig)) {
        saveCache(config);
      }

      setData(config);
    } catch (err) {
      lastPosition.current = null;
      setError((err as any)?.message || 'Erro desconhecido');

      if (isNetworkError(err) && cachedConfig) {
        setData(cachedConfig);
        return;
      }

      setData(null);
    } finally {
      isBusy.current = false;
      setIsLoading(false);
    }
  }

  async function refresh(position: Position): Promise<void> {
    fetchCityConfig(position);
  }

  return { data, refresh, isLoading, error };
}
