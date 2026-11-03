import { AntDesign, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from 'styled-components';
import { ActivityIndicator, NativeTouchEvent, View } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { Fragment, useEffect, useState } from 'react';
import {
  Address,
  AddressContent,
  AddressSection,
  Ball,
  ButtonAccept,
  ButtonContent,
  ButtonRefuse,
  ButtonReject,
  ClienSection,
  ClientInfo,
  ClientInfoContent,
  Distance,
  ClientRating,
  Info,
  Label,
  Line,
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
import { translate } from '../../../../../../client/locales';
import { IsToShowField } from '../../../../utils/cityConfig';
import { getTripPaymentFormDisplay } from '../../../../utils/tripUtils';
import { maskMoney } from '../../../../../../client/utils/money';
import { useTripProvider } from '../../../../context/Trip';
import { useAuth } from '../../../../../../context/auth';
import Helper from '../../../../utils/Helper';
import { useUserDriver } from '../../../../context/userDriver';
import { AlertRecording } from '../../../../../../common/AlertRecording';
import { CallTripAvatar } from '../../../CallTripAvatar';
import { If } from '../../../If';
import { AnimationIconFly } from '../../../../../../client/components/AnimationIconFly';
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
const MIN_DISTANCE = 100;

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
  const refuseTrip: any = useTripProvider((context: any) => context.refuseTrip);
  const dispatchTrip: any = useTripProvider(
    (context: any) => context.dispatchTrip,
  );
  const trip: any = useTripProvider((context: any) => context.stateTrip.trip);
  const { colors } = useTheme();
  const { cityConfig, generalSettings } = useAuth();
  const [startDistance, setStartDistance] = useState<NativeTouchEvent>();
  const { getDriverFind } = useUserDriver();

  const verifyDistance = (endDistance?: NativeTouchEvent) => {
    if (!startDistance || !endDistance) return;

    const distanceX = (endDistance?.locationX - startDistance?.locationX) * -1;
    const distanceY = (endDistance?.locationY - startDistance?.locationY) * -1;

    if (distanceX >= MIN_DISTANCE || distanceY >= MIN_DISTANCE) {
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
    let basePrice = 0;
    if (String(cityConfig?.showNetValueForDriverOnCall) === '1') {
      basePrice = parseFloat(trip?.driverValue || 0);
    } else {
      basePrice = parseFloat(trip?.price || 0);
    }
    const rewardValue = parseFloat(trip?.rewardTrip?.value || 0);
    const finalPrice = basePrice + rewardValue;

    return finalPrice;
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
                  (Number(
                    trip?.estimative?.distance?.text?.replaceAll(
                      /[^0-9.]/g,
                      '',
                    ),
                  ) +
                    Number(trip?.distance))
                ).toFixed(2)}
              </TextCalc>
            </If>

            <If
              condition={Boolean(
                trip?.estimative?.duration?.text && trip?.estimatedTripTime,
              )}
            >
              <TextCalc>
                {translate('trip.hr_rs')}
                {(
                  (witchPrice() /
                    (Number(
                      trip?.estimative?.duration?.text?.replaceAll(
                        /[^0-9.]/g,
                        '',
                      ),
                    ) +
                      Number(trip?.estimatedTripTime))) *
                  60
                ).toFixed(2)}
              </TextCalc>
            </If>

            <If condition={IsToShowField('price', cityConfig) && cityConfig !== null}>
              <Price>
                {cityConfig?.typeMoney} {maskMoney(witchPrice())}
              </Price>
            </If>
          </>
        );
      default:
        return (
          <If condition={IsToShowField('price', cityConfig) && cityConfig !== null}>
            <Price>
              {cityConfig?.typeMoney} {maskMoney(witchPrice())}
            </Price>
          </If>
        );
    }
  };

  const handleRefuse = () => {
    setLoading(false);
    dispatchTrip({ type: 'update', field: 'callDriverModal', arg: false });
    refuseTrip(Number(driverId), trip?.tripReference).then(() => getDriverFind());
  };

  const hasRiskArea = Boolean(trip?.riskArea?.destination || trip?.riskArea?.origin);

  return (
    <View style={{ position: 'relative', flex: 1 }}>
      {timesShowAlertRecording >= trip?.quantityTripsCustomer && (
        <AlertRecording />
      )}
      <GeneralContent>
        <RiskAreaContent visible={hasRiskArea}>
          <TextRisk>{translate('trip.risk_area')}</TextRisk>
        </RiskAreaContent>
        <If condition={trip?.turbochargedPrice}>
          <AnimationOnPulseBgWhiteOnCentralized layout={layout} />
        </If>
        <Header>
          <If
            condition={!trip?.turbochargedPrice && trip?.callType !== 'partner'}
          >
            <FavoriteText show={Boolean(Number(trip?.isFavoriteDriver))}>
              {translate('list_client.title_favorite')}
            </FavoriteText>
          </If>

          <If condition={trip?.callType === 'partner'}>
            <FavoriteText show>
              {translate('callTrip.title_third')}
            </FavoriteText>
          </If>

          <If condition={trip?.turbochargedPrice}>
            <ContainerTurbine>
              <FavoriteText show>
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

          <ButtonRefuse onPress={handleRefuse}>
            <AntDesign name="close" size={RFValue(20)} color="red" />
          </ButtonRefuse>
        </Header>
        <View
          onTouchStart={e => setStartDistance(e.nativeEvent)}
          onTouchEnd={e => verifyDistance(e.nativeEvent)}
        >
          <ClientInfoContent>
            <CallTripAvatar trip={trip} style={{ marginRight: 10 }} />
            <ClientInfo>
              <View style={{ width: '60%' }}>
                <SimpleText>{trip?.nameCustomer}</SimpleText>
                <ClienSection>
                  <If condition={IsToShowField('ratingCustomer', cityConfig)}>
                    <AntDesign
                      style={{ marginRight: 5 }}
                      name="star"
                      size={12}
                      color={colors.primary}
                    />
                    <ClientRating>
                      {/* @ts-ignore */}
                      {Number.isFinite(parseFloat(trip?.ratingCustomer))
                        ? parseFloat(trip?.ratingCustomer).toPrecision(2)
                        : '5.0'}
                      {IsToShowField('quantityTripsCustomer', cityConfig) && trip?.quantityTripsCustomer != null
                        ? ` - ${trip?.quantityTripsCustomer} ${translate('callTrip.text_trip')}`
                        : ''}
                    </ClientRating>
                  </If>
                </ClienSection>
              </View>
              <If condition={totalBonus !== 0 && IsToShowField('reward', cityConfig)}>
                <View style={{ width: '45%' }}>
                  <Label>{translate('callTrip.text_bonus').toUpperCase()}</Label>
                  <Bonus>
                    + {cityConfig?.typeMoney} {maskMoney(totalBonus || 0)}
                  </Bonus>
                </View>
              </If>
            </ClientInfo>
          </ClientInfoContent>

          <SectionInfo>
            <Section isFirst>
              <View style={{ marginBottom: 25 }}>
                <Label>{translate('callTrip.text_type_trip')}</Label>
                <Info>{trip?.type}</Info>
              </View>
              <View>
                <If condition={IsToShowField('paymentForm', cityConfig)}>
                  <Label>{translate('callTrip.text_type_payment')}</Label>
                  <Info>{getTripPaymentFormDisplay(trip?.tripPaymentForm)}</Info>
                </If>
              </View>
            </Section>
            <Section>
              <CalcContent>
                <If condition={trip?.multiplierDynamic > 0}>
                  <View style={{ flexDirection: 'row' }}>
                    <ClienSection>
                      <TextCalc>{trip?.multiplierDynamic}x</TextCalc>
                      <Feather
                        style={{ marginLeft: 5, marginRight: 5 }}
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
                  IsToShowField('quantityWaypoints', cityConfig)
                }
              >
                {trip?.tripWayPoints?.map((_, index) => (
                  <Fragment key={index}>
                    <Ball />
                    <Line />
                  </Fragment>
                ))}
              </If>
              <Square />
            </PointsContent>
            <View style={{ marginLeft: 5 }}>
              <View style={{ paddingBottom: 10 }}>
                <If condition={IsToShowField('origin', cityConfig)}>
                  <Address
                    riskArea={trip?.riskArea ? trip?.riskArea?.origin : false}
                  >
                    {trip?.startAddress}
                  </Address>
                  <If condition={trip?.estimative}>
                    <Distance>
                      {IsToShowField('estimatedDistance', cityConfig) &&
                        trip?.estimative?.distance?.text &&
                        trip?.estimative?.distance?.text}{' '}
                      {IsToShowField('estimatedDistance', cityConfig) &&
                        trip.estimative?.duration?.text &&
                        `, ${trip.estimative?.duration?.text?.replace(
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
                  IsToShowField('quantityWaypoints', cityConfig)
                }
              >
                {trip?.tripWayPoints?.map(waypoint => (
                  <View key={waypoint.id}>
                    <Address waypoint>{waypoint.address}</Address>
                  </View>
                ))}
              </If>
              <View>
                {IsToShowField('destination', cityConfig) && (
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
            <ButtonReject
              onPress={handleRefuse}
              disabled={loading}
            >
              <TextButton style={{ color: '#c62828' }}>
                {translate('callTrip.text_refuse')}
              </TextButton>
            </ButtonReject>
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
                  <TextButton style={{ color: colors.primaryText }}>
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
