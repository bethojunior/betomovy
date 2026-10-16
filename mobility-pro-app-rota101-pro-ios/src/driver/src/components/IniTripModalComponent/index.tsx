import { useEffect, useRef, useState } from 'react';
import { Animated as Animation } from 'react-native';
import { useNetwork } from '../../../../context/ConfigGlobal';
import { useUserDriver } from '../../context/userDriver';
import { PublicityComponent } from '../PublicityComponent';
import { useBubbleButton } from '@704apps/react-native-bubble-button';
import { useEnsureOverlayPermission } from '../../pages/OverlayPermission/useEnsureOverlayPermission';
import { bubble } from '../../pages/Home/service';
import theme from '../../styles/theme';
import Helper from '../../utils/Helper';
import { useAuth } from '../../../../context/auth';
import { useLocal } from '../../hooks/location';
import { V2 } from '../Home/V2';
import { V1 } from '../Home/V1';
import V1SpeedMob from '../Home/SpeedMob/V1';
import { useTripProvider } from '../../context/Trip';
import { useBank } from '../../context/bank';
import { NegativeBalanceModal } from '../NegativeBalanceModal';
import { translate } from '../../../../client/locales';
import { useTripStatusProvider } from '../../context/TripStatus';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { FinishedTripStorage } from '~/utils/Storage/finishedTripStorage';
import { hasObjectValue } from '~/utils/object';

