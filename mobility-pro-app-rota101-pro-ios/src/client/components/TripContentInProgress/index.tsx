import {useEffect, useState, useCallback, useMemo} from 'react';
import {Share, Text} from 'react-native';
import {AntDesign, Feather, Ionicons} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';
import {View} from 'moti';
import {
  STATUS_IN_PROGRESS,
  STATUS_SCHEDULED,
  tripStatus,
} from '../../constants/trip';
import {useTrip} from '../../contexts/Trip';
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
  DriverRating,
  DriverRatingContainer,
  HeaderContainer,
  Input,
  InputContainer,
  LicensePlate,
  Nickname,
  NicknameContainer,
  ShareButton,
  TripStatus,
  TripStatusContainer,
  TripTimeContainer,
} from './styles';
import {useAuth} from '../../../context/auth';
import {customToast} from '../../../utils/FlashMessage';
import {TextEdit} from '../TextEdit';
import theme from '../../styles/theme';
import {translate} from '../../locales';
import LookUpAddressesModalInTrip from '../LookUpAddressesModalInTrip';
import {If} from '../If';
import {convertDatetimeToTime} from '../../utils/FormatDate';
import {ModalCancellationReasonsCustomer} from '../ModalCancellationReason';
import Animated, {
  useSharedValue,
  withTiming,
  useAnimatedStyle,
  withRepeat,
  withSequence,
} from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useFocusEffect} from '@react-navigation/native';
import {ChatRealtime} from '../../services/realtime/ChatRealtime';
import {CardInfoClient} from '../CardInfoClient';
import {TripProps} from '../../contexts/Trip/types';
import ModalFrame from '../../../driver/src/components/form/ModalFrame';
import Helper from '../../utils/Helper';

const height = 260;

