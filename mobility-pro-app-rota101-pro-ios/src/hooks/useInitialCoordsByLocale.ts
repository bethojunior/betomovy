import {useMemo} from 'react';
import {initialRegions} from '../../config/mapRegions';
import i18n from 'i18n-js';
import { storage } from '../common/services/mmkv/storage';

export function useInitialCoordsByLocale(fallbackLang: string = 'pt') {
  const lang = useMemo(() => i18n.locale?.split('_')[0], [i18n.locale]);

  const initialCoords = useMemo(() => {
    // 1. Tentar usar a última posição real salva (como na Uber — abre direto no local do usuário)
    const lastPos = storage.getItem('lastPositionSync', 'json') as any;
    const lat = lastPos?.coords?.latitude;
    const lng = lastPos?.coords?.longitude;
    if (lat && lng && !isNaN(lat) && !isNaN(lng) && lat !== 0 && lng !== 0) {
      return {
        latitude: lat,
        longitude: lng,
        latitudeDelta: 0.04,
        longitudeDelta: 0.04,
      };
    }

    // 2. Fallback para região do idioma (centro do país)
    return initialRegions[lang ?? ''] || initialRegions[fallbackLang];
  }, [lang, fallbackLang]);

  return {
    lang,
    initialCoords,
  };
}
