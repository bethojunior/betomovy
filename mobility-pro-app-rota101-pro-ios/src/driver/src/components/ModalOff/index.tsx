import { Dimensions, Modal, Platform, View } from 'react-native';
import { useTheme } from 'styled-components/native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons, FontAwesome } from '@expo/vector-icons/';
import { RFValue } from 'react-native-responsive-fontsize';
import { useBubbleButton } from '@704apps/react-native-bubble-button';
import { useEnsureOverlayPermission } from '../../pages/OverlayPermission/useEnsureOverlayPermission';
import { useUserDriver } from '../../context/userDriver';
import { useStationReturn } from '../../context/StationReturn';
import { PropsStationReturn } from '../../context/StationReturn/types';
import { If } from '../If';
import { ReturnItem } from '../ReturnItem';
import { translate } from '../../../../client/locales';
import { convertMoney } from '../../utils/money';
import { ButtonCircleOff } from '../ButtonCircleOff';
import { useLocalProvider } from '../../context/local';
import { useTripProvider } from '../../context/Trip';
import {
  BottomModal,
  ButtonBottomText,
  ContainerActivate,
  ContainerModal,
  ContainerTextReturn,
  ContentGraphics,
  ContentModal,
  Graphic,
  GraphicTitle,
  InfoData,
  InfoDataHeader,
  InfoDataItem,
  InfoDataItemNote,
  InfoDataItemNoteSubTitle,
  InfoDataItemNoteTitle,
  InfoDataItemSubTitle,
  InfoDataItemTitle,
  InfoDataSubTitle,
  InfoDataTitle,
  ModalHeader,
  ModalView,
  Returns,
  ReturnsItem,
  ReturnsTitle,
  TextOff,
  TextReturn,
  ViewInfoData,
} from './styles';
import { useAuth } from '../../../../context/auth';
import { useModules } from '../../../../client/contexts/modules';
import theme from '../../styles/theme';
import { BarChart } from 'react-native-chart-kit';
import { ButtonV2 } from '../ButtonOnAndOff';
import { useEffect, useState } from 'react';
import { bubble } from '../../pages/Home/service';
import Helper from '../../utils/Helper';
import { useNetwork } from '../../../../context/ConfigGlobal';
import { DeliveryOrderService } from '../../../../context/DeliveryOrder/services';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { storage } from '~/common/services/mmkv/storage';
import { STORAGE_KEYS } from '~/common/constants/storageKeys';
import { mountSong } from '../../utils/mountSong';
import { SafeAreaView } from 'react-native-safe-area-context';
import { rgba } from 'polished';

const BAR_CHART_WIDTH = Dimensions.get('window').width * 0.9 - RFValue(10);

interface Props {
  modalVisible: boolean;
  setModalVisible: (value: boolean) => void;
  stationsById: any;
  weeklyEarningsData: any;
  weeklyEarningsTotal: any;
  isSpeedmob?: boolean;
}

