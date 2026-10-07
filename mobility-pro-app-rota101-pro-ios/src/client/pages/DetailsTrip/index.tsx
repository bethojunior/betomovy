import {Alert, Image, View, Text} from 'react-native';
import {useEffect, useRef, useState, useCallback} from 'react';
import MapView, {Marker, Polyline} from 'react-native-maps';
import {Button} from 'react-native-paper';
import {useNavigation} from '@react-navigation/native';
import {
  Address,
  AddressContent,
  Ball,
  Buton,
  ButtonsHelp,
  Column,
  ContainerButton,
  ContainerDialog,
  ContainerFooter,
  ContainerModal,
  ContainerText,
  Content,
  ContentDriverInfo,
  Destiny,
  DriverContent,
  DriverName,
  HeaderCardContainer,
  Line,
  MapContent,
  SectionDriver,
  Square,
  TextSmall,
} from './styles';

import {If} from '../../components/If';
import apiMain from '../../api/apiMain';
import theme from '../../styles/theme';
import {
  STATUS_CANCELED,
  STATUS_FINISHED,
  STATUS_SCHEDULED,
} from '../../constants/trip';
import {translate} from '../../locales';
import {maskMoneyIntl} from '../../utils/money';
import {ButtonSmall} from '../../components/ButtonSmall';
import {convertDate, maskHour} from '../../utils/FormatDate';
import {useFavorite} from '../../contexts/favorite';
import Preload from '../../components/Preload';
import {useReceipt} from '../../contexts/Receipt';
import HelpMethodModal from '../../components/HelpMethodModal';
import {customToast} from '../../../utils/FlashMessage';
import {useAuth} from '../../../context/auth';
import Helper from '../../utils/Helper';
import {showMessage} from 'react-native-flash-message';

