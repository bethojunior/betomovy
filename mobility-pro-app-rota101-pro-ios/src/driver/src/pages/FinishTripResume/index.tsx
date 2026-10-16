import { NavigationProp, RouteProp, useNavigation } from "@react-navigation/native";
import { ActivityIndicator, Alert, ScrollView } from "react-native";
import { useAuth } from "~/context/auth";
import { useTripStatusProvider } from "../../context/TripStatus";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { PixService } from "../../components/Modal/FinishTrip/service";
import { MONEY_IN_LOCAL } from "~/client/constants/paymentFormType";
import { useFinishTrip } from "../../context/FinishTrip";
import { translate } from "~/client/locales";
import {
  ConfirmButtonResumeTrip,
  Container,
  FixedFooter,
  TextButton,
} from "./styles";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useTripProvider } from '../../context/Trip';
import { TripInfo } from '../../context/Trip/types';
import { useRouteTraveled } from '../../context/RouteTraveled';
import { RecalculationSection } from '../../components/RecalculationSection';
import { TotalPriceResume } from '../../components/TotalPriceResume';
import { BonusRewardCard } from '../../components/BonusRewardCard';
import { JourneyResumeCard } from '../../components/JourneyResumeCard';
import { useRoute } from '@react-navigation/native';
import { setIniTripModal } from '../../store/iniTripModal';
import { getTripFinishStatus } from '~/hooks/useOfflineTripActions';

