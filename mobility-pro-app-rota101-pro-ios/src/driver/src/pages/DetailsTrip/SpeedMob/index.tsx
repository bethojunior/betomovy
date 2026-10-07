import {Image, View, Text} from 'react-native';
import {useEffect, useRef, useState} from 'react';
import {useNavigation} from '@react-navigation/native';
import {
  Address,
  AddressContent,
  Ball,
  ButtonLiberation,
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
  Square,
  TextSmall,
  TitleCentralized,
  ButtonBack,
  Header,
  TitleHeader,
} from './styles';

import {If} from '../../../components/If';
import apiMain from '../../../api/apiMain';
import theme from '../../../styles/theme';
import {
  STATUS_CANCELED,
  STATUS_FINISHED,
  STATUS_SITUATION_BLOCKED,
  STATUS_SITUATION_RELEASED,
} from '../../../constants/trip';
import {convertDate, maskHour} from '../../../utils/FormatDate';
import {translate} from '../../../../../client/locales';
import Preload from '../../../components/Preload';
import Helper from '../../../utils/Helper';
import {useAuth} from '../../../../../context/auth';
import HelpMethodModal from '../../../components/HelpMethodModal';
import {buildApp} from '../../../../../constantBuild/config';

import {Ionicons} from '@expo/vector-icons';

interface LocationProps {
  latitude: string;
  longitude: string;
}

