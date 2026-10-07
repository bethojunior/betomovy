import {decode, encode} from 'base-64';
import 'react-native-gesture-handler';
import 'expo-dev-client';
import './src/client/utils/config/reactotron';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {NavigationContainer} from '@react-navigation/native';
import {StatusBar} from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import {
  SafeAreaView,
  StyleSheet,
  KeyboardAvoidingView,
  Text,
  Modal,
  Platform,
  View,
  TouchableOpacity,
} from 'react-native';
import * as Location from 'expo-location';
import FlashMessage from 'react-native-flash-message';
import ToastManager from 'toastify-react-native';
import {
  useFonts,
  Roboto_300Light,
  Roboto_100Thin,
  Roboto_400Regular,
  Roboto_400Regular_Italic,
  Roboto_500Medium,
  Roboto_700Bold,
  Roboto_900Black,
} from '@expo-google-fonts/roboto';
import {
  Lato_900Black,
  Lato_400Regular,
  Lato_400Regular_Italic,
  Lato_700Bold,
  Lato_700Bold_Italic,
} from '@expo-google-fonts/lato';

import {
  SourceCodePro_400Regular,
  SourceCodePro_600SemiBold,
  SourceCodePro_700Bold,
  SourceCodePro_900Black,
} from '@expo-google-fonts/source-code-pro';

import {
  MavenPro_400Regular,
  MavenPro_500Medium,
  MavenPro_600SemiBold,
  MavenPro_700Bold,
  MavenPro_800ExtraBold,
  MavenPro_900Black,
} from '@expo-google-fonts/maven-pro';

import {Picker} from '@react-native-picker/picker';
import {useEffect, useState} from 'react';
import {ThemeProvider} from 'styled-components/native';
import {Provider} from 'react-native-paper';
import themeClient from './src/client/styles/theme';
import themeDriver from './src/driver/src/styles/theme';
import reactotron from './config/ReactotronConfig';
import 'intl';
import 'intl/locale-data/jsonp/pt-BR';
import apiMain from './src/client/api/apiMain';

import {ModulesProvider} from './src/client/contexts/modules';
import {AuthProvider} from './src/context/auth';
import Routes from './src/routes';
import {translate} from './src/client/locales';

import {ConfigAppContextSpeedmobProvider} from './src/context/ConfigAppSpeedmob';
import {ColorInverse} from './src/driver/src/hooks/colorInverse';
import TermsOfUseLocation from './src/client/pages/TermsOfUseLocation';

import {ApresentationApp} from './src/client/pages/AppApresentation';

import {buildApp} from './src/constantBuild/config';
import {ConfigGlobalProvider} from './src/context/ConfigGlobal';
import {useActiveKeepAwake} from './src/driver/src/hooks/keepAwake';

import {ContextBatteryProvider} from './src/context/Battery';
// import {DatadogProvider} from '@datadog/mobile-react-native';
import {config} from './src/client/services/datadog/initialize';
import {DriversNearsContextProvider} from './src/context/driversNears';

if (!global.btoa) {
  global.btoa = encode;
}

if (!global.atob) {
  global.atob = decode;
}

if (__DEV__) reactotron.connect();

