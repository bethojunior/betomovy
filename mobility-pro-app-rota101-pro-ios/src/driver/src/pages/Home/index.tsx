import * as MediaLibrary from 'expo-media-library';
import {ScrollView, View, TouchableWithoutFeedback} from 'react-native';
import {useEffect, useRef, useState} from 'react';
import {MaterialIcons, Ionicons} from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useNavigation} from '@react-navigation/native';
import * as TaskManager from 'expo-task-manager';
import {Camera} from 'expo-camera';
import {RFValue} from 'react-native-responsive-fontsize';
import {
  BatteryOptEnabled,
  RequestDisableOptimization,
} from 'react-native-battery-optimization-check';
import * as BackgroundFetch from 'expo-background-fetch';
import {useAuth} from '../../../../context/auth';
import {
  Container,
  ContainerButtonFloat,
  ViewPanic,
  ContentButtonFloatsAndPanic,
} from './styles';
import {If} from '../../components/If';
import {useUserDriver} from '../../context/userDriver';
import {translate} from '../../../../client/locales';
import {useStationReturn} from '../../context/StationReturn';
import {CardPanic} from '../../components/CardPanic';
import {usePanic} from '../../context/Panic';
import {ModalOff} from '../../components/ModalOff';
import Helper from '../../utils/Helper';
import {customToast} from '../../../../utils/FlashMessage';
import {TripTypeUnic} from '../../components/ViewTaximeter/types';
import ModalFrame from '../../components/Modal/ModalFrame';
import {CardButtonText} from '../../components/CardButtonText';
import {FloatButton} from '../../components/FloatButton';
import {ModalNavigation} from '../../components/ModalNavigation';
import {useMenu} from '../../context/menu';
import {useModules} from '../../../../client/contexts/modules';
import Preload from '../../components/Preload';
import {useNetwork} from '../../../../context/ConfigGlobal';
import {bubble} from './service';
import NavigationMap, {NavigationMapRef} from '../../components/NavigationMap';
import {MapService} from '../../components/Map/services';
import {SwalAlert} from '../../../../client/components/SwalAlert';
import {PanicButtonTriggeredModal} from '../../components/Modal/PanicButtonTriggeredModal';
import Collapse from '../../../../client/components/Collapse';

import theme from '../../../../client/styles/theme';

import {ModalCallTripComponent} from '../../components/ModalCallTripComponent';
import {ModalInTripComponent} from '../../components/ModalInTripComponent';
import {ModalFinishTripComponent} from '../../components/ModalFinishTripComponent';
import {ModalAndButtonPreAcceptedComponent} from '../../components/ModalAndButtonPreAcceptedComponent';
import {IniTripModalComponent} from '../../components/IniTripModalComponent';
import {AlertPanicComponent} from '../../components/AlertPanicComponent';
import {NotificationComponent} from '../../components/NotificationComponent';
import {TripRealtimeComponent} from '../../components/TripRealtimeComponent';
import {TripPreAcceptedComponent} from '../../components/TripPreAcceptedComponent';
import {CheckBatteryComponent} from '../../components/CheckBatteryComponent';
import {WebViewMapComponent} from '../../components/WebViewMapComponent';
import {ButtonTargetComponent} from '../../components/ButtonTargetComponent';
import {TripRealtimeScheduleAccepted} from '../../components/TripRealtimeScheduleAccepted';
import {TripRealtimeScheduleCall} from '../../components/TripRealtimeScheduleCall';
import {TripRealtimeSearchOffer} from '../../components/TripRealtimeSearchOffer';
import {FloatButtonsComponent} from '../../components/FloatButtonsComponent';
import {FloatButtonHandleMyLocation} from '../../components/FloatButtonHandleMyLocation';
import {ButtonTaximeterComponent} from '../../components/ButtonTaximeterComponent';
import {DoorHandleComponent} from '../../components/DoorHandleComponent';
import {InicializeComponent} from '../../components/InicializeComponent';
import UpdateLocationMap from '../../components/UpdateLocationMap';
import {TaximeterComponent} from '../../components/TaximeterComponent';
import {ModalsProvider} from '../../../../context/Modals';
import MenuComponent from '../../components/MenuComponent';
import getAppColors from '../../../../utils/GetAppColors';
import {AppsId} from '../../../../context/ConfigGlobal/constants';
import {TripRealtimeDelivery} from '../../components/TripRealtimeDelivery';
import {ButtonScrollViewTaximeter} from '../../components/ButtonScrollView';
import {RouteTraveledProvider} from '../../context/RouteTraveled';

