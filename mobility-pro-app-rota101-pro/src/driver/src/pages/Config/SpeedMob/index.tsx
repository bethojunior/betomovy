import { ActivityIndicator, View } from 'react-native';
import { Switch } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';
import { Feather, Ionicons } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Camera } from 'expo-camera';
import * as Location from 'expo-location';
import { Audio } from 'expo-av';
import { useTheme } from 'styled-components';
import * as Notifications from 'expo-notifications';
import { useNavigation } from '@react-navigation/native';
import {
  Content,
  Header,
  Section,
  SubTitle,
  Title,
  Button,
  ButtonText,
  ButtonBack,
  HeaderSpeedMob,
  TitleHeaderSpeedMob,
} from './styles';
import { useConfig } from '../../../context/Config';
import { customToast } from '../../../../../utils/FlashMessage';
import { translate } from '../../../../../client/locales';

import theme from '../../../styles/theme';

let addNew = [];

export const ConfigSpeedMob = () => {
  const [appSettings, setAppSettings] = useState(null);
  const [optionClick, setOptionClick] = useState(true);
  const [optionTouch, setOptionTouch] = useState(true);
  const [optionFlashLight, setOptionFlashLight] = useState(false);
  const [permissions, setPermissions] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();

  const {
    listPaymentForm,
    listChooseDriver,
    listImposition,
    getPaymentForm,
    getChooseDriverPaymentForm,
    getImpositionPaymentForm,
    updateChooseDriver,
  } = useConfig();

  const { colors } = useTheme();

  const getAppSettings = async () => {
    const settings = JSON.parse(await AsyncStorage.getItem('appSetting'));
    setAppSettings(settings);
    setOptionClick(settings.enableClick);
    setOptionTouch(settings.enableTouch);
    setOptionFlashLight(settings.enableFlashLight);
  };

  const updateStorage = async (type: string, status: string) => {
    const _permissions = { ...permissions };
    if (status === 'denied') {
      _permissions[type] = status;
      customToast(
        translate('configPage.text_permission_denied_perma'),
        'warning',
      );
    } else if (status !== 'granted') {
      _permissions[type] = false;
      customToast(translate('configPage.text_permission_denied'), 'warning');
    } else {
      _permissions[type] = true;
      customToast(translate('configPage.text_permission_success'), 'success');
    }

    setPermissions(_permissions);
  };

  useEffect(() => {
    const getList = async () => {
      await getPaymentForm();
      await getChooseDriverPaymentForm();
      await getImpositionPaymentForm();
      await getAppSettings();
      setLoading(false);
    };

    getList();
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

  return (
    <View>
      <HeaderSpeedMob backgroundColor={theme.colors.primary}>
        <ButtonBack onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back" size={30} color={theme.colors.background_global} />
        </ButtonBack>
        <TitleHeaderSpeedMob>
          {translate('menu.text_config')}
        </TitleHeaderSpeedMob>
      </HeaderSpeedMob>
      {loading ? (
        <ActivityIndicator size="large" color={theme.colors.primary} />
      ) : (
        <>
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
                    color={theme.colors.primary}
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
                    color={theme.colors.primary}
                    value={optionTouch}
                    onValueChange={e => {
                      setOptionTouch(e);
                      changeAcceptMode('enableTouch', e);
                    }}
                  />
                </Section>
                <Section removeBorder>
                  <SubTitle>Ligar lanterna ao sinalizar chegada</SubTitle>
                  <Switch
                    color={theme.colors.primary}
                    value={optionFlashLight}
                    onValueChange={e => {
                      setOptionFlashLight(e);
                      changeAcceptMode('enableFlashLight', e, false);
                    }}
                  />
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
                <Button
                  disabled={permissions?.location !== false}
                  onPress={async () => {
                    const { status } =
                      await Location.getForegroundPermissionsAsync();
                    await updateStorage('location', status);
                  }}
                >
                  <ButtonText disabled={permissions?.location !== false}>
                    {translate(`configPage.text_${permissions?.location}`) ||
                      translate('configPage.text_false')}
                  </ButtonText>
                </Button>
              </Section>
              <Section>
                <SubTitle>
                  {translate('configPage.text_acess_localization_background')}
                </SubTitle>
                <Button
                  disabled={permissions?.locationBackground !== false}
                  onPress={async () => {
                    const { status } =
                      await Location.requestBackgroundPermissionsAsync();
                    updateStorage('locationBackground', status);
                  }}
                >
                  <ButtonText
                    disabled={permissions?.locationBackground !== false}
                  >
                    {translate(
                      `configPage.text_${permissions?.locationBackground}`,
                    ) || translate('configPage.text_false')}
                  </ButtonText>
                </Button>
              </Section>
              <Section>
                <SubTitle>
                  {translate('configPage.text_acess_galery')}  (Xiaomi)
                </SubTitle>
              </Section>
              <Section>
                <SubTitle>
                  {translate('configPage.text_acess_camera')}
                </SubTitle>
                <Button
                  disabled={permissions?.camera !== false}
                  onPress={async () => {
                    const { status } =
                      await Camera.requestCameraPermissionsAsync();
                    updateStorage('camera', status);
                  }}
                >
                  <ButtonText disabled={permissions?.camera !== false}>
                    {translate(`configPage.text_${permissions?.camera}`) ||
                      translate('configPage.text_false')}
                  </ButtonText>
                </Button>
              </Section>
              <Section>
                <SubTitle>
                  {translate('configPage.text_acess_audio')}
                </SubTitle>
                <Button
                  disabled={permissions?.audio !== false}
                  onPress={async () => {
                    const { status } = await Audio.requestPermissionsAsync();
                    updateStorage('audio', status);
                  }}
                >
                  <ButtonText disabled={permissions?.audio !== false}>
                    {translate(`configPage.text_${permissions?.audio}`) ||
                      translate('configPage.text_false')}
                  </ButtonText>
                </Button>
              </Section>
              <Section removeBorder>
                <SubTitle>
                  {translate('configPage.text_acess_notification')}
                </SubTitle>
                <Button
                  disabled={permissions?.notification !== false}
                  onPress={async () => {
                    const { status } =
                      await Notifications.getPermissionsAsync();
                    updateStorage('notification', status);
                  }}
                >
                  <ButtonText disabled={permissions?.notification !== false}>
                    {translate(
                      `configPage.text_${permissions?.notification}`,
                    ) || translate('configPage.text_false')}
                  </ButtonText>
                </Button>
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
                            el =>
                              el.tripPaymentFormId === item.idTripPaymentForm,
                          ) ||
                          listImposition?.some(
                            el =>
                              el.tripPaymentFormId === item.idTripPaymentForm,
                          )
                        }
                        color={theme.colors.primary}
                        onValueChange={e => {
                          changePaymentForm(e, item.idTripPaymentForm);
                        }}
                      />
                    </Section>
                  );
                })}
              </View>
            </Content>
          </ScrollView>
        </>
      )}
    </View>
  );
};
