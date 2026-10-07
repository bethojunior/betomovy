import AsyncStorage from '@react-native-async-storage/async-storage';
import {useState} from 'react';

export type Place = {
  address: string;
  latitude: number;
  longitude: number;
  street: string | null;
  type: string | null;
  amountOfUse: number;
  isFavorite?: boolean;
};

export enum ObserverTypeEnum {
  'removed',
  'added',
  'updated',
}

const DEFAULT_PLACES_LIMIT = 10;

type PlaceResult = {
  places: Place[];
  savePlace: (place: Place) => Promise<void>;
  requestAllPlaces: (limit?: number) => Promise<void>;
  filterPlaces: (term: string) => Promise<Place[]>;
  removeAllPlaces: () => Promise<void>;
  removeByAddress(address: string): Promise<void>;
  toggleFavorite(address: string): Promise<void>;
  subscribe(type: ObserverTypeEnum, callback: () => void): UnsubriceObserver;
};

const KEY_STORE = '@data:places';

type UnsubriceObserver = () => void;

type ObserverType = {
  id: string;
  type: ObserverTypeEnum;
  callback: () => void;
};

const observers: ObserverType[] = [];

export const usePlaces = (): PlaceResult => {
  const [places, setPlaces] = useState<Place[]>([]);

  const savePlace = async (place: Place) => {
    if (!place?.address?.trim().length) {
      return;
    }

    const places = await getStoragePlaces();

    const placeFound = places.find(item => {
      return item.address === place.address;
    });

    if (!placeFound) {
      const newPlaces: Place[] = [
        {...place, amountOfUse: 1},
        ...places.slice(0, 19),
      ];

      return await AsyncStorage.setItem(KEY_STORE, JSON.stringify(newPlaces));
    }

    const amount = placeFound.amountOfUse || 0;

    placeFound.amountOfUse = amount + 1;

    await AsyncStorage.setItem(KEY_STORE, JSON.stringify(places));
  };

  const getStoragePlaces = async (): Promise<Place[]> => {
    const storage = await AsyncStorage.getItem(KEY_STORE);

    if (storage) {
      const places: Place[] = JSON.parse(storage);

      places.sort((place1, place2) => {
        const place1Amount = place1?.amountOfUse || 0;
        const place2Amount = place2?.amountOfUse || 0;

        return place2Amount - place1Amount;
      });

      return places.filter(place => place.address?.trim()?.length > 0);
    }

    return [];
  };

  const requestAllPlaces = async (limit: number = DEFAULT_PLACES_LIMIT) => {
    const places = await getStoragePlaces();

    setPlaces(places.slice(0, limit));
  };

  const filterPlaces = async (term: string): Promise<Place[]> => {
    const places = await getStoragePlaces();

    return places.filter(place => {
      return place.address
        .toLocaleLowerCase()
        .includes(term.toLocaleLowerCase());
    });
  };

  const notify = (type: ObserverTypeEnum) => {
    observers.forEach(observer => {
      if (observer.type === type) {
        observer.callback();
      }
    });
  };

  const removeAllPlaces = async (): Promise<void> => {
    await AsyncStorage.removeItem(KEY_STORE);
    setPlaces([]);

    notify(ObserverTypeEnum.removed);
  };

  const removeByAddress = async (address: string) => {
    const places = await getStoragePlaces();

    const newPlaces = places.filter(place => place.address !== address);

    await AsyncStorage.setItem(KEY_STORE, JSON.stringify(newPlaces));

    setPlaces(newPlaces);
    notify(ObserverTypeEnum.updated);
  };

  const toggleFavorite = async (address: string): Promise<void> => {
    const places = await getStoragePlaces();

    const newPlaces = places.map(place =>
      place.address === address
        ? {...place, isFavorite: !place.isFavorite}
        : place,
    );

    await AsyncStorage.setItem(KEY_STORE, JSON.stringify(newPlaces));

    setPlaces(newPlaces);
    notify(ObserverTypeEnum.updated);
  };

  const subscribe = (type: ObserverTypeEnum, callback: () => void) => {
    const id = `${Math.random() * 9999}`;

    observers.push({
      id,
      type,
      callback,
    });

    return () => {
      const index = observers.findIndex(observer => observer.id === id);

      observers.splice(index, 1);
    };
  };

  return {
    places,
    savePlace,
    requestAllPlaces,
    filterPlaces,
    removeAllPlaces,
    removeByAddress,
    toggleFavorite,
    subscribe,
  };
};
