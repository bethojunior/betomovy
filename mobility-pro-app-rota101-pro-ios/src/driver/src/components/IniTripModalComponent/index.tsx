import {useEffect, useState} from 'react';
import {Animated as Animation} from 'react-native';
import {useNetwork} from '../../../../context/ConfigGlobal';
import {useUserDriver} from '../../context/userDriver';
import {PublicityComponent} from '../PublicityComponent';
import {useBubbleButton} from '@704apps/react-native-bubble-button';
import {bubble} from '../../pages/Home/service';
import theme from '../../styles/theme';
import Helper from '../../utils/Helper';
import {useAuth} from '../../../../context/auth';
import {useLocal} from '../../hooks/location';
import {V2} from '../Home/V2';
import {V1} from '../Home/V1';
import V1SpeedMob from '../Home/SpeedMob/V1';
import {useTripProvider} from '../../context/Trip';
import {useBank} from '../../context/bank';
import {SwalAlert} from '../../../../client/components/SwalAlert';
import {translate} from '../../../../client/locales';
import {useTripStatusProvider} from '../../context/TripStatus';
import {If} from '../If';
import {ButtonOk} from './style';
import {TextEdit} from '../TextEdit';
import {useNavigation} from '@react-navigation/native';

export const IniTripModalComponent = ({
  version,
  visibleQrCode,
  setVisibleQrCode,
  iniTripModal,
  setModalVisible,
  modalVisible,
  setFinishTripModal,
  setIniTripModal,
}) => {
  const {userDriverFind, toogleDriverStatus} = useUserDriver();
  const {itsNetwork} = useNetwork();
  const {
    cityConfig,
    generalSettings,
    setIsNegativate,
    visibleNegativateModal,
    setVisibleNegativateModal,
  } = useAuth();
  const [loadingStatus, setLoadingStatus] = useState(false);
  const {requestPermission, checkPermission, openApp} = useBubbleButton();
  const {location} = useLocal();
  const {stateTrip, dispatchTrip} = useTripProvider();
  const {hasRecalculation} = useTripStatusProvider();
  const {countTrip, tripAccepted} = stateTrip;
  const pulse = [1];
  const aminating = new Animation.Value(0);
  const {navigate} = useNavigation();
  const {getLatestTransactions} = useBank();
  const [swalCustomNegative, setSwalCustomerNegative] = useState(false);

  const getBalance = async () => {
    try {
      const valueLimitNegative = Helper.generalSettingsValue(
        generalSettings,
        'max_amount_for_receipt_in_vehicle',
      );
      const {balance} = await getLatestTransactions();
      const valueDriver = Number(balance.balance);

      if (valueDriver < -Number(valueLimitNegative)) {
        setVisibleNegativateModal(true);
        return setIsNegativate(true);
      } else if (valueDriver < 0) {
        setSwalCustomerNegative(true);
      }
      setIsNegativate(false);
    } catch (error) {
      console.log(error);
    }
  };

  const requestPermissionAndShowBubble = async () => {
    const perms = await checkPermission();
    if (!perms) {
      await requestPermission();
    }
  };

  const setOn = async () => {
    userDriverFind.status = 'disponivel';
    setLoadingStatus(true);
    await requestPermissionAndShowBubble();
    if (!itsNetwork) {
      return;
    }
    await toogleDriverStatus('disponivel', location?.coords);
    await bubble(
      userDriverFind?.idDriver,
      theme,
      cityConfig?.showNetValueForDriverOnCall,
      Helper.generalSettingsValue(generalSettings, 'show_more_calcs_driver'),
      Helper.generalSettingsActive(generalSettings, 'enable_realtime_socket'),
    );
    setLoadingStatus(false);
  };

  useEffect(() => {
    if (
      (tripAccepted &&
        Object.keys(tripAccepted).length !== 0 &&
        tripAccepted.status === 'finished') ||
      hasRecalculation ||
      (tripAccepted &&
        Object.keys(tripAccepted)?.length > 0 &&
        tripAccepted?.tripOff?.status)
    ) {
      dispatchTrip({type: 'update', field: 'callDriverModal', arg: false});

      setIniTripModal(false);
      setFinishTripModal(true);
    }
    if (tripAccepted && Object?.keys(tripAccepted)?.length === 0) {
      getBalance();
    }
  }, [tripAccepted, hasRecalculation]);

  return (
    <>
      <SwalAlert
        title={translate('requestPermission.title')}
        description={translate('trip.negative_balance')}
        visible={swalCustomNegative}
        setVisible={setSwalCustomerNegative}
      >
        <If
          condition={Helper.generalSettingsActive(
            generalSettings,
            'enable_credit_prepaid',
          )}
        >
          <ButtonOk
            onPress={() => {
              setVisibleNegativateModal(false);
              navigate('Prepaid');
            }}
          >
            <TextEdit color={theme.colors.primary}>
              {translate('trip.to_prepaid')}
            </TextEdit>
          </ButtonOk>
        </If>
      </SwalAlert>
      <SwalAlert
        title={translate('requestPermission.title')}
        description={translate('trip.negative_balance_driver')}
        visible={visibleNegativateModal}
        setVisible={setVisibleNegativateModal}
      >
        <If
          condition={Helper.generalSettingsActive(
            generalSettings,
            'enable_credit_prepaid',
          )}
        >
          <ButtonOk
            onPress={() => {
              setVisibleNegativateModal(false);
              navigate('Prepaid');
            }}
          >
            <TextEdit color={theme.colors.primary}>
              {translate('trip.to_prepaid')}
            </TextEdit>
          </ButtonOk>
        </If>
      </SwalAlert>

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
            return (
              <V1SpeedMob setModalVisible={setModalVisible} setOn={setOn} />
            );
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
