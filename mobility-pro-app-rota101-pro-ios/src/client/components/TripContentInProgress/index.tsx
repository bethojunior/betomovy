import { useEffect, useState } from 'react';
import { Share } from 'react-native';
import { AntDesign, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import {
  STATUS_ACCEPTED,
  STATUS_BOARDING,
  STATUS_IN_PROGRESS,
  STATUS_SCHEDULED,
  tripStatus,
} from '../../constants/trip';
import { useTrip } from '../../contexts/Trip';
import {
  BottomContainer,
  CancelButton,
  CarInfo,
  CarInfoContainer,
  CenterContainer,
  ChatIcon,
  Container,
  ContainerAddress,
  ContainerButton,
  ContainerPressable,
  DriverInfoContainer,
  DriverProfilePicture,
  DriverProfilePictureContainer,
  DriverRating,
  DriverRatingContainer,
  Handle,
  HeaderContainer,
  Input,
  InputContainer,
  LicensePlate,
  MoreInfo,
  MoreInfoButton,
  MoreInfoContainer,
  Nickname,
  NicknameContainer,
  NicknameIcon,
  ShareButton,
  StatusIcon,
  TripStatus,
  TripStatusContainer,
  TripTimeContainer,
  TripTimeLabel,
  TripTimeValue,
} from './styles';
import { customToast } from '../../../utils/FlashMessage';
import theme from '../../styles/theme';
import { translate } from '../../locales';
import LookUpAddressesModalInTrip from '../LookUpAddressesModalInTrip';
import { If } from '../If';
import { convertDatetimeToTime } from '../../utils/FormatDate';
import { ModalCancellationReasonsCustomer } from '../ModalCancellationReason';
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  withRepeat,
  withSequence,
} from 'react-native-reanimated';

import { CardInfoClient } from '../CardInfoClient';
import DistantDriverPriceConfirmationModal from '../../../components/DistantDriverPriceConfirmModal';
import apiMain from '../../api/apiMain';
import { STATUS_WAITING } from '../../../driver/src/constants/trip';
import TimerCircle from '../../../driver/src/components/TimerCircle';

