import { useCallback, useEffect, useRef, useState } from 'react';
import { Alert, AppState, BackHandler, Clipboard } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { Ionicons } from '@expo/vector-icons';
import {
  RouteProp,
  useFocusEffect,
  useNavigation,
  useRoute,
} from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { HeaderBackButton } from '@react-navigation/elements';
import { useTheme } from 'styled-components/native';

import { useAuth } from '../../../context/auth';
import { useTrip } from '../../contexts/Trip';
import { usePix } from '../../hooks/usePix';
import { getPixTripPrice } from '../../utils/pixPrice';
import { maskMoney } from '../../utils/money';
import { translate } from '../../locales';
import { PixValueCard } from '../../../components/PixValueCard';
import { PixCard } from '../../../components/PixCard';
import { PixLoadingState } from '../../../components/PixLoadingState';
import { PixSuccessState } from '../../../components/PixSuccessState';
import {
  Container,
  ErrorContainer,
  ErrorMessage,
  ErrorTitle,
  InstructionsBody,
  InstructionsCard,
  InstructionsHeader,
  InstructionsIllustration,
  InstructionsTitle,
  InstructionStepBadge,
  InstructionStepBadgeColumn,
  InstructionStepBadgeText,
  InstructionStepConnector,
  InstructionStepContent,
  InstructionStepRow,
  InstructionStepsColumn,
  InstructionStepText,
  NotificationRow,
  NotificationText,
  ScrollContent,
} from './styles';
import { TripRoutesParamList } from '~/client/routes/types';
import { Button } from '~/client/components/Button';

type NavigationProps = StackNavigationProp<TripRoutesParamList, 'TripPixPayment'>;
type RouteProps = RouteProp<TripRoutesParamList, 'TripPixPayment'>;

