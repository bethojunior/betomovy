import {ActivityIndicator, View, Linking, AppState} from 'react-native';
import {Switch} from 'react-native-elements';
import {ScrollView} from 'react-native-gesture-handler';
import {Feather} from '@expo/vector-icons';
import {useEffect, useState} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {Camera} from 'expo-camera';
import * as Location from 'expo-location';
import {Audio} from 'expo-av';
import {useTheme} from 'styled-components';
import * as Notifications from 'expo-notifications';
import * as MediaLibrary from 'expo-media-library';
import {
  Content,
  Header,
  Section,
  SubTitle,
  Title,
  Button,
  ButtonText,
} from './styles';
import {useConfig} from '../../context/Config';
import {customToast} from '../../../../utils/FlashMessage';
import {translate} from '../../../../client/locales';
import {ModalSwitch} from '../../components/ModalSwitch';
import {If} from '../../components/If';

let addNew = [];

const statusPermission = {
  foreground: 'false',
  background: 'false',
  media: 'false',
  camera: 'false',
  audio: 'false',
  notifications: 'false',
};

export const Config = () => {
  const [appSettings, setAppSettings] = useState(null);
  const [optionClick, setOptionClick] = useState(true);
  const [optionTouch, setOptionTouch] = useState(true);
  const [optionFlashLight, setOptionFlashLight] = useState(false);
  const [loading, setLoading] = useState(true);
  const [modalNavigationExternal, setModalNavigationExternal] = useState(false);
  const [lastNavigationExternal, setLastNavigationExternal] = useState('');

  const {
    listPaymentForm,
    listChooseDriver,
    listImposition,
    getPaymentForm,
    getChooseDriverPaymentForm,
    getImpositionPaymentForm,
    updateChooseDriver,
  } = useConfig();

  const {colors} = useTheme();

  const getAppSettings = async () => {
    const settings = JSON.parse(await AsyncStorage.getItem('appSetting'));
    setAppSettings(settings);
    setOptionClick(settings.enableClick);
    setOptionTouch(settings.enableTouch);
    setOptionFlashLight(settings.enableFlashLight);
  };

  const getPermissionExpo = async () => {
    statusPermission.foreground = (
      await Location.getForegroundPermissionsAsync()
    ).status;
    statusPermission.background = (
      await Location.getBackgroundPermissionsAsync()
    ).status;
    statusPermission.media = (await MediaLibrary.getPermissionsAsync()).status;
    statusPermission.camera = (await Camera.getCameraPermissionsAsync()).status;
    statusPermission.audio = (await Audio.getPermissionsAsync()).status;
    statusPermission.notifications = (
      await Notifications.getPermissionsAsync()
    ).status;
  };

  useEffect(() => {
    const getList = async () => {
      await getPermissionExpo();
      await getPaymentForm();
      await getChooseDriverPaymentForm();
      await getImpositionPaymentForm();
      await getAppSettings();
      setLoading(false);
    };

    getList();
    getLastNavigation();
  }, []);

  useEffect(() => {
    if (listChooseDriver?.length > 0) {
      listChooseDriver?.map(item => {
        return addNew.push(item.tripPaymentFormId);
      });
    }
  }, [listChooseDriver?.length > 0]);

  useEffect(() => {
    if (appSettings === null) {
      getAppSettings();
    }

    AppState.addEventListener('change', state => {
      if (state === 'active') {
        getPermissionExpo();
      }
    });
  }, [appSettings]);

  const changePaymentForm = async (state: boolean, id: number) => {
    if (listImposition.some(el => el.tripPaymentFormId === id)) {
      return customToast(
        translate('configPage.text_payment_form_imposition'),
        'warning',
      );
    }

    if (state) {
      addNew.push(id);
    } else {
      addNew = addNew.filter(el => el !== id);
    }

    await updateChooseDriver(addNew);
    return getChooseDriverPaymentForm();
  };

  const changeAcceptMode = async (
    type: string,
    state: boolean,
    acceptMode = true,
  ) => {
    if (!state && acceptMode) {
      if (type === 'enableClick' && appSettings.enableTouch === false) {
        setOptionTouch(true);
        appSettings.enableTouch = true;
      }

      if (type === 'enableTouch' && appSettings.enableClick === false) {
        setOptionClick(true);
        appSettings.enableClick = true;
      }
    }

    appSettings[type] = state;
    setAppSettings(appSettings);
    await AsyncStorage.setItem('appSetting', JSON.stringify(appSettings));

    return customToast(
      translate('configPage.text_success_mode_accept'),
      'success',
    );
  };

  const getLastNavigation = async () => {
    const lastNavigation = await AsyncStorage.getItem('lastGps');
    if (lastNavigation && lastNavigation === 'waze') {
      setLastNavigationExternal('Waze');
    } else if (lastNavigation && lastNavigation === 'google') {
      setLastNavigationExternal('Google Maps');
    }
  };

  const ButonPermission = ({status}) => (
    <Button disabled={status} onPress={() => Linking.openSettings()}>
      <ButtonText disabled={status}>
        {translate(`configPage.text_${status}`)}
      </ButtonText>
    </Button>
  );

  return (
    <View
      style={{padding: 10, backgroundColor: colors.background_global, flex: 1}}
    >
      {loading ? (
        <ActivityIndicator size="large" color={colors.primary} />
      ) : (
        <ScrollView>
          <Content>
            <Header>
              <Feather
                name="settings"
                size={20}
                color={colors.background_global}
              />
              <Title>{translate('configPage.title_mode_accept')}</Title>
            </Header>
            <View>
              <Section>
                <SubTitle>
                  {translate('configPage.text_click_to_accept')}
                </SubTitle>
                <Switch
                  color={colors.primary}
                  value={optionClick}
                  onValueChange={e => {
                    setOptionClick(e);
                    changeAcceptMode('enableClick', e);
                  }}
                />
              </Section>
              <Section>
                <SubTitle>
                  {translate('configPage.text_drag_to_accept')}
                </SubTitle>
                <Switch
                  color={colors.primary}
                  value={optionTouch}
                  onValueChange={e => {
                    setOptionTouch(e);
                    changeAcceptMode('enableTouch', e);
                  }}
                />
              </Section>
              <Section>
                <SubTitle>Ligar lanterna ao sinalizar chegada</SubTitle>
                <Switch
                  color={colors.primary}
                  value={optionFlashLight}
                  onValueChange={e => {
                    setOptionFlashLight(e);
                    changeAcceptMode('enableFlashLight', e, false);
                  }}
                />
              </Section>
              <Section removeBorder>
                <SubTitle>
                  {translate('driverTrip.external_navigation_map')}
                </SubTitle>
                <Button
                  disabled={!!lastNavigationExternal}
                  onPress={async () => {
                    setModalNavigationExternal(true);
                  }}
                >
                  <ButtonText size={10} disabled={!!lastNavigationExternal}>
                    {lastNavigationExternal
                      ? lastNavigationExternal
                      : translate('orderPaymentForm.text_choose')}
                  </ButtonText>
                </Button>
                <If condition={!!lastNavigationExternal}>
                  <Feather
                    name="edit"
                    size={20}
                    onPress={() => {
                      setModalNavigationExternal(true);
                    }}
                    color={colors.primary}
                  />
                </If>
              </Section>
            </View>
          </Content>
          <Content>
            <Header>
              <Feather
                name="settings"
                size={20}
                color={colors.background_global}
              />
              <Title>{translate('configPage.title_permissions_app')}</Title>
            </Header>
            <Section>
              <SubTitle>
                {translate('configPage.text_acess_localization')}
              </SubTitle>
              <ButonPermission
                status={statusPermission?.foreground === 'granted'}
              />
            </Section>
            <Section>
              <SubTitle>
                {translate('configPage.text_acess_localization_background')}
              </SubTitle>
              <ButonPermission
                status={statusPermission?.background === 'granted'}
              />
            </Section>
            <Section>
              <SubTitle>{translate('configPage.text_acess_galery')} (Xiaomi)</SubTitle>
              <ButonPermission status={statusPermission?.media === 'granted'} />
            </Section>
            <Section>
              <SubTitle>{translate('configPage.text_acess_camera')}</SubTitle>
              <ButonPermission
                status={statusPermission?.camera === 'granted'}
              />
            </Section>
            <Section>
              <SubTitle>{translate('configPage.text_acess_audio')}</SubTitle>
              <ButonPermission status={statusPermission?.audio === 'granted'} />
            </Section>
            <Section removeBorder>
              <SubTitle>
                {translate('configPage.text_acess_notification')}
              </SubTitle>
              <ButonPermission
                status={statusPermission?.notifications === 'granted'}
              />
            </Section>
          </Content>
          <Content>
            <Header>
              <Feather
                name="settings"
                size={20}
                color={colors.background_global}
              />
              <Title>{translate('configPage.title_payment_form')}</Title>
            </Header>
            <View>
              {listPaymentForm?.map((item, index) => {
                return (
                  <Section
                    removeBorder={index === listPaymentForm.length - 1}
                    key={index}
                  >
                    <SubTitle>{item.name}</SubTitle>
                    <Switch
                      value={
                        listChooseDriver?.some(
                          el => el.tripPaymentFormId === item.idTripPaymentForm,
                        ) ||
                        listImposition?.some(
                          el => el.tripPaymentFormId === item.idTripPaymentForm,
                        )
                      }
                      color={colors.primary}
                      onValueChange={e => {
                        changePaymentForm(e, item.idTripPaymentForm);
                      }}
                    />
                  </Section>
                );
              })}
              <Section
              removeBorder
              style={{
                borderTopColor: colors.primary,
                borderTopWidth: 1,
              }}
              >
                <SubTitle>Todos</SubTitle>
                <Switch
                  value={
                    listChooseDriver?.length === 0
                  }
                  pointerEvents='none'
                  ios_backgroundColor={colors.primary}
                  color={colors.primary}
                />
              </Section>
            </View>
          </Content>
        </ScrollView>
      )}
      <ModalSwitch
        modalEdit={modalNavigationExternal}
        setModalEdit={setModalNavigationExternal}
        textButtons={{
          button1: 'Google',
          button2: 'Waze',
        }}
        title="Escolha o aplicativo de navegação externa"
        onClickButton1={async () => {
          setLastNavigationExternal('google');
          await AsyncStorage.setItem('lastGps', 'google');

          setModalNavigationExternal(false);
        }}
        onClickButton2={async () => {
          setLastNavigationExternal('waze');
          await AsyncStorage.setItem('lastGps', 'waze');
          setModalNavigationExternal(false);
        }}
      />
    </View>
  );
};
