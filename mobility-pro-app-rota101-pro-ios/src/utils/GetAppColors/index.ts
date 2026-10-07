import AsyncStorage from '@react-native-async-storage/async-storage';
import apiMain from '../../client/api/apiMain';
import theme from '../../client/styles/theme';
import loginTheme from '../../client/styles/loginTheme';
import themeDriver from '../../driver/src/styles/theme';
import {ColorInverse} from '../../driver/src/hooks/colorInverse';
import {buildApp} from '../../constantBuild/config';

const getAppColors = async (appId = 4) => {
  const config = JSON.parse(await AsyncStorage.getItem('cityConfig'));
  apiMain
    .post('appconfig/findbyapp', {appId, cityId: config?.cityId || null})
    .then(response => {
      if (response.data.data !== null && response.data.data !== undefined) {
        AsyncStorage.setItem('appConfig', JSON.stringify(response.data.data));
        AsyncStorage.setItem('logo', response.data.data.logo);

        if (appId == 4) {
          loginTheme.images.logo = response.data.data.logo;
          loginTheme.colors.primary = response.data.data.mainColor;
          loginTheme.colors.secondary = response.data.data.mainColorText;
          loginTheme.colors.background_global =
            response.data.data.secondaryColor;
        }

        theme.images.logo = response.data.data.logo;
        theme.colors.primary = response.data.data.mainColor;
        theme.colors.secondary = response.data.data.mainColorText;
        theme.colors.background_global = response.data.data.secondaryColor;

        themeDriver.images.logo = response.data.data.logo;
        themeDriver.colors.primary = response.data.data.mainColor;
        themeDriver.colors.secondary = response.data.data.mainColorText;
        themeDriver.colors.background_global =
          response.data.data.secondaryColor;

        if (ColorInverse(response.data.data.mainColor) === 'dark') {
          theme.colors.primaryText = '#ffffff';
        } else {
          theme.colors.primaryText = '#000000';
        }

        if (ColorInverse(response.data.data.mainColor) === 'dark') {
          themeDriver.colors.primaryText = '#ffffff';
        } else {
          themeDriver.colors.primaryText = '#000000';
        }
      } else {
        theme.images.logo = buildApp().HOST_IMAGE_LOGO;
        theme.colors.primary = '#00349a';
        theme.colors.secondary = '#000';
        theme.colors.background_global = '#f1f1f1';

        loginTheme.images.logo = buildApp().HOST_IMAGE_LOGO;
        loginTheme.colors.primary = '#00349a';
        loginTheme.colors.secondary = '#000';
        loginTheme.colors.background_global = '#f1f1f1';

        themeDriver.images.logo = buildApp().HOST_IMAGE_LOGO;
        themeDriver.colors.primary = '#00349a';
        themeDriver.colors.secondary = '#000';
        themeDriver.colors.background_global = '#f1f1f1';
        themeDriver.colors.primaryText = '#f1f1f1';
      }
    });
};

export default getAppColors;