export function TripPixPayment() {
  const navigation = useNavigation<NavigationProps>();
  const route = useRoute<RouteProps>();
  const { origin, pixCode: pixCodeParam, amount, turbined, offerInDriver } = route.params;

  const theme = useTheme();
  const { cityConfig } = useAuth();
  const { stateTripCustomer } = useTrip();
  const { selectedOptionTravel, selectedCoupon } = stateTripCustomer;

  const [pixError, setPixError] = useState(false);
  const [pixExpired, setPixExpired] = useState(false);
  const [paymentConfirmed, setPaymentConfirmed] = useState(false);
  const [confirmedWhileExiting, setConfirmedWhileExiting] = useState(false);

  const pixFlowStatusRef = useRef<'started' | 'paused'>('started');
  const pendingConfirmedTransactionRef = useRef<string | null>(null);

  const paymentInstructionSteps = [
    translate('paymentPage.instructions_step_1'),
    translate('paymentPage.instructions_step_2'),
    translate('paymentPage.instructions_step_3'),
  ];

  const price =
    origin === 'TravelOptions'
      ? getPixTripPrice({
          turbined: !!turbined,
          offerInDriver,
          selectedOptionTravel,
          selectedCoupon,
          cityConfig,
        })
      : amount;

  const {
    pixKey,
    loadingPix,
    pixValue,
    pixExpirationSeconds,
    idTransaction,
    checkPixStatus,
    getToPixKey,
    copyToClipboard,
    refreshPixExpiration,
    clearPixVerification,
    clearPixCache,
    clearTripCache,
  } = usePix({
    price,
    pixCode: origin === 'Home' ? pixCodeParam : undefined,
    tripData: stateTripCustomer,
    onError: setPixError,
    onPixConfirmed: (confirmedIdTransaction) => finishPayment(confirmedIdTransaction),
  });

  const lastPixKeyRef = useRef<typeof pixKey>(pixKey);
  if (pixKey?.key) {
    lastPixKeyRef.current = pixKey;
  }

  const lastIdTransactionRef = useRef<string | null>(null);
  if (idTransaction) {
    lastIdTransactionRef.current = idTransaction;
  }

  const finishPayment = useCallback(
    async (idTransaction?: string) => {
      if (pixFlowStatusRef.current === 'paused') {
        pendingConfirmedTransactionRef.current = idTransaction;
        return;
      }

      setPaymentConfirmed(true);

      await clearPixCache();
      await clearTripCache();

      setTimeout(() => {
        navigation.replace('Trip', { pixResult: 'confirmed', idTransaction });
      }, 2000);
    },
    [clearPixCache, clearTripCache, navigation],
  );

  const handlePixExpired = useCallback(async () => {
    if (paymentConfirmed) return;

    clearPixVerification();
    setPixExpired(true);

    await clearPixCache();
    await clearTripCache();
  }, [paymentConfirmed, clearPixVerification, clearPixCache, clearTripCache]);

  useEffect(() => {
    getToPixKey();
  }, []);

  useEffect(() => {
    const subscription = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'active') {
        refreshPixExpiration();
      }
    });

    return () => subscription.remove();
  }, [refreshPixExpiration]);

  const leavePixScreen = useCallback(async () => {
    if (origin === 'TravelOptions') {
      await clearPixCache();
      await clearTripCache();
    }

    if (origin === 'Home') {
      navigation.navigate('Home', { pixCacheAction: 'cancel' });
      return;
    }

    navigation.goBack();
  }, [navigation, origin, clearPixCache, clearTripCache]);

  const confirmExitPix = useCallback(async () => {
    pixFlowStatusRef.current = 'started';

    let paidIdTransaction = pendingConfirmedTransactionRef.current;
    pendingConfirmedTransactionRef.current = null;

    if (!paidIdTransaction && lastIdTransactionRef.current) {
      const statusData = await checkPixStatus(lastIdTransactionRef.current);
      if (String(statusData?.transactionStatusId) === '1') {
        paidIdTransaction = lastIdTransactionRef.current;
      }
    }

    if (paidIdTransaction) {
      setConfirmedWhileExiting(true);
      finishPayment(paidIdTransaction);
      return;
    }

    leavePixScreen();
  }, [leavePixScreen, finishPayment, checkPixStatus]);

  const resumePixFlow = useCallback(() => {
    pixFlowStatusRef.current = 'started';

    const confirmedIdTransaction = pendingConfirmedTransactionRef.current;
    if (confirmedIdTransaction) {
      pendingConfirmedTransactionRef.current = null;
      finishPayment(confirmedIdTransaction);
    }
  }, [finishPayment]);

  const handleExitPix = useCallback(() => {
    if (paymentConfirmed || pixError || pixExpired) {
      leavePixScreen();
      return;
    }

    pixFlowStatusRef.current = 'paused';

    Alert.alert(
      translate('paymentPage.confirm_exit_pix_title'),
      translate('paymentPage.confirm_exit_pix_message'),
      [
        {
          text: translate('paymentPage.confirm_exit_pix_cancel'),
          style: 'cancel',
          onPress: resumePixFlow,
        },
        {
          text: translate('paymentPage.confirm_exit_pix_confirm'),
          onPress: confirmExitPix,
        },
      ],
      { cancelable: false },
    );
  }, [
    paymentConfirmed,
    pixError,
    pixExpired,
    leavePixScreen,
    resumePixFlow,
    confirmExitPix,
  ]);

  useEffect(() => {
    navigation.setOptions({
      headerLeft: (props) => <HeaderBackButton {...props} onPress={handleExitPix} />,
    });
  }, [navigation, handleExitPix]);

  useFocusEffect(
    useCallback(() => {
      const subscription = BackHandler.addEventListener('hardwareBackPress', () => {
        handleExitPix();
        return true;
      });
      return () => subscription.remove();
    }, [handleExitPix]),
  );

  const isFromHome = origin === 'Home';
  const currentOrLastPixCode = pixKey?.key || lastPixKeyRef.current?.key;

  const finalPixCode = isFromHome ? pixCodeParam : currentOrLastPixCode;
  const finalAmount = isFromHome ? amount : pixValue || price;
  const showLoading =
    origin === 'TravelOptions' && !pixError && (loadingPix || !finalPixCode);

  const handleCopy = async () => {
    if (origin === 'Home') {
      await Clipboard.setString(finalPixCode || '');
      return;
    }
    await copyToClipboard();
  };

  if (paymentConfirmed) {
    return (
      <Container>
        <PixSuccessState
          title={translate('paymentPage.payment_confirmed_title')}
          subtitle={translate(
            confirmedWhileExiting
              ? 'paymentPage.payment_confirmed_after_exit_message'
              : 'paymentPage.payment_confirmed_message',
          )}
        />
      </Container>
    );
  }

  if (pixError || pixExpired) {
    return (
      <Container>
        <ErrorContainer>
          <Ionicons name="alert-circle" size={RFValue(60)} color="#FF6B6B" />
          <ErrorTitle>
            {translate(
              pixExpired
                ? 'paymentPage.error_pix_expired_title'
                : 'paymentPage.error_generate_pix_title',
            )}
          </ErrorTitle>
          <ErrorMessage>
            {translate(
              pixExpired
                ? 'paymentPage.error_pix_expired_message'
                : 'paymentPage.error_generate_pix_message',
            )}
          </ErrorMessage>
          <Button title={translate('paymentPage.close')} onPress={leavePixScreen} />
        </ErrorContainer>
      </Container>
    );
  }

  if (showLoading) {
    return (
      <Container>
        <PixLoadingState />
      </Container>
    );
  }

  return (
    <Container>
      <ScrollContent>
        <PixValueCard
          amount={`${cityConfig?.typeMoney} ${maskMoney(Number(finalAmount) || 0)}`}
          expirationSeconds={pixExpirationSeconds}
          onExpire={handlePixExpired}
        />

        <PixCard showQrCode pixCode={finalPixCode || ''} onCopy={handleCopy} />

        <InstructionsCard>
          <InstructionsHeader>
            <InstructionsTitle>
              {translate('paymentPage.instructions_title')}
            </InstructionsTitle>
          </InstructionsHeader>

          <InstructionsBody>
            <InstructionStepsColumn>
              {paymentInstructionSteps.map((step, index) => (
                <InstructionStepRow key={step}>
                  <InstructionStepBadgeColumn>
                    <InstructionStepBadge>
                      <InstructionStepBadgeText>{index + 1}</InstructionStepBadgeText>
                    </InstructionStepBadge>
                    {index < paymentInstructionSteps.length - 1 && (
                      <InstructionStepConnector />
                    )}
                  </InstructionStepBadgeColumn>

                  <InstructionStepContent>
                    <InstructionStepText>{step}</InstructionStepText>
                  </InstructionStepContent>
                </InstructionStepRow>
              ))}
            </InstructionStepsColumn>

            <InstructionsIllustration
              source={require('../../../assets/phone_pix.webp')}
              resizeMode="contain"
            />
          </InstructionsBody>
        </InstructionsCard>

        <NotificationRow>
          <Ionicons
            name="car-outline"
            size={RFValue(14)}
            color={theme.colors.text_gray}
          />
          <NotificationText>
            {translate('paymentPage.notification_confirmed_text')}
          </NotificationText>
        </NotificationRow>
      </ScrollContent>
    </Container>
  );
}