export default function TripContentInProgress({setModalDriverData}) {
  const {user, cityConfig} = useAuth();
  const chatRealtime = useMemo(() => new ChatRealtime(), []);

  const [cancellationReasonsModal, setCancellationReasonsModal] =
    useState(false);
  const {
    shareTrip,
    previewChangeRoutes,
    stateTripCustomer,
    dispatchTripCustomer,
    cancelTripByCustomer,
    initNewTripAfterCancel,
  } = useTrip();

  const {trip, routeTrip, waypointQuantities, waypoints} = stateTripCustomer;
  const navigation = useNavigation();
  const [newMessage, setNewMessage] = useState(false);
  const [linkShare, setLinkShare] = useState('');
  const [visibleInfoCardInfo, setVisibleInfoCardInfo] = useState(false);
  const [visibleLongDistance, setVisibleLongDistance] = useState(false);

  const [visibleLookUpAddressModal, setVisibleLookUpAddressModal] =
    useState(false);

  const seconds = 15;

  useEffect(() => {
    if (trip.tripReference) {
      if (trip.tripLongDistanceValue !== null && trip.status == 'accepted') {
        setVisibleLongDistance(true);
        setTimeout(() => {
          setVisibleLongDistance(false);
        }, seconds * 1000);
      } else {
        setVisibleLongDistance(false);
      }
      chatRealtime.getLastMessageUnread(trip.tripReference, ({item, id}) => {
        if (item.message === 'null') {
          return;
        }

        if (
          // eslint-disable-next-line eqeqeq
          item.userId != user.idUser &&
          !item.viewed &&
          navigation.isFocused()
        ) {
          setNewMessage(true);
        }
      });
    }
  }, [trip]);

  const getLink = async () => {
    if (trip.tripReference) {
      const result = await shareTrip(trip.tripReference);
      setLinkShare(result);
    }
  };

  const setSwitchRead = async () => {
    try {
      const responseSwitchRead = await AsyncStorage.getItem(
        'switchRead-client',
      );
      if (responseSwitchRead === null) {
        await AsyncStorage.setItem('switchRead-client', 'true');
      } else if (responseSwitchRead == 'false') {
        await AsyncStorage.setItem('switchRead-client', 'false');
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getLink();
  }, []);

  const researchDriver = async () => {
    const localTrip: TripProps = trip;
    await cancelTripByCustomer();
    initNewTripAfterCancel(localTrip, false);
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
      customToast('Erro ao Compartilhar', 'error');
    }
  };

  const rotation = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{translateX: rotation.value}],
    };
  });

  useFocusEffect(
    useCallback(() => {
      setSwitchRead();
    }, []),
  );

  useEffect(() => {
    rotation.value = withRepeat(
      withSequence(
        withTiming(1, {duration: 150}),
        withTiming(-1, {duration: 150}),
        withTiming(0, {duration: 150}),
      ),
      -1,
      true,
    );
  }, []);

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
      <View
        style={{
          backgroundColor: theme.colors.background_global,
          height,
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          paddingTop: height === 260 ? 0 : 20,
        }}
      >
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
          <HeaderContainer>
            <TripStatusContainer>
              <TripStatus>
                {String(tripStatus[trip.status]).concat(
                  trip?.status === STATUS_SCHEDULED
                    ? ` - ${convertDatetimeToTime(trip?.schedule?.schedule)}`
                    : '',
                )}
              </TripStatus>
            </TripStatusContainer>
            <TripTimeContainer>
              <TextEdit size="smalls" color={theme.colors.secondary}>
                {(routeTrip && String(routeTrip?.time)?.replace('min', '')) ||
                  0}
              </TextEdit>
              <TextEdit size="smalls" color={theme.colors.secondary}>
                {translate('trip.minutes')}
              </TextEdit>
            </TripTimeContainer>
          </HeaderContainer>
          <CenterContainer>
            <DriverInfoContainer
              activeOpacity={0.8}
              onPress={() => {
                // setModalDriverData(true)
                setVisibleInfoCardInfo(true);
              }}
            >
              <DriverProfilePicture
                source={{uri: trip?.driver?.profilePicture}}
              />
              <DriverRatingContainer>
                <DriverRating>
                  {parseFloat(trip.driver.rating).toFixed(1).replace('.', ',')}
                </DriverRating>
                <AntDesign
                  name="star"
                  size={10}
                  color={theme.colors.secondary}
                />
              </DriverRatingContainer>
            </DriverInfoContainer>

            <NicknameContainer>
              <Feather
                name="user-check"
                size={22}
                color={theme.colors.secondary}
              />
              <Nickname>{trip?.driver?.nickname}</Nickname>
            </NicknameContainer>

            <CarInfoContainer>
              <LicensePlate>{trip.driver?.car?.plate}</LicensePlate>
              <CarInfo>{`${trip.driver.car?.brand || ''} ${
                trip.driver?.car?.model || ''
              } - ${trip.driver?.car?.color || ''}`}</CarInfo>
            </CarInfoContainer>
          </CenterContainer>
          <BottomContainer>
            <ContainerPressable
              onPress={() => {
                setNewMessage(false);
                navigation.navigate('TripChat');
              }}
            >
              <InputContainer pointerEvents="none">
                <Input
                  editable={false}
                  color={
                    newMessage
                      ? theme.colors.primaryText
                      : theme.colors.secondary
                  }
                  newMessage={newMessage}
                >
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
                        name="ios-chatbubble-ellipses-sharp"
                        size={24}
                        color={theme.colors.red}
                      />
                    </Animated.View>
                  </>
                ) : (
                  <>
                    <ChatIcon
                      name="ios-chatbubble-ellipses-sharp"
                      size={24}
                      color={theme.colors.primary}
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
            {trip.status !== STATUS_IN_PROGRESS && (
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
      </View>
      {trip.tripLongDistanceValue !== null && true ? (
        <ModalFrame
          textConfirm="Procurar mais próximo"
          textCancel="Continuar"
          onClose={() => setVisibleLongDistance(false)}
          onPressConfirm={researchDriver}
          setVisible={setVisibleLongDistance}
          visible={visibleLongDistance}
        >
          <View>
            <View
              style={{
                borderBottomWidth: 0.5,
                borderBottomColor: theme.colors.border,
                marginBottom: 10,
              }}
            >
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 18,
                  fontFamily: 'MavenPro_400Regular',
                }}
              >
                AVISO
              </Text>
            </View>
            <View>
              <Text
                style={{
                  fontFamily: 'MavenPro_400Regular',
                  margin: 5,
                }}
              >
                Encontramos seu motorista distante da sua localização. Deseja
                continuar com essa corrida?
              </Text>
              <Text
                style={{
                  fontFamily: 'MavenPro_600Medium',
                  margin: 5,
                  textAlign: 'center',
                  fontSize: 22,
                }}
              >
                {cityConfig.typeMoney}{' '}
                {Helper.maskMoney(
                  Number(trip.price) +
                    Number(trip?.tripLongDistanceValue?.value),
                )}
              </Text>
            </View>
          </View>
        </ModalFrame>
      ) : null}
    </>
  );
}
