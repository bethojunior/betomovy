import {Ionicons} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';

import {useState, useEffect, useCallback} from 'react';
import {View, Alert, FlatList} from 'react-native';
import {Avatar} from 'react-native-elements';

import {translate} from '../../../locales';

import apiMain from '../../../api/apiMain';
import {customToast} from '../../../../utils/FlashMessage';

import Preload from '../../../components/Preload';

import {useAuth} from '../../../../context/auth';
import {useReceipt} from '../../../contexts/Receipt';
import {useFavorite} from '../../../contexts/favorite';

import {convertDate, maskHour} from '../../../utils/FormatDate';
import {maskMoneyIntl} from '../../../utils/money';

import theme from '../../../styles/theme';

import {
  Container,
  ButtonBack,
  Header,
  TitleHeader,
  Body,
  AddressContent,
  TextDescription,
  ButtonDriver,
  ContentInformationTrip,
  DriverContent,
  Address,
  Destiny,
  Circle,
  Square,
  DriverName,
  ContentPhotoDriver,
  DescriptionDriver,
  ContentDescriptionDriver,
  TextButtonDriver,
  ContentActionsDriver,
  ContentHelp,
  ContentHeaderHelp,
  ButtonHeaderHelp,
  ButtonTextsHeaderHelp,
  ContentItemsList,
  ContentReceipt,
  ButtonReceiptEmail,
  TextButtonReceiptEmail,
  ContentTypeHelp,
  PaymentNameTypeHelp
} from './styles';

