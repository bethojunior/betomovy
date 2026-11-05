import React, {
  useContext,
  createContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiMain from '../../api/apiMain';
import { customToast } from '../../../utils/FlashMessage';
import { translate } from '../../locales';
import { calculateDistance } from '../../../utils/geolocation';
import { TIMEOUT_SHORT } from '~/common/constants/timeouts';
import { loadSession } from '../../../utils/Storage/sessionStorage';
import * as Location from 'expo-location';

interface IPlace {
  [key: string]: any;
}

interface LocalContextProps {
  places: IPlace[];
  placeSelected: IPlace | null;
  placeUser: IPlace | null;
  loading: boolean;
  position: { latitude: number; longitude: number } | null;
  lastPlaceSelected: IPlace;
  addLocal: (place: IPlace) => Promise<any>;
  addPlaceSelected: (place: IPlace) => Promise<void>;
  updateListPlaces: (places: IPlace[]) => Promise<void>;
  getLocalByPosition: (latitude: number, longitude: number) => void;
  setLoading: (loading: boolean) => void;
  setPosition: (position: { latitude: number; longitude: number }) => void;
  getLocals: () => Promise<void>;
  setLastPlaceSelected: (lastPlaceSelected: IPlace) => void;
}

const LocalContext = createContext<LocalContextProps>({} as LocalContextProps);

interface LocalProviderProps {
  children: ReactNode;
}
export const LocalProvider: React.FC<LocalProviderProps> = ({ children }) => {
  const [places, setPlaces] = useState<IPlace[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [placeSelected, setPlaceSelected] = useState<IPlace | null>(null);
  const [placeUser, setPlaceUser] = useState<IPlace | null>(null);
  const [position, setPosition] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [lastPlaceSelected, setLastPlaceSelected] = useState<IPlace>(
    {} as IPlace,
  );

  useEffect(() => {
    async function loadStorageData() {
      const storagePlaces = await AsyncStorage.getItem('places');
      const storagePlaceSelected = await AsyncStorage.getItem('placeSelected');

      if (storagePlaces) setPlaces(JSON.parse(storagePlaces));

      if (storagePlaceSelected)
        setPlaceSelected(JSON.parse(storagePlaceSelected));

      // loading=true significa bootstrap concluído (Sections usa !loading como spinner)
      setLoading(true);
    }

    loadStorageData();
    getLocals();

    let watchSub: Location.LocationSubscription | null = null;

    async function initGpsLocation() {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status === 'granted') {
          // 1. Posição rápida do cache para não deixar mapa em branco
          const lastLoc = await Location.getLastKnownPositionAsync().catch(() => null);
          if (lastLoc?.coords) {
            setPosition({
              latitude: lastLoc.coords.latitude,
              longitude: lastLoc.coords.longitude,
            });
            getLocalByPosition(lastLoc.coords.latitude, lastLoc.coords.longitude);
          }

          // 2. Alta precisão GPS atual (como na Uber)
          const currentLoc = await Location.getCurrentPositionAsync({
            accuracy: Location.Accuracy.High,
          }).catch(() => null);
          if (currentLoc?.coords) {
            setPosition({
              latitude: currentLoc.coords.latitude,
              longitude: currentLoc.coords.longitude,
            });
            getLocalByPosition(currentLoc.coords.latitude, currentLoc.coords.longitude);
          }

          // 3. Monitoramento contínuo em tempo real conforme usuário se desloca
          watchSub = await Location.watchPositionAsync(
            {
              accuracy: Location.Accuracy.Balanced,
              distanceInterval: 15,
              timeInterval: 10000,
            },
            loc => {
              if (loc?.coords) {
                setPosition({
                  latitude: loc.coords.latitude,
                  longitude: loc.coords.longitude,
                });
              }
            }
          ).catch(() => null);
        }
      } catch (err) {
        console.warn('Erro ao inicializar GPS LocalContext:', err);
      }
    }

    initGpsLocation();

    return () => {
      watchSub?.remove();
    };
  }, []);

  useEffect(() => {
    if (!position?.latitude || !position?.longitude) return;
    if (!placeUser?.latitude || !placeUser?.longitude) {
      getLocalByPosition(position.latitude, position.longitude);
      return;
    }
    if (placeUser.latitude === position.latitude && placeUser.longitude === position.longitude) return;
    const distance = calculateDistance(
      placeUser.latitude,
      placeUser.longitude,
      position.latitude,
      position.longitude
    );
    if (distance < 0.1) return;
    getLocalByPosition(position.latitude, position.longitude);
  }, [position?.latitude, position?.longitude, placeUser?.latitude, placeUser?.longitude]);

  async function getLocals() {
    try {
      const session = await loadSession();
      if (!session?.token) {
        return;
      }
      const response = await apiMain.get('CustomerPlace/getAll', {
        metadata: { skipSessionCheck: true },
      } as any);
      if (response?.data?.status && Array.isArray(response?.data?.data)) {
        setPlaces(response.data.data);
      }
    } catch (error: any) {
      console.warn('Erro ao buscar lugares salvos:', error?.message || error);
    }
  }

  async function addLocal(place) {
    try {
      const {
        data: { status, data, message, errors },
      } = await apiMain.post('CustomerPlace/Insert', place);

      if (!status) return { status, message, data: null, errors };

      if (data && status) {
        const newPlaces = [...places, data];
        setPlaces(newPlaces);
        try {
          await AsyncStorage.setItem('places', JSON.stringify(newPlaces));
        } catch (storageError) {
          console.error('Erro ao salvar lugares no AsyncStorage:', storageError?.message || storageError);
        }
      }

      return { message, status, data };
    } catch (error) {
      console.error('Erro ao adicionar lugar:', error?.message || error);
      return { status: false, message: translate('contexts.error_local') || 'Erro ao adicionar endereço', data: null, errors: null };
    }
  }

  async function addPlaceSelected(place) {
    setPlaceSelected(place);

    await AsyncStorage.setItem('placeSelected', JSON.stringify(place));
  }

  async function updateListPlaces(places) {
    setPlaces(places);
    await AsyncStorage.setItem('places', JSON.stringify(places));
  }

  function getPlace(latitude, longitude) {
    apiMain
      .get(`geocoding/search?latlng=${latitude},${longitude}`, {
        timeout: TIMEOUT_SHORT,
      })
      .then(({ data: { status, data } }) => {
        if (status && data) {
          setPlaceUser({
            ...data,
            latitude,
            longitude,
          });
        }
      })
      .catch(error => {
        console.error('Erro ao buscar localização:', error?.message || error);
      });
  }

  function getLocalByPosition(latitude, longitude) {
    getPlace(latitude, longitude);
  }

  return (
    <LocalContext.Provider
      value={{
        places,
        placeSelected,
        placeUser,
        loading,
        position,
        addLocal,
        addPlaceSelected,
        updateListPlaces,
        getLocalByPosition,
        setPosition,
        getLocals,
        lastPlaceSelected,
        setLastPlaceSelected,
        setLoading,
      }}
    >
      {children}
    </LocalContext.Provider>
  );
};

export const useLocal = () => {
  const context = useContext(LocalContext);

  return context;
};
