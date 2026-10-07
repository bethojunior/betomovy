import {AntDesign, Feather, MaterialCommunityIcons} from '@expo/vector-icons';
import {useTheme} from 'styled-components';
import {ActivityIndicator, NativeTouchEvent, View} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {useEffect, useState} from 'react';
import {
  Address,
  AddressContent,
  AddressSection,
  Ball,
  ButtonAccept,
  ButtonContent,
  ButtonRefuse,
  ClienSection,
  ClientInfo,
  ClientInfoContent,
  Distance,
  ClientRating,
  Info,
  Label,
  Line,
  Photo,
  PointsContent,
  Price,
  Section,
  SectionInfo,
  SimpleText,
  Square,
  TextButton,
  Toll,
  ProgressBarrer,
  FavoriteText,
  Header,
  TextCalc,
  CalcContent,
  RiskAreaContent,
  TextRisk,
  Bonus,
  ContainerTurbine,
  GeneralContent,
} from './styles';
import {translate} from '../../../../../../client/locales';
import {IsToShowField} from '../../../../utils/cityConfig';
import {maskMoney} from '../../../../../../client/utils/money';
import {buildApp} from '../../../../../../constantBuild/config';
import {useTripProvider} from '../../../../context/Trip';
import {useAuth} from '../../../../../../context/auth';
import Helper from '../../../../utils/Helper';
import {useUserDriver} from '../../../../context/userDriver';
import {AlertRecording} from '../../../../../../common/AlertRecording';
import {If} from '../../../If';
import {AnimationIconFly} from '../../../../../../client/components/AnimationIconFly';
import theme from '../../../../styles/theme';
import AnimationOnPulseBgWhiteOnCentralized from '../../../AnimationPulse';

interface Props {
  confirm: () => void;
  setLoading: (loading: boolean) => void;
  modeAccepted: any;
  loading: boolean;
  timeToAccept: number;
  driverId: string;
  totalBonus: number;
  verifyToucheIsEnabled: () => void;
  isMoved: () => void;
  layout?: {
    width: number;
    height: number;
  };
}

let timesShowAlertRecording = 3;

