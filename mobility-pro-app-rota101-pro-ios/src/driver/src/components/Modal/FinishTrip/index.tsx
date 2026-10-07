/* eslint-disable no-unsafe-optional-chaining */
import {useCallback, useEffect, useState} from 'react';
import {Alert, Dimensions} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import {Content} from './styles';
import {useTripProvider} from '../../../context/Trip';
import {useTripStatusProvider} from '../../../context/TripStatus';
import {customToast} from '../../../../../utils/FlashMessage';
import {useUserDriver} from '../../../context/userDriver';
import {ResumeTripComponent} from './ResumeTrip';
import {AvaliableComponent} from './Avaliable';
import {useNetwork} from '../../../../../context/ConfigGlobal';
import {MONEY_IN_LOCAL} from '../../../../../client/constants/paymentFormType';
import {VerifyPaymentForm} from '../../../../../common/Utils';
import Helper from '../../../../../client/utils/Helper';
import FinishTaximeterTrip from '../FinishTaximeterTrip';
import {If} from '../../../../../client/components/If';
import {TripInfo} from '../../../context/Trip/types';
import {translate} from '../../../../../client/locales';

interface ModalProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
  showInitModal: (boolean) => void;
}

export const ModalFinishTrip = ({
  visible,
  setVisible,
  showInitModal,
}: ModalProps) => {
  const [isTransparent, setIsTransparent] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);
  const [loadingAvaliation, setLoadingAvaliation] = useState(false);
  const [disableBackground, setDisableBackground] = useState(true);
  const [priceChoose, setPriceChoose] = useState('');
  const [mapAvaliations, setMapAvaliations] = useState({
    selectedOrigin: 1,
    selectedDestination: 1,
    securityOrigin: 1,
    securityDestination: 1,
  });

  const {stateTrip, sendAvaliations, initTripPreAccepted, clearDataTrip} =
    useTripProvider();
  const {tripAccepted: tripCurrent, tripPreAccepted} = stateTrip;
  const {itsNetwork} = useNetwork();
  const {finishTripRecalculated, recalculated, setButtonTargetVisibility} =
    useTripStatusProvider();
  const [tripAccepted, setTripAccepted] = useState(
    tripCurrent || ({} as TripInfo),
  );

  const {getDriverFind, userDriverFind} = useUserDriver();

  const screenDimensions = Dimensions.get('window').height;

  const animation = useSharedValue(screenDimensions);

  const animatedStyles = useAnimatedStyle(() => {
    return {
      transform: [{translateY: animation.value}],
    };
  });

  const getLastFinishedTrip = async () => {
    const lastTrip = await AsyncStorage.getItem('tripDriver');
    if (lastTrip && tripAccepted?.status) {
      setTripAccepted(JSON.parse(lastTrip));

      if (tripAccepted.status === 'finished') {
        await AsyncStorage.setItem(
          'lastTripFinished',
          JSON.stringify(tripAccepted),
        );
      }
    }
  };

  const conditionToReprove = (e: string) => {
    if (e === 'reproved') {
      return 2;
    }
    return 1;
  };

  const handleReprove = (e: string, type: string, id: number) => {
    // eslint-disable-next-line default-case
    switch (type) {
      case 'Map':
        if (id === 1) {
          return setMapAvaliations({
            ...mapAvaliations,
            selectedOrigin: conditionToReprove(e),
          });
        }
        setMapAvaliations({
          ...mapAvaliations,
          selectedDestination: conditionToReprove(e),
        });
        break;
      case 'Security':
        if (id === 1) {
          return setMapAvaliations({
            ...mapAvaliations,
            securityOrigin: conditionToReprove(e),
          });
        }
        setMapAvaliations({
          ...mapAvaliations,
          securityDestination: conditionToReprove(e),
        });
    }
  };

  const riskArea = (isOrigin: boolean, type: string) => {
    return {
      address: isOrigin
        ? tripAccepted.origin.address
        : tripAccepted.destination.name,
      latitude: tripAccepted?.[type].latitude,
      longitude: tripAccepted?.[type].longitude,
      tripReference: tripAccepted.tripReference,
      userId: userDriverFind.userId,
    };
  };

  const closeResume = useCallback(async () => {
    animation.value = withTiming(
      -screenDimensions -
        screenDimensions /
          ((await VerifyPaymentForm(MONEY_IN_LOCAL))
            ? tripAccepted.pix
              ? 1.95
              : 2.5
            : 3),
    );
  }, []);

  const sendAvaliable = useCallback(async () => {
    let status = false;
    if (!itsNetwork) {
      await AsyncStorage.setItem(
        'sendAvaliableOff',
        JSON.stringify({
          selectedOrigin: mapAvaliations.selectedOrigin,
          originName: tripAccepted.origin.address,
          selectedDestination: mapAvaliations.selectedDestination,
          destinationName: tripAccepted.destination.name,
        }),
      );
      status = true;
    }
    let mountRiskArea = [];

    if (mapAvaliations.securityOrigin === 2) {
      mountRiskArea.push(riskArea(true, 'origin'));
    }

    if (mapAvaliations.securityDestination === 2) {
      mountRiskArea.push(riskArea(false, 'destination'));
    }

    if (itsNetwork) {
      status = await sendAvaliations(
        mapAvaliations.selectedOrigin,
        tripAccepted.origin.address,
        mapAvaliations.selectedDestination,
        tripAccepted.destination.name,
        tripAccepted,
        mountRiskArea,
      );
    }
    if (!status) {
      return '';
    }
    setDisableBackground(true);
    animation.value = withTiming(-screenDimensions * 3, {duration: 500});
    if (itsNetwork) {
      getDriverFind();
    }
    setTimeout(() => {
      setIsTransparent(true);
      animation.value = withTiming(screenDimensions, {duration: 500});
      setTimeout(() => {
        setVisible(false);
        setIsTransparent(false);
        setLoading1(false);
        setLoading2(false);
        setLoadingAvaliation(false);
        setDisableBackground(false);
      }, 5000);
    }, 6000);
    if (!itsNetwork) {
      return clearDataTrip();
    }
    const result = await initTripPreAccepted();
    if (result) {
      return showInitModal(true);
    }
    setTimeout(() => {
      setButtonTargetVisibility(true);
    }, 1000);
    return clearDataTrip();
  }, [clearDataTrip, getDriverFind, mapAvaliations]);

  const recalculate = useCallback(
    async (chooseRecalc = false) => {
      Alert.alert(
        translate('menu.text_warning'),
        translate('callTrip.are_you_sure_you_want_to_charge_this_amount'),
        [
          {
            text: translate('tripDriver.no'),
            onPress: () => {
              setLoading1(false);
              setLoading2(false);
            },
            style: 'cancel',
          },
          {
            text: translate('tripDriver.yes'),
            onPress: async () => {
              setPriceChoose(
                Helper.maskMoney(
                  chooseRecalc
                    ? Number(recalculated.price)
                    : Number(tripAccepted.price),
                ),
              );
              if (!itsNetwork) {
                await AsyncStorage.setItem(
                  'recalculateOff',
                  JSON.stringify({
                    chooseRecalc,
                  }),
                );
                setLoading1(false);
                setLoading2(false);
                closeResume();
                return;
              }
              const result = await finishTripRecalculated(chooseRecalc);

              setLoading1(false);
              setLoading2(false);
              if (!result) {
                customToast('Erro ao enviar preço escolhido, tente novamente');
              }

              closeResume();
            },
          },
        ],
      );
    },
    [finishTripRecalculated, closeResume, customToast],
  );

  const finishTaximeterTrip = async () => {
    closeResume();
    setDisableBackground(true);
    setTimeout(() => {
      setButtonTargetVisibility(true);
      setIsTransparent(true);
      setVisible(false);
      setIsTransparent(false);
      setLoading1(false);
      setLoading2(false);
      setLoadingAvaliation(false);
      setDisableBackground(false);
    }, 1000);
    return clearDataTrip();
  };

  useEffect(() => {
    getLastFinishedTrip();
  }, []);

  useEffect(() => {
    if (visible) {
      animation.value = withTiming(screenDimensions / 10, {duration: 1000});
      const timeoutId = setTimeout(() => {
        setDisableBackground(false);
      }, 1000);

      return () => {
        clearTimeout(timeoutId);
      };
    }

    animation.value = withTiming(screenDimensions, {duration: 1000});
  }, [visible]);

  return (
    <>
      <If condition={tripAccepted?.tripCallType === 'CHAMADA TAXÍMETRO'}>
        <Content
          isTransparent={isTransparent}
          disableBackground={disableBackground}
        >
          <FinishTaximeterTrip
            tripAccepted={tripAccepted}
            finishTaximeterTrip={finishTaximeterTrip}
            animatedStyles={animatedStyles}
            screenDimensions={screenDimensions}
          />
        </Content>
      </If>
      <If
        condition={
          tripAccepted?.tripCallType &&
          tripAccepted?.tripCallType !== 'CHAMADA TAXÍMETRO'
        }
      >
        <Content
          isTransparent={isTransparent}
          disableBackground={disableBackground}
        >
          <ResumeTripComponent
            animatedStyles={animatedStyles}
            screenDimensions={screenDimensions}
            recalculate={recalculate}
            loading1={loading1}
            tripAccepted={tripAccepted}
            loading2={loading2}
            closeResume={closeResume}
            setLoading1={setLoading1}
            setLoading2={setLoading2}
          />
          <AvaliableComponent
            animatedStyles={animatedStyles}
            screenDimensions={screenDimensions}
            tripAccepted={tripAccepted}
            loadingAvaliation={loadingAvaliation}
            sendAvaliable={sendAvaliable}
            setLoadingAvaliation={setLoadingAvaliation}
            handleReprove={handleReprove}
            priceChoose={priceChoose}
          />
        </Content>
      </If>
    </>
  );
};
