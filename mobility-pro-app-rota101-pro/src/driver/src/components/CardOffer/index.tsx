import { useEffect, useState } from 'react';
import { View } from 'react-native';

import { useAuth } from '../../../../context/auth';
import { searchNative } from '../../context/Trip/directionRoute';
import { maskMoney } from '../../utils/money';
import { getTripPaymentFormDisplay } from '../../utils/tripUtils';
import { ContainerRow } from '../ContainerRow';
import {
  Address,
  AddressContent,
  Ball,
  ButtonAction,
  Container,
  ContainerHeader,
  ContainerRowFooter,
  Destiny,
  Footer,
  Line,
  Square,
  TextDescription,
} from './styles';
import { translate } from '../../../../client/locales';
import { useLocalProvider } from '../../context/local';
import { If } from '../If';
import { position } from 'polished';
import theme from '../../styles/theme';
import { RFValue } from 'react-native-responsive-fontsize';
import { ModalInDriverOnDriver } from '../../../../client/components/ModalInDriverOnDriver';
import { useTripProvider } from '../../context/Trip';
import { useUserDriver } from '../../context/userDriver';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ActivityIndicator } from 'react-native-paper';
import { Trip } from '../../../../interfaces/trip';

type TripOffer = Trip & { tripEstimative?: string };

