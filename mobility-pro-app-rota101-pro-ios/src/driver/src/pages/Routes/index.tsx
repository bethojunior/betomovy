/* eslint-disable radix */
import {useEffect, useState} from 'react';
import {TouchableOpacity, View, Image, Alert} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import {useTheme} from 'styled-components';
import Ionicons from '@expo/vector-icons/Ionicons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import {useLocalization} from '../../../contexts/Localization';
import ModalFrame from '../../components/Modal/ModalFrame';
import {useRoutes} from '../../context/Route';
import {ListRoutesProps} from '../../context/Route/types';
import {getCoinType, maskMoney} from '../../utils/money';
import {
  Ball,
  Button,
  ButtonContent,
  Card,
  CardContent,
  Content,
  Container,
  DataContent,
  Info,
  InfoModal,
  Input,
  ItemOfferedButton,
  Line,
  ModalSection,
  Price,
  PriceSection,
  RouteName,
  Section,
  SimpleText,
  TextButton,
  TitleModal,
  TitlePrice,
  VacanciesButton,
  VacanciesText,
} from './styles';
import {IfLoaderInsideScreen} from '../../components/IfLoaderInsideScreen';
import {translate} from '../../../../client/locales';
import Helper from '../../utils/Helper';
import {useAuth} from '../../../../context/auth';
import { useLocalProvider } from '../../context/local';

