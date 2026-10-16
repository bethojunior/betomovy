import AsyncStorage from '@react-native-async-storage/async-storage';
import apiMain from '../client/api/apiMain';
import loginTheme from '../client/styles/loginTheme';
import theme from '../client/styles/theme';
import themeDriver from '../driver/src/styles/theme';
import { ColorInverse } from '../driver/src/hooks/colorInverse';
import { useEffect, useState } from 'react';
import { AppConfigType } from '../interfaces/appConfig';
import { getDefaultLogo } from '../utils/logo';
import { buildApp } from '../constantBuild/config';
import { loadCache } from './useCityConfig';

const CACHE_KEY_APP_CONFIG = 'appConfig';
const CACHE_KEY_APP_PARTNER = '@mobilitypro:theme_app_partner_selected';

type ThemeReadyListener = () => void;
const themeReadyListeners: Set<ThemeReadyListener> = new Set();

export function onThemeReady(listener: ThemeReadyListener): () => void {
  themeReadyListeners.add(listener);
  return () => themeReadyListeners.delete(listener);
}

function notifyThemeReady() {
  themeReadyListeners.forEach(l => l());
}

export default function useAppTheme(appId: string | number = 4) {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { APP_PARTNER } = buildApp();

  const setThemeConfigAppPartner = (appPartnerSelected: any) => {
    if (!appPartnerSelected) return;

    if (appId == 4) {
      loginTheme.colors.primary = appPartnerSelected.primary_color;
      loginTheme.colors.secondary = appPartnerSelected.text_color;
      loginTheme.colors.background_global = appPartnerSelected.secondary_color;
      loginTheme.images.logo = appPartnerSelected.logo;
    }

    theme.colors.primary = appPartnerSelected.primary_color;
    theme.colors.secondary = appPartnerSelected.text_color;
    theme.colors.background_global = appPartnerSelected.secondary_color;
    theme.images.logo = appPartnerSelected.logo;

    themeDriver.colors.primary = appPartnerSelected.primary_color;
    themeDriver.colors.secondary = appPartnerSelected.text_color;
    themeDriver.colors.background_global = appPartnerSelected.secondary_color;
    themeDriver.images.logo = appPartnerSelected.logo;
  };

  const setColorScheme = (colorScheme: 'light' | 'dark') => {
    if (colorScheme === 'dark') {
      theme.colors.primaryText = '#ffffff';
      themeDriver.colors.primaryText = '#ffffff';
    } else {
      theme.colors.primaryText = '#000000';
      themeDriver.colors.primaryText = '#000000';
    }
  };

  const setThemeConfig = (appConfig: AppConfigType) => {
    if (appId == 4) {
      loginTheme.colors.primary = appConfig.mainColor;
      loginTheme.colors.secondary = appConfig.mainColorText;
      loginTheme.colors.background_global = appConfig.secondaryColor;
    }

    theme.colors.primary = appConfig.mainColor;
    theme.colors.secondary = appConfig.mainColorText;
    theme.colors.background_global = appConfig.secondaryColor;

    themeDriver.colors.primary = appConfig.mainColor;
    themeDriver.colors.secondary = appConfig.mainColorText;
    themeDriver.colors.background_global = appConfig.secondaryColor;
  };

  const setAppLogo = (url: string) => {
    if (appId == 4) loginTheme.images.logo = url;
    theme.images.logo = url;
    themeDriver.images.logo = url;
  };

  const getCachedConfig = async (): Promise<AppConfigType | null> => {
    try {
      const appConfigJson = await AsyncStorage.getItem(CACHE_KEY_APP_CONFIG);
      return appConfigJson ? JSON.parse(appConfigJson) : null;
    } catch {
      return null;
    }
  };

  useEffect(() => {
    async function loadAppConfigAndDataAsync() {
      try {
        const appPartnerJson = await AsyncStorage.getItem(CACHE_KEY_APP_PARTNER);
        const selectedAppPartner = appPartnerJson ? JSON.parse(appPartnerJson) : null;

        if (APP_PARTNER && selectedAppPartner) {
          setThemeConfigAppPartner(selectedAppPartner);
        }

        const cached = await getCachedConfig();
        if (cached) {
          if (APP_PARTNER && selectedAppPartner) {
            setThemeConfigAppPartner(selectedAppPartner);
          } else {
            setAppLogo(cached.logo);
            setThemeConfig(cached);
            setColorScheme(ColorInverse(cached.mainColor));
          }

          if (cached.appId == appId) {
            notifyThemeReady();
            setLoading(false);
          }
        }

        const config = loadCache();

        const { data } = await apiMain.post('appconfig/findbyapp', {
          appId,
          cityId: config?.cityId || null,
        });

        if (!data || !data.data) {
          const appLogoDefault = await getDefaultLogo();
          setAppLogo(appLogoDefault);
          return;
        }

        const appConfig: AppConfigType = data.data;

        await AsyncStorage.setItem(CACHE_KEY_APP_CONFIG, JSON.stringify(appConfig));
        await AsyncStorage.setItem('logo', appConfig.logo);

        if (APP_PARTNER && selectedAppPartner) {
          setThemeConfigAppPartner(selectedAppPartner);
        } else {
          setAppLogo(appConfig.logo);
          setThemeConfig(appConfig);
          setColorScheme(ColorInverse(appConfig.mainColor));
        }
      } catch (error) {
        setError(error);
      } finally {
        notifyThemeReady();
        setLoading(false);
      }
    }

    loadAppConfigAndDataAsync();
  }, []);

  return { loading, error };
}