export const FinishTripResume = () => {
  const navigation = useNavigation<NavigationProp<any>>();
  const route = useRoute<RouteProp<any, 'FinishTripResume'>>();
  const tripCurrent = route.params?.tripAccepted || null;

  const {
    hasRecalculation,
    recalculated,
    finishTripRecalculated,
    confirmFinishTrip,
    confirmRecalcPrice,
    resetRecalcPrice,
    getSavedRecalcPrice,
    cancelPreviewFinishTrip,
  } = useTripStatusProvider((c) => c)

  const { cityConfig, generalSettings, userDriver } = useAuth();

  const enableTripPriceRecalc = useMemo(() =>
    Number(cityConfig?.enableChoicePriceTripRecalculation) === 1,
    [cityConfig?.enableChoicePriceTripRecalculation]
  );

  const textBonusFinishTrip = generalSettings?.find(item => {
    return item?.key === 'text_the_end_trip_with_bonus';
  });

  const pixEnabled = generalSettings?.find(item => {
    return item?.key === 'enable_pix_trip_end_ipag';
  });

  const { initTripPreAccepted } = useTripProvider((c) => c)

  const { generatePixPayment, checkPixStatus } = PixService();

  const [pixCode, setPixCode] = useState<string | null>(null);
  const [loadingPix, setLoadingPix] = useState(false);
  const [generate, setGenerate] = useState(false);
  const [pixData, setPixData] = useState(null);
  const [pixStatus, setPixStatus] = useState<string | null>("0");
  const [clickGeneratePix, setClickGeneratePix] = useState<boolean>(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);
  const allowLeaveRef = useRef(false);

  const [tripAccepted, setTripAccepted] = useState<TripInfo | null>(
    tripCurrent || null,
  );

  // @TODO: verificar essas bombas de loading
  const [loading1, setLoading1] = useState(false)
  const [loading2, setLoading2] = useState(false)

  const { clearRoute } = useRouteTraveled();

  const {
    priceSelected,
    selectedPrice,
    valueConfirmed,
    isFinishing,
    resetPriceSelection,
    confirmPriceSelection,
    markTripAsFinishing,
    setIsFinishing,
  } = useFinishTrip();

  const allowedPayments = ['dinheiro'];
  const paymentForm = tripAccepted?.tripPaymentForm?.toLowerCase() || '';
  const isCashPayment = Number(tripAccepted?.paymentFormTypeId) === MONEY_IN_LOCAL;
  const showPixButton = pixEnabled?.value == '1' && (isCashPayment || allowedPayments.some(payment =>
    paymentForm.includes(payment)
  ));

  const recalculate = useCallback(
    async (chooseRecalc = false, finishCompleteTrip = false, temporaryPrice = null) => {
      Alert.alert(
        translate('menu.text_warning'),
        translate('callTrip.are_you_sure_you_want_to_charge_this_amount'),
        [
          {
            text: translate('tripDriver.no'),
            onPress: () => {
              setLoading1(false);
              setLoading2(false);
              resetRecalcPrice();
              resetPriceSelection();
            },
            style: 'cancel',
          },
          {
            text: translate('tripDriver.yes'),
            onPress: async () => {
              const priceValue = temporaryPrice || (chooseRecalc
                ? Number(recalculated.price)
                : Number(tripAccepted.price));

              confirmPriceSelection(priceValue, chooseRecalc);
              confirmRecalcPrice(priceValue, chooseRecalc);
              setLoading1(false);
              setLoading2(false);

              if (finishCompleteTrip) {
                await goToAvaliation();
              }
            },
          },
        ],
      );
    },
    [tripAccepted, recalculated, setLoading1, setLoading2, resetPriceSelection, confirmPriceSelection],
  );

  useEffect(() => {
    const getTripDriver = async () => {
      if (tripCurrent && Object.keys(tripCurrent).length > 0) return;

      const tripFind = await AsyncStorage.getItem('tripDriver');
      if (tripFind) {
        const parsedTrip = JSON.parse(tripFind);
        if (parsedTrip && Object.keys(parsedTrip).length > 0) {
          setTripAccepted(parsedTrip);
        }
      }
    };

    getTripDriver();
  }, []);

  useEffect(() => {
    const unsubscribe = navigation.addListener('beforeRemove', (e) => {
      if (allowLeaveRef.current || tripAccepted?.tripCallType === 'CHAMADA TAXÍMETRO') {
        return;
      }

      e.preventDefault();

      if (isFinishing) {
        Alert.alert(
          translate('finishTrip.title_wait_finish'),
          translate('finishTrip.text_wait_finish'),
        );
        return;
      }

      Alert.alert(
        translate('finishTrip.title_confirm_leave_resume'),
        translate('finishTrip.text_confirm_leave_resume'),
        [
          { text: translate('finishTrip.text_cancel'), style: 'cancel' },
          {
            text: translate('finishTrip.button_leave_resume'),
            style: 'destructive',
            onPress: () => {
              cancelPreviewFinishTrip();
              setIniTripModal(true);
              navigation.dispatch(e.data.action);
            },
          },
        ],
      );
    });

    return () => unsubscribe();
  }, [navigation, tripAccepted?.tripReference, tripAccepted?.tripCallType, isFinishing]);

  useEffect(() => {
    if (tripCurrent && Object.keys(tripCurrent).length > 0) {
      setTripAccepted(tripCurrent);
    }
  }, [tripCurrent]);

  useEffect(() => {
    if (tripAccepted?.tripReference) {
      resetPriceSelection();
    }
  }, [tripAccepted?.tripReference, resetPriceSelection]);

  const getLastFinishedTrip = async () => {
    if (tripCurrent && Object.keys(tripCurrent).length > 0) return;
    const lastTrip = await AsyncStorage.getItem('tripDriver');
    if (lastTrip && tripAccepted?.status) {
      const parsedTrip = JSON.parse(lastTrip);
      setTripAccepted(parsedTrip);

      if (parsedTrip?.status === 'finished') {
        await AsyncStorage.setItem(
          'lastTripFinished',
          JSON.stringify(parsedTrip),
        );
      }
    }
  };

  useEffect(() => {
    getLastFinishedTrip();
  }, []);

  useEffect(() => {
    if (!hasRecalculation || priceSelected || cityConfig == null) return;

    const saved = getSavedRecalcPrice();
    if (saved) {
      confirmPriceSelection(saved.priceValue, saved.chooseRecalc);
    } else if (!enableTripPriceRecalc && recalculated?.price) {
      confirmPriceSelection(Number(recalculated.price), true);
      confirmRecalcPrice(Number(recalculated.price), true);
    }
  }, [hasRecalculation, cityConfig, enableTripPriceRecalc, priceSelected, recalculated?.price]);

  // Seleciona automaticamente o preço original quando NÃO houver recálculo,
  // garantindo a exibição do bloco "Valor a receber" com o preço da corrida
  useEffect(() => {
    if (!hasRecalculation && !priceSelected && !valueConfirmed && tripAccepted?.price) {
      confirmPriceSelection(Number(tripAccepted?.price), false);
    }
  }, [hasRecalculation, priceSelected, valueConfirmed, tripAccepted?.price]);

  const handlePix = async () => {
    if (!tripAccepted?.tripReference || !tripAccepted?.price) return;

    try {
      setLoadingPix(true);
      setClickGeneratePix(true);

      const priceToUse = selectedPrice !== null ? selectedPrice : tripAccepted.price;

      const data = await generatePixPayment(tripAccepted.tripReference, priceToUse);
      setPixData(data);
      setPixCode(data.payment_code);
      setGenerate(true);
    } catch (err) {
      console.log(err)
      setClickGeneratePix(false);
      Alert.alert(
        'Erro ao gerar PIX',
        'Não foi possível gerar o código PIX para pagamento. Tente novamente ou selecione outra forma de pagamento.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoadingPix(false);
      setClickGeneratePix(false);
    }
  };

  const verifyPayment = async () => {
    const transactionId = pixData?.idTransaction;
    if (!transactionId) return;

    try {
      const response = await checkPixStatus(transactionId);
      const statusId = response?.data?.transactionStatusId;

      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
        intervalRef.current = null;
      }

      if (statusId === "1") {
        setPixStatus(statusId);
        await handleConfirmResumeTrip();
        return;
      }

      intervalRef.current = setTimeout(verifyPayment, 10000);

    } catch (error) {
      console.error('Error checking PIX payment status:', error);
    }
  };

  const isTripFinished = async (): Promise<boolean> => {
    const status = await getTripFinishStatus(tripAccepted?.tripReference);
    return status === 'FINISHED';
  };

  const handleConfirmResumeTrip = async () => {
    if (hasRecalculation && enableTripPriceRecalc && (!priceSelected || !valueConfirmed)) {
      return Alert.alert("Seleção necessária", "Por favor, selecione um valor para cobrança primeiro.");
    }

    if (loadingPix || clickGeneratePix) return;

    executeFinish();
  };

  const executeFinish = async () => {
    if (isFinishing) return;
    setIsFinishing(true);

    try {
      if (!tripAccepted?.tripReference) return;

      if (tripAccepted?.tripCallType === 'CHAMADA TAXÍMETRO') {
        const alreadyFinished = await isTripFinished();

        if (alreadyFinished) {
          await markTripAsFinishing(tripAccepted.tripReference);
          await goToAvaliation();
          return;
        }
      }

      await markTripAsFinishing(tripAccepted.tripReference);

      const isRecalculatedSelected = Number(selectedPrice) === Number(recalculated.price);
      const finishResult = hasRecalculation && priceSelected
        ? await finishTripRecalculated(isRecalculatedSelected, tripAccepted, true)
        : await confirmFinishTrip(tripAccepted);

      if (!finishResult) {
        Alert.alert("Erro", "Não foi possível finalizar a corrida. Tente novamente.");
        return;
      }

      await goToAvaliation();
    } catch (error) {
      console.error(error);
      Alert.alert("Erro", "Ocorreu um erro ao finalizar a corrida.");
    } finally {
      clearRoute();
      setIsFinishing(false);
    }
  };

  useEffect(() => {
    if (pixData?.idTransaction) {
      verifyPayment();
    }
  }, [pixData]);

  const goToAvaliation = async () => {
    allowLeaveRef.current = true;

    const tripUserId = tripAccepted?.userId ? String(tripAccepted.userId) : null;
    const driverUserId = userDriver?.idUser ? String(userDriver.idUser) : null;

    const isDriverSameUser =
      !!tripUserId && !!driverUserId && tripUserId === driverUserId;

    const openedPreAccepted = await initTripPreAccepted();
    if (openedPreAccepted) {
    setIniTripModal(true);
    }

    if (isDriverSameUser) {
      navigation.navigate('Home');
    } else {
      navigation.navigate('FinishTripAvaliation', { tripAccepted });
    }
  };

  return (
    <>
      <ScrollView style={{ backgroundColor: '#f6f7f9' }}>
        <Container>
          {enableTripPriceRecalc && <RecalculationSection hasRecalculation={hasRecalculation}
            valueConfirmed={valueConfirmed}
            priceSelected={priceSelected}
            loading1={loading1}
            loading2={loading2}
            tripAccepted={tripAccepted}
            typeMoney={cityConfig?.typeMoney}
            selectedPrice={selectedPrice}
            setLoading1={setLoading1}
            setLoading2={setLoading2}
            recalculate={recalculate}
            recalculated={recalculated}
          />}

          {((!hasRecalculation) || (priceSelected && valueConfirmed)) && (
            <TotalPriceResume
              typeMoney={cityConfig?.typeMoney}
              selectedPrice={selectedPrice}
              tripAccepted={tripAccepted}
              showPixButton={showPixButton}
              handlePix={handlePix}
              loadingPix={loadingPix}
              generate={generate}
              pixCode={pixCode}
              pixStatus={pixStatus}
            />
          )}
          {tripAccepted?.rewardTrip?.value && (
            <BonusRewardCard
              typeMoney={cityConfig?.typeMoney}
              tripAccepted={tripAccepted}
              textBonusFinishTrip={textBonusFinishTrip} />
          )}

          <JourneyResumeCard tripAccepted={tripAccepted} />
        </Container>
      </ScrollView>
      <FixedFooter>
        <ConfirmButtonResumeTrip
          activeOpacity={0.8}
          disabled={isFinishing}
          onPress={handleConfirmResumeTrip}
        >
          {isFinishing ? (
            <ActivityIndicator size="small" color="#fff" />
          ) : (
            <TextButton>Prosseguir</TextButton>
          )}
        </ConfirmButtonResumeTrip>
      </FixedFooter>
    </>
  );
}
