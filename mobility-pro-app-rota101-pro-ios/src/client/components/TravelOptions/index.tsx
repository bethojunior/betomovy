import { useCallback, useState, useEffect, useRef } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { LogBox, ScrollView, Modal, View } from 'react-native';
import moment from 'moment';
import {
  BackButton,
  ContainerDriver,
  ContainerTextAnother,
  ContainerTextDriver,
  DriverDoorHandle,
  DriverImage,
  ButtonNavigate,
} from './styles';
import { useTrip } from '../../contexts/Trip';
import PaymentMethodModal from '../PaymentMethodModal';
import { useLocal } from '../../contexts/local';
import { ModalInfo } from '../../modules/GetLight/components/ModalInfo';
import { If } from '../If';
import { usePaymentForm } from '../../contexts/paymentForms';
import ModalFrame from '../form/Modal';
import { translate } from '../../locales';
import { customToast } from '../../../utils/FlashMessage';
import { convertUSDate } from '../../utils/FormatDate';
import { TextEdit } from '../TextEdit';
import theme from '../../styles/theme';
import { ModalSchedule } from '../ModalSchedule';
import { ModalReadQrCode } from '../ModalReadQrCode';
import { useFavorite } from '../../contexts/favorite';
import { useAuth } from '../../../context/auth';
import { ModalInDriver } from '../ModalInDriver';
import { useModules } from '../../contexts/modules';
import CouponTripContent from '../../modules/mobility/pages/CouponTripContent';
import { DeliveryOption } from '../DeliveryOption';
import { ModalPartner } from '../ModalPartner';
import { ModalOfferInPrice } from '../ModalOfferInPrice';
import { CardCart } from '../CardCart';
import { buildApp } from '../../../constantBuild/config';
import { ModalFavorite } from '../ModalFavorite';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { loadCache } from '../../../hooks/useCityConfig';
import { ModalConfirmOrigin } from '../ModalConfirmOrigin';
import {
  useAddressConfirmation,
  useFavoriteConfirmation,
} from '../../../driver/src/hooks/addressConfirmation';
import {
  verifyCardOnCoupon as verifyCardOnCouponFn,
  changePriceByDiscount,
} from '../../utils/CalulateDiscountByCoupon';
import { getAvailableFavorites } from '../../utils/favoriteDrivers';
import TravelOptionsContainer from '../TravelOptionsContainer';
import { useStoragePictures } from '../../../driver/src/hooks/useStoragePictures';
import apiMain from '../../api/apiMain';

let getPricesTimeout = null;
let serviceSelected;