export const DetailsTrip = ({route}: any) => {
  const {user} = useAuth();
  const {addFavorites, getFavorites, favorites} = useFavorite();
  const {sendReceipt} = useReceipt();
  const [detailsTrip, setDetailsTrip] = useState<any>({});
  const [driverBloqued, setDriverBlocked] = useState({});
  const [loading, setLoading] = useState(true);
  const [modalHelp, setModalHelp] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const {navigate} = useNavigation();
  const mapRef = useRef<any>(null);
  const [isDriverFavorited, setIsDriverFavorited] = useState<boolean>(false);

  const getDetailsTrip = async (tripReference: string) => {
    setLoading(true);
    try {
      const response = await apiMain.post(`Trip/Get`, {
        stdObject: [
          {
            tripReference,
          },
        ],
      });
      setDetailsTrip(response.data.data);
      listBlockDriver(response.data.data.driver.idDriver);
      setLoading(false);
      return response.data.data;
    } catch (error) {
      console.log(error);
      setLoading(false);

      return console.log('erro');
    }
  };

  const getListFavorites = useCallback(async () => {
    setLoading(true);
    await getFavorites();
    setLoading(false);
  }, [loading, getFavorites]);

  async function cancelTripByCustomerSchedule(
    tripReference: string,
    status = STATUS_CANCELED,
  ) {
    setIsLoading(true);
    const payload = {
      stdObject: [
        {
          status,
          userId: user.idUser,
          tripReference: tripReference,
          dateEnd: Helper.getNow(),
        },
      ],
    };

    const {data} = await apiMain.post('Customer/CancelTrip', payload);

    if (data.status) {
      setIsLoading(false);
      customToast(translate('service.toast_sucess'), 'success');
      navigate('TripRoutes', {screen: 'Home'});
    } else {
      setIsLoading(false);
      showMessage({
        message: data.message,
        type: 'info',
        position: 'bottom',
        icon: 'auto',
        duration: 4000,
        style: {
          height: 80,
          alignItems: 'center',
        },
        titleStyle: {
          fontSize: 16,
        },
      });
    }
  }

  const formatDateAndHour = (date: string) => {
    const dateSplit = date.split(' ');
    return `${convertDate(dateSplit[0])} ${maskHour(dateSplit[1])}`;
  };
  const switchStatus = (status: string) => {
    switch (status) {
      case 'SCHEDULED':
        return translate('service.scheduled');
      case 'IN_PROGRESS':
        return translate('request.text_in_progress');
      case 'FINISHED':
        return translate('service.finished');
      case 'CANCELED':
        return translate('service.cancel');
      case 'BACK_OFF':
        return translate('service.not_answered');
      case 'NOT_ANSWERED':
        return translate('service.not_answered');
      default:
        return '';
    }
  };
  const {tripReference} = route.params;
  const {trip} = route.params;

  const checkDriverIsFavorited = () => {
    const isDriverExists = favorites.filter(
      data => data.idDriver === detailsTrip?.driver?.idDriver,
    );
    if (isDriverExists.length > 0) {
      setIsDriverFavorited(true);
    } else {
      setIsDriverFavorited(false);
    }
  };

  const addFavorite = async () => {
    Alert.alert(
      translate('detailsTrip.add_favorite'),
      translate('detailsTrip.favorite'),
      [
        {
          text: translate('detailsTrip.text_button_no'),
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: translate('detailsTrip.text_button_yes'),
          onPress: async () => {
            await addFavorites(user.idCustomer, detailsTrip.driver.idDriver);
          },
        },
      ],
      {cancelable: false},
    );
  };

  const listBlockDriver = async (idDriver: string) => {
    setLoading(true);
    try {
      const {data} = await apiMain.post(`/RefusedDriver/list`, {
        customerId: user.idCustomer,
      });
      const driverBlocked = data.data.find(
        (item: any) => item.idDriver === idDriver,
      );
      setDriverBlocked(driverBlocked);
      setLoading(false);
      return driverBlocked;
    } catch (error) {
      setLoading(false);
      return console.log(error);
    }
  };

  const blockDriver = async (driverBlocked: any) => {
    if (!driverBlocked) {
      return Alert.alert(
        translate('detailsTrip.blocked_driver'),
        translate('detailsTrip.text_dialog_blocked'),
        [
          {
            text: translate('detailsTrip.text_button_no'),
            onPress: () => console.log('Cancel Pressed'),
            style: 'cancel',
          },
          {
            text: translate('detailsTrip.text_button_yes'),
            onPress: async () => {
              const response = await apiMain.post(`RefusedDriver/Insert`, {
                driverId: detailsTrip.driver.idDriver,
                customerId: user.idCustomer,
              });
              await listBlockDriver(detailsTrip.driver.idDriver);
              if (!response.data.status) {
                return customToast(response.data.message, 'danger');
              }
              return customToast(
                translate('detailsTrip.text_sucess_blocked'),
                'success',
              );
            },
          },
        ],
        {cancelable: false},
      );
    }
    return Alert.alert(
      translate('detailsTrip.unlock_driver'),
      translate('detailsTrip.text_dialog_unlock'),
      [
        {
          text: translate('detailsTrip.text_button_no'),
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: translate('detailsTrip.text_button_yes'),
          onPress: async () => {
            const response = await apiMain.post(`RefusedDriver/Delete`, {
              idRefused: driverBlocked.id,
            });
            await listBlockDriver(detailsTrip.driver.idDriver);
            if (!response.data.status) {
              return customToast(response.data.message, 'danger');
            }
            return customToast(
              translate('detailsTrip.text_sucess_unlock'),
              'success',
            );
          },
        },
      ],
      {cancelable: false},
    );
  };

  const sendReceiptEmail = async () => {
    setLoading(true);
    await sendReceipt(tripReference);
    setLoading(false);
  };

  useEffect(() => {
    getDetailsTrip(tripReference);
  }, []);

  const cancelTripBySchedule = async (tripReference: string) => {
    setLoading(true);
    await cancelTripByCustomerSchedule(tripReference);
    await getDetailsTrip(tripReference);
    setLoading(false);
  };

  useEffect(() => {
    getListFavorites();
  }, []);

  useEffect(() => {
    if (favorites) {
      if (
        switchStatus(trip.status.toUpperCase()) === 'Finalizado' ||
        switchStatus(trip.status.toUpperCase()) === 'Cancelado'
      ) {
        checkDriverIsFavorited();
      }
    }
  }, [loading]);

  return (
    <>
      <Preload visible={loading} />
      <If condition={Object.keys(detailsTrip).length > 0}>
        <ContainerModal>
          {trip && (
            <MapContent style={{zIndex: -1}}>
              <MapView
                ref={mapRef}
                style={{
                  width: '100%',
                  height: 200,
                }}
                initialRegion={{
                  latitude: parseFloat(trip.originLatitude),
                  longitude: parseFloat(trip.originLongitude),
                  latitudeDelta: 0.0522,
                  longitudeDelta: 0.0421,
                }}
                onMapReady={() => {
                  mapRef.current.fitToCoordinates(
                    [
                      {
                        latitude: parseFloat(trip.originLatitude),
                        longitude: parseFloat(trip.originLongitude),
                      },
                      {
                        latitude: parseFloat(trip.destinationLatitude),
                        longitude: parseFloat(trip.destinationLongitude),
                      },
                    ],
                    {
                      edgePadding: {
                        top: 5,
                        right: 20,
                        bottom: 15,
                        left: 100,
                      },
                      animated: true,
                    },
                  );
                }}
                scrollEnabled={false}
                rotateEnabled={false}
                zoomEnabled={false}
                pitchEnabled={false}
              >
                <Marker
                  coordinate={{
                    latitude: parseFloat(trip.originLatitude),
                    longitude: parseFloat(trip.originLongitude),
                  }}
                  title="Localização Atual"
                />
                {/* {trip.schedule === null && ( */}
                <Marker
                  coordinate={{
                    latitude: parseFloat(trip.destinationLatitude),
                    longitude: parseFloat(trip.destinationLongitude),
                  }}
                  title="Chegada"
                />
                {/* )} */}
                <Polyline
                  strokeWidth={6}
                  coordinates={
                    trip.schedule === null
                      ? [
                          {
                            latitude: parseFloat(trip.originLatitude),
                            longitude: parseFloat(trip.originLongitude),
                          },
                          {
                            latitude: parseFloat(trip.destinationLatitude),
                            longitude: parseFloat(trip.destinationLongitude),
                          },
                        ]
                      : [
                          {
                            latitude: parseFloat(trip.originLatitude),
                            longitude: parseFloat(trip.originLongitude),
                          },
                          {
                            latitude: parseFloat(trip.destinationLatitude),
                            longitude: parseFloat(trip.destinationLongitude),
                          },
                        ]
                  }
                />
              </MapView>
            </MapContent>
          )}
          <ContainerDialog>
            <HeaderCardContainer>
              <If condition={detailsTrip?.driver}>
                <DriverContent>
                  <Image
                    source={{
                      uri: detailsTrip?.driver?.profilePicture,
                    }}
                    style={{
                      width: 70,
                      height: 70,
                      borderRadius: 50,
                      marginLeft: 10,
                      marginTop: 5,
                    }}
                  />

                  <ContentDriverInfo>
                    <DriverName>{trip?.driverName}</DriverName>
                    <SectionDriver>
                      <Column>
                        <TextSmall>{detailsTrip?.driver?.car?.model}</TextSmall>
                        <Button
                          disabled={isDriverFavorited}
                          onPress={addFavorite}
                        >
                          <TextSmall color={theme.colors.primary}>
                            {isDriverFavorited
                              ? translate('favorites.text_button_isfavorited')
                              : translate('favorites.text_button_favorite')}
                          </TextSmall>
                        </Button>
                      </Column>
                      <Column
                        style={{
                          alignSelf: 'flex-end',
                        }}
                      >
                        <TextSmall>{detailsTrip?.driver?.car?.plate}</TextSmall>
                        <Button onPress={() => blockDriver(driverBloqued)}>
                          <TextSmall color={theme.colors.primary}>
                            {driverBloqued
                              ? translate('detailsTrip.unlock')
                              : translate('detailsTrip.blocked')}
                          </TextSmall>
                        </Button>
                      </Column>
                    </SectionDriver>
                  </ContentDriverInfo>
                </DriverContent>
              </If>
            </HeaderCardContainer>
          </ContainerDialog>
          <AddressContent>
            <View style={{padding: 10}}>
              <Ball color="primary" />
              <Line />
              {detailsTrip.tripWayPoints &&
                detailsTrip.tripWayPoints.length > 0 &&
                detailsTrip.tripWayPoints.map(() => (
                  <>
                    <Ball color="secondary" />
                    <Line />
                  </>
                ))}
              <Square />
            </View>
            <View style={{paddingRight: 20}}>
              <Address>{trip.originAddress}</Address>
              {detailsTrip.tripWayPoints &&
                detailsTrip.tripWayPoints.length > 0 &&
                detailsTrip.tripWayPoints.map(wayPoint => (
                  <Address>{wayPoint.address}</Address>
                ))}
              <Destiny>{trip.destinationAddress}</Destiny>
            </View>
          </AddressContent>

          <ContainerFooter>
            <ContainerText>
              <TextSmall>
                {translate('detailsTrip.text_type_payment')}
              </TextSmall>
              <Text>{trip.paymentForm}</Text>
              <Content style={{marginTop: 20}}>
                <TextSmall>{translate('detailsTrip.text_total')}</TextSmall>
                <Text>{maskMoneyIntl(trip.price)}</Text>
              </Content>
            </ContainerText>

            <ContainerText>
              <TextSmall>{translate('detailsTrip.text_status')}</TextSmall>
              <Text>{switchStatus(trip.status.toUpperCase())}</Text>
              <Content style={{marginTop: 20}}>
                <TextSmall>{translate('detailsTrip.text_date')}</TextSmall>
                <Text>
                  {trip.schedule
                    ? formatDateAndHour(trip.schedule.schedule)
                    : formatDateAndHour(trip.date)}
                </Text>
              </Content>
            </ContainerText>
          </ContainerFooter>

          <If condition={trip.status === STATUS_SCHEDULED.toLowerCase()}>
            <ContainerButton>
              <ButtonSmall
                title={translate('service.text_button_cancel')}
                onPress={async () => {
                  await cancelTripBySchedule(trip.tripReference);
                }}
                loading={isLoading}
              />
            </ContainerButton>
          </If>

          <If condition={trip.status === STATUS_FINISHED.toLowerCase()}>
            <ButtonsHelp>
              <Buton
                onPress={() => {
                  setModalHelp(true);
                }}
              >
                <TextSmall color={theme.colors.white}>
                  {translate('detailsTrip.need_help')}
                </TextSmall>
              </Buton>
              <Buton onPress={sendReceiptEmail} loading={false}>
                <TextSmall color={theme.colors.white}>
                  {translate('detailsTrip.send_receipt')}
                </TextSmall>
              </Buton>
            </ButtonsHelp>
          </If>
        </ContainerModal>
      </If>

      <If condition={modalHelp}>
        <HelpMethodModal visible={modalHelp} setVisible={setModalHelp} />
      </If>
    </>
  );
};
