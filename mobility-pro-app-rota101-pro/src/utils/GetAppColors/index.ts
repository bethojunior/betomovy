import AsyncStorage from '@react-native-async-storage/async-storage';
import apiMain from '../../client/api/apiMain';
import theme from '../../client/styles/theme';
import loginTheme from '../../client/styles/loginTheme';
import themeDriver from '../../driver/src/styles/theme';
import { ColorInverse } from '../../driver/src/hooks/colorInverse';
import { buildApp } from '../../constantBuild/config';

const getAppColors = async (appId = 4) => {
  try {
    const rawConfig = await AsyncStorage.getItem('cityConfig');
    const config = rawConfig ? JSON.parse(rawConfig) : null;

    const response = await apiMain.post('appconfig/findbyapp', {
      appId,
      cityId: config?.cityId || null,
    });

    if (response?.data?.data) {
      const data = response.data.data;
      await AsyncStorage.setItem('appConfig', JSON.stringify(data));
      if (data.logo) {
        await AsyncStorage.setItem('logo', data.logo);
      }

      loginTheme.images.logo = data.logo;
      loginTheme.colors.primary = data.mainColor;
      loginTheme.colors.secondary = data.mainColorText;
      loginTheme.colors.background_global = data.secondaryColor;

      theme.images.logo = data.logo;
      theme.colors.primary = data.mainColor;
      theme.colors.secondary = data.mainColorText;
      theme.colors.background_global = data.secondaryColor;

      themeDriver.images.logo = data.logo;
      themeDriver.colors.primary = data.mainColor;
      themeDriver.colors.secondary = data.mainColorText;
      themeDriver.colors.background_global = data.secondaryColor;

      const isDark = ColorInverse(data.mainColor) === 'dark';
      const textColor = isDark ? '#ffffff' : '#000000';
      theme.colors.primaryText = textColor;
      themeDriver.colors.primaryText = textColor;
      loginTheme.colors.primaryText = textColor;
    } else {
      const defaultLogo = buildApp().HOST_IMAGE_LOGO;
      theme.images.logo = defaultLogo;
      theme.colors.primary = '#00349a';
      theme.colors.secondary = '#000';
      theme.colors.background_global = '#f1f1f1';

      loginTheme.images.logo = defaultLogo;
      loginTheme.colors.primary = '#00349a';
      loginTheme.colors.secondary = '#000';
      loginTheme.colors.background_global = '#f1f1f1';

      themeDriver.images.logo = defaultLogo;
      themeDriver.colors.primary = '#00349a';
      themeDriver.colors.secondary = '#000';
      themeDriver.colors.background_global = '#f1f1f1';
      themeDriver.colors.primaryText = '#f1f1f1';
    }
  } catch (err) {
    console.log('Error in getAppColors:', err);
  }
};

export default getAppColors;
