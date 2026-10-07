import {useEffect, useRef, useState} from 'react';
import {Alert, Modal, View} from 'react-native';
import {useAuth} from '../../../context/auth';
import {customToast} from '../../../utils/FlashMessage';
import {
  STATUS_BACK_OFF,
  STATUS_SEARCHING_DRIVER_OFFER,
} from '../../constants/trip';
import {useTrip} from '../../contexts/Trip';
import {translate} from '../../locales';
import theme from '../../styles/theme';
import Helper from '../../utils/Helper';
import {coinTypePerApi} from '../../utils/money';
import {CardInDriver} from '../CardInDriver';
import {CardOffer} from '../CardOffer';
import {IfLoaderInsideScreen} from '../IfLoaderInsideScreen';
import {SwalAlert} from '../SwalAlert';
import {TextEdit} from '../TextEdit';
import {
  ContainerModal,
  ContentModal,
  Address,
  AddressContent,
  Ball,
  Destiny,
  Line,
  Square,
  ButtonOffer,
  ContainerAddress,
  ContainerReceivedOffers,
  ButtonCancel,
  TitleOffer,
  ContainerDot,
  Dot,
} from './styles';
import {mountSong} from '../../../driver/src/utils/mountSong';

interface Props {
  visible?: boolean;
  trip?: any;
}