interface Props {
  trip: TripOffer;
  onPress?: string;
  onPressAccept?: (tripReference: string) => Promise<void>;
  onPressRefuse?: (idTrip: string) => Promise<void>;
}
export const CardOffer = ({ trip, onPressAccept, onPressRefuse }: Props) => {
  const { cityConfig } = useAuth();
  const { userDriverFind } = useUserDriver();
  const { location } = useLocalProvider();
  const createTripOffer: any = useTripProvider(
    (context: any) => context.createTripOffer,
  );
  const [loading, setLoading] = useState(false);
  const [modalInDriver, setModalInDriver] = useState(false);
  const [offerInDriver, setOfferInDriver] = useState(0);
  const [estimative, setEstimative] = useState('');
  const hasTripBid = trip?.tripBids
    ? trip?.tripBids.some(item => {
      return item.driverId == userDriverFind?.idDriver;
    })
    : false;
  const getAttribuitionEstimative = async () => {
    const result = await searchNative(
      `${location?.coords?.latitude},${location?.coords?.longitude}`,
      `${trip?.origin?.latitude},${trip?.origin?.longitude}`,
    );
    trip.tripEstimative = `${(result?.data?.distance / 1000).toFixed(0)}km/${(
      result?.data?.duration / 60
    ).toFixed(0)}min`;
    setEstimative(
      `${(result?.data?.distance / 1000).toFixed(0)}km/${(
        result?.data?.duration / 60
      ).toFixed(0)}min`,
    );
  };

  useEffect(() => {
    if (!trip?.tripEstimative) {
      getAttribuitionEstimative();
    }
  }, [location, position]);

  const handleInDriverModal = () => {
    setModalInDriver(true);
    setOfferInDriver(parseFloat(trip.price));
  };

  // const refuseOffer = async (tripReference: string) => {
  //   let tripsOffer =
  //     JSON.parse(await AsyncStorage.getItem('refusedOffer')) || [];

  //   const tripRefused = {
  //     tripReference,
  //     price: trip?.price,
  //   };

  //   const newList = [tripRefused, ...tripsOffer];

  //   await AsyncStorage.setItem('refusedOffer', JSON.stringify(newList));
  //   await checkIfIsRemoved();
  // };

  return (
    <>
      <If condition={modalInDriver}>
        <ModalInDriverOnDriver
          priceOffer={offerInDriver}
          setOfferPrice={setOfferInDriver}
          visible={modalInDriver}
          setVisible={setModalInDriver}
          initialPriceOffer={parseInt(trip?.price)}
          onPress={createTripOffer}
          trip={trip}
        />
      </If>

      <Container>
        <ContainerHeader>
          <AddressContent>
            <View style={{ paddingRight: 10 }}>
              <Ball color="primary" />
              <Line />
              {trip?.tripWayPoints &&
                trip?.tripWayPoints.length > 0 &&
                trip?.tripWayPoints.map(index => (
                  <>
                    <Ball key={index} color="secondary" />
                    <Line />
                  </>
                ))}
              <Square />
            </View>
            <View style={{ paddingRight: 20 }}>
              <Address>{trip?.origin?.address}</Address>
              {trip?.tripWayPoints &&
                trip?.tripWayPoints.length > 0 &&
                trip?.tripWayPoints.map(wayPoint => (
                  <Address key={wayPoint?.id}>{wayPoint?.address}</Address>
                ))}
              <Destiny>{trip?.destination?.name}</Destiny>
            </View>
          </AddressContent>
          <If condition={trip?.oldPrice}>
            <ContainerRow
              title={<TextDescription>Valor de refêrencia: </TextDescription>}
              description={
                <TextDescription
                  style={{
                    color: theme.colors.red,
                    fontSize: RFValue(17),
                  }}
                >
                  {cityConfig?.typeMoney || '$'}
                  {maskMoney(parseFloat(trip?.oldPrice))}
                </TextDescription>
              }
            />
          </If>

          <ContainerRow
            title={<TextDescription>Valor do lance: </TextDescription>}
            description={
              <TextDescription
                style={{
                  fontSize: RFValue(19),
                }}
              >
                {cityConfig?.typeMoney || '$'}
                {maskMoney(parseFloat(trip?.price))}
              </TextDescription>
            }
          />
          <ContainerRow
            title={<TextDescription>Nome: </TextDescription>}
            description={
              <TextDescription>
                {trip?.customer?.nickname || trip?.customer?.name}
              </TextDescription>
            }
          />
          <ContainerRow
            title={<TextDescription>Estimativa(Cliente): </TextDescription>}
            description={<TextDescription>{estimative}</TextDescription>}
          />
          <ContainerRow
            title={<TextDescription>Estimativa(Viagem): </TextDescription>}
            description={
              <TextDescription>
                {parseInt(trip?.distance)}km/{trip?.estimatedTripTime}min
              </TextDescription>
            }
          />
          <ContainerRow
            title={
              <TextDescription>{translate('tripDriver.Tipo')}</TextDescription>
            }
            description={<TextDescription>{trip?.tripType}</TextDescription>}
          />
          <ContainerRow
            title={<TextDescription>Pagamento: </TextDescription>}
            description={
              <TextDescription>{getTripPaymentFormDisplay(trip?.tripPaymentForm)}</TextDescription>
            }
          />
        </ContainerHeader>
        <Footer>
          <ContainerRowFooter>
            <If condition={!hasTripBid}>
              <ButtonAction
                bg={theme.colors.red}
                isDisable={userDriverFind.status === 'desligado'}
                disabled={userDriverFind.status === 'desligado'}
                onPress={() => onPressRefuse(trip.idTrip)}
              >
                <TextDescription color={theme.colors.primaryText}>
                  {translate('trip.recuse')}
                </TextDescription>
              </ButtonAction>
            </If>

            <If condition={!hasTripBid}>
              <ButtonAction
                bg={theme.colors.black}
                onPress={handleInDriverModal}
                isDisable={userDriverFind.status === 'desligado'}
                disabled={userDriverFind.status === 'desligado'}
              >
                <TextDescription color={theme.colors.white}>
                  {translate('tripAnother.to_bid')}
                </TextDescription>
              </ButtonAction>
            </If>
          </ContainerRowFooter>
          <View
            style={{
              width: '100%',
              height: 40,
            }}
          >
            <ButtonAction
              bg={theme.toast.success}
              isDisable={userDriverFind.status === 'desligado'}
              disabled={userDriverFind.status === 'desligado'}
              onPress={async () => {
                setLoading(true);
                await onPressAccept(trip?.tripReference);
                setModalInDriver(false);
                setLoading(false);
              }}
            >
              {loading ? (
                <ActivityIndicator size="small" color={theme.colors.secondary} />
              ) : (
                <TextDescription color={theme.colors.secondary}>
                  {translate('trip.acccept')}
                </TextDescription>
              )}
            </ButtonAction>
          </View>
        </Footer>
      </Container>
    </>
  );
};