export default function TravelOptions({
  hide,
  valueVoucher,
  visibleOptionTravel,
  setVisibleOptionTravel,
  setIsTripNoDestinationAnother,
}) {
  const {
    calculateAll,
    newTrip,
    newTripSchedule,
    newTripDoorHandle,
    newTripPartner,
    stateTripCustomer,
    dispatchTripCustomer,
  } = useTrip();

  const {
    origin,
    trip,
    destination: destiny,
    waypoints,
    prices,
    selectedPaymentMethod,
    showLoadingToGetPrices,
    selectedOptionTravel,
    selectedCoupon,
    inputWho,
  } = stateTripCustomer;
  const { waitFavoriteConfirmation, confirmFavorite } = useFavoriteConfirmation();
  const { getCards, getCoupons, cards } = usePaymentForm();

  const { setLastPlaceSelected } = useLocal();
  const { cityConfig } = useAuth();
  const { modulesActives, init } = useModules();
  const { findPerCodeDriver, getFavorites, favorites } = useFavorite();
  const [visible, setVisible] = useState(false);
  const [modalInfo, setModalInfo] = useState(false);
  const [modalCoupon, setModalCoupon] = useState(false);
  const [selectedCard, setSelectedCard] = useState<any>({});
  const [hasInDriver, setHasInDriver] = useState({});
  const [modalSchedule, setModalSchedule] = useState(false);
  const [modalCard, setModalCard] = useState(false);
  const [modalOfferInPrice, setModalOfferInPrice] = useState(false);
  const [modalTripSend, setModalTripSend] = useState(false);
  const [dataScanned, setDataScanned] = useState('');
  const [detailsDriver, setDetailsDriver] = useState<any>({});
  const [visibleModalReadQrCode, setVisibleModalReadQrCode] = useState(false);
  const [modalInDriver, setModalInDriver] = useState(false);
  const [offerInDriver, setOfferInDriver] = useState(0);
  const [modalFavorite, setModalFavorite] = useState(false);
  const [loadingConfirm, setLoadingConfirm] = useState(false);
  const [haveCancelationFee, setHaveCancelationFee] = useState(false);
  const { getStoragePictureSpecific } = useStoragePictures();
  const [turbined, setTurbined] = useState(false);
  const [date, setDate] = useState(
    convertUSDate(new Date(new Date().setDate(new Date().getDate()))),
  );
  const [hours, setHours] = useState({
    hour: '',
    hourFinal: '',
  });
  const [typeTrip, setTypeTrip] = useState('');
  const [loadingButton, setLoadingButton] = useState(false);
  const [coupons, setCoupons] = useState([]);
  const [visibleConfirmAddress, setVisibleConfirmAddress] =
    useState<boolean>(false);
  const [
    enableDepartureAddresConfirmation,
    setEnableDepartureAddressConfirmation,
  ] = useState<string | null>(null);


  const [lastService, setLastService] = useState<any>(null);
  const [listServices, setListServices] = useState<any>();

  const addressConfirmation = useAddressConfirmation();

  const getCityConfig = async () => {
    try {
      const responseCityConfig = loadCache();
      setEnableDepartureAddressConfirmation(
        responseCityConfig?.enableDepartureAddressConfirmation || '0',
      );
    } catch (error) {
      console.log(error);
    }
  };

  const conditionalTrip = ![
    'tripSchedule',
    'tripPartner',
    'doorHandle',
    'tripTurbine',
  ].includes(typeTrip);
  LogBox.ignoreLogs(['Setting a timer']);

  const navigation = useNavigation<any>();
  const route = useRoute<RouteProp<any>>();
  const openedPixRef = useRef(false);

  useFocusEffect(
    useCallback(() => {
      const pixWasConfirmed = route.params?.pixResult === 'confirmed';

      if (pixWasConfirmed) {
        confirmPixReturnedTrip();
        return;
      }

      retryAddressConfirmationAfterPix();
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [route.params?.pixResult, route.params?.idTransaction, enableDepartureAddresConfirmation, turbined, selectedOptionTravel]),
  );

  const handleBack = useCallback(async results => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    } else {
      navigation.navigate('TripRoutes', { screen: 'Trip' });
    }
  }, []);

  const listCoupons = () => {
    getCoupons().then((data: any) => {
      if (data.length === 0) {
        return;
      }

      return setCoupons(data);
    });
  };

  const listCards = async () => {
    const response = await getCards();
    if (response.length > 0) {
      AsyncStorage.setItem("cardSelected", JSON.stringify(response[0]))
      setSelectedCard(response[0].idCard);
    }
  };

  const listFavorites = async () => {
    await getFavorites();
  };

  useEffect(() => {
    getCityConfig();
    listCards();
    listCoupons();
    listFavorites();
    setHasInDriver(modulesActives.find(data => data.moduleName === 'InDriver'));
  }, []);

  useEffect(() => {
    setTurbined(false);
    setTypeTrip('');
  }, [hide]);

  useEffect(() => {
    const getLastServices = async () => {
      try {
        if (showLoadingToGetPrices) {
          const responseLastService = await AsyncStorage.getItem(
            '@lastServices',
          );
          if (responseLastService) {
            setLastService(JSON.parse(responseLastService));
          }
        }
      } catch (error) {
        console.log(error);
      }
    };
    getLastServices();
  }, [showLoadingToGetPrices]);

  useEffect(() => {
    // Só aplica lastService se não houver seleção manual E se for a primeira renderização
    if (lastService && typeof lastService === 'object' && lastService?.price) {
      // Verifica se já existe uma seleção manual diferente
      const hasManualSelection = selectedOptionTravel?.tripTypeId &&
        selectedOptionTravel?.tripTypeId !== lastService?.tripTypeId;

      if (hasManualSelection) {
        return;
      }

      // Só aplica se não houver nenhuma seleção
      if (!selectedOptionTravel?.tripTypeId) {
        dispatchTripCustomer({
          type: 'update',
          field: 'selectedOptionTravel',
          arg: lastService,
        });
        setOfferInDriver(lastService?.price);
      }
    }
  }, [lastService]); // Removido selectedOptionTravel da dependência para evitar loop

  const selectLastUsedService = (pricesList: any[]) => {
    if (!lastService?.idPrice?.length) {
      return undefined;
    }

    const foundService = pricesList.find(data => {
      return Number(data?.tripTypeId) === Number(lastService?.tripTypeId);
    });

    if (foundService) {
      dispatchTripCustomer({
        type: 'update',
        field: 'selectedOptionTravel',
        arg: foundService,
      });
      setOfferInDriver(foundService.price);
    }

    return foundService;
  };

  const orderElement = async listPrices => {
    if (!listPrices || !Array.isArray(listPrices) || listPrices.length === 0) {
      setListServices([]);
      return;
    }

    const isCustomOrderEnabled = cityConfig?.enableCustomOrderTripType === '1';

    if (isCustomOrderEnabled) {
      const sortedPrices = [...listPrices].sort((a, b) => {
        const orderA = a.order ? parseInt(a.order) : 9999;
        const orderB = b.order ? parseInt(b.order) : 9999;
        return orderA - orderB;
      });

      setListServices(sortedPrices);
      selectLastUsedService(sortedPrices);
      return;
    }

    const foundService = selectLastUsedService(listPrices);

    if (foundService) {
      const array = listPrices.filter(
        data => data?.tripTypeId !== lastService?.tripTypeId,
      );
      array.unshift(foundService);
      setListServices(array);
      return;
    }
    setListServices(listPrices);
  };

  useEffect(() => {
    if (Array?.isArray(prices || {})) {
      orderElement(prices);
    }
  }, [prices]);

  const detailsDoorHandle = async () => {
    if (dataScanned === '') {
      return;
    }
    const idDriverScanner = dataScanned?.split('/').pop();
    const response = await findPerCodeDriver(idDriverScanner);
    if (response === undefined) {
      return;
    }
    setTypeTrip('doorHandle');
    setDetailsDriver(response);
  };

  useEffect(() => {
    detailsDoorHandle();
  }, [dataScanned]);

  const removeDoorHandle = () => {
    setDetailsDriver({});
    setDataScanned('');
    setTypeTrip('');
  };

  const calculatePricesAndSome = useCallback(
    async percentForSome => {
      prices.forEach((item, index) => {
        const price = item.price;
        const percent = (price * percentForSome) / 100;
        prices[index].turbinedPrice = price + percent;
      });
    },
    [prices],
  );

  const handleSendConfirmSchedule = useCallback(async () => {
    if (
      hours.hour === '' ||
      date === '' ||
      selectedPaymentMethod === null ||
      Object.keys(selectedOptionTravel).length === 0
    ) {
      return customToast(translate('schedule.toast_warning'), 'warning');
    }
    setLoadingButton(true);

    const schedule = `${date} ${maskHour(hours.hour)}:00`;
    const localOffset = new Date().getTimezoneOffset() / -60; // Obtém o deslocamento de fuso horário local em horas

    const scheduleUTC = moment(schedule).utcOffset(localOffset).format();

    const data = await newTripSchedule(
      schedule,
      scheduleUTC,
      selectedCard,
      turbinedOrCoupon(selectedOptionTravel.price),
    );
    setLoadingButton(false);
    if (data && data.status) {
      return navigation.navigate('TripRoutes', {
        screen: 'Home',
        noUnsubscribe: true,
      });
      // return navigation.navigate('Mobilidade');
    }
  }, [
    date,
    hours.hour,
    modalSchedule,
    navigation,
    selectedOptionTravel,
    selectedPaymentMethod,
  ]);

  const maskHour = useCallback(value => {
    let hour = value.replace(/[^0-9]/g, '') ?? '';
    if (hour.length > 2) {
      const hourForm = `${hour.substring(0, 2)}:${hour.substring(2, 4)}`;
      const [h, m] = hourForm?.split(':');
      if (Number(h) > 23) {
        return (hour = '23');
      }
      if (Number(m) > 59) {
        return (hour = `${h}:59`);
      }
      return (hour = hourForm);
    }
  }, []);

  const verifyCardOnCoupon = verifyCardOnCouponFn(selectedOptionTravel, selectedCoupon);

  useEffect(() => {
    try {
      if (Object.keys(selectedOptionTravel).length > 0) {
        serviceSelected = prices.filter(
          data => data?.idPrice === selectedOptionTravel?.idPrice,
        )[0];
      }

      setOfferInDriver(serviceSelected?.price);
    } catch (error) {
      console.log(error);
    }
  }, [selectedOptionTravel, prices]);

  useEffect(() => {
    setHaveCancelationFee(
      listServices?.some(item => {
        return item?.cancellationFee > 0;
      }),
    );
  }, [listServices]);

  useEffect(() => {
    if (!!origin.latitude && !!destiny.latitude) {
      getPricesTimeout = setTimeout(() => {
        return calculateAll(origin, destiny, waypoints, false, {
          args: {
            dateTimeSchedule: hours?.hourFinal || null,
          },
        });
      }, 2000 * 60);
    }

    return () => {
      clearTimeout(getPricesTimeout);
    };
  }, [prices]);

  useEffect(() => {
    if (prices && prices?.length > 0) {
      calculatePricesAndSome(50);
    }
  }, [prices]);

  const saveSuggestionTripsData = async () => {
    const storageData = [
      ['@App:listServices', JSON.stringify(listServices)],
      ['@App:lastServices', JSON.stringify(selectedOptionTravel)],
    ];

    await Promise.all(
      storageData.map(([key, value]) => AsyncStorage.setItem(key, value)),
    );

    setTurbinedStorage();
  };

  const handlePix = async () => {
    setTypeTrip('pixTrip');
    openedPixRef.current = true;

    await saveSuggestionTripsData();

    navigation.navigate('TripPixPayment', {
      origin: 'TravelOptions',
      turbined,
      offerInDriver,
    });
  };

  const handleFavoriteModal = () => {
    setTypeTrip('favorite');
    setModalFavorite(true);
  };

  const handleTripSendModal = () => {
    setModalTripSend(true);
  };

  const handleInDriverModal = () => {
    setModalInDriver(true);
  };

  const setTurbinedStorage = async () => {
    await AsyncStorage.setItem(
      '@App:isPriceTurbined',
      JSON.stringify(turbined),
    );
  };

  const turbinedOrCoupon = newPrice => {
    return turbined
      ? newPrice
      : changePriceByDiscount(
          parseFloat(newPrice || selectedOptionTravel.price),
          selectedCoupon,
          selectedOptionTravel,
      );
  };

  const handleNewTrip = async (priceTurbined = null, isTurbine = false, idTransaction: string = null) => {
    try {
      const cardForTrip = idTransaction ? '' : selectedCard;

      await newTrip(
        cardForTrip,
        turbinedOrCoupon(priceTurbined),
        isTurbine,
        idTransaction,
      );
    } catch (error) {
      customToast(translate('toast.text_start_trip_error'), 'error');
    }
  };

  const confirmPixReturnedTrip = () => {
    const { idTransaction } = route.params;
    navigation.setParams({ pixResult: undefined, idTransaction: undefined });

    if (!idTransaction) return;

    saveSuggestionTripsData();
    const priceTurbined = turbined ? selectedOptionTravel?.turbinedPrice : null;
    handleNewTrip(priceTurbined, turbined, idTransaction);
  };

  const retryAddressConfirmationAfterPix = () => {
    if (!openedPixRef.current) return;
    openedPixRef.current = false;
    setTypeTrip('');

    if (enableDepartureAddresConfirmation !== '1') return;

    setVisibleConfirmAddress(true);
    addressConfirmation.waitForAddressConfirmation().then(() => {
      setVisibleConfirmAddress(false);
      handlePix();
    });
  };

  const tripHandlers = {
    tripSchedule: handleSendConfirmSchedule,
    tripPartner: newTripPartner,
    doorHandle: () =>
      newTripDoorHandle(selectedCard, detailsDriver?.idDriver, offerInDriver),
    tripTurbine: () => handleNewTrip(selectedOptionTravel?.turbinedPrice, true),
    pixTrip: handlePix,
  };

  const processTripType = async (tripType: string, args: any[]) => {
    if (!tripHandlers[tripType]) {
      throw new Error(
        `Handler não encontrado para o tipo de viagem: ${tripType}`,
      );
    }
    return await tripHandlers[tripType](...args);
  };

  const handleConfirm = async tripType => {
    setLoadingConfirm(true);
    try {
      // if (selectedPaymentMethod?.name !== 'PIX via aplicativo') {
      await processTripType(tripType, [selectedCard, inputWho, offerInDriver]);
      // }
      return true;
    } catch (error) {
      console.log(error);
      return false;
    } finally {
      setLoadingConfirm(false);
    }
  };

  const handleConfirmRace = async () => {
    setLoadingConfirm(true);
    let response = false;

    await saveSuggestionTripsData();

    // Só abre o modal se existir favorito disponível E que atenda o tipo de
    // viagem selecionado; senão segue o fluxo normal (busca aleatória)
    const hasAvailableFavorite =
      getAvailableFavorites(favorites, selectedOptionTravel?.tripTypeId).length > 0;

    if (
      hasAvailableFavorite &&
      conditionalTrip &&
      selectedOptionTravel?.tripType?.offerOption === '0'
    ) {
      handleFavoriteModal();
      await waitFavoriteConfirmation();
    }

    response = await handleConfirm(typeTrip);

    if (!response) {
      if (selectedOptionTravel.tripType?.deliveryOption === '1') {
        handleTripSendModal();
      } else if (
        selectedOptionTravel.tripType?.offerOption === '1' ||
        hasInDriver
      ) {
        handleInDriverModal();
      } else if (conditionalTrip) {
        handleNewTrip();
      }

      return;
    }
    setLoadingConfirm(false);
  };

  if (hide) return null;

  return (
    <>
      {/* VERIFICANDO SE O MÓDULO É SPEEDMOB E PASSANDO OS DADOS DA APLICAÇÃO SELECIONADA */}
      <PaymentMethodModal
        isSpeedmob={init !== 'Speedmob'}
        visible={visible}
        setVisible={setVisible}
      />
      <BackButton onPress={handleBack}>
        <Ionicons name="close" size={24} color={theme.colors.primaryText} />
      </BackButton>

      <If
        condition={
          detailsDriver !== undefined && Object.keys(detailsDriver).length > 0
        }
      >
        <DriverDoorHandle>
          <ContainerDriver>
            <DriverImage
              source={{
                uri:
                  `${(getStoragePictureSpecific('driver') ||
                    buildApp().HOST_IMAGE_DRIVER) +
                  detailsDriver?.profileImage
                  }` || '',
              }}
            />
            <ContainerTextDriver>
              <TextEdit
                color={theme.colors.background_global}
                change="none"
                size="small"
              >
                {detailsDriver?.name ?? translate('trip.no_name')}
              </TextEdit>
              <TextEdit
                color={theme.colors.background_global}
                change="none"
                size="small"
              >
                {detailsDriver?.car?.plate ?? translate('trip.no_name')}
              </TextEdit>
            </ContainerTextDriver>

            <BackButton onPress={removeDoorHandle}>
              <Ionicons
                name="close"
                size={24}
                color={theme.colors.primaryText}
              />
            </BackButton>
          </ContainerDriver>
        </DriverDoorHandle>
      </If>
      <If
        condition={
          inputWho.name && Object.keys(inputWho).length > 0 && !trip?.status
        }
      >
        <DriverDoorHandle>
          <ContainerDriver>
            <ContainerTextAnother>
              <TextEdit color={theme.colors.background_global} change="none">
                {inputWho?.name ?? translate('trip.no_name')}
              </TextEdit>
              <TextEdit color={theme.colors.background_global} change="none">
                {inputWho?.phone ?? ''}
              </TextEdit>
            </ContainerTextAnother>

            <BackButton
              onPress={() => {
                dispatchTripCustomer({
                  type: 'update',
                  field: 'inputWho',
                  arg: {},
                });
                setTypeTrip('');
              }}
            >
              <Ionicons
                name="close"
                size={24}
                color={theme.colors.primaryText}
              />
            </BackButton>
          </ContainerDriver>
        </DriverDoorHandle>
      </If>
      {visibleOptionTravel ? (
        <TravelOptionsContainer
          serviceSelected={serviceSelected}
          enableDepartureAddresConfirmation={
            enableDepartureAddresConfirmation
          }
          setVisibleOptionTravel={setVisibleOptionTravel}
          setVisibleConfirmAddress={setVisibleConfirmAddress}
          handlePix={handlePix}
          handleConfirmRace={handleConfirmRace}
          turbined={turbined}
          setTurbined={setTurbined}
          setTypeTrip={setTypeTrip}
          calculatePricesAndSome={calculatePricesAndSome}
          setOfferInDriver={setOfferInDriver}
          setModalInfo={setModalInfo}
          haveCancelationFee={haveCancelationFee}
          listServices={listServices}
          setModalOfferInPrice={setModalOfferInPrice}
          setModalCard={setModalCard}
          valueVoucher={valueVoucher}
          setVisible={setVisible}
          selectedCard={selectedCard}
          setVisibleModalReadQrCode={setVisibleModalReadQrCode}
          loadingButton={loadingButton}
          setModalSchedule={setModalSchedule}
          loadingConfirm={loadingConfirm}
          typeTrip={typeTrip}
          date={date}
          hours={hours}
          offerInDriver={offerInDriver}
          verifyCardOnCoupon={verifyCardOnCoupon}
          coupons={coupons}
          setModalCoupon={setModalCoupon}
          hasInDriver={hasInDriver}
          waitForAddressConfirmation={addressConfirmation.waitForAddressConfirmation}
        />
      ) : null}

      <If condition={modalFavorite}>
        <ModalFavorite
          loading={false}
          onPressConfirm={() => {
            setLoadingConfirm(true);
            confirmFavorite();
            setLoadingConfirm(false);
            setModalFavorite(false);
          }}
        />
      </If>

      {visibleConfirmAddress && enableDepartureAddresConfirmation === '1' ? (
        <ModalConfirmOrigin
          visibleTravelOptions={visibleOptionTravel}
          setVisible={setVisibleConfirmAddress}
          address={origin.address}
          handleConfirmRace={addressConfirmation.confirmAddress}
          setVisibleTravelOption={setVisibleOptionTravel}
        />
      ) : null}
      <ModalInDriver
        priceOffer={offerInDriver}
        setOfferPrice={setOfferInDriver}
        visible={modalInDriver}
        setVisible={setModalInDriver}
        selectedCard={selectedCard}
        setVisibleOptionTravel={setVisibleOptionTravel}
        initialPriceOffer={selectedOptionTravel.price}
      />
      <DeliveryOption
        visible={modalTripSend}
        setVisible={setModalTripSend}
        hasInDriver={hasInDriver}
        selectedCard={selectedCard}
        setVisibleOptionTravel={setVisibleOptionTravel}
        setVisibleConfirmAddress={setVisibleConfirmAddress}
      />

      <ModalInfo
        visible={modalInfo}
        setVisible={setModalInfo}
        prices={prices}
      />
      <CouponTripContent
        coupons={coupons}
        visible={modalCoupon}
        setVisible={setModalCoupon}
        selectedCoupon={selectedCoupon}
      />

      <ModalFrame
        visible={modalCard}
        setVisible={setModalCard}
        onPressConfirm={() => setModalCard(false)}
        onClose={() => setModalCard(false)}
        hideConfirm
        title={translate('appRoutes.title_card_list')}
      >
        <ScrollView
          style={{
            maxHeight: 300,
            marginTop: 10,
            marginBottom: 10,
          }}
        >
          {cards.length > 0 ? (
            cards.map(item => (
              <CardCart
                key={item.idCard}
                card={item}
                setVisibleSecondModal={setModalCard}
                selectedCard={selectedCard}
                setCardSelected={setSelectedCard}
              />
            ))
          ) : (
            <TextEdit>{translate('schedule.no_card')}</TextEdit>
          )}
          <ButtonNavigate
            onPress={() => {
              setModalCard(false);
              navigation.navigate('PaymentPage');
            }}
          >
            <TextEdit color={theme.colors.primaryText}>
              {translate('appRoutes.title_add_card')}
            </TextEdit>
          </ButtonNavigate>
        </ScrollView>
      </ModalFrame>

      <ModalReadQrCode
        visible={visibleModalReadQrCode}
        setVisible={setVisibleModalReadQrCode}
        setDataScanned={setDataScanned}
      />
      <ModalOfferInPrice
        visible={modalOfferInPrice}
        setVisible={setModalOfferInPrice}
        setOfferPrice={setOfferInDriver}
        setTripType={setTypeTrip}
        priceOffer={offerInDriver}
      />
      <ModalSchedule
        visible={modalSchedule}
        setModal={setModalSchedule}
        date={date}
        hour={hours}
        onConfirm={date => {
          calculateAll(origin, destiny, waypoints, false, {
            args: {
              dateTimeSchedule: date,
            },
          });
        }}
        setDate={setDate}
        setHour={setHours}
        setTypeTrip={setTypeTrip}
      />
      <ModalPartner
        setTripType={setTypeTrip}
        setIsTripNoDestinationAnother={setIsTripNoDestinationAnother}
      />
    </>
  );
}