export default function DetailsTripSpeedMob({route}: any) {
  const {user} = useAuth();
  const {addFavorites, getFavorites, favorites} = useFavorite();
  const {sendReceipt} = useReceipt();
  const [detailsTrip, setDetailsTrip] = useState<any>({});
  const [driverBloqued, setDriverBlocked] = useState({});
  const [loading, setLoading] = useState(true);
  const [helpers, setHelpers] = useState([]);
  const [isDriverFavorited, setIsDriverFavorited] = useState<boolean>(false);

  const [screenFavoriteAndReceived, setScreenFavoriteAndReceived] = useState<'help' | 'received'>('help');

  const navigation = useNavigation();

  const listMethodsHelp = async () => {
    setLoading(true);
    try {
      const {data} = await apiMain.get('/TripReportType/GetAll');
      setHelpers(data.data);
    } catch {
      console.log('error');
    }
    setLoading(false);
  };

  const getListFavorites = useCallback(async () => {
    setLoading(true);
    await getFavorites();
    setLoading(false);
  }, [loading, getFavorites]);


  const navigateToHelp = (item: any) => {
    navigation.navigate('ContactUsSpeedMob', {
      title: item.name,
      id: item.idTripReportType,
    });
  }

  const PaymentMethod = ({item}: any) => (
    <ContentTypeHelp
      onPress={() => {
        navigateToHelp(item);
      }}
    >
      <PaymentNameTypeHelp>{item.name}</PaymentNameTypeHelp>
    </ContentTypeHelp>
  );

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
    const isDriverExists = favorites.filter((data) => data.idDriver === detailsTrip?.driver?.idDriver);
    if(isDriverExists.length > 0){
      setIsDriverFavorited(true);
    }else{
      setIsDriverFavorited(false);
    }
  }

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
    if(switchStatus(trip.status.toUpperCase()) === 'Finalizado'){
      listMethodsHelp();
    }
  }, [favorites]);

  useEffect(() => {
    getListFavorites();
  }, []);

  useEffect(() => {
    if(favorites){
      if(switchStatus(trip.status.toUpperCase()) === 'Finalizado' || switchStatus(trip.status.toUpperCase()) === 'Cancelado'){
        checkDriverIsFavorited();
      }
    }
  },[loading]);

  return (
    <Container>
      <Preload visible={loading} />
      <Header backgroundColor={theme.colors.primary}>
        <ButtonBack onPress={() => navigation.goBack()}>
          <Ionicons
            name="arrow-back"
            size={30}
            color={theme.colors.background_global}
          />
        </ButtonBack>
        <TitleHeader colorText={theme.colors.background_global}>
          {translate('appRoutes.title_details_trip')}
        </TitleHeader>
      </Header>
      <Body>
        <ContentInformationTrip>
          <View>
            <TextDescription textColor={theme.colors.primary}>
              {formatDateAndHour(trip.date)}
            </TextDescription>
            <TextDescription textColor={theme.colors.primary}>
              {trip.paymentForm}
            </TextDescription>
          </View>
          <TextDescription textColor={theme.colors.primary}>
            {maskMoneyIntl(trip.price)}
          </TextDescription>
        </ContentInformationTrip>
        <AddressContent>
          <Address>
            <Circle color="green" />
            {trip.originAddress}
          </Address>
          <Destiny>
            <Square color="red" />
            {trip.destinationAddress}
          </Destiny>
        </AddressContent>
        {trip.driverName && (
          <>
            <DriverContent>
              <ContentPhotoDriver>
                <Avatar
                  rounded
                  size={100}
                  source={{
                    uri:
                      detailsTrip?.driver?.profilePicture,
                  }}
                />
              </ContentPhotoDriver>
              <ContentDescriptionDriver>
                <DriverName>{trip.driverName}</DriverName>
                <DescriptionDriver>
                  {detailsTrip?.driver?.car?.model}
                </DescriptionDriver>
                <DescriptionDriver>
                  {detailsTrip?.driver?.car?.plate}
                </DescriptionDriver>
                <DescriptionDriver>
                  {`${translate('detailsTrip.time_duration_trip')} `}
                  {detailsTrip?.driver?.estimative?.duration} KM
                </DescriptionDriver>
                <DescriptionDriver>
                  {`${translate('detailsTrip.time_distance_trip')} `}
                  {detailsTrip?.driver?.estimative?.distance} Min
                </DescriptionDriver>
              </ContentDescriptionDriver>
            </DriverContent>
            <ContentActionsDriver>
              <ButtonDriver
                isDisabled={isDriverFavorited}
                disabled={isDriverFavorited}
                backgroundColor={theme.colors.primary}
                onPress={addFavorite}
              >
                <TextButtonDriver colorText={theme.colors.background_global}>
                  {isDriverFavorited ? translate('favorites.text_button_isfavorited') : translate('favorites.text_button_favorite')}
                </TextButtonDriver>
              </ButtonDriver>
              <ButtonDriver
                backgroundColor={theme.colors.primary}
                onPress={() => blockDriver(driverBloqued)}
              >
                <TextButtonDriver colorText={theme.colors.background_global}>
                  {driverBloqued
                    ? translate('detailsTrip.unlock')
                    : translate('detailsTrip.blocked')}
                </TextButtonDriver>
              </ButtonDriver>
            </ContentActionsDriver>
          </>
        )}
        {switchStatus(trip.status.toUpperCase()) === 'Finalizado' && (
          <ContentHelp>
            <ContentHeaderHelp>
              <ButtonHeaderHelp style={{ borderColor: screenFavoriteAndReceived === 'help' ? theme.colors.secondary : '', borderBottomWidth: screenFavoriteAndReceived === 'help' ? 1 : 0 }} 
                onPress={() => setScreenFavoriteAndReceived('help')}
              >
                <ButtonTextsHeaderHelp>
                  {translate('detailsTrip.need_help')}
                </ButtonTextsHeaderHelp>
              </ButtonHeaderHelp>
              <ButtonHeaderHelp style={{ borderColor: screenFavoriteAndReceived === 'received' ? theme.colors.secondary : '', borderBottomWidth: screenFavoriteAndReceived === 'received' ? 1 : 0 }}
                onPress={() => setScreenFavoriteAndReceived('received')}
              >
                <ButtonTextsHeaderHelp>
                  {translate('detailsTrip.send_receipt_select')}
                </ButtonTextsHeaderHelp>
              </ButtonHeaderHelp>
            </ContentHeaderHelp>
            {screenFavoriteAndReceived === 'help' && (
              <ContentItemsList>
                <FlatList
                  style={{paddingBottom: 10}}
                  data={helpers}
                  renderItem={PaymentMethod}
                  keyExtractor={(item: any) => item.idTripReportType}
                />
              </ContentItemsList>
            )}

            {screenFavoriteAndReceived === 'received' && (
              <ContentReceipt>
                <ButtonReceiptEmail onPress={sendReceiptEmail}>
                  <TextButtonReceiptEmail>{translate('detailsTrip.send_receipt')}</TextButtonReceiptEmail>
                </ButtonReceiptEmail>
              </ContentReceipt>
            )}
          </ContentHelp>
        )}
      </Body>
    </Container>
  );
}
