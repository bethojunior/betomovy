import React, {
  useContext,
  createContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import apiMain from '../../api/apiMain';
import {customToast} from '../../../utils/FlashMessage';
import {translate} from '../../locales';

interface IPlace {
  [key: string]: any;
}

interface LocalContextProps {
  places: IPlace[];
  placeSelected: IPlace | null;
  placeUser: IPlace | null;
  loading: boolean;
  position: {latitude: number; longitude: number} | null;
  lastPlaceSelected: IPlace;
  addLocal: (place: IPlace) => Promise<any>;
  addPlaceSelected: (place: IPlace) => Promise<void>;
  updateListPlaces: (places: IPlace[]) => Promise<void>;
  getLocalByPosition: (latitude: number, longitude: number) => void;
  setLoading: (loading: boolean) => void;
  setPosition: (position: {latitude: number; longitude: number}) => void;
  getLocals: () => Promise<void>;
  setLastPlaceSelected: (lastPlaceSelected: IPlace) => void;
}

const LocalContext = createContext<LocalContextProps>({} as LocalContextProps);

interface LocalProviderProps {
  children: ReactNode;
}
export const LocalProvider: React.FC<LocalProviderProps> = ({children}) => {
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

      setLoading(true);
    }

    loadStorageData();
  }, []);

  useEffect(() => {
    if (position) getLocalByPosition(position.latitude, position.longitude);
  }, [position]);

  async function getLocals() {
    const {data} = await apiMain.get('CustomerPlace/getAll');

    if (!data.status) {
      customToast(translate('contexts.error_local'), 'error');
    }

    return setPlaces(data.data);
  }

  async function addLocal(place) {
    const {
      data: {status, data, message, errors},
    } = await apiMain.post('CustomerPlace/Insert', place);

    if (!status) return {status, message, data: null, errors};

    return {message, status, data};
  }

  async function addPlaceSelected(place) {
    setPlaceSelected(place);

    await AsyncStorage.setItem('placeSelected', JSON.stringify(place));
  }

  async function updateListPlaces(places) {
    setPlaces(places);
    await AsyncStorage.setItem('places', JSON.stringify(places));
  }

  function getLocalByPosition(latitude, longitude) {
    async function getPlace(latitude, longitude) {
      const {
        data: {status, data},
      } = await apiMain.get(`geocoding/search?latlng=${latitude},${longitude}`);

      if (status)
        setPlaceUser({
          ...data,
          latitude,
          longitude,
        });
    }

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
