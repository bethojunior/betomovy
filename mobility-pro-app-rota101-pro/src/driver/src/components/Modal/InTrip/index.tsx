import { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import { Alert, TouchableOpacity, View } from 'react-native';
import { Feather, AntDesign, MaterialIcons } from '@expo/vector-icons/';
import { useDynamicAnimation } from 'moti';
import { useTheme } from 'styled-components/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { storage } from '~/common/services/mmkv/storage';
import { STORAGE_KEYS } from '~/common/constants/storageKeys';
import { NavigationProp, ParamListBase, useNavigation } from '@react-navigation/native';
import { IsToShowField } from '../../../utils/cityConfig';
import {
  Address,
  AddressContent,
  Ball,
  Button,
  ButtonContent,
  ButtonMinimizeModal,
  ClientContent,
  ClientName,
  Dot,
  Line,
  Modal,
  MoreInfo,
  SimpleText,
  SimpleTitle,
  Square,
  SwalButton,
  SwalButtonContainers,
} from './styles';
import { useTripProvider } from '../../../context/Trip';
import {
  STATUS_BOARDING_TRIP,
  STATUS_IN_PROGRESS,
  STATUS_WAITING,
} from '../../../constants/trip';
import { useTripStatusProvider } from '../../../context/TripStatus';
import { useAuth } from '../../../../../context/auth';
import { translate } from '../../../../../client/locales';
import { useUserDriver } from '../../../context/userDriver';
import { ModalCancellationReasons } from '../CancellationReason';
import { setIniTripModal } from '../../../store/iniTripModal';
import { buildApp } from '../../../../../constantBuild/config';
import { customToast } from '../../../../../utils/FlashMessage';
import { If } from '../../If';
import theme from '../../../styles/theme';
import { CardInfoDriver } from '../../CardInfoDriver';
import Helper from '../../../utils/Helper';
import { getTripPaymentFormDisplay } from '../../../utils/tripUtils';
import { ChatRealtime } from '../../../service/realtime/ChatRealtime';
import { TextWrapper } from '../../../../../common/TextWrapper';
import { CustomerAvatar } from '../../CustomerAvatar';
import { useStoragePictures } from '../../../hooks/useStoragePictures';
import { Text } from 'react-native-elements';
import TimerCircle from '../../TimerCircle';
import AnimatedActionButton from '../../AnimatedActionButton';
import { AnimatedDragButton } from '../../AnimatedDragButton';
import { SwalAlert } from '../../../../../client/components/SwalAlert';
import Preload from '../../Preload';
import { hasObjectValue } from '~/utils/object';
import { isTaximeterTripInProgress } from '~/driver/src/service/rules/trip/isTaximeterTripInProgress';
import { NotificationMessage, MessageProps } from '~/components/NotificationMessage';

interface ModalProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
}

interface WaitingConfigsProps {
  waiting_tolerance_seconds: string | null;
  waiting_penalty_fee: string | null;
  waiting_extra_fee_per_minute: string | null;
}