export default function App() {
  const [modalSelect, setModalSelect] = useState(false);
  const [listCity, setListCity] = useState([]);
  const [citySelected, setCitySelected] = useState(0);
  const [updateColors, setUpdateColors] = useState<boolean>(false);
  const [modalTermLocation, setModalTermLocation] = useState(false);
  const [cityConfig, setCityConfig] = useState<null | number>(null);

  const [apresentationApp, setApresentationApp] = useState<boolean>(true);

  const getCities = async () => {
    const response = await apiMain('city/getactives');

    if (response.data.status) {
      setListCity(response.data.data);
    }
  };

  const firstLoad = async () => {
    await getCities();
  };

  useEffect(() => {
    firstLoad();
  }, []);

  useEffect(() => {
    const update = async () => {
      const colors = JSON.parse(
        await AsyncStorage.getItem('appConfigCustomer'),
      );
      if (colors !== null) {
        themeClient.images.logo = colors.logo;
        themeClient.colors.primary = colors.mainColor;
        themeClient.colors.secondary = colors.mainColorText;
        themeClient.colors.background_global = colors.secondaryColor;

        themeDriver.images.logo = colors.logo;
        themeDriver.colors.primary = colors.mainColor;
        themeDriver.colors.secondary = colors.mainColorText;
        themeDriver.colors.background_global = colors.secondaryColor;
      }

      if (ColorInverse(themeClient.colors.primary) === 'dark') {
        themeClient.colors.primaryText = '#ffffff';
      } else {
        themeClient.colors.primaryText = '#000000';
      }

      if (ColorInverse(themeDriver.colors.primary) === 'dark') {
        themeDriver.colors.primaryText = '#ffffff';
      } else {
        themeDriver.colors.primaryText = '#000000';
      }
    };

    update();
  }, [updateColors]);

  const [isLoaded] = useFonts({
    Roboto_100Thin,
    Roboto_300Light,
    Roboto_400Regular,
    Roboto_400Regular_Italic,
    Roboto_500Medium,
    Roboto_700Bold,
    Roboto_900Black,
    Lato_900Black,
    Lato_400Regular,
    Lato_400Regular_Italic,
    Lato_700Bold,
    Lato_700Bold_Italic,
    SourceCodePro_400Regular,
    SourceCodePro_600SemiBold,
    SourceCodePro_700Bold,
    SourceCodePro_900Black,
    MavenPro_400Regular,
    MavenPro_500Medium,
    MavenPro_600SemiBold,
    MavenPro_700Bold,
    MavenPro_800ExtraBold,
    MavenPro_900Black,
  });

  const hideSplashScreen = async () => {
    if (Platform.OS === 'ios') return;
    await SplashScreen.hideAsync();
  };

  const getConfigByPosition = async (position: {
    latitude: number;
    longitude: number;
  }) => {
    try {
      if (!position.latitude || !position.longitude) {
        return console.log('erro na localização');
      }
      if (cityConfig) {
        return cityConfig;
      }
      const {
        data: {data},
      } = await apiMain.post('City/getConfig', {
        lat: position.latitude,
        lng: position.longitude,
      });
      if (data) {
        setCityConfig(data?.cityId);
        await AsyncStorage.setItem('cityConfig', JSON.stringify(data));
      } else if (!data) {
        setModalSelect(true);
      }
      return data?.cityId || null;
    } catch (error) {
      console.log(error);
    }
  };

  const managerConfigPosition = async (
    lastPosition: {
      latitude: number;
      longitude: number;
      appId: number;
    } = null,
    cityIdSelected: number = null,
  ) => {
    try {
      let cityId: number;

      if (lastPosition === null && cityIdSelected === null) {
        let position = await Location.getLastKnownPositionAsync();
        if (position === null) {
          position = await Location.getCurrentPositionAsync({accuracy: 1});
        }
        lastPosition = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          appId: 4,
        };
        await AsyncStorage.setItem(
          'lastPosition',
          JSON.stringify(lastPosition),
        );
      }

      if (cityIdSelected === null) {
        cityId = await getConfigByPosition({
          latitude: lastPosition.latitude,
          longitude: lastPosition.longitude,
        });
      } else {
        cityId = cityIdSelected;
      }

      const response = await apiMain.post('appconfig/findbyapp', {
        appId: 4,
        cityId: cityId || null,
      });

      if (response.data.data !== null && response.data.data !== undefined) {
        await AsyncStorage.setItem(
          'appConfig',
          JSON.stringify(response.data.data),
        );
        await AsyncStorage.setItem('logo', response.data.data.logo);
        setUpdateColors(true);
      }

      if (Platform.OS === 'ios') return;
      await SplashScreen.hideAsync();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const getConfigAppCurrent = async () => {
      try {
        const response = await AsyncStorage.getItem(
          '@speedmob:CurrentAppConfig',
        );
        if (response) {
          const valueFormated = JSON.parse(response);

          themeDriver.images.logo = valueFormated?.logo;
          themeDriver.colors.primary = valueFormated?.primary_color;
          themeDriver.colors.background_global = valueFormated?.secondary_color;
          themeClient.images.logo = valueFormated?.logo;
          themeClient.colors.primary = valueFormated?.primary_color;
          themeClient.colors.background_global = valueFormated?.secondary_color;

          if (ColorInverse(themeClient.colors.primary) === 'dark') {
            themeClient.colors.primaryText = '#ffffff';
          } else {
            themeClient.colors.primaryText = '#000000';
          }

          if (ColorInverse(themeDriver.colors.primary) === 'dark') {
            themeDriver.colors.primaryText = '#ffffff';
          } else {
            themeDriver.colors.primaryText = '#000000';
          }
        }
      } catch (error) {
        console.log(error);
      }

      const {status} = await Location.getForegroundPermissionsAsync();

      if (status === 'granted') {
        await managerConfigPosition();
      }

      await hideSplashScreen();
    };

    getConfigAppCurrent();
  }, []);

  const showSplashScreen = async () => {
    try {
      if (Platform.OS === 'ios') return;
      await SplashScreen.preventAutoHideAsync();

      const lastPosition = JSON.parse(
        await AsyncStorage.getItem('lastPosition'),
      );

      if (lastPosition !== null) {
        await managerConfigPosition(lastPosition);
        return hideSplashScreen();
      }

      const {status} = await Location.getForegroundPermissionsAsync();

      if (status === 'granted') {
        await managerConfigPosition();
      }

      await hideSplashScreen();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    showSplashScreen();
  }, []);

  useEffect(() => {
    if (citySelected !== 0) {
      managerConfigPosition(null, citySelected);
    }
  }, [citySelected]);

  if (Platform.OS === 'android') {
    useActiveKeepAwake();
  }

  useEffect(() => {
    const getLastPosition = async () => {
      try {
        const {granted} = await Location.getForegroundPermissionsAsync();

        if (granted) {
          const responseLastPosition =
            await Location.getLastKnownPositionAsync();

          const objectPosition = {
            latitude: Number(responseLastPosition.coords.latitude),
            longitude: Number(responseLastPosition.coords.longitude),
          };

          const positionUser = await getConfigByPosition(objectPosition);

          const responseConfigAppCustomer = await apiMain.post(
            'appconfig/findbyapp',
            {
              appId: 4,
              cityId: positionUser || null,
            },
          );

          const responseConfigAppDriver = await apiMain.post(
            'appconfig/findbyapp',
            {
              appId: 2,
              cityId: positionUser || null,
            },
          );

          if (responseConfigAppCustomer.data.data === null) {
            themeClient.images.logo = buildApp().HOST_IMAGE_LOGO;
            themeClient.colors.primary = '#00349a';
            themeClient.colors.secondary = '#000';
            themeClient.colors.background_global = '#f1f1f1';

            themeDriver.images.logo = buildApp().HOST_IMAGE_LOGO;
            themeDriver.colors.primary = '#00349a';
            themeDriver.colors.secondary = '#000';
            themeDriver.colors.background_global = '#f1f1f1';

            // if (ColorInverse(responseConfigApp.data.data.mainColor) === 'dark') {
            //   themeClient.colors.primaryText = '#ffffff';
            // } else {
            //   themeClient.colors.primaryText = '#000000';
            // }

            // if (ColorInverse(responseConfigApp.data.data.mainColor) === 'dark') {
            //   themeDriver.colors.primaryText = '#ffffff';
            // } else {
            //   themeDriver.colors.primaryText = '#000000';
            // }

            await AsyncStorage.setItem('appConfigCustomer', 'null');
            await AsyncStorage.setItem('logo', buildApp().HOST_IMAGE_LOGO);
          } else {
            themeClient.images.logo = responseConfigAppCustomer.data.data.logo;
            themeClient.colors.primary =
              responseConfigAppCustomer.data.data.mainColor;
            themeClient.colors.secondary =
              responseConfigAppCustomer.data.data.mainColorText;
            themeClient.colors.background_global =
              responseConfigAppCustomer.data.data.secondaryColor;

            themeDriver.images.logo = responseConfigAppCustomer.data.data.logo;
            themeDriver.colors.primary =
              responseConfigAppCustomer.data.data.mainColor;
            themeDriver.colors.secondary =
              responseConfigAppCustomer.data.data.mainColorText;
            themeDriver.colors.background_global =
              responseConfigAppCustomer.data.data.secondaryColor;

            await AsyncStorage.setItem(
              'appConfigCustomer',
              JSON.stringify(responseConfigAppCustomer.data.data),
            );
            await AsyncStorage.setItem(
              'logo',
              responseConfigAppCustomer.data.data.logo,
            );
          }

          if (responseConfigAppDriver.data.data === null) {
            themeClient.images.logo = buildApp().HOST_IMAGE_LOGO;
            themeClient.colors.primary = '#00349a';
            themeClient.colors.secondary = '#000';
            themeClient.colors.background_global = '#f1f1f1';

            themeDriver.images.logo = buildApp().HOST_IMAGE_LOGO;
            themeDriver.colors.primary = '#00349a';
            themeDriver.colors.secondary = '#000';
            themeDriver.colors.background_global = '#f1f1f1';

            // if (ColorInverse(responseConfigApp.data.data.mainColor) === 'dark') {
            //   themeClient.colors.primaryText = '#ffffff';
            // } else {
            //   themeClient.colors.primaryText = '#000000';
            // }

            // if (ColorInverse(responseConfigApp.data.data.mainColor) === 'dark') {
            //   themeDriver.colors.primaryText = '#ffffff';
            // } else {
            //   themeDriver.colors.primaryText = '#000000';
            // }

            await AsyncStorage.setItem('appConfig', 'null');
            await AsyncStorage.setItem('logo', buildApp().HOST_IMAGE_LOGO);
          }
        }
      } catch (error) {
        console.log(error);
      }
    };

    getLastPosition();
  }, []);

  if (!isLoaded) return null;

  return (
    // <DatadogProvider configuration={config}>
    <ThemeProvider theme={themeClient}>
      <SafeAreaView style={styles.container}>
        <ConfigGlobalProvider>
          <ContextBatteryProvider>
            <Provider>
              <StatusBar
                style="light"
                backgroundColor="#000"
                translucent={false}
              />
              <NavigationContainer>
                <ConfigAppContextSpeedmobProvider>
                  <AuthProvider>
                    <DriversNearsContextProvider>
                      <ModulesProvider>
                        <KeyboardAvoidingView
                          behavior={
                            Platform.OS === 'ios' ? 'padding' : undefined
                          }
                          style={styles.container}
                        >
                          <Routes />

                          <FlashMessage
                            position="top"
                            style={{padding: 0, margin: 0}}
                          />
                          <ToastManager
                            position="top"
                            style={{
                              height: 80,
                              width: '100%',
                              alignItems: 'center',
                              marginTop: Platform.OS === 'ios' ? -70 : 40,
                              borderRadius: 8,
                            }}
                          />

                          <ApresentationApp
                            visible={apresentationApp}
                            setVisible={setApresentationApp}
                            setModalTerms={setModalTermLocation}
                          />

                          <TermsOfUseLocation
                            visible={modalTermLocation}
                            setVisible={setModalTermLocation}
                          />
                          <Modal visible={modalSelect}>
                            <View style={styles.modalContent}>
                              <Text style={styles.title}>
                                {translate('requestPermission.title')}
                              </Text>
                              <Text style={styles.text}>
                                {translate('requestPermission.text')}
                              </Text>

                              <Picker
                                style={styles.select}
                                selectedValue={citySelected}
                                onValueChange={value => setCitySelected(value)}
                              >
                                {listCity?.map(item => {
                                  return (
                                    <Picker.Item
                                      key={item.id}
                                      label={item.nome}
                                      value={item.id}
                                    />
                                  );
                                })}
                              </Picker>

                              <TouchableOpacity
                                style={styles.button}
                                onPress={() => {
                                  setModalSelect(false);
                                  managerConfigPosition(null, citySelected);
                                }}
                              >
                                <Text style={{fontSize: 15}}>
                                  {translate('requestPermission.button_text')}
                                </Text>
                              </TouchableOpacity>
                            </View>
                          </Modal>
                        </KeyboardAvoidingView>
                      </ModulesProvider>
                    </DriversNearsContextProvider>
                  </AuthProvider>
                </ConfigAppContextSpeedmobProvider>
              </NavigationContainer>
            </Provider>
          </ContextBatteryProvider>
        </ConfigGlobalProvider>
      </SafeAreaView>
    </ThemeProvider>
    // </DatadogProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: themeClient.colors.background_global,
  },
  modalContent: {
    position: 'absolute',
    top: 150,
    width: '95%',
    alignSelf: 'center',
    height: '30%',
    backgroundColor: themeClient.colors.background_global,
    borderRadius: 5,
    padding: 15,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  text: {
    textAlign: 'justify',
    marginTop: 10,
    fontSize: 15,
  },
  select: {
    backgroundColor: themeClient.colors.border_white_light,
    marginTop: 15,
  },
  button: {
    backgroundColor: themeClient.colors.border_white_light,
    alignSelf: 'flex-end',
    marginTop: 30,
    padding: 7,
    borderRadius: 5,
  },
});