export const ModalOfferTrip = ({visible, trip}: Props) => {
  const {cityConfig} = useAuth();
  const {cancelTripByCustomer, stateTripCustomer, dispatchTripCustomer} =
    useTrip();

  const {origin, destination, isLoading} = stateTripCustomer;
  const [priceOffer, setOfferPrice] = useState(0);
  const [initialPriceOffer, setInitialPriceOffer] = useState(0);
  const [changeOffer, setChangeOffer] = useState(false);
  const [visibleModalAlert, setVisibleModalAlert] = useState(false);
  const [findDriverAccept, setFindDriveAccept] = useState<any>({});

  const monitoringOfferTrip = async (trip, type) => {
    if (trip?.status === STATUS_SEARCHING_DRIVER_OFFER && type !== 'removed') {
      await mountSong(
        require('../../assets/songs/alertNewMessageChat.mp3'),
      ).then(async song => {
        await song.playAsync();
      });
    }
  };

  const verifyIfTripAcceptOfferDriver = trip => {
    if (trip?.tripBids?.length > 0) {
      monitoringOfferTrip(trip, 'added');
      const filteredTripsWithMyPrice = trip?.tripBids?.find(
        item =>
          Number(item?.price).toFixed(1) === Number(trip?.price).toFixed(1),
      );
      if (filteredTripsWithMyPrice) {
        setFindDriveAccept(filteredTripsWithMyPrice);
        setVisibleModalAlert(true);
      }
    }
  };

  useEffect(() => {
    verifyIfTripAcceptOfferDriver(trip);
  }, [trip]);

  return (
    <Modal visible={visible}>
      <ContainerModal>
        <SwalAlert
          visible={visibleModalAlert}
          description={`${translate('inDriver.the_driver')} ${
            findDriverAccept?.driver?.name
          } ${translate('inDriver.accepted_your_offer_in_the_amount_of')} ${
            cityConfig?.typeMoney
          } ${Helper.maskMoney(Number(findDriverAccept?.price))}${translate(
            'inDriver.waiting_for_your_confirmation',
          )}`}
          setVisible={setVisibleModalAlert}
        />
        <ContentModal>
          <ContainerAddress>
            <AddressContent>
              <View style={{padding: 10}}>
                <Ball color="primary" />
                <Line />
                {trip.tripWayPoints &&
                  trip.tripWayPoints.length > 0 &&
                  trip.tripWayPoints.map(() => (
                    <>
                      <Ball color="secondary" />
                      <Line />
                    </>
                  ))}
                <Square />
              </View>
              <View style={{paddingRight: 20}}>
                <Address>{trip?.origin?.address}</Address>
                {trip.tripWayPoints &&
                  trip.tripWayPoints.length > 0 &&
                  trip.tripWayPoints.map(wayPoint => (
                    <Address>{wayPoint.address}</Address>
                  ))}
                <Destiny>{trip?.destination?.name}</Destiny>
              </View>
            </AddressContent>
            <View style={{padding: 10}}>
              <TextEdit size={'medium'}>
                {translate('inDriver.value_offered')}{' '}
                {coinTypePerApi(cityConfig?.typeMoney)}{' '}
                {Helper.maskMoney(parseFloat(trip?.price))}
              </TextEdit>
            </View>
            <ButtonOffer
              mode="outlined"
              onPress={async () => {
                await setInitialPriceOffer(parseFloat(trip?.price));
                await setOfferPrice(parseFloat(trip?.price));
                setChangeOffer(true);
              }}
            >
              <TextEdit color={theme.colors.primary}>
                {translate('inDriver.change_value_offer')}
              </TextEdit>
            </ButtonOffer>
          </ContainerAddress>

          <ContainerReceivedOffers>
            {trip?.tripBids && trip?.tripBids.length > 0 ? (
              trip.tripBids.map((item, index) => {
                return <CardOffer data={item} key={index} />;
              })
            ) : (
              <TitleOffer>
                <TextEdit size={'small'}>
                  {translate('trip.searching_driver')}
                </TextEdit>
                <ContainerDot>
                  <Dot
                    key="dot1"
                    from={{
                      scale: 1,
                      backgroundColor: theme.colors.white,
                    }}
                    animate={{
                      scale: 1.8,
                      backgroundColor: 'green',
                    }}
                    transition={{
                      loop: true,
                      type: 'timing',
                      duration: 1300,
                    }}
                  />
                  <Dot
                    key="dot2"
                    from={{
                      scale: 1,
                      backgroundColor: theme.colors.white,
                    }}
                    animate={{
                      scale: 1.8,
                      backgroundColor: 'green',
                    }}
                    transition={{
                      loop: true,
                      type: 'timing',
                      duration: 1400,
                    }}
                  />
                  <Dot
                    key="dot3"
                    from={{
                      scale: 1,
                      backgroundColor: theme.colors.white,
                    }}
                    animate={{
                      scale: 1.8,
                      backgroundColor: 'green',
                    }}
                    transition={{
                      loop: true,
                      type: 'timing',
                      duration: 1500,
                    }}
                  />
                  <Dot
                    key="dot4"
                    from={{
                      scale: 1,
                      backgroundColor: theme.colors.white,
                    }}
                    animate={{
                      scale: 1.8,
                      backgroundColor: 'green',
                    }}
                    transition={{
                      loop: true,
                      type: 'timing',
                      duration: 1600,
                    }}
                  />
                  <Dot
                    key="dot5"
                    from={{
                      scale: 1,
                      backgroundColor: theme.colors.white,
                    }}
                    animate={{
                      scale: 1.8,
                      backgroundColor: 'green',
                    }}
                    transition={{
                      loop: true,
                      type: 'timing',
                      duration: 1700,
                    }}
                  />
                </ContainerDot>
              </TitleOffer>
            )}
          </ContainerReceivedOffers>
          <IfLoaderInsideScreen loading={isLoading}>
            <ButtonCancel
              mode="contained"
              onPress={async () => {
                Alert.alert(
                  translate('trip.cancel_trip'),
                  translate('trip.text_dialog_cancel'),
                  [
                    {
                      text: translate('cleanBagModal.text_confirmed'),
                      onPress: async () => {
                        await cancelTripByCustomer(null, STATUS_BACK_OFF);
                        customToast(
                          translate('trip.your_trip_has_been_canceled'),
                          'success',
                        );
                        dispatchTripCustomer({
                          type: 'update',
                          field: 'origin',
                          arg: origin,
                        });
                        dispatchTripCustomer({
                          type: 'update',
                          field: 'destination',
                          arg: destination,
                        });
                      },
                    },

                    {
                      text: translate('cleanBagModal.text_denied'),
                      onPress: () => {},
                    },
                  ],
                  {cancelable: false},
                );
              }}
            >
              <TextEdit color={theme.colors.primaryText}>
                {translate('trip.cancel')}
              </TextEdit>
            </ButtonCancel>
          </IfLoaderInsideScreen>
        </ContentModal>
        {changeOffer && (
          <CardInDriver
            visible={changeOffer}
            setVisible={() => setChangeOffer(false)}
            priceOffer={priceOffer}
            initialPriceOffer={initialPriceOffer}
            setOfferPrice={setOfferPrice}
          />
        )}
      </ContainerModal>
    </Modal>
  );
};