export const IniTripModalComponent = ({
  version,
  visibleQrCode,
  setVisibleQrCode,
  iniTripModal,
  setModalVisible,
  modalVisible,
  setFinishTripModal,
  setIniTripModal,
  checkHorasLimites, // Nova prop
  showModalHorasLimites, // Nova prop
}) => {
  const { userDriverFind, toogleDriverStatus } = useUserDriver();
  const { itsNetwork } = useNetwork();
  const {
    cityConfig,
    generalSettings,
    setIsNegativate,
    visibleNegativateModal,
    setVisibleNegativateModal,
  } = useAuth();
  const [loadingStatus, setLoadingStatus] = useState(false);
  const { hideBubble } = useBubbleButton();
  const { ensureOverlayPermission } = useEnsureOverlayPermission();
  const { location } = useLocal();
  const dispatchTrip: any = useTripProvider((context: any) => context.dispatchTrip);
  const tripAccepted: any = useTripProvider(
    (context: any) => context.stateTrip.tripAccepted,
  );
  const countTrip: any = useTripProvider((context: any) => context.stateTrip.countTrip);
  const hasRecalculation: any = useTripStatusProvider(
    (context: any) => context.hasRecalculation,
  );
  const shouldShowFinishModal: any = useTripStatusProvider(
    (context: any) => context.shouldShowFinishModal,
  );
  const tripPreAccepted: any = useTripProvider(
    (context: any) => context.stateTrip.tripPreAccepted,
  );

  const pulse = [1];
  const aminating = new Animation.Value(0);
  const { navigate } = useNavigation<NavigationProp<any>>();
  const { getLatestTransactions } = useBank();
  const [swalCustomNegative, setSwalCustomerNegative] = useState(false);
  const [hasShownNegativeBalanceAlert, setHasShownNegativeBalanceAlert] = useState(false);
  const [hasShownNegativateModalAlert, setHasShownNegativateModalAlert] = useState(false);
  const [balanceValue, setBalanceValue] = useState(0);

  const hasNavigatedRef = useRef(false);

  const getBalance = async () => {
    try {
      const valueLimitNegative = Helper.generalSettingsValue(
        generalSettings,
        'max_amount_for_receipt_in_vehicle',
      );
      const { balance } = await getLatestTransactions();
      const valueDriver = Number(balance?.balance);
      setBalanceValue(valueDriver);

      if (valueDriver < -Number(valueLimitNegative)) {
        if (!hasShownNegativateModalAlert) {
          setVisibleNegativateModal(true);
          setHasShownNegativateModalAlert(true);
          return setIsNegativate(true);
        }
      } else if (valueDriver < 0) {
        if (!hasShownNegativeBalanceAlert) {
          setSwalCustomerNegative(true);
          setHasShownNegativeBalanceAlert(true);
        }
      } else {
        setIsNegativate(false);
        setHasShownNegativeBalanceAlert(false);
        setHasShownNegativateModalAlert(false);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const setOn = async () => {
    await ensureOverlayPermission(async () => {
      userDriverFind.status = 'disponivel';
      setLoadingStatus(true);

      if (!itsNetwork) {
        return;
      }

      if (Object.keys(tripPreAccepted).length > 0) {
        return;
      }

      const status = await toogleDriverStatus('disponivel', location?.coords);
      if (!status) {
        await hideBubble();
      } else {
        await bubble(
          userDriverFind?.idDriver,
          theme,
          cityConfig?.showNetValueForDriverOnCall,
          Helper.generalSettingsValue(generalSettings, 'show_more_calcs_driver'),
          Helper.generalSettingsActive(generalSettings, 'enable_realtime_socket'),
          cityConfig,
        );
      }

      setLoadingStatus(false);
    });
  };

  useEffect(() => {
    const isFinished = FinishedTripStorage.exists(tripAccepted?.tripReference);
    const hasTripAccepted = hasObjectValue(tripAccepted);

    const shouldGoToFinishResume =
      (hasTripAccepted && tripAccepted?.status === 'finished') ||
      (hasTripAccepted && tripAccepted?.status === 'in_progress' && isFinished) ||
      hasRecalculation ||
      shouldShowFinishModal ||
      (hasTripAccepted && tripAccepted?.tripOff?.status);

    if (shouldGoToFinishResume && !hasNavigatedRef.current) {
      hasNavigatedRef.current = true;

      dispatchTrip({ type: 'update', field: 'callDriverModal', arg: false });
      setIniTripModal(false);

      if (tripAccepted?.tripCallType !== 'CHAMADA TAXÍMETRO') {
        navigate('FinishTripResume', { tripAccepted });
      }
    } else if (!shouldGoToFinishResume) {
      hasNavigatedRef.current = false;
      getBalance();
    }
  }, [
    tripAccepted?.tripReference,
    tripAccepted?.status,
    tripAccepted?.tripOff?.status,
    tripAccepted?.tripCallType,
    hasRecalculation,
    shouldShowFinishModal,
  ]);

  return (
    <>
      <NegativeBalanceModal
        visible={swalCustomNegative}
        onClose={() => setSwalCustomerNegative(false)}
        title={translate('negativeBalanceModal.title_soft')}
        description={translate('negativeBalanceModal.description_soft')}
        balanceValue={balanceValue}
        showPrepaidOption={Helper.generalSettingsActive(
          generalSettings,
          'enable_credit_prepaid',
        )}
        onPressPay={() => {
          setSwalCustomerNegative(false);
          navigate('Account');
        }}
        onPressPrepaid={() => {
          setSwalCustomerNegative(false);
          navigate('Prepaid');
        }}
      />
      <NegativeBalanceModal
        visible={visibleNegativateModal}
        onClose={() => setVisibleNegativateModal(false)}
        title={translate('negativeBalanceModal.title_hard')}
        description={translate('negativeBalanceModal.description_hard')}
        balanceValue={balanceValue}
        showPrepaidOption={Helper.generalSettingsActive(
          generalSettings,
          'enable_credit_prepaid',
        )}
        onPressPay={() => {
          setVisibleNegativateModal(false);
          navigate('Account');
        }}
        onPressPrepaid={() => {
          setVisibleNegativateModal(false);
          navigate('Prepaid');
        }}
      />

      {(() => {
        switch (version) {
          case '0':
            return (
              <V2
                iniTripModal={iniTripModal}
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                setOn={setOn}
                aminating={aminating}
                publicity={
                  <PublicityComponent
                    visibleQrCode={visibleQrCode}
                    setVisibleQrCode={setVisibleQrCode}
                    countTrip={countTrip}
                  />
                }
              />
            );
          case '2':
            return <V1SpeedMob setModalVisible={setModalVisible} setOn={setOn} />;
          default:
            return (
              <V1
                // Pulse={Pulse}
                iniTripModal={iniTripModal}
                loadingStatus={loadingStatus}
                modalVisible={modalVisible}
                setModalVisible={setModalVisible}
                pulse={pulse}
                setOn={setOn}
                aminating={aminating}
                publicity={
                  <PublicityComponent
                    visibleQrCode={visibleQrCode}
                    setVisibleQrCode={setVisibleQrCode}
                    countTrip={countTrip}
                  />
                }
              />
            );
        }
      })()}
    </>
  );
};
