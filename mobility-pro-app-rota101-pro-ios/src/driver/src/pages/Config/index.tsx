import { ActivityIndicator, View, Linking, PermissionsAndroid, Platform } from 'react-native';
import { Audio } from 'expo-av';
import { Camera } from 'expo-camera';
import * as Location from 'expo-location';
import * as Notifications from 'expo-notifications';
import { Switch } from 'react-native-elements';
import { ScrollView } from 'react-native-gesture-handler';
import { Feather } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTheme } from 'styled-components';
import {
  Content,
  Header,
  Section,
  SubTitle,
  Title,
  Button,
  ButtonText,
} from './styles';
import { useConfig } from '../../context/Config';
import { customToast } from '../../../../utils/FlashMessage';
import { translate } from '../../../../client/locales';
import { ModalSwitch } from '../../components/ModalSwitch';
import { If } from '../../components/If';
import { useAuth } from '../../../../context/auth';
import { useDriverAppReport } from '../../hooks/useDriverAppReport';
import { useDevicePermissions } from '../../hooks/useDevicePermissions';

const samePaymentId = (a: unknown, b: unknown) => Number(a) === Number(b);

export const Config = () => {
  const [appSettings, setAppSettings] = useState(null);
  const [optionClick, setOptionClick] = useState(true);
  const [optionTouch, setOptionTouch] = useState(true);
  const [optionFlashLight, setOptionFlashLight] = useState(false);
  const [loading, setLoading] = useState(true);
  const [modalNavigationExternal, setModalNavigationExternal] = useState(false);
  const [lastNavigationExternal, setLastNavigationExternal] = useState('');
  const [savingPayment, setSavingPayment] = useState(false);

  const {
    listPaymentForm,
    listChooseDriver,
    listImposition,
    getPaymentForm,
    getChooseDriverPaymentForm,
    getImpositionPaymentForm,
    updateChooseDriver,
    setListChooseDriver,
  } = useConfig();

  const { colors } = useTheme();
  const { userDriver } = useAuth();
  const { sendReport: sendAppReport } = useDriverAppReport();
  const { permissions, refresh: refreshPermissions } = useDevicePermissions();

  const handleRequestPermission = async (type?: 'foreground' | 'background' | 'camera' | 'audio' | 'notifications' | 'media') => {
    try {
      if (type === 'audio') {
        if (Platform.OS === 'android') {
          try {
            const granted = await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.RECORD_AUDIO);
            if (granted === PermissionsAndroid.RESULTS.GRANTED) {
              await refreshPermissions();
              return;
            }
          } catch {}
        }
        const res = await Audio.requestPermissionsAsync();
        if (res.granted) {
          await refreshPermissions();
          return;
        }
      } else if (type === 'camera') {
        const res = await Camera.requestCameraPermissionsAsync();
        if (res.granted) {
          await refreshPermissions();
          return;
        }
      } else if (type === 'foreground') {
        const res = await Location.requestForegroundPermissionsAsync();
        if (res.granted) {
          await refreshPermissions();
          return;
        }
      } else if (type === 'background') {
        const res = await Location.requestBackgroundPermissionsAsync();
        if (res.granted) {
          await refreshPermissions();
          return;
        }
      } else if (type === 'notifications') {
        const res = await Notifications.requestPermissionsAsync();
        if (res.granted) {
          await refreshPermissions();
          return;
        }
      }
    } catch (e) {
      console.warn('[handleRequestPermission] erro ao solicitar permissao:', e);
    }
    Linking.openSettings();
  };

  const getAppSettings = async () => {
    const settings = JSON.parse(await AsyncStorage.getItem('appSetting'));
    setAppSettings(settings);
    setOptionClick(settings.enableClick);
    setOptionTouch(settings.enableTouch);
    setOptionFlashLight(settings.enableFlashLight);
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
    getLastNavigation();
  }, []);

  useEffect(() => {
    if (appSettings === null) {
      getAppSettings();
    }
  }, [appSettings]);

  const selectedPaymentIds = (listChooseDriver || [])
    .map(item => Number(item.tripPaymentFormId))
    .filter(id => Number.isFinite(id) && id > 0);

  const isPaymentImposed = (id: number) =>
    (listImposition || []).some(el => samePaymentId(el.tripPaymentFormId, id));

  const isPaymentSelected = (id: number) =>
    selectedPaymentIds.some(el => samePaymentId(el, id)) || isPaymentImposed(id);

  const changePaymentForm = async (state: boolean, id: number) => {
    if (savingPayment) {
      return;
    }

    if (isPaymentImposed(id)) {
      return customToast(
        translate('configPage.text_payment_form_imposition'),
        'warning',
      );
    }

    const paymentId = Number(id);
    const nextIds = state
      ? Array.from(new Set([...selectedPaymentIds, paymentId]))
      : selectedPaymentIds.filter(el => el !== paymentId);

    // Atualização otimista para o Switch refletir na hora (API pode devolver id como string)
    setListChooseDriver(
      nextIds.map(tripPaymentFormId => ({ tripPaymentFormId } as any)),
    );

    setSavingPayment(true);
    try {
      await updateChooseDriver(nextIds);
      await getChooseDriverPaymentForm();
    } finally {
      setSavingPayment(false);
    }
  };

  const changeAllPaymentForms = async (enableAll: boolean) => {
    if (savingPayment) {
      return;
    }

    // Lista vazia = aceita todas as formas (comportamento da API / "Todos")
    const nextIds = enableAll ? [] : selectedPaymentIds;
    if (enableAll) {
      setListChooseDriver([]);
    }

    setSavingPayment(true);
    try {
      await updateChooseDriver(nextIds);
      await getChooseDriverPaymentForm();
    } finally {
      setSavingPayment(false);
    }
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

  const ButtonPermission = ({ status, type }: { status: boolean; type?: 'foreground' | 'background' | 'camera' | 'audio' | 'notifications' | 'media' }) => (
    <Button disabled={status} onPress={() => handleRequestPermission(type)}>
      <ButtonText disabled={status}>
        {translate(`configPage.text_${status}`)}
      </ButtonText>
    </Button>
  );

  const handleSendAppInfo = async () => {
    setLoading(true);
    const { success, message } = await sendAppReport({
      driverId: Number(userDriver?.idDriver),
      userId: Number(userDriver?.idUser),
      nickname: userDriver?.nickname,
    });
    setLoading(false);

    customToast(
      message ?? (success ? 'Sucesso' : 'Ocorreu um erro ao enviar os dados.'),
      success ? 'success' : 'error',
    );
  };

  return (
    <View
      style={{ padding: 10, backgroundColor: colors.background_global, flex: 1 }}
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
              <ButtonPermission status={permissions.foreground} type="foreground" />
            </Section>
            <Section>
              <SubTitle>
                {translate('configPage.text_acess_localization_background')}
              </SubTitle>
              <ButtonPermission status={permissions.background} type="background" />
            </Section>
            <Section>
              <SubTitle>{translate('configPage.text_acess_galery')} (Xiaomi)</SubTitle>
              <ButtonPermission status={permissions.media} type="media" />
            </Section>
            <Section>
              <SubTitle>{translate('configPage.text_acess_camera')}</SubTitle>
              <ButtonPermission status={permissions.camera} type="camera" />
            </Section>
            <Section>
              <SubTitle>{translate('configPage.text_acess_audio')}</SubTitle>
              <ButtonPermission status={permissions.audio} type="audio" />
            </Section>
            <Section removeBorder>
              <SubTitle>
                {translate('configPage.text_acess_notification')}
              </SubTitle>
              <ButtonPermission status={permissions.notifications} type="notifications" />
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
              {(listPaymentForm || []).map((item, index) => {
                const paymentId = Number(item.idTripPaymentForm);
                const selected = isPaymentSelected(paymentId);
                const imposed = isPaymentImposed(paymentId);
                return (
                  <Section
                    removeBorder={index === (listPaymentForm || []).length - 1}
                    key={`payment-${paymentId || index}`}
                  >
                    <SubTitle>{item.name}</SubTitle>
                    <Switch
                      value={!!selected}
                      disabled={imposed || savingPayment}
                      color={colors.primary}
                      onValueChange={e => {
                        changePaymentForm(e, paymentId);
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
                  value={(listChooseDriver || []).length === 0}
                  disabled={savingPayment}
                  ios_backgroundColor={colors.primary}
                  color={colors.primary}
                  onValueChange={enableAll => {
                    changeAllPaymentForms(enableAll);
                  }}
                />
              </Section>
            </View>
          </Content>
          <Content>
            <Section removeBorder style={{ alignItems: 'center' }}>
              <SubTitle>{translate('configPage.title_report_app_status')}</SubTitle>
              <Button onPress={handleSendAppInfo} disabled={false} style={{ marginTop: 2 }}>
                <ButtonText disabled={false}>Relatar</ButtonText>
              </Button>
            </Section>
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