export const V1ModalCallTrip = ({
  confirm,
  setLoading,
  modeAccepted,
  loading,
  timeToAccept,
  driverId,
  totalBonus,
  verifyToucheIsEnabled,
  isMoved,
  layout,
}: Props) => {
  const {refuseTrip, dispatchTrip, stateTrip} = useTripProvider();
  const {trip} = stateTrip;
  const {colors} = useTheme();
  const {cityConfig, generalSettings} = useAuth();
  const [startDistance, setStartDistance] = useState<NativeTouchEvent>();
  const {getDriverFind} = useUserDriver();

  const verifyDistance = (endDistance: NativeTouchEvent) => {
    const distanceX = (endDistance.locationX - startDistance.locationX) * -1;
    const distanceY = (endDistance.locationY - startDistance.locationY) * -1;
    if (distanceX > 100 || distanceY > 100) {
      verifyToucheIsEnabled();
    }
  };
  useEffect(() => {
    generalSettings?.find(el => {
      if (
        el.key === 'how_many_times_alert_will_be_shown' &&
        Number(el.value) > 3
      ) {
        timesShowAlertRecording = Number(el.value);
      }
    });
  }, []);

  const witchPrice = () => {
    if (String(cityConfig?.showNetValueForDriverOnCall) === '1') {
      return trip?.driverValue + (trip?.rewardTrip?.value || 0);
    }
    return trip?.price + (trip?.rewardTrip?.value || 0);
  };

  const chooseLayout = (config: any) => {
    switch (config) {
      case true:
        return (
          <>
            <If condition={trip?.estimative?.distance.text && trip?.distance}>
              <TextCalc>
                {translate('trip.km_rs')}
                {(
                  witchPrice() /
                  (Number(trip?.estimative?.distance.text.replace('km', '')) +
                    Number(trip?.distance))
                ).toFixed(2)}
              </TextCalc>
            </If>

            <If
              condition={Boolean(
                trip?.estimative?.duration.text && trip?.estimatedTripTime,
              )}
            >
              <TextCalc>
                {translate('trip.hr_rs')}
                {(
                  (witchPrice() /
                    (Number(
                      trip.estimative?.duration.text.replace('mins', ''),
                    ) +
                      Number(trip?.estimatedTripTime))) *
                  60
                ).toFixed(2)}
              </TextCalc>
            </If>

            <If condition={IsToShowField('price') && cityConfig !== null}>
              <Price>
                {cityConfig?.typeMoney} {maskMoney(Number(witchPrice()))}
              </Price>
            </If>
          </>
        );
      default:
        return (
          <If condition={IsToShowField('price') && cityConfig !== null}>
            <Price>
              {cityConfig?.typeMoney} {maskMoney(witchPrice())}
            </Price>
          </If>
        );
    }
  };

  return (
    <View style={{position: 'relative', flex: 1}}>
      {timesShowAlertRecording >= trip?.quantityTripsCustomer && (
        <AlertRecording />
      )}
      <GeneralContent>
        <RiskAreaContent
          visible={trip?.riskArea?.destination || trip?.riskArea?.origin}
        >
          <TextRisk>{translate('trip.risk_area')}</TextRisk>
        </RiskAreaContent>
        <If condition={trip?.turbochargedPrice}>
          <AnimationOnPulseBgWhiteOnCentralized layout={layout} />
        </If>
        <Header>
          <If
            condition={!trip?.turbochargedPrice && trip?.callType !== 'partner'}
          >
            <FavoriteText display={trip.status === 'searching_favorite'}>
              {translate('list_client.title_favorite')}
            </FavoriteText>
          </If>

          <If condition={trip?.callType === 'partner'}>
            <FavoriteText display>
              {translate('callTrip.title_third')}
            </FavoriteText>
          </If>

          <If condition={trip?.turbochargedPrice}>
            <ContainerTurbine>
              <FavoriteText display>
                {translate('callTrip.title_turbocharged')}
              </FavoriteText>
              <AnimationIconFly>
                <MaterialCommunityIcons
                  name="rocket-launch"
                  size={RFValue(24)}
                  style={{
                    marginLeft: RFValue(5),
                  }}
                  color={theme.colors.primary}
                />
              </AnimationIconFly>
            </ContainerTurbine>
          </If>

          <ButtonRefuse
            onPress={async () => {
              setLoading(false);
              await refuseTrip(Number(driverId), trip?.tripReference);
              dispatchTrip({
                type: 'update',
                field: 'callDriverModal',
                arg: false,
              });
              getDriverFind();
            }}
          >
            <AntDesign name="close" size={RFValue(30)} color="red" />
          </ButtonRefuse>
        </Header>
        <View
          onTouchStart={e => setStartDistance(e.nativeEvent)}
          onTouchEnd={e => verifyDistance(e.nativeEvent)}
        >
          <ClientInfoContent>
            <Photo
              source={{
                uri: trip?.customerImage
                  ? `${buildApp().HOST_IMAGE_CUSTOMER}${trip?.customerImage}`
                  : trip?.tripTypePicture,
              }}
            />
            <ClientInfo>
              <View style={{width: '60%'}}>
                <SimpleText>{trip?.nameCustomer}</SimpleText>
                <ClienSection>
                  <AntDesign
                    style={{marginRight: 5}}
                    name="enviromento"
                    size={12}
                    color={colors.primary}
                  />
                  <SimpleText>
                    {IsToShowField('quantityTripsCustomer')
                      ? `${trip?.quantityTripsCustomer} ${translate(
                          'callTrip.text_trip',
                        )}`
                      : ''}
                  </SimpleText>
                </ClienSection>
                <ClienSection>
                  <If condition={IsToShowField('ratingCustomer')}>
                    <AntDesign
                      style={{marginRight: 5}}
                      name="star"
                      size={12}
                      color={colors.primary}
                    />
                    <ClientRating>
                      {/* @ts-ignore */}
                      {parseFloat(trip?.ratingCustomer).toPrecision(2)} -{' '}
                      {trip?.quantityTripsCustomer}{' '}
                      {translate('callTrip.text_trip')}
                    </ClientRating>
                  </If>
                </ClienSection>
              </View>
              <If condition={totalBonus !== 0 && IsToShowField('reward')}>
                <View style={{width: '45%'}}>
                  <Label>{translate('callTrip.text_bonus')}</Label>
                  <Bonus>
                    + {cityConfig?.typeMoney} {maskMoney(totalBonus || 0)}
                  </Bonus>
                </View>
              </If>
            </ClientInfo>
          </ClientInfoContent>
          <SectionInfo>
            <Section isFirst>
              <View style={{marginBottom: 25}}>
                <Label>{translate('callTrip.text_type_trip')}</Label>
                <Info>{trip?.type}</Info>
              </View>
              <View>
                <If condition={IsToShowField('paymentForm')}>
                  <Label>{translate('callTrip.text_type_payment')}</Label>
                  <Info>{trip?.tripPaymentForm}</Info>
                </If>
              </View>
            </Section>
            <Section>
              <CalcContent>
                <If condition={trip?.multiplierDynamic > 0}>
                  <View style={{flexDirection: 'row'}}>
                    <ClienSection>
                      <TextCalc>{trip?.multiplierDynamic}x</TextCalc>
                      <Feather
                        style={{marginLeft: 5, marginRight: 5}}
                        name="trending-up"
                        size={9}
                        color={colors.primaryText}
                      />
                    </ClienSection>

                    <TextCalc>
                      {maskMoney(witchPrice() / trip.multiplierDynamic || 1)}
                    </TextCalc>
                  </View>
                </If>
                {chooseLayout(
                  Helper.generalSettingsActive(
                    generalSettings,
                    'show_more_calcs_driver',
                  ),
                )}
              </CalcContent>
            </Section>
          </SectionInfo>
          <AddressContent>
            <PointsContent>
              <Ball />
              <Line />
              <If
                condition={
                  trip?.tripWayPoints?.length !== 0 &&
                  IsToShowField('quantityWaypoints')
                }
              >
                {trip?.tripWayPoints?.map(() => (
                  <>
                    <Ball />
                    <Line />
                  </>
                ))}
              </If>
              <Square />
            </PointsContent>
            <View style={{marginLeft: 5}}>
              <View style={{paddingBottom: 10}}>
                <If condition={IsToShowField('origin')}>
                  <Address
                    riskArea={trip?.riskArea ? trip?.riskArea?.origin : false}
                  >
                    {trip?.startAddress}
                  </Address>
                  <If condition={trip?.estimative}>
                    <Distance>
                      {IsToShowField('estimatedDistance') &&
                        trip?.estimative?.distance.text &&
                        Helper.kmToMiles(
                          Number(
                            (trip?.estimative?.distance.text).replace('km', ''),
                          ),
                          Helper.generalSettingsActive(
                            generalSettings,
                            'enable_transform_km_for_mi',
                          ),
                        )}{' '}
                      {IsToShowField('estimatedDistance') &&
                        trip.estimative?.duration.text &&
                        `, ${(trip.estimative?.duration.text).replace(
                          'mins',
                          'min',
                        )}`}
                    </Distance>
                  </If>
                </If>
              </View>
              <If
                condition={
                  trip?.tripWayPoints?.length !== 0 &&
                  IsToShowField('quantityWaypoints')
                }
              >
                {trip?.tripWayPoints?.map(waypoint => (
                  <View key={waypoint.id}>
                    <Address waypoint>{waypoint.address}</Address>
                  </View>
                ))}
              </If>
              <View>
                {IsToShowField('destination') && (
                  <>
                    <Address riskArea={trip.riskArea?.destination || false}>
                      {trip?.endAddress}
                    </Address>
                    <AddressSection>
                      <Distance>
                        {Helper.kmToMiles(
                          Number(trip?.distance),
                          Helper.generalSettingsActive(
                            generalSettings,
                            'enable_transform_km_for_mi',
                          ),
                        )}
                        , {trip?.estimatedTripTime} min
                      </Distance>
                      {trip?.tolls?.length !== 0 && (
                        <Toll>pedágio: {trip?.tolls?.length}</Toll>
                      )}
                    </AddressSection>
                  </>
                )}
              </View>
            </View>
          </AddressContent>
          <ButtonContent>
            <ButtonAccept
              onPress={() => {
                confirm();
                setLoading(true);
              }}
              disabled={loading || !modeAccepted?.enableClick}
            >
              {loading ? (
                <ActivityIndicator size={25} color={colors.secondary} />
              ) : (
                <>
                  <ProgressBarrer width={timeToAccept} />
                  <TextButton style={{color: colors.primaryText}}>
                    {translate('callTrip.text_accept')}
                  </TextButton>
                </>
              )}
            </ButtonAccept>
          </ButtonContent>
        </View>
      </GeneralContent>
    </View>
  );
};