export const ModalInTrip = ({ visible, setVisible }: ModalProps) => {
  const { navigate }: NavigationProp<ParamListBase> = useNavigation();
  const [cancellationReasonsModal, setCancellationReasonsModal] = useState(false);
  const [minimize, setMinimize] = useState(false);
  const [percent, setPercent] = useState(0);
  const [showCountTime, setShowCountTime] = useState(false);
  const [newMessage, setNewMessage] = useState(false);
  const [message, setMessage] = useState<MessageProps | null>(null);
  const chatUnsubscribeRef = useRef<(() => void) | null>(null);
  const shownMessageIds = useRef(new Set<string>());
  const [markWaypoint, setMarkWaypoint] = useState(0);
  const [waitTime, setWaitTime] = useState(0);
  const [visibleCardInfo, setVisibleCardInfo] = useState(false);
  const [swalVisible, setSwalVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [showWaitingTimer, setShowWaitingTimer] = useState(false);
  const [waitingConfigs, setWaitingConfigs] = useState<WaitingConfigsProps>();

  const { colors } = useTheme();
  const dispatchTrip: any = useTripProvider((context: any) => context.dispatchTrip);
  const cancel: any = useTripProvider((context: any) => context.cancel);
  const priceToShow: any = useTripProvider((context: any) => context.priceToShow);
  const tripAccepted: any = useTripProvider(
    (context: any) => context.stateTrip.tripAccepted,
  );
  const cancelTrip: any = useTripProvider((context: any) => context.stateTrip.cancelTrip);
  const checkStatusTrip: any = useTripStatusProvider(
    (context: any) => context.checkStatusTrip,
  );
  const statusTrip: any = useTripStatusProvider((context: any) => context.statusTrip);
  const setStatusTrip: any = useTripStatusProvider(
    (context: any) => context.setStatusTrip,
  );
  const waitingTripStatus: any = useTripStatusProvider(
    (context: any) => context.waitingTripStatus,
  );
  const waitingFees: any = useTripStatusProvider((context: any) => context.waitingFees);
  const { cityConfig } = useAuth();
  const { userDriverFind } = useUserDriver();
  const chatRealtime = useMemo(() => new ChatRealtime(), []);

  const { getStoragePictureSpecific } = useStoragePictures();

  const hasTripAccepted = useMemo(() => hasObjectValue(tripAccepted), [tripAccepted]);

  let dateFinal = new Date();
  let dateStart = new Date();
  const difTime = cityConfig?.waitingTimeCustomerCancellationFee;
  let counter = Number(cityConfig?.waitingTimeCustomerCancellationFee);

  const animation = useDynamicAnimation(() => {
    return {
      transform: [{ translateY: 500 }],
    };
  });

  const verifyChat = (tripReference: string, tripCallType: string) => {
    if (tripReference && tripCallType !== 'CHAMADA TAXÍMETRO') {
      chatUnsubscribeRef.current?.();
      chatUnsubscribeRef.current = chatRealtime.getLastMessageUnread(
        tripReference,
        ({ item, id }) => {
          if (
            !shownMessageIds.current.has(id) &&
            Number(item?.userId) !== Number(userDriverFind?.userId) &&
            !item.viewed
          ) {
            shownMessageIds.current.add(id);
            setMessage(item);
            setNewMessage(true);
          }
        },
      );
    }
  };

  const calculatePercentTime = async () => {
    const max = (dateFinal.getTime() - dateStart.getTime()) / 1000;

    const now = (dateFinal.getTime() - new Date().getTime()) / 1000;

    let result = 100 - (now * 100) / max;

    result = result < 100 ? result : 100;

    counter -= 1;
    setWaitTime(counter);
    setPercent(result);

    if (result >= 100) {
      counter = Number(cityConfig?.waitingTimeCustomerCancellationFee);
      return '';
    }

    return setTimeout(() => {
      calculatePercentTime();
    }, 1000);
  };

  const startCount = async () => {
    const date = new Date(JSON.parse(await AsyncStorage.getItem('customerWaitTime')));
    dateFinal = new Date(date.setSeconds(date.getSeconds() + Number(difTime)));
    dateStart = date;
    await calculatePercentTime();
  };

  const cancelTripAccepted = async (cancellationReasonId: number) => {
    if (cancellationReasonId === null) {
      return customToast(
        translate('driverTrip.text_choosbe_reason_to_cancel'),
        'warning',
      );
    }

    cancelTrip.cancellationReasonsId = cancellationReasonId;
    dispatchTrip({ type: 'update', field: 'cancelTrip', arg: cancelTrip });

    if (percent === 0) {
      await startCount();
    }

    if (tripAccepted?.status === STATUS_BOARDING_TRIP && percent >= 100) {
      if (!Array.isArray(cityConfig)) {
        if (!!cityConfig.allowDriverGenerateCancellationFee === true) {
          // ESSE SWITH É PRA SE TRANSFORMAR EM UM RADIO DENTRO DO MODAL
          // DE ESCOLHA DO MOTIVO DE CANCELAMENTO
          return Alert.alert(translate('driverTrip.text_taxe_client'), '', [
            {
              text: translate('driverTrip.text_yes'),
              onPress: async () => {
                return cancelTripByDriver(true);
              },
            },
            {
              text: translate('driverTrip.text_no'),
              onPress: async () => {
                return cancelTripByDriver(false);
              },
            },
          ]);
        }
      }
      return cancelTripByDriver(true);
    }

    // GERAR TAXA DE CANCELAMENTO PARA O MOTORISTA, POIS O TEMPO NAO FOI EXCEDIDO
    return Alert.alert(
      translate('driverTrip.text_driver_taxe'),
      translate('driverTrip.text_driver_confirm_taxe'),
      [
        {
          text: translate('driverTrip.text_yes'),
          onPress: async () => {
            return cancelTripByDriver();
          },
        },
        {
          text: translate('driverTrip.text_no'),
          onPress: async () => {
            return '';
          },
        },
      ],
    );
  };

  const cancelTripByDriver = async (generateCancellationFee = true) => {
    cancelTrip.tripReference = tripAccepted.tripReference;
    cancelTrip.generateCancellationFee = generateCancellationFee;
    cancelTrip.driverId = Number(userDriverFind.idDriver);
    dispatchTrip({ type: 'update', field: 'cancelTrip', arg: cancelTrip });

    hideModalAnimation();
    setVisible(false);
    setIniTripModal(false);

    try {
      await cancel(false);
    } catch {}
  };

  const progressTrip = async () => {
    const previousStatus = statusTrip;
    try {
      const result = await checkStatusTrip();

      if (!result) {
        setStatusTrip(previousStatus);
        return;
      }

      const { callback, status, waypoint } = result;

      if (!callback) {
        customToast(translate('driverTrip.text_error_update_trip'), 'warning');
        setStatusTrip(status);
      }

      if (status === translate('statusTrip.accepted') && callback === true) {
        AsyncStorage.setItem('customerWaitTime', JSON.stringify(new Date()));
        dateFinal = new Date();
        dateFinal.setSeconds(dateFinal.getSeconds() + Number(difTime));
        dateStart = new Date();
        calculatePercentTime();
        counter = Number(cityConfig?.waitingTimeCustomerCancellationFee);
        setShowCountTime(true);
      }

      if (status === translate('statusTrip.in_progress') && callback === true) {
        setMarkWaypoint(0);
        setVisible(false);
      }

      if (status === translate('statusTrip.waypoint') && waypoint) {
        setMarkWaypoint(1);
      }
    } catch {
      setStatusTrip(previousStatus);
    }
  };

  const setSwitchRead = async () => {
    try {
      const responseSwitchRead = storage.getItem(STORAGE_KEYS.SWITCH_READ, 'boolean');
      if (responseSwitchRead === null) {
        storage.setItem(STORAGE_KEYS.SWITCH_READ, true, 'boolean');
      }
    } catch (error) {
      console.log(error);
    }
  };

  const showModalAnimation = () => {
    animation.animateTo({
      opacity: 1,
      transform: [{ translateY: 0 }],
    });
  };

  const hideModalAnimation = () => {
    animation.animateTo({
      opacity: 0.7,
      transform: [{ translateY: 500 }],
    });
  };

  useEffect(() => {
    verifyChat(tripAccepted?.tripReference, tripAccepted?.tripCallType);

    return () => {
      chatUnsubscribeRef.current?.();
    };
  }, [tripAccepted?.tripReference, tripAccepted?.tripCallType]);

  useEffect(() => {
    if (visible && !isTaximeterTripInProgress(tripAccepted)) {
      showModalAnimation();
    } else {
      hideModalAnimation();
    }

    if (visible && tripAccepted?.status === STATUS_IN_PROGRESS) {
      setMinimize(true);
    } else {
      setMinimize(false);
    }
  }, [visible, tripAccepted?.status, tripAccepted?.tripCallType]);

  const putIntWaiting = async () => {
    setLoading(true);
    const data = await waitingTripStatus();
    setLoading(false);
    if (data) {
      setSwalVisible(false);
    }
  };

  const onEndWaitingTime = async () => {
    setLoading(true);
    try {
      const total = await stopWaiting();
      console.log('Tempo total em espera:', total, 'segundos');
      await progressTrip();
    } finally {
      setLoading(false);
    }
  };

  const stopWaiting = async () => {
    const now = Date.now();
    const raw = await AsyncStorage.getItem('waitingTimer');
    if (!raw) return 0;

    const data = JSON.parse(raw);

    if (data.startTime) {
      data.totalPaused += Math.floor((now - data.startTime) / 1000);
      data.startTime = null;
      await AsyncStorage.setItem('waitingTimer', JSON.stringify(data));
    }

    return data.totalPaused;
  };

  const getWaitingFees = async () => {
    const data = await waitingFees();

    if (!data) {
      return setShowWaitingTimer(false);
    }

    const hasExtraFee =
      data.waiting_extra_fee_per_minute !== null &&
      data.waiting_extra_fee_per_minute !== '' &&
      Number(data.waiting_extra_fee_per_minute) > 0;

    const hasPenaltyFee =
      data.waiting_penalty_fee !== null &&
      data.waiting_penalty_fee !== '' &&
      Number(data.waiting_penalty_fee) > 0;

    if (hasExtraFee || hasPenaltyFee) {
      setWaitingConfigs(data);
      return setShowWaitingTimer(true);
    }

    setShowWaitingTimer(false);
  };

  const formatTime = (seconds: number | string | null | undefined) => {
    const safeSeconds = Number(seconds);

    if (isNaN(safeSeconds) || safeSeconds < 0) {
      return '00:00';
    }

    const minutes = Math.floor(safeSeconds / 60);
    const secs = safeSeconds % 60;

    const mm = String(minutes).padStart(2, '0');
    const ss = String(secs).padStart(2, '0');

    return `${mm}:${ss}`;
  };

  const valideSeconds = (seconds: number | string | null | undefined) => {
    const safeSeconds = Number(seconds);
    if (isNaN(safeSeconds) || safeSeconds < 0) {
      return 0;
    }

    return safeSeconds;
  };

  useEffect(() => {
    setSwitchRead();
    getWaitingFees();
  }, []);

  return (
    <If condition={hasTripAccepted}>
      <Preload visible={loading} />
      <SwalAlert
        visible={swalVisible}
        title="Modo de espera"
        description={`O modo de espera poderá ser ativado quando o passageiro solicitar uma parada não prevista. Após a tolerância de ${formatTime(Number(waitingConfigs?.waiting_tolerance_seconds)) || 0} minutos o cliente receberá uma cobrança adicional de R$ ${Helper.maskMoney(Number(waitingConfigs?.waiting_penalty_fee))} e terá um acréscimo de R$ ${Helper.maskMoney(Number(waitingConfigs?.waiting_extra_fee_per_minute))} por minuto durante a espera.`}
        setVisible={() => setSwalVisible(false)}
        closeButton={true}
        children={
          <SwalButtonContainers>
            <SwalButton backgroundColor={''}>
              <Text
                style={{ color: theme.colors.secondary }}
                onPress={() => setSwalVisible(false)}
              >
                Fechar
              </Text>
            </SwalButton>
            <SwalButton
              backgroundColor={theme.colors.primary}
              onPress={() => putIntWaiting()}
            >
              <Text style={{ color: theme.colors.primaryText }}>Confirmar</Text>
            </SwalButton>
          </SwalButtonContainers>
        }
      />
      <CardInfoDriver
        visible={visibleCardInfo}
        setVisible={setVisibleCardInfo}
        markWaypoint={markWaypoint}
      />

      <Modal
        pointerEvents={visible && !cancellationReasonsModal ? 'auto' : 'none'}
        transition={{
          type: 'timing',
          duration: 900,
        }}
        state={animation}
        style={{
          shadowColor: theme.colors.black,
          shadowOffset: {
            width: 0,
            height: 12,
          },
          shadowOpacity: 0.58,
          shadowRadius: 16.0,
          elevation: cancellationReasonsModal ? 0 : 24,
        }}
      >
        <ButtonMinimizeModal
          onPress={() => {
            setMinimize(!minimize);
          }}
        >
          <MaterialIcons
            name={minimize ? 'arrow-drop-up' : 'arrow-drop-down'}
            size={30}
            style={{
              color: colors.primaryText,
            }}
          />
        </ButtonMinimizeModal>
        {!minimize && (
          <>
            <ClientContent
              activeOpacity={0.8}
              onPress={() => {
                setVisibleCardInfo(true);
              }}
            >
              <CustomerAvatar trip={tripAccepted} />

              <ClientName>
                {tripAccepted?.customer?.name &&
                  tripAccepted?.customer?.name?.length > 0 &&
                  tripAccepted?.customer?.name}
              </ClientName>
            </ClientContent>
            <ButtonContent>
              <Button
                onPress={() => {
                  setNewMessage(false);
                  setVisible(false);
                  navigate('TripChatDriver', {
                    trip: tripAccepted,
                  });
                }}
              >
                <If condition={newMessage}>
                  <Dot
                    from={{
                      opacity: 1,
                      scale: 0.8,
                    }}
                    animate={{
                      opacity: 1,
                      scale: 1,
                    }}
                    transition={{
                      type: 'spring',
                      stiffness: 260,
                      damping: 20,
                      loop: true,
                    }}
                  />
                </If>

                <AntDesign name="message" size={23} color={colors.primary} />
              </Button>
              <Button onPress={() => setCancellationReasonsModal(true)}>
                <Feather name="x" size={25} color={colors.primary} />
              </Button>
            </ButtonContent>
            <MoreInfo>
              {IsToShowField('paymentForm', cityConfig) && (
                <View>
                  <SimpleTitle>{translate('callTrip.text_type_payment')}</SimpleTitle>
                  <SimpleText>
                    {getTripPaymentFormDisplay(tripAccepted?.tripPaymentForm)}
                  </SimpleText>
                </View>
              )}
              {IsToShowField('price', cityConfig) && cityConfig !== null && (
                <View>
                  <SimpleTitle>{translate('callTrip.text_price')}</SimpleTitle>
                  <SimpleText>
                    {cityConfig?.typeMoney} {Helper?.maskMoney(priceToShow())}
                  </SimpleText>
                </View>
              )}
            </MoreInfo>
            {showWaitingTimer && tripAccepted?.status == STATUS_IN_PROGRESS && (
              <View style={{ alignItems: 'flex-end', padding: 10 }}>
                <TouchableOpacity
                  style={{ backgroundColor: theme.colors.primary, borderRadius: 18 }}
                  onPress={() => setSwalVisible(true)}
                >
                  <Text
                    style={{
                      color: theme.colors.primaryText,
                      marginHorizontal: 10,
                      marginVertical: 5,
                    }}
                  >
                    Colocar em espera
                  </Text>
                </TouchableOpacity>
              </View>
            )}
            {tripAccepted?.status != STATUS_WAITING ? (
              <AddressContent>
                <View style={{ alignItems: 'center' }}>
                  <Ball style={{ marginTop: 5 }} />
                  <Line />
                  {tripAccepted?.tripWayPoints?.length !== 0 &&
                    tripAccepted?.tripWayPoints?.map((_, index) => (
                      <Fragment key={index}>
                        <Ball />
                        <Line />
                      </Fragment>
                    ))}
                  <Square />
                </View>
                <View>
                  {IsToShowField('origin', cityConfig) && (
                    <TextWrapper
                      text={tripAccepted?.origin?.address}
                      selected={statusTrip === translate('statusTrip.accepted')}
                      Children={Address}
                      initialNumber={2}
                      endNumber={5}
                    />
                  )}

                  {tripAccepted?.tripWayPoints?.length !== 0 &&
                    tripAccepted?.tripWayPoints?.map((waypoint, index) => {
                      return (
                        <TextWrapper
                          text={waypoint?.address}
                          selected={
                            statusTrip === translate('statusTrip.waypoint') &&
                            markWaypoint === index
                          }
                          key={index}
                          Children={Address}
                          initialNumber={2}
                          endNumber={5}
                        />
                      );
                    })}
                  {IsToShowField('destination', cityConfig) && (
                    <TextWrapper
                      text={tripAccepted?.destination?.name}
                      selected={statusTrip === translate('statusTrip.in_progress')}
                      Children={Address}
                      initialNumber={2}
                      endNumber={5}
                    />
                  )}
                </View>
              </AddressContent>
            ) : (
              <></>
            )}
          </>
        )}
        {tripAccepted?.status == STATUS_WAITING && (
          <View
            style={{
              width: '98%',
              alignSelf: 'center',
              marginBottom: 10,
            }}
          >
            <TimerCircle
              initialSeconds={valideSeconds(
                Number(waitingConfigs?.waiting_tolerance_seconds),
              )}
              onTimeUpdate={() => {}}
            />
            <AnimatedActionButton
              text={'Retomar viagem'}
              onPress={() => onEndWaitingTime()}
              colors={{
                primary: theme.colors.primary,
                background_global: theme.colors.primary,
                primaryText: theme.colors.primaryText,
              }}
            />
          </View>
        )}
        {tripAccepted?.status != STATUS_WAITING && (
          <View
            style={{
              width: '98%',
              alignSelf: 'center',
              marginTop: 10,
              marginBottom: 10,
            }}
          >
            <AnimatedDragButton
              text={statusTrip}
              onPressButton={() => {
                setStatusTrip(translate('statusTrip.loading'));
                progressTrip();
              }}
              statusTrip={statusTrip}
            />
          </View>
        )}
      </Modal>

      <ModalCancellationReasons
        visible={cancellationReasonsModal}
        setVisible={setCancellationReasonsModal}
        cancelTripAccepted={cancelTripAccepted}
      />

      <NotificationMessage
        visible={!!message?.message}
        message={message}
        isAudio={message?.isAudio}
        title={tripAccepted?.customer?.name}
        pictureUri={
          tripAccepted?.customer?.profileImage
            ? `${getStoragePictureSpecific('customer') || buildApp().HOST_IMAGE_CUSTOMER}${tripAccepted?.customer?.profileImage}`
            : undefined
        }
        onPress={() => navigate('TripChatDriver', { trip: tripAccepted })}
        onRead={() => setNewMessage(false)}
        onDismiss={() => setMessage(null)}
      />
    </If>
  );
};