export const Routes = () => {
  const [selected, setSelected] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [routeSelected, setRouteSelected] = useState({} as ListRoutesProps);
  const [loading, setLoading] = useState(false);
  const [loadingCard, setLoadingCard] = useState(false);
  const [tripItems, setTripItems] = useState<Array<number>>([]);
  const [vacancies, setVacancies] = useState(1);
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [error, setError] = useState(false);
  const [messageError, setMessageError] = useState('');
  const [hourOffered, setHourOffered] = useState('');
  const [dateOffered, setDateOffered] = useState('');

  const {colors} = useTheme();
  const {location} = useLocalProvider();
  const {generalSettings} = useAuth();
  const {
    getNew,
    getReleased,
    getOffered,
    listRoutes,
    requestRoute,
    offerRoute,
    cancelOffer,
  } = useRoutes();

  useEffect(() => {
    setLoadingCard(true);
    const loadNewRoute = async () => {
      await getNew(location?.coords?.latitude, location?.coords?.longitude);
      setLoadingCard(false);
    };

    setShowModal(false);
    setSelected(1);
    loadNewRoute();
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-shadow
  function validateDate(date: string) {
    if (!date) return false;

    const [day, month, year] = date.split('/');
    const currentDate = new Date();
    const currentDay = currentDate.getDate();
    const currentMonth = currentDate.getMonth() + 1;
    const currentYear = currentDate.getFullYear();

    if (Number(month) > 12 || Number(day) > 30) {
      return false;
    }

    if (Number(year) < currentYear) {
      return false;
    }

    if (Number(year) === currentYear && Number(month) < currentMonth) {
      return false;
    }

    if (Number(month) === currentMonth && Number(day) < currentDay) {
      return false;
    }

    return true;
  }

  const doSomething = async () => {
    setError(false);
    if (selected === 1) {
      setLoading(true);
      await requestRoute(routeSelected.id);
      setShowModal(false);
      return setLoading(false);
    }

    if (selected === 2) {
      if (date === '' || time === '') {
        setMessageError(translate('pageRoutes.text_required_fields'));
        return setError(true);
      }

      const newTime = time.split(':');
      const format = date.split('/');

      const isValid = await validateDate(date);
      if (!isValid || format[1] === undefined || format[2] === undefined) {
        setMessageError(translate('pageRoutes.text_invalid_date'));
        return setError(true);
      }

      const newDate = `${format[2]}-${format[1]}-${format[0]} ${time}`;

      if (
        newTime[1] === undefined ||
        Number(newTime[0]) > 23 ||
        Number(newTime[1]) > 59
      ) {
        setMessageError(translate('pageRoutes.text_invalid_hour'));
        return setError(true);
      }

      setLoading(true);

      const status = await offerRoute(
        routeSelected.id,
        newDate,
        tripItems,
        vacancies,
      );

      if (status) {
        clearData();
        setShowModal(false);
        setLoading(false);
      }

      return '';
    }

    Alert.alert(
      translate('trip.cancel_trip'),
      translate('trip.text_dialog_cancel'),
      [
        {
          text: 'Cancelar rota',
          onPress: async () => {
            setLoading(true);
            await cancelOffer(routeSelected.ride?.tripReference);
            getOffered();
            setShowModal(false);
            return setLoading(false);
          },
        },

        {
          text: 'Voltar',
          onPress: () => {},
        },
      ],
      {cancelable: false},
    );
    return '';
  };

  const clearData = () => {
    setTripItems([]);
    setVacancies(1);
    setDate('');
    setTime('');
    setError(false);
    setMessageError('');
  };

  useEffect(() => {
    if (selected === 3) {
      let convertDate = routeSelected?.ride?.schedule.split(' ');
      setHourOffered(convertDate[1]);
      convertDate = convertDate[0].split('-');
      setDateOffered(`${convertDate[2]}-${convertDate[1]}-${convertDate[0]}`);

      routeSelected?.ride?.rideItems?.find(item => {
        setTripItems([...tripItems, item.routeTripItemTypeId]);
      });
    }
  }, [routeSelected]);

  return (
    <>
      <Content>
        <IfLoaderInsideScreen
          loading={loadingCard}
          color={colors.primary}
          size={30}
        >
          <CardContent>
            <ScrollView>
              {listRoutes.length > 0 ? (
                listRoutes.map((route, index) => {
                  return (
                    <Card
                      key={index}
                      activeOpacity={0.8}
                      onPress={() => {
                        setRouteSelected(route);
                        setShowModal(true);
                      }}
                      disabled={
                        selected === 2
                          ? route?.driverAccept?.active === '0'
                          : false
                      }
                    >
                      <DataContent>
                        <Info>{translate('pageRoutes.title_route')}</Info>
                        <RouteName>{route.name}</RouteName>
                        <Info>
                          {Helper.kmToMiles(
                            Number(Number(route.estimatedDistance) / 1000),
                            Helper.generalSettingsActive(
                              generalSettings,
                              'enable_transform_km_for_mi',
                            ),
                          )}{' '}
                          -{' '}
                          {Helper.kmToMiles(
                            Number(Number(route.estimatedTime) / 60),
                            Helper.generalSettingsActive(
                              generalSettings,
                              'enable_transform_km_for_mi',
                            ),
                          )}{' '}
                          {translate('pageRoutes.text_min')}
                        </Info>
                        <Line />
                        <Section>
                          <Ball color="green" />
                          <Info>
                            {route.routeWayPoints.filter(
                              el => el.routePitStopType === 'EMBARQUE',
                            ).length || 1}{' '}
                            {translate('pageRoutes.text_boarding')}
                          </Info>
                        </Section>
                        <Section>
                          <Ball color="red" />
                          <Info>
                            {route.routeWayPoints.filter(
                              el => el.routePitStopType === 'DESEMBARQUE',
                            ).length || 1}{' '}
                            {translate('pageRoutes.text_living')}
                          </Info>
                        </Section>
                        {route.routeTripItemTypes.length > 0 && (
                          <View>
                            <Line />
                            {route.routeTripItemTypes.map(res => {
                              return (
                                <Section key={res.id}>
                                  <Info>{res.name} </Info>
                                  <Info>
                                    {getCoinType()}
                                    {maskMoney(parseFloat(res.value))}
                                  </Info>
                                </Section>
                              );
                            })}
                          </View>
                        )}
                      </DataContent>
                      <PriceSection>
                        <View>
                          <TitlePrice>
                            {translate('pageRoutes.title_value')}
                          </TitlePrice>

                          <Price>
                            {translate('pageRoutes.text_person')}{' '}
                            {getCoinType()}
                            {maskMoney(parseFloat(route.price))}
                          </Price>
                        </View>
                        {route?.ride?.riders?.length > 0 && (
                          <SimpleText>
                            {route?.ride?.riders?.length}{' '}
                            {translate('pageRoutes.text_confirm')}
                          </SimpleText>
                        )}
                      </PriceSection>
                    </Card>
                  );
                })
              ) : (
                <Info
                  style={{alignSelf: 'center', marginTop: 20, fontSize: 18}}
                >
                  {translate('pageRoutes.text_empty_routes')}
                </Info>
              )}
            </ScrollView>
          </CardContent>
        </IfLoaderInsideScreen>
        <ButtonContent>
          <Button
            activeOpacity={0.8}
            onPress={async () => {
              setLoadingCard(true);
              setSelected(1);
              await getNew(location?.coords?.latitude, location?.coords?.longitude);
              setLoadingCard(false);
            }}
            disabled={selected === 1}
          >
            <TextButton selected={selected === 1}>
              {translate('pageRoutes.title_new')}
            </TextButton>
          </Button>
          <Button
            activeOpacity={0.8}
            onPress={async () => {
              setLoadingCard(true);
              setSelected(2);
              await getReleased();
              setLoadingCard(false);
            }}
            disabled={selected === 2}
          >
            <TextButton selected={selected === 2}>
              {translate('pageRoutes.title_free')}
            </TextButton>
          </Button>
          <Button
            activeOpacity={0.8}
            onPress={async () => {
              setLoadingCard(true);
              setSelected(3);
              await getOffered();
              setLoadingCard(false);
            }}
            disabled={selected === 3}
          >
            <TextButton selected={selected === 3}>
              {translate('pageRoutes.title_offered')}
            </TextButton>
          </Button>
        </ButtonContent>
      </Content>
      <ModalFrame
        visible={showModal}
        setVisible={setShowModal}
        onClose={() => {
          setShowModal(false);
          clearData();
        }}
        title={routeSelected?.name}
        textConfirm={translate(`pageRoutes.title_button${selected}`)}
        textCancel={translate('pageRoutes.text_close')}
        onPressConfirm={doSomething}
        isLoading={loading}
        loadingColor={colors.primary}
        error={error}
        textError={messageError}
      >
        <View style={{maxHeight: 510}}>
          <ScrollView>
            <ModalSection>
              <TitleModal>{translate('pageRoutes.title_info')}</TitleModal>
              <InfoModal>
                - {translate('pageRoutes.text_duration')}{' '}
                {Number(Number(routeSelected?.estimatedTime) / 60)}{' '}
                {translate('pageRoutes.text_min')}
              </InfoModal>
              <InfoModal>
                - {translate('pageRoutes.text_distance')}{' '}
                {Helper.kmToMiles(
                  Number(Number(routeSelected?.estimatedDistance) / 1000),
                  Helper.generalSettingsActive(
                    generalSettings,
                    'enable_transform_km_for_mi',
                  ),
                )}
              </InfoModal>
            </ModalSection>
            {routeSelected?.routeTripItemTypes?.length > 0 && (
              <ModalSection>
                <TitleModal>
                  {translate('pageRoutes.title_item_offer')}
                </TitleModal>
                {routeSelected?.routeTripItemTypes?.map(res => {
                  return (
                    <InfoModal key={res.id}>
                      - {res.name} {getCoinType()}
                      {maskMoney(parseFloat(res.value))}
                    </InfoModal>
                  );
                })}
              </ModalSection>
            )}
            <ModalSection>
              <TitleModal>
                {translate('pageRoutes.title_waypoint_boarding')}
              </TitleModal>
              <InfoModal>- {routeSelected?.origin?.address}</InfoModal>
              {routeSelected?.routeWayPoints
                ?.filter(el => el.routePitStopType === 'EMBARQUE')
                .map((item, index) => {
                  return (
                    <InfoModal key={index}>
                      - {item.tag} ({item.address})
                    </InfoModal>
                  );
                })}
            </ModalSection>
            <View
              style={{
                marginTop: 5,
              }}
            >
              <TitleModal>
                {translate('pageRoutes.title_waypoint_living')}
              </TitleModal>
              {routeSelected?.routeWayPoints
                ?.filter(el => el.routePitStopType === 'DESEMBARQUE')
                .map((item, index) => {
                  return (
                    <InfoModal key={index}>
                      - {item.tag} ({item.address})
                    </InfoModal>
                  );
                })}
              <InfoModal>- {routeSelected?.destination?.address}</InfoModal>
            </View>
            {selected !== 1 && (
              <View>
                <Line />

                {routeSelected?.routeTripItemTypes?.length > 0 && (
                  <ModalSection>
                    <TitleModal>
                      {translate('pageRoutes.title_my_offers')}
                    </TitleModal>
                    {routeSelected?.routeTripItemTypes?.map(res => {
                      return (
                        <ItemOfferedButton
                          activeOpacity={0.8}
                          onPress={() => {
                            // eslint-disable-next-line no-unused-expressions
                            tripItems.includes(res.id)
                              ? setTripItems(
                                  tripItems.filter(id => id !== res.id),
                                )
                              : setTripItems([...tripItems, res.id]);
                          }}
                          disabled={selected === 3}
                        >
                          <MaterialIcons
                            name={
                              tripItems.includes(res.id)
                                ? 'check-box'
                                : 'check-box-outline-blank'
                            }
                            size={20}
                            color={colors.primary}
                            style={{marginRight: 5}}
                          />
                          <InfoModal>{res.name}</InfoModal>
                        </ItemOfferedButton>
                      );
                    })}
                  </ModalSection>
                )}

                <ModalSection>
                  <TitleModal>
                    {translate('pageRoutes.title_when_offer')}
                  </TitleModal>
                  <Container>
                    <InfoModal>{translate('pageRoutes.text_day')}</InfoModal>
                    <Input
                      type="datetime"
                      editable={selected !== 3}
                      options={{
                        format: 'DD/MM/YYYY',
                      }}
                      onChangeText={text => {
                        setDate(text);
                      }}
                      value={selected === 3 ? dateOffered : date}
                    />
                    <InfoModal>{translate('pageRoutes.text_as')}</InfoModal>
                    <Input
                      type="datetime"
                      editable={selected !== 3}
                      options={{
                        format: 'HH:MM',
                      }}
                      onChangeText={text => {
                        setTime(text);
                      }}
                      value={selected === 3 ? hourOffered : time}
                    />
                    <InfoModal>{translate('pageRoutes.text_hour')}</InfoModal>
                  </Container>
                </ModalSection>
                {selected === 2 && (
                  <Container style={{marginTop: 10, marginBottom: 10}}>
                    <TitleModal>
                      {translate('pageRoutes.text_quantity_vacancies')}
                    </TitleModal>
                    <VacanciesButton>
                      <TouchableOpacity
                        disabled={vacancies === 1}
                        onPress={() => setVacancies(vacancies - 1)}
                        activeOpacity={0.5}
                      >
                        <Ionicons
                          name="remove"
                          size={20}
                          color={colors.primary}
                        />
                      </TouchableOpacity>
                      <VacanciesText>{vacancies}</VacanciesText>
                      <TouchableOpacity
                        onPress={() => setVacancies(vacancies + 1)}
                        activeOpacity={0.5}
                      >
                        <Ionicons name="add" size={20} color={colors.primary} />
                      </TouchableOpacity>
                    </VacanciesButton>
                  </Container>
                )}
              </View>
            )}
            {selected === 3 &&
              (routeSelected?.ride?.riders?.length > 0 ? (
                <View>
                  <TitleModal style={{marginBottom: 10, marginTop: 10}}>
                    Confirmados
                  </TitleModal>
                  {routeSelected?.ride?.riders?.map(item => {
                    return (
                      <View
                        key={item.id}
                        style={{flexDirection: 'row', alignItems: 'center'}}
                      >
                        <Image
                          source={{uri: item.profileImage}}
                          style={{
                            width: 60,
                            height: 60,
                            borderRadius: 50,
                            marginRight: 10,
                          }}
                        />
                        <View>
                          <InfoModal>{item.name}</InfoModal>
                          <InfoModal>{item.phone}</InfoModal>
                        </View>
                      </View>
                    );
                  })}
                </View>
              ) : (
                <TitleModal style={{marginTop: 15, alignSelf: 'center'}}>
                  {translate('pageRoutes.text_empty_clients')}
                </TitleModal>
              ))}
          </ScrollView>
        </View>
      </ModalFrame>
    </>
  );
};