export default function TripContentInProgress({ setModalDriverData,
  newMessage,
  setNewMessage
}) {
  const [tripStatusText, setTripStatusText] = useState<Record<string, string>>({});

  const [cancellationReasonsModal, setCancellationReasonsModal] =
    useState(false);
  const {
    shareTrip,
    previewChangeRoutes,
    stateTripCustomer,
    dispatchTripCustomer,
    cancelTripByCustomer,
    initNewTripAfterCancel,
    getWaitingTimer
  } = useTrip();

  interface WaitingConfigsProps {
    waiting_tolerance_seconds: string | null
    waiting_penalty_fee: string | null
    waiting_extra_fee_per_minute: string | null
  }

  const { trip, routeTrip, waypointQuantities, waypoints } = stateTripCustomer;
  const navigation = useNavigation();
  const [linkShare, setLinkShare] = useState('');
  const [visibleInfoCardInfo, setVisibleInfoCardInfo] = useState(false);
  const [visibleLongDistance, setVisibleLongDistance] = useState(false);
  const [waitingConfigs, setWaitingConfigs] = useState<WaitingConfigsProps>()

  const [visibleLookUpAddressModal, setVisibleLookUpAddressModal] =
    useState(false);

  const getTrip = async (tripReference: string) => {
    try {
      const {
        data: { data },
      } = await apiMain.post('trip/get', { stdObject: [{ tripReference }] });
      return data;
    } catch (error) {
      console.log('error', error);

      return false;
    }
  };

  useEffect(() => {
    if (!trip?.tripReference) return;

    getTrip(trip.tripReference).then(tripData => {
      if (!tripData.acceptedText) {
        setTripStatusText(tripStatus);
      } else {
        setTripStatusText({
          ...tripStatus,
          [STATUS_ACCEPTED]: tripData.acceptedText,
          [STATUS_BOARDING]: tripData.boardingText,
          [STATUS_IN_PROGRESS]: tripData.inProgressText,
        });
      }
    });
  }, [trip.tripReference]);

  const getLink = async () => {
    if (trip.tripReference) {
      const result = await shareTrip(trip.tripReference);
      setLinkShare(result);
    }
  };

  useEffect(() => {
    getLink();
  }, []);

  const researchDriver = async () => {
    setVisibleLongDistance(false);

    const canceled = await cancelTripByCustomer(null);
    if (!canceled) return;

    await initNewTripAfterCancel(trip, false);
  };

  const onShare = async () => {
    try {
      const result = await Share.share({
        message: `Acompanhe minha Viagem: ${linkShare}`,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      customToast(translate('toast.text_share_error'), 'danger');
    }
  };

  const rotation = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: rotation.value }],
    };
  });

  const valideSeconds = (seconds: number | string | null | undefined) => {
    const safeSeconds = Number(seconds);
    if (isNaN(safeSeconds) || safeSeconds < 0) {
      return 0;
    }

    return safeSeconds;
  }

  const getWaitingFees = async () => {
    const data: any = await getWaitingTimer(String(trip?.cityId), trip?.tripTypeId)

    const hasExtraFee =
      data.waiting_extra_fee_per_minute !== null &&
      data.waiting_extra_fee_per_minute !== "" &&
      Number(data.waiting_extra_fee_per_minute) > 0

    const hasPenaltyFee =
      data.waiting_penalty_fee !== null &&
      data.waiting_penalty_fee !== "" &&
      Number(data.waiting_penalty_fee) > 0

    if (hasExtraFee || hasPenaltyFee) {
      setWaitingConfigs(data)
    }

  }

  useEffect(() => {
    rotation.value = withRepeat(
      withSequence(
        withTiming(1, { duration: 150 }),
        withTiming(-1, { duration: 150 }),
        withTiming(0, { duration: 150 }),
      ),
      -1,
      true,
    );
  }, []);

  useEffect(() => {
    getWaitingFees()
  }, [])

  useEffect(() => {
    if (trip?.status === STATUS_ACCEPTED && !!trip?.tripLongDistanceValue && !!trip?.recalculatedPrice) {
      setVisibleLongDistance(true);
    } else {
      setVisibleLongDistance(false);
    }
  }, [trip?.status, trip?.tripLongDistanceValue, trip?.recalculatedPrice]);

  return (
    <>
      <If condition={visibleLookUpAddressModal}>
        <ContainerAddress>
          <LookUpAddressesModalInTrip
            onBack={() => setVisibleLookUpAddressModal(false)}
            onComplete={content => {
              previewChangeRoutes(
                content?.destination,
                content?.waypoints || [],
              );
            }}
            setVisible={setVisibleLookUpAddressModal}
            visible={visibleLookUpAddressModal}
            destinationPerson={false}
            voice={undefined}
          />
        </ContainerAddress>
      </If>

      <Container
        from={{
          opacity: 0,
          translateY: 150,
        }}
        animate={{
          opacity: 1,
          translateY: 0,
        }}
        transition={{
          type: 'timing',
        }}
        exit={{
          opacity: 0,
          translateY: 150,
        }}
      >
        <Handle />

        <HeaderContainer>
          {trip.status == STATUS_WAITING ? (
            <TimerCircle initialSeconds={valideSeconds(Number(waitingConfigs?.waiting_tolerance_seconds))} onTimeUpdate={() => { }} />
          ) :
            <>
              <TripStatusContainer>
                <StatusIcon name="time-outline" size={18} color={theme.colors.primary} />
                <TripStatus numberOfLines={3}>
                  {tripStatusText[trip.status] &&
                    String(tripStatusText[trip.status]).concat(
                      trip?.status === STATUS_SCHEDULED
                        ? ` - ${convertDatetimeToTime(trip?.schedule?.schedule)}`
                        : '',
                    )}
                </TripStatus>
              </TripStatusContainer>
              <TripTimeContainer>
                <TripTimeValue>
                  {(routeTrip && String(routeTrip?.time)?.replace('min', '')) ||
                    0}
                </TripTimeValue>
                <TripTimeLabel>
                  {translate('trip.minutes')}
                </TripTimeLabel>
              </TripTimeContainer>
            </>
          }
        </HeaderContainer>
        <CenterContainer>
          <DriverInfoContainer
            activeOpacity={0.8}
            onPress={() => {
              // setModalDriverData(true)
              setVisibleInfoCardInfo(true);
            }}
          >
            <DriverProfilePictureContainer>
              <DriverProfilePicture
                source={{ uri: trip?.driver?.profilePicture }}
              />
            </DriverProfilePictureContainer>
            <DriverRatingContainer>
              <DriverRating>
                {parseFloat(trip?.driver?.rating)
                  .toFixed(1)
                  .replace('.', ',')}
              </DriverRating>
              <AntDesign
                name="star"
                size={10}
                color={theme.colors.primary}
              />
            </DriverRatingContainer>
          </DriverInfoContainer>

          <CarInfoContainer>
            <LicensePlate>{trip.driver?.car?.plate}</LicensePlate>
            <CarInfo>{`${trip?.driver?.car?.brand || ''} ${trip?.driver?.car?.model || ''
              } - ${trip?.driver?.car?.color || ''}`}</CarInfo>
          </CarInfoContainer>
        </CenterContainer>

        <MoreInfoContainer>
          <NicknameContainer>
            <NicknameIcon name="user" />
            <Nickname>{trip?.driver?.nickname}</Nickname>
          </NicknameContainer>

          <MoreInfoButton onPress={() => setVisibleInfoCardInfo(true)}>
            <MoreInfo>Mais detalhes</MoreInfo>
            <Ionicons name="chevron-forward" size={14} color={theme.colors.blue} />
          </MoreInfoButton>
        </MoreInfoContainer>

        <BottomContainer>
          <ContainerPressable
            onPress={() => {
              setNewMessage(false);
              navigation.navigate('TripChat');
            }}
          >
            <InputContainer pointerEvents="none">
              <Input>
                {newMessage
                  ? translate('trip.new_message_received')
                  : translate('trip.send_message')}
              </Input>
              {newMessage ? (
                <>
                  <Animated.View
                    style={[
                      {
                        width: 24,
                        height: 24,
                        position: 'absolute',
                        right: 0,
                      },
                      animatedStyle,
                    ]}
                  >
                    <ChatIcon
                      name="chatbubble-ellipses-sharp"
                      size={24}
                      color={theme.colors.black}
                    />
                  </Animated.View>
                </>
              ) : (
                <>
                  <ChatIcon
                    name="chatbubble-ellipses-sharp"
                    size={24}
                    color={theme.colors.black}
                  />
                </>
              )}
            </InputContainer>
          </ContainerPressable>
          <If condition={!trip?.oldDestinationId}>
            <ContainerButton
              activeOpacity={0.8}
              onPress={async () => {
                await dispatchTripCustomer({
                  type: 'update',
                  field: 'origin',
                  arg: trip?.origin,
                });

                if (trip?.tripWayPoints.length > 0) {
                  dispatchTripCustomer({
                    type: 'update',
                    field: 'waypoints',
                    arg: [...waypoints, ...trip?.tripWayPoints],
                  });
                  return;
                }
                dispatchTripCustomer({
                  type: 'update',
                  field: 'waypointQuantities',
                  arg: waypointQuantities + 1,
                });

                dispatchTripCustomer({
                  type: 'update',
                  field: 'destination',
                  arg: {
                    address:
                      trip?.destination?.name || trip?.destination?.address,
                    latitude: trip?.destination?.latitude,
                    longitude: trip?.destination?.longitude,
                    street: trip?.destination?.street || null,
                    type: 'destination',
                    name:
                      trip?.destination?.name || trip?.destination?.address,
                  },
                });
                setVisibleLookUpAddressModal(!visibleLookUpAddressModal);
              }}
            >
              <Ionicons
                name="add"
                size={30}
                style={{
                  marginLeft: 3,
                }}
                color={theme.colors.primaryText}
              />
            </ContainerButton>
          </If>
          <ShareButton
            onPress={() => {
              // Linking.openURL(linkShare);
              onShare();
            }}
          >
            <Ionicons
              name="share-social"
              size={24}
              color={theme.colors.primaryText}
            />
          </ShareButton>
          {trip.status !== STATUS_IN_PROGRESS && trip.status !== STATUS_WAITING && (
            <CancelButton
              onPress={() => {
                setCancellationReasonsModal(true);
              }}
            >
              <AntDesign
                name="close"
                size={24}
                color={theme.colors.primaryText}
              />
            </CancelButton>
          )}
        </BottomContainer>
      </Container>
      <ModalCancellationReasonsCustomer
        visible={cancellationReasonsModal}
        setVisible={setCancellationReasonsModal}
      />
      <CardInfoClient
        setVisible={setVisibleInfoCardInfo}
        visible={visibleInfoCardInfo}
      />

      <DistantDriverPriceConfirmationModal
        visible={visibleLongDistance}
        newPrice={Number(trip.price)}
        onPressSearchNew={researchDriver}
        onPressContinue={() => setVisibleLongDistance(false)}
      />
    </>
  );
}