export const ModalOff = ({
  modalVisible,
  setModalVisible,
  weeklyEarningsData,
  weeklyEarningsTotal,
  isSpeedmob,
}: Props) => {
  const [isSubmitting, setSubmitting] = useState(false);
  const { userDriverFind, setUserDriverFind, toogleDriverStatus, getDriverFind } =
    useUserDriver();
  const { colors } = useTheme();
  const { location } = useLocalProvider();
  const { ensureOverlayPermission } = useEnsureOverlayPermission();
  const { itsNetwork } = useNetwork();
  const {
    setSelectedStation,
    stationsById,
    activeStationReturn,
    selectedStation,
  } = useStationReturn();
  const { hideBubble } = useBubbleButton();
  const dispatchTrip: any = useTripProvider(
    (context: any) => context.dispatchTrip,
  );
  const { navigate } = useNavigation();
  const { cityConfig, generalSettings } = useAuth();

  const { init } = useModules();

  const weeklyEarningsDefault = [
    { day: 'Dom', earnings: '0.00' },
    { day: 'Seg', earnings: '0.00' },
    { day: 'Ter', earnings: '0.00' },
    { day: 'Qua', earnings: '0.00' },
    { day: 'Qui', earnings: '0.00' },
    { day: 'Sex', earnings: '0.00' },
    { day: 'Sab', earnings: '0.00' },
  ];
  const [initLocationX, setInitLocationX] = useState(0);

  const getEarnings =
    weeklyEarningsData.length > 0 ? weeklyEarningsData : weeklyEarningsDefault;

  useEffect(() => {
    if (modalVisible || isDeliveryMan) {
      getDriverFind();
    }
  }, [modalVisible]);

  const setOff = async () => {
    if (isSubmitting) return;
    setSubmitting(true);

    try {
      void mountSong(null, true, 'soundCallOffline')
        .then(sound => sound?.playAsync())
        .catch(error => {
          console.log('[SOUND] Error playing offline sound', error);
        });

      await toogleDriverStatus('desligado', {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      if (Platform.OS === "android") {
        await hideBubble();
      }

      setModalVisible(false);
      clearStorage();
      dispatchTrip({ type: 'update', field: 'trip', arg: {} });
    } catch (error) {
      console.error('[SET_OFF] Error changing driver status', error);
    } finally {
      setSubmitting(false);
    }
  };

  const clearStorage = () => {
    AsyncStorage.multiRemove([
      'lastTripFinished',
      'dateTimeInProgress',
      'timePolyline',
      'taximetersDetails',
    ]);

    storage.removeItem(STORAGE_KEYS.SWITCH_READ);
  };

  const onPressReturnItem = async (index: number) => {
    if (stationsById && stationsById.length > index) {
      if (
        selectedStation.name === stationsById[index].name ||
        userDriverFind.stationId
      ) {
        setSelectedStation({} as PropsStationReturn);
        setUserDriverFind({
          ...userDriverFind,
          stationId: null,
        });
        await activeStationReturn(null);
        return;
      }
      setSelectedStation(stationsById[index]);
      setUserDriverFind({
        ...userDriverFind,
        stationId: stationsById[index].stationId,
      });
      await activeStationReturn(stationsById[index].stationId);
      return;
    }
    setModalVisible(false);
    navigate(isSpeedmob ? 'StationPointReturnSpeedMob' : 'StationPointReturn', {
      station: '',
    });
  };

  const isDeliveryMan = userDriverFind?.isDeliveryMan === '1';

  const setOn = async () => {
    // Verificar horas limites antes de ficar online
    const podeFicarOnline = checkHorasLimites();
    if (!podeFicarOnline) {
      return; // Não permite ficar online se atingiu o limite
    }

    await ensureOverlayPermission(async () => {
      if (!itsNetwork) {
        return;
      }

      const success = await toogleDriverStatus('disponivel', location?.coords);
      if (!success) {
        await hideBubble();
      } else {
        await bubble(
          userDriverFind?.idDriver,
          theme,
          cityConfig?.showNetValueForDriverOnCall,
          Helper.generalSettingsValue(generalSettings, 'show_more_calcs_driver'),
          Helper.generalSettingsActive(generalSettings, 'enable_realtime_socket'),
          cityConfig,
        );
      }
    });
  };

  const checkHorasLimites = () => {
    return true;
  };

  const getChartColor = (opacity: number) => {
    return rgba(theme.colors.primaryText, opacity);
  }

  if (isDeliveryMan) {
    return (
      <ModalView
        style={{
          marginTop: isDeliveryMan ? '25%' : 0,
        }}
        visible={isDeliveryMan ? true : modalVisible}
      >
        <ContainerModal>
          <ContentModal>
            <ContainerActivate>
              <ButtonV2
                initLocationX={initLocationX}
                setInitLocationX={setInitLocationX}
                setOff={setOff}
                setOn={setOn}
              />
            </ContainerActivate>
            <ContentGraphics>
              <InfoData>
                <InfoDataHeader>
                  <InfoDataTitle>
                    {translate('driverhome.my_day')}
                  </InfoDataTitle>
                  <InfoDataSubTitle>
                    {cityConfig?.typeMoney}
                    {userDriverFind?.statistics?.value_collected}
                  </InfoDataSubTitle>
                </InfoDataHeader>

                <ViewInfoData>
                  <View style={{ width: '50%' }}>
                    <InfoDataItem>
                      <InfoDataItemTitle>
                        {translate('driverhome.call')}
                      </InfoDataItemTitle>
                      <InfoDataItemSubTitle>
                        {userDriverFind?.statistics?.quantity_calls}
                      </InfoDataItemSubTitle>
                    </InfoDataItem>

                    <InfoDataItem>
                      <InfoDataItemTitle>
                        {translate('driverhome.accepted')}
                      </InfoDataItemTitle>
                      <InfoDataItemSubTitle>
                        {userDriverFind?.statistics?.quantity_accepted_calls}
                      </InfoDataItemSubTitle>
                    </InfoDataItem>

                    <InfoDataItem>
                      <InfoDataItemTitle>
                        {translate('driverhome.recused')}
                      </InfoDataItemTitle>
                      <InfoDataItemSubTitle>
                        {userDriverFind?.statistics?.quantity_refused_calls}
                      </InfoDataItemSubTitle>
                    </InfoDataItem>

                    <InfoDataItem>
                      <InfoDataItemTitle>
                        {translate('driverhome.canceled')}
                      </InfoDataItemTitle>
                      <InfoDataItemSubTitle>
                        {userDriverFind?.statistics?.quantity_canceled_calls}
                      </InfoDataItemSubTitle>
                    </InfoDataItem>

                    <InfoDataItem>
                      <InfoDataItemTitle>
                        {translate('driverhome.finished')}
                      </InfoDataItemTitle>
                      <InfoDataItemSubTitle>
                        {userDriverFind?.statistics?.quantity_finished_calls}
                      </InfoDataItemSubTitle>
                    </InfoDataItem>
                  </View>

                  <InfoDataItemNote>
                    <InfoDataItemNoteTitle>
                      {translate('driverhome.note')}
                    </InfoDataItemNoteTitle>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Ionicons
                        name="star"
                        size={17}
                        color={colors.background_white}
                      />
                      <InfoDataItemNoteSubTitle>
                        {userDriverFind.rating
                          ? parseFloat(userDriverFind?.rating).toPrecision(2)
                          : '0.0'}
                      </InfoDataItemNoteSubTitle>
                    </View>
                  </InfoDataItemNote>
                </ViewInfoData>
              </InfoData>

              <Graphic>
                <GraphicTitle>
                  {translate('driverhome.week')}
                  {'  '}
                  {convertMoney(weeklyEarningsTotal)}
                </GraphicTitle>
                <BarChart
                  data={{
                    labels: getEarnings.map(item => item.day),
                    datasets: [
                      {
                        data: getEarnings.map(item => Number(item.earnings || 0)),
                      },
                    ],
                  }}
                  width={BAR_CHART_WIDTH}
                  height={RFValue(200)}
                  chartConfig={{
                    backgroundGradientFrom: '#000',
                    backgroundGradientTo: '#000',
                    decimalPlaces: 2,
                    color: (opacity = 1) => `rgba(255, 255, 255, ${opacity})`,
                    style: { borderRadius: 16 },
                    barPercentage: 0.6,
                    paddingRight: 30,
                  }}
                  yAxisLabel={cityConfig?.typeMoney}
                  yAxisSuffix=""
                  showValuesOnTopOfBars
                  style={{
                    marginVertical: 8,
                    borderRadius: 1,
                  }}
                />
              </Graphic>
            </ContentGraphics>
          </ContentModal>
        </ContainerModal>
      </ModalView>
    );
  }
  return (
    <Modal
      animationType="slide"
      transparent
      visible={isDeliveryMan ? true : modalVisible}
    >
      <SafeAreaView style={{ flex: 1 }}>
        <ContainerModal
          style={{
            marginTop: isDeliveryMan ? '25%' : 0,
          }}
        >
          {!isDeliveryMan && (
            <ModalHeader
              activeOpacity={0.5}
              onPress={() =>
                isDeliveryMan ? null : setModalVisible(!modalVisible)
              }
            >
              <Ionicons
                name="chevron-down"
                size={25}
                color={
                  isDeliveryMan
                    ? theme.colors.background_global
                    : theme.colors.secondary
                }
                style={{ marginTop: 3 }}
              />
              <ButtonBottomText>
                {userDriverFind.status === 'desligado'
                  ? translate('driverhome.info_off')
                  : translate('driverhome.info_on')}
              </ButtonBottomText>
              <FontAwesome
                name="circle"
                size={20}
                color={
                  userDriverFind.status === 'desligado' ? colors.off : colors.on
                }
              />
            </ModalHeader>
          )}

          <ContentModal>
            {isDeliveryMan ? (
              <ContainerActivate>
                <ButtonV2
                  initLocationX={initLocationX}
                  setInitLocationX={setInitLocationX}
                  setOff={setOff}
                  setOn={setOn}
                />
              </ContainerActivate>
            ) : (
              <Returns>
                <ReturnsTitle>{translate('driverhome.my_returns')}</ReturnsTitle>
                <ReturnsItem>
                  <ReturnItem
                    data={
                      stationsById && stationsById.length > 0
                        ? stationsById[0]
                        : null
                    }
                    onPress={async () => {
                      await onPressReturnItem(0);
                    }}
                    onLongPress={() => {
                      if (stationsById.length > 0) {
                        setModalVisible(false);
                        navigate(
                          isSpeedmob
                            ? 'StationPointReturnSpeedMob'
                            : 'StationPointReturn',
                          {
                            station: stationsById[0],
                          },
                        );
                      }
                    }}
                  />
                  <ReturnItem
                    data={
                      stationsById && stationsById.length > 1
                        ? stationsById[1]
                        : null
                    }
                    onPress={async () => {
                      await onPressReturnItem(1);
                    }}
                    onLongPress={() => {
                      if (stationsById.length > 1) {
                        setModalVisible(false);
                        navigate(
                          isSpeedmob
                            ? 'StationPointReturnSpeedMob'
                            : 'StationPointReturn',
                          {
                            station: stationsById[1],
                          },
                        );
                      }
                    }}
                  />
                  <ReturnItem
                    data={
                      stationsById && stationsById.length > 2
                        ? stationsById[2]
                        : null
                    }
                    onPress={async () => {
                      await onPressReturnItem(2);
                    }}
                    onLongPress={() => {
                      if (stationsById.length > 2) {
                        setModalVisible(false);
                        navigate(
                          isSpeedmob
                            ? 'StationPointReturnSpeedMob'
                            : 'StationPointReturn',
                          {
                            station: stationsById[2],
                          },
                        );
                      }
                    }}
                  />
                </ReturnsItem>
                <ContainerTextReturn>
                  <If
                    condition={
                      (selectedStation &&
                        Object.keys(selectedStation).length > 0) ||
                      userDriverFind.stationId
                    }
                  >
                    <TextReturn>
                      Funcão de retorno ativa. você receberá apenas viagens para o
                      seu destino!
                    </TextReturn>
                  </If>
                </ContainerTextReturn>
              </Returns>
            )}

            <ContentGraphics>
              <InfoData>
                <InfoDataHeader>
                  <InfoDataTitle>{translate('driverhome.my_day')}</InfoDataTitle>
                  <InfoDataSubTitle>
                    {cityConfig?.typeMoney}
                    {userDriverFind?.statistics?.value_collected}
                  </InfoDataSubTitle>
                </InfoDataHeader>

                <ViewInfoData>
                  <View style={{ width: '50%' }}>
                    <InfoDataItem>
                      <InfoDataItemTitle>
                        {translate('driverhome.call')}
                      </InfoDataItemTitle>
                      <InfoDataItemSubTitle>
                        {userDriverFind?.statistics?.quantity_calls}
                      </InfoDataItemSubTitle>
                    </InfoDataItem>

                    <InfoDataItem>
                      <InfoDataItemTitle>
                        {translate('driverhome.accepted')}
                      </InfoDataItemTitle>
                      <InfoDataItemSubTitle>
                        {userDriverFind?.statistics?.quantity_accepted_calls}
                      </InfoDataItemSubTitle>
                    </InfoDataItem>

                    <InfoDataItem>
                      <InfoDataItemTitle>
                        {translate('driverhome.recused')}
                      </InfoDataItemTitle>
                      <InfoDataItemSubTitle>
                        {userDriverFind?.statistics?.quantity_refused_calls}
                      </InfoDataItemSubTitle>
                    </InfoDataItem>

                    <InfoDataItem>
                      <InfoDataItemTitle>
                        {translate('driverhome.canceled')}
                      </InfoDataItemTitle>
                      <InfoDataItemSubTitle>
                        {userDriverFind?.statistics?.quantity_canceled_calls}
                      </InfoDataItemSubTitle>
                    </InfoDataItem>

                    <InfoDataItem>
                      <InfoDataItemTitle>
                        {translate('driverhome.finished')}
                      </InfoDataItemTitle>
                      <InfoDataItemSubTitle>
                        {userDriverFind?.statistics?.quantity_finished_calls}
                      </InfoDataItemSubTitle>
                    </InfoDataItem>
                  </View>

                  <InfoDataItemNote>
                    <InfoDataItemNoteTitle>
                      {translate('driverhome.note')}
                    </InfoDataItemNoteTitle>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Ionicons
                        name="star"
                        size={17}
                        color={theme.colors.primaryText}
                      />
                      <InfoDataItemNoteSubTitle>
                        {userDriverFind.rating
                          ? parseFloat(userDriverFind?.rating).toPrecision(2)
                          : '0.0'}
                      </InfoDataItemNoteSubTitle>
                    </View>
                  </InfoDataItemNote>
                </ViewInfoData>
              </InfoData>

              <Graphic>
                <GraphicTitle>
                  {translate('driverhome.week')}
                  {'  '}
                  {convertMoney(weeklyEarningsTotal)}
                </GraphicTitle>
                <BarChart
                  data={{
                    labels: getEarnings.map(item => item.day),
                    datasets: [
                      {
                        data: getEarnings.map(item => Number(item.earnings || 0)),
                      },
                    ],
                  }}
                  width={BAR_CHART_WIDTH}
                  height={RFValue(200)}
                  chartConfig={{
                    backgroundGradientFrom: colors.primary,
                    backgroundGradientTo: colors.primary,
                    decimalPlaces: 2,
                    color: (opacity = 1) => getChartColor(opacity),
                    style: { borderRadius: 16 },
                    barPercentage: 0.6,
                    paddingRight: 30,
                  }}
                  yAxisLabel={cityConfig?.typeMoney}
                  yAxisSuffix=""
                  showValuesOnTopOfBars
                  style={{
                    marginVertical: 8,
                    borderRadius: 1,
                  }}
                />
              </Graphic>
            </ContentGraphics>
          </ContentModal>

          {init !== 'Speedmob' && !isDeliveryMan && (
            <>
              <BottomModal>
                <ButtonCircleOff
                  loading={isSubmitting}
                  onPress={setOff}
                  enabled={userDriverFind.status === 'disponivel'}
                  iconName={
                    userDriverFind.status === 'desligado'
                      ? 'hand-back-right-off-outline'
                      : 'hand-back-right-outline'
                  }
                />
              </BottomModal>

              <TextOff>{translate('driverhome.button_off')}</TextOff>
            </>
          )}
        </ContainerModal>
      </SafeAreaView>
    </Modal>
  );
};
