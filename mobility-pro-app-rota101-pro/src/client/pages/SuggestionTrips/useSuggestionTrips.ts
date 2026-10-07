import { useFocusEffect } from '@react-navigation/native';
import { useCallback, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { SuggestionService } from '~/interfaces/suggestionTrip';

const SUGGESTION_STORAGE_KEYS = {
  listServices: '@App:listServices',
  lastServices: '@App:lastServices',
  isPriceTurbined: '@App:isPriceTurbined',
} as const;

export const useSuggestionTrips = () => {
  const [services, setServices] = useState<SuggestionService[]>([]);
  const [lastService, setLastService] = useState<SuggestionService | null>(null);
  const [loading, setLoading] = useState(true);
  const [isTurbine, setIsTurbine] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const loadData = async () => {
        setLoading(true);
        try {
          const [listServices, lastServiceRaw, turbined] = await Promise.all([
            AsyncStorage.getItem(SUGGESTION_STORAGE_KEYS.listServices),
            AsyncStorage.getItem(SUGGESTION_STORAGE_KEYS.lastServices),
            AsyncStorage.getItem(SUGGESTION_STORAGE_KEYS.isPriceTurbined),
          ]);

          setServices(listServices ? JSON.parse(listServices) : []);
          setLastService(lastServiceRaw ? JSON.parse(lastServiceRaw) : null);
          setIsTurbine(Boolean(turbined ? JSON.parse(turbined) : false));
        } catch (error) {
          console.error('Failed to load suggestion data from AsyncStorage:', error);
          setServices([]);
          setLastService(null);
          setIsTurbine(false);
        } finally {
          setLoading(false);
        }
      };

      loadData();
    }, []),
  );

  return { services, lastService, loading, isTurbine };
};