enum MapType {
  standard = 'standard',
  satellite = 'satellite',
  hybrid = 'hybrid',
  terrain = 'terrain',
  none = 'none',
  mutedStandard = 'mutedStandard',
}

const BACKGROUND_FETCH_TASK = 'background-fetch';

export function Home({route}) {
  const [modalVisible, setModalVisible] = useState(false);
  const [typesProblems, setTypesProblems] = useState([]);
  const {init} = useModules();

  const [prelaodVisible, setPreloadVisible] = useState(false);
  const [visibleQrCode, setVisibleQrCode] = useState(false);
  const [weeklyEarningsData, setWeeklyEarningsData] = useState([]);
  const [weeklyEarningsTotal, setWeeklyEarningsTotal] = useState('');
  const [countVisible, setCountVisible] = useState(false);
  const [iniTripModal, setIniTripModal] = useState(false);
  const [finishTripModal, setFinishTripModal] = useState(false);
  const [modalTaximeter, setModalTaximeter] = useState(false);
  const [modalNavigation, setModalNavigation] = useState(false);
  const [selectedTripType, setSelectedTripType] = useState<TripTypeUnic>(
    {} as TripTypeUnic,
  );
  const [isRegistered, setIsRegistered] = useState(false);
  const [mapType, setMapType] = useState<MapType>(MapType.terrain);
  const [showMenuButtons, setShowMenuButton] = useState<boolean>(false);

  const [swalVisible, setSwalVisible] = useState(false);

  const {generalSettings, setNewActionFb} = useAuth();

  const [onVisibleMap, setOnVisibleMap] = useState(false);
  const navigationMapRef = useRef<NavigationMapRef>(null);
  const [firstLoad, setFirstLoad] = useState(false);

  const refButtonMenu = useRef<any>(null);

  const {getMenuOptions} = useMenu();

  const {getListProblems} = usePanic();
  const {cityConfig} = useAuth();
  const {itsNetwork} = useNetwork();

  const {userDriverFind, getWeeklyEarnings} = useUserDriver();
  const {getStationReturnById, stationsById} = useStationReturn();
  const {navigate} = useNavigation();

  const handleShowMenuButtons = () => {
    showMenuButtons ? setShowMenuButton(false) : setShowMenuButton(true);
  };

  TaskManager.defineTask(BACKGROUND_FETCH_TASK, () => {
    const now = Date.now();

    console.log(
      `Got background fetch call at date: ${new Date(now).toISOString()}`,
    );

    return BackgroundFetch.BackgroundFetchResult.NewData;
  });

  const getEarnings = async () => {
    const response = await getWeeklyEarnings();

    setWeeklyEarningsTotal(response.earningsTotal);

    if (response) {
      response.earnings.map(item => {
        return setWeeklyEarningsData(oldArray => [
          ...oldArray,
          {day: item.slug, earnings: item.total_day},
        ]);
      });
    }
  };

  const listProblems = async () => {
    const response = await getListProblems();
    if (!response.status) {
      return;
    }
    setTypesProblems(response?.data);
  };

  const getPermissionsActions = () => {
    getPermsCam();
    BatteryOptEnabled().then(isEnabled => {
      if (isEnabled) {
        RequestDisableOptimization();
      }
    });
  };

  const getLastMapType = async () => {
    const mapType: any = await AsyncStorage.getItem('mapType');
    if (mapType) {
      setMapType(mapType);
    }
  };

  const stations = async () => {
    const response = await getStationReturnById();
    if (!response.status) {
      return customToast(response.message, 'danger');
    }
  };

  const initiTripSchedule = () => {
    setIniTripModal(true);
  };

  useEffect(() => {
    try {
      if (!itsNetwork || firstLoad) {
        return;
      }
      getPermissionsActions();
      stations();
      listProblems();
      getMenuOptions();
      toggleFetchTask();
      getEarnings();
      getLastMapType();

      setFirstLoad(true);
    } catch (error) {
      console.log('erro no useEFFECT');
    }
    if (userDriverFind?.status !== 'desligado') {
      bubble(
        userDriverFind?.idDriver,
        theme,
        cityConfig?.showNetValueForDriverOnCall,
        Helper.generalSettingsValue(generalSettings, 'show_more_calcs_driver'),
        Helper.generalSettingsActive(generalSettings, 'enable_realtime_socket'),
      );
    }
  }, [itsNetwork]);

  useEffect(() => {
    if (route.params?.visible) {
      setIniTripModal(true);
    }
  }, [route]);

  async function registerBackgroundFetchAsync() {
    return BackgroundFetch.registerTaskAsync(BACKGROUND_FETCH_TASK, {
      minimumInterval: 15, // 15 seconds
      stopOnTerminate: true, // android only,
      startOnBoot: true, // android only
    });
  }

  async function unregisterBackgroundFetchAsync() {
    return BackgroundFetch.unregisterTaskAsync(BACKGROUND_FETCH_TASK);
  }

  const checkStatusAsync = async () => {
    const registered = await TaskManager.isTaskRegisteredAsync(
      BACKGROUND_FETCH_TASK,
    );
    setIsRegistered(registered);
  };

  const toggleFetchTask = async () => {
    if (isRegistered) {
      await unregisterBackgroundFetchAsync();
    } else {
      await registerBackgroundFetchAsync();
    }

    checkStatusAsync();
  };

  const handleClearModal = () => {
    setShowMenuButton(false);
  };

  const confirmationAcceptTrip = async (status: boolean = null) => {
    if (status) {
      setFinishTripModal(false);
      setIniTripModal(true);
    }
  };

  useEffect(() => {
    if (userDriverFind && userDriverFind?.driverRegisterStatusId !== '1') {
      navigate('StatusPending');
      setNewActionFb('');
    }
  }, [userDriverFind?.driverRegisterStatusId]);

  useEffect(() => {
    getAppColors(Number(AppsId.DRIVER));
  }, []);

  const getPermsCam = async () => {
    const permissions = JSON.parse(await AsyncStorage.getItem('permissions'));
    const {status} = await MediaLibrary.requestPermissionsAsync();
    await Camera.requestCameraPermissionsAsync();
    await Camera.requestMicrophonePermissionsAsync();

    if (status !== 'granted') {
      return Camera.requestCameraPermissionsAsync();
    }

    permissions.gallery = true;
    await AsyncStorage.setItem('permissions', JSON.stringify(permissions));
  };

  const notif = false;

  return (
    <RouteTraveledProvider>
      <ModalsProvider>
        <TouchableWithoutFeedback onPress={handleClearModal}>
          <Container>
            <ButtonTargetComponent />
            <PanicButtonTriggeredModal />
            <Preload visible={prelaodVisible} />
            <SwalAlert
              title={translate('service.trip_schedule')}
              description={translate('service.your_trip_schedule')}
              visible={swalVisible}
              setVisible={setSwalVisible}
              callBack={initiTripSchedule}
            />

            <MenuComponent />

            {userDriverFind?.isDeliveryMan === '0' && (
              <>
                <ModalCallTripComponent
                  showInitModal={confirmationAcceptTrip}
                  receivedNotification={notif}
                  setPreloadVisible={setPreloadVisible}
                />

                <ModalInTripComponent
                  visible={iniTripModal}
                  setVisible={setIniTripModal}
                  countVisible={countVisible}
                />

                <ModalFinishTripComponent
                  visible={finishTripModal}
                  setVisible={setFinishTripModal}
                  showInitModal={setIniTripModal}
                />

                <ModalAndButtonPreAcceptedComponent />
                <NavigationMap
                  onPress={() => setCountVisible(false)}
                  ref={navigationMapRef}
                  mapType={mapType}
                  setMapType={setMapType}
                />

                <If condition={countVisible}>
                  <ViewPanic>
                    <CardPanic
                      data={typesProblems}
                      setVisible={setCountVisible}
                    />
                  </ViewPanic>
                </If>
                {init === 'Speedmob' && (
                  <ContainerButtonFloat>
                    <FloatButton
                      ref={refButtonMenu}
                      icon={
                        <MaterialIcons
                          name="my-location"
                          size={24}
                          color={theme.colors.primaryText}
                        />
                      }
                      onPress={() =>
                        navigationMapRef.current?.handleMyLocation(false)
                      }
                    />
                  </ContainerButtonFloat>
                )}
                <TripRealtimeComponent
                  setIniTripModal={setIniTripModal}
                  setSwalVisible={setSwalVisible}
                  setVisibleQrCode={setVisibleQrCode}
                  handleMyLocation={navigationMapRef.current?.handleMyLocation}
                  iniTripModal={iniTripModal}
                />
                <TripRealtimeScheduleAccepted />
                <TripRealtimeScheduleCall />
                <TripRealtimeSearchOffer />
                <InicializeComponent />
                <UpdateLocationMap />
                <TripPreAcceptedComponent setIniTripModal={setIniTripModal} />
              </>
            )}
            {userDriverFind?.isDeliveryMan === '1' && <TripRealtimeDelivery />}
            <CheckBatteryComponent />

            {userDriverFind?.isDeliveryMan === '0' && (
              <>
                {init !== 'Speedmob' && (
                  <ContainerButtonFloat>
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                      }}
                    >
                      <View>
                        <FloatButton
                          backgrounColorButton={theme.colors.background_white}
                          icon={
                            <Ionicons
                              name={showMenuButtons ? 'close' : 'menu'}
                              size={RFValue(24)}
                              color={theme.colors.primary}
                            />
                          }
                          onPress={handleShowMenuButtons}
                        />
                        <Collapse open={showMenuButtons}>
                          <NotificationComponent onPress={handleClearModal} />
                          <FloatButtonHandleMyLocation
                            callback={
                              navigationMapRef.current?.handleMyLocation
                            }
                          />
                          {/* <FloatButton
                          icon={
                            <MaterialIcons
                              name={MapService.switchMapTypeIcon(mapType)}
                              size={RFValue(24)}
                              color={theme.colors.primaryText}
                            />
                          }
                          onPress={async () => {
                            navigationMapRef.current?.toggleMapType(
                              MapService.switchMapType(mapType),
                            );
                          }}
                        /> */}
                          <ButtonTaximeterComponent
                            setModalTaximeter={setModalTaximeter}
                            selectedTripType={selectedTripType}
                          />
                          {/* <FloatButton
                          icon={
                            <View
                              style={{
                                flexDirection: 'row',
                                position: 'relative',
                                width: '100%',
                                height: '100%',
                                justifyContent: 'center',
                                alignItems: 'center',
                              }}
                            >
                              <MaterialIcons
                                name={'map'}
                                size={RFValue(15)}
                                color={theme.colors.primaryText}
                              />
                              <MaterialIcons
                                name={'settings'}
                                size={RFValue(12)}
                                style={{
                                  position: 'absolute',
                                  alignSelf: 'center',
                                  right: RFValue(5),
                                  bottom: RFValue(5),
                                }}
                                color={theme.colors.primaryText}
                              />
                            </View>
                          }
                          onPress={async () => {
                            navigationMapRef.current?.visibleConfigMap();
                          }}
                        /> */}
                        </Collapse>
                      </View>
                      <ContentButtonFloatsAndPanic>
                        <AlertPanicComponent
                          setCountVisible={setCountVisible}
                        />
                        <FloatButtonsComponent
                          setModalNavigation={setModalNavigation}
                          setOnVisibleMap={setOnVisibleMap}
                        />
                      </ContentButtonFloatsAndPanic>
                    </View>
                  </ContainerButtonFloat>
                )}
                <DoorHandleComponent
                  setVisibleQrCode={setVisibleQrCode}
                  visibleQrCode={visibleQrCode}
                />
                <ModalFrame
                  visible={modalTaximeter}
                  onClose={() => {}}
                  hideConfirm
                  setVisible={setModalTaximeter}
                >
                  <ButtonScrollViewTaximeter
                    setModalTaximeter={setModalTaximeter}
                    setSelectedTripType={setSelectedTripType}
                  />
                </ModalFrame>
                <TaximeterComponent
                  onClose={() => {
                    setSelectedTripType({} as TripTypeUnic);
                  }}
                  setSelectedTripTaximeter={setSelectedTripType}
                  setModalTaximeter={setModalTaximeter}
                  selectedTripTaximeter={selectedTripType}
                  setIniTripModal={setIniTripModal}
                />
              </>
            )}
            {/* FIM MODAIS */}
            {userDriverFind?.isDeliveryMan === '0' && (
              <>
                <IniTripModalComponent
                  version={
                    init !== 'Speedmob'
                      ? generalSettings?.find(
                          item => item?.key === 'enable_driver_v2',
                        )?.value
                      : '2'
                  }
                  modalVisible={modalVisible}
                  iniTripModal={iniTripModal}
                  visibleQrCode={visibleQrCode}
                  setVisibleQrCode={setVisibleQrCode}
                  setModalVisible={setModalVisible}
                  setIniTripModal={setIniTripModal}
                  setFinishTripModal={setFinishTripModal}
                />

                <ModalOff
                  isSpeedmob={init === 'Speedmob'}
                  modalVisible={modalVisible}
                  setModalVisible={setModalVisible}
                  stationsById={stationsById}
                  weeklyEarningsData={weeklyEarningsData}
                  weeklyEarningsTotal={weeklyEarningsTotal}
                />
              </>
            )}

            <WebViewMapComponent
              onVisibleMap={onVisibleMap}
              setOnVisibleMap={setOnVisibleMap}
            />
            <If condition={modalNavigation}>
              <ModalNavigation
                modalNavigation={modalNavigation}
                setModalNavigation={setModalNavigation}
              />
            </If>
          </Container>
        </TouchableWithoutFeedback>
      </ModalsProvider>
    </RouteTraveledProvider>
  );
}