export const DetailsTripSpeedMob = ({route}: any) => {
  const [detailsTrip, setDetailsTrip] = useState<any>({});
  const {cityConfig, generalSettings} = useAuth();
  const [loading, setLoading] = useState(true);
  const [modalMessage, setModalMessage] = useState(false);

  const navigation = useNavigation();

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

  const polilyneCoords = () => {
    return detailsTrip?.location?.length > 0
      ? detailsTrip?.location?.map((res: LocationProps) => {
          return {
            latitude: res.latitude,
            longitude: res.longitude,
          };
        })
      : [
          {
            latitude: parseFloat(detailsTrip?.origin.latitude),
            longitude: parseFloat(detailsTrip?.origin.longitude),
          },
          {
            latitude: parseFloat(detailsTrip?.destination.latitude),
            longitude: parseFloat(detailsTrip?.destination.longitude),
          },
        ];
  };

  useEffect(() => {
    getDetailsTrip(tripReference);
  }, []);

  return (
    <>
      <Header>
        <ButtonBack onPress={() => navigation.goBack()}>
          <Ionicons
            name="arrow-back"
            color={theme.colors.background_global}
            size={30}
          />
        </ButtonBack>
        <TitleHeader>{translate('routes.detail_travel')}</TitleHeader>
      </Header>
      <Preload visible={loading} />
      <If condition={Object.keys(detailsTrip).length > 0}>
        {Object.keys(detailsTrip).length > 0 && (
          <ContainerModal>
            {trip.status !== 'canceled' && (
              <ContainerDialog>
                <TitleCentralized>
                  {translate('register.client')}
                </TitleCentralized>
                <HeaderCardContainer>
                  {trip.status === STATUS_FINISHED.toLowerCase() &&
                    detailsTrip.driver != null &&
                    detailsTrip.driver !== undefined && (
                      <DriverContent>
                        <Image
                          source={{ uri: buildApp().HOST_IMAGE_CUSTOMER + detailsTrip?.customer?.profileImage }}
                          style={{
                            width: 70,
                            height: 70,
                            borderRadius: 50,
                            marginLeft: 10,
                            marginTop: 5,
                          }}
                        />

                        <ContentDriverInfo>
                          <DriverName>{detailsTrip?.customerName}</DriverName>
                        </ContentDriverInfo>
                      </DriverContent>
                    )}
                </HeaderCardContainer>
              </ContainerDialog>
            )}
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
                <Address>{trip?.originAddress}</Address>
                {detailsTrip?.tripWayPoints &&
                  detailsTrip?.tripWayPoints.length > 0 &&
                  detailsTrip?.tripWayPoints.map(wayPoint => (
                    <Address>{wayPoint?.address}</Address>
                  ))}
                <Destiny>{detailsTrip?.destination?.name}</Destiny>
              </View>
            </AddressContent>
            <View
              style={{
                width: '100%',
              }}
            >
              <ContainerFooter>
                <ContainerText>
                  <TextSmall>
                    {translate('detailsTrip.text_type_payment')}
                  </TextSmall>
                  <Text>{trip.paymentForm}</Text>
                  <Content style={{marginTop: 20}}>
                    <TextSmall>{translate('detailsTrip.text_total')}</TextSmall>
                    <Text>
                      {cityConfig?.typeMoney}
                      {Helper.maskMoney(Number(trip.price))}
                    </Text>
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
              <ContainerFooter>
                <ContainerText>
                  <TextSmall>{translate('myTravels.situation')}</TextSmall>
                  <Text>{detailsTrip?.situation}</Text>
                </ContainerText>
                <ContainerText>
                  <TextSmall>{translate('myTravels.call_type')}</TextSmall>
                  <Text>{detailsTrip?.tripCallType}</Text>
                </ContainerText>
              </ContainerFooter>
              <TitleCentralized>
                {translate('myTravels.estimated')}
              </TitleCentralized>
              <ContainerFooter>
                <ContainerText>
                  <TextSmall>{translate('myTravels.distance')}</TextSmall>
                  <Text>
                    {Helper.kmToMiles(
                      parseFloat(detailsTrip.distance).toFixed(3),
                      Helper.generalSettingsActive(
                        generalSettings,
                        'enable_transform_km_for_mi',
                      ),
                    )}
                  </Text>
                </ContainerText>
                <ContainerText>
                  <TextSmall>{translate('myTravels.duration')}</TextSmall>
                  <Text>
                    {detailsTrip?.estimatedTimeDriverArrival || 0} min
                  </Text>
                </ContainerText>
              </ContainerFooter>
              <If condition={trip.status !== STATUS_CANCELED.toLowerCase()}>
                <>
                  <TitleCentralized>
                    {translate('myTravels.price_breakdown')}
                  </TitleCentralized>
                  <ContainerFooter>
                    <ContainerText>
                      <Content style={{marginTop: 20}}>
                        <TextSmall>
                          ({translate('myTravels.dynamics_flags_triggers')})
                        </TextSmall>
                        <Text>
                          {detailsTrip?.multiplierDynamic
                            ? detailsTrip?.multiplierDynamic
                            : '0'}
                        </Text>
                      </Content>
                      <Content style={{marginTop: 20}}>
                        <TextSmall>
                          {translate('myTravels.value_min')}
                        </TextSmall>
                        <Text>
                          {detailsTrip?.fare
                            ? cityConfig?.typeMoney +
                              Helper.maskMoney(
                                Number(
                                  Number(detailsTrip?.fare?.min_price) *
                                    Number(detailsTrip?.multiplierDynamic || 1),
                                ),
                              )
                            : ''}
                        </Text>
                      </Content>
                      <Content style={{marginTop: 20}}>
                        <TextSmall>
                          {translate('myTravels.waypoints')}
                        </TextSmall>
                        <Text>
                          {cityConfig?.typeMoney}
                          {Helper.maskMoney(
                            parseFloat(detailsTrip?.fare?.waypoint_price) *
                              parseFloat(detailsTrip?.tripWayPoints?.length),
                          )}
                        </Text>
                      </Content>
                      <Content style={{marginTop: 20}}>
                        <TextSmall>
                          {detailsTrip?.fare?.tax_price_description || ''}
                        </TextSmall>
                        <Text>
                          {cityConfig?.typeMoney}
                          {Helper.maskMoney(
                            parseFloat(detailsTrip?.fare?.tax_price),
                          )}
                        </Text>
                      </Content>
                      <Content style={{marginTop: 20}}>
                        <View
                          style={{
                            width: '80%',
                          }}
                        >
                          <TextSmall>
                            {translate(
                              'myTravels.distance_to_charge_additional_amount',
                            )}
                          </TextSmall>
                        </View>
                        <Text>
                          {Helper.kmToMiles(
                            Number(detailsTrip?.fare?.km_to_additional_value),
                            Helper.generalSettingsActive(
                              generalSettings,
                              'enable_transform_km_for_mi',
                            ),
                          )}
                        </Text>
                      </Content>
                      <Content style={{marginTop: 20, marginBottom: 20}}>
                        <TextSmall>
                          {translate('myTravels.value_estimated')}
                        </TextSmall>
                        <Text>
                          {cityConfig?.typeMoney}
                          {Helper.maskMoney(
                            parseFloat(
                              detailsTrip?.recalculatedPrice
                                ? detailsTrip?.recalculatedPrice?.oldPrice
                                : detailsTrip?.price,
                            ),
                          )}
                        </Text>
                      </Content>
                    </ContainerText>
                    <ContainerText>
                      <TextSmall>
                        {translate('myTravels.base_price')}{' '}
                      </TextSmall>
                      <Text>
                        {detailsTrip?.fare
                          ? ' + ' +
                            cityConfig?.typeMoney +
                            Helper.maskMoney(
                              parseFloat(detailsTrip?.fare?.base_price),
                            )
                          : ''}
                      </Text>
                      <Content style={{marginTop: 20}}>
                        <TextSmall>
                          {generalSettings?.find(
                            item => item?.key === 'enable_transform_km_for_mi',
                          )?.value == '1'
                            ? translate('myTravels.mi_price')
                            : translate('myTravels.km_price')}{' '}
                          (
                          {detailsTrip?.fare
                            ? Helper.maskMoney(
                                parseFloat(detailsTrip?.fare?.km_price),
                              ) +
                              'x ' +
                              Helper.maskMoney(
                                parseFloat(detailsTrip?.distance),
                              )
                            : ''}
                          )
                        </TextSmall>
                        <Text>
                          {cityConfig?.typeMoney}
                          {Helper.maskMoney(
                            parseFloat(detailsTrip?.fare?.km_price) *
                              parseFloat(detailsTrip?.distance),
                          )}
                        </Text>
                      </Content>
                      <Content style={{marginTop: 20}}>
                        <TextSmall>
                          {translate('myTravels.minute_price')} (
                          {detailsTrip?.fare
                            ? Helper.maskMoney(
                                parseFloat(detailsTrip?.fare?.minute_price),
                              ) +
                              'x ' +
                              Helper.maskMoney(
                                parseFloat(detailsTrip?.estimatedTripTime),
                              )
                            : ''}
                          ){' '}
                        </TextSmall>
                        <Text>
                          {detailsTrip?.fare
                            ? cityConfig?.typeMoney +
                              Helper.maskMoney(
                                parseFloat(detailsTrip?.fare?.minute_price) *
                                  parseFloat(detailsTrip?.estimatedTripTime),
                              )
                            : ''}
                        </Text>
                      </Content>
                      <Content style={{marginTop: 20}}>
                        <TextSmall>
                          {detailsTrip?.fare?.another_fee_description}
                        </TextSmall>
                        <Text>
                          {cityConfig?.typeMoney}
                          {Helper.maskMoney(
                            parseFloat(detailsTrip?.fare?.another_fee || 0),
                          )}
                        </Text>
                      </Content>
                      <Content style={{marginTop: 20}}>
                        <TextSmall>
                          {translate('myTravels.long_distance_price')}
                        </TextSmall>
                        <Text>
                          {cityConfig?.typeMoney}
                          {Helper.maskMoney(
                            parseFloat(
                              detailsTrip?.tripLongDistanceValue
                                ? Helper.maskMoney(
                                    parseFloat(
                                      detailsTrip?.tripLongDistanceValue.value,
                                    ),
                                  )
                                : '0,00',
                            ),
                          )}
                        </Text>
                      </Content>
                      <Content style={{marginTop: 20}}>
                        <TextSmall>
                          {translate('myTravels.additional_value')}
                        </TextSmall>
                        <Text>
                          {cityConfig?.typeMoney}
                          {Helper.maskMoney(
                            parseFloat(
                              detailsTrip?.fare?.additional_value_after_km,
                            ),
                          )}
                        </Text>
                      </Content>
                    </ContainerText>
                  </ContainerFooter>
                </>
              </If>
            </View>
            {/* <ContainerHelp>
              <Buton>
                <TextSmall color={theme.colors.background_global}>
                  Ajuda
                </TextSmall>
              </Buton>
            </ContainerHelp> */}

            <If
              condition={trip.tripAuditId !== String(STATUS_SITUATION_RELEASED)}
            >
              <ContainerButton>
                <ButtonLiberation
                  onPress={() => {
                    setModalMessage(true);
                  }}
                >
                  <TextSmall color={theme.colors.background_global}>
                    {translate('myTravels.request_release')}
                  </TextSmall>
                </ButtonLiberation>
              </ContainerButton>
            </If>
          </ContainerModal>
        )}
      </If>
      <HelpMethodModal
        tripReference={tripReference}
        visible={modalMessage}
        setVisible={setModalMessage}
      />
    </>
  );
};
