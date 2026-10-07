import {useEffect, useState} from 'react';
import {View} from 'react-native';

import {useAuth} from '../../../../context/auth';
import {searchNative} from '../../context/Trip/directionRoute';
import {maskMoney} from '../../utils/money';
import {ContainerRow} from '../ContainerRow';
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
import {translate} from '../../../../client/locales';
import {useLocalProvider} from '../../context/local';
import {If} from '../If';
import {position} from 'polished';
import theme from '../../styles/theme';
import {RFValue} from 'react-native-responsive-fontsize';
import {ModalInDriverOnDriver} from '../../../../client/components/ModalInDriverOnDriver';
import {useTripProvider} from '../../context/Trip';
import {useUserDriver} from '../../context/userDriver';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Props {
  trip: any;
  onPress?: string;
  onPressAccept?: (tripReference: string) => void;
  checkIfIsRemoved?: () => void;
}
export const CardOffer = ({trip, onPressAccept, checkIfIsRemoved}: Props) => {
  const {cityConfig} = useAuth();
  const {userDriverFind} = useUserDriver();
  const {location} = useLocalProvider();
  const {createTripOffer} = useTripProvider();
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

  const refuseOffer = async (tripReference: string) => {
    let tripsOffer =
      JSON.parse(await AsyncStorage.getItem('refusedOffer')) || [];

    tripsOffer.push(tripReference);
    await AsyncStorage.setItem('refusedOffer', JSON.stringify(tripsOffer));
    await checkIfIsRemoved();
  };

  return (
    <>
      <If condition={modalInDriver}>
        <ModalInDriverOnDriver
          priceOffer={offerInDriver}
          setOfferPrice={setOfferInDriver}
          visible={modalInDriver}
          setVisible={setModalInDriver}
          initialPriceOffer={trip?.price}
          onPress={createTripOffer}
          trip={trip}
        />
      </If>

      <Container>
        <ContainerHeader>
          <AddressContent>
            <View style={{paddingRight: 10}}>
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
            <View style={{paddingRight: 20}}>
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
              <TextDescription>{trip?.customer?.nickname}</TextDescription>
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
              <TextDescription>{trip?.tripPaymentForm}</TextDescription>
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
                onPress={() => refuseOffer(trip.tripReference)}
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
                setLoading(false);
              }}
            >
              <TextDescription color={theme.colors.secondary}>
                {translate('trip.acccept')}
              </TextDescription>
            </ButtonAction>
          </View>
        </Footer>
      </Container>
    </>
  );
};
