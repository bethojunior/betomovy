import {useMemo} from 'react';
import {initialRegions} from '../../config/mapRegions';
import i18n from 'i18n-js';

export function useInitialCoordsByLocale(fallbackLang: string = 'pt') {
  const lang = useMemo(() => i18n.locale?.split('_')[0], [i18n.locale]);

  const initialCoords = useMemo(
    () => initialRegions[lang ?? ''] || initialRegions[fallbackLang],
    [lang, initialRegions, fallbackLang],
  );

  return {
    lang,
    initialCoords,
  };
}
