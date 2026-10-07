import AsyncStorage from '@react-native-async-storage/async-storage';
import {useAuth} from '../../../../context/auth';
import {useTripProvider} from '../../context/Trip';
import {useUserDriver} from '../../context/userDriver';
import Helper from '../../utils/Helper';
import {ButtonTaximeter} from '../ButtonTaximeter';
import {If} from '../If';

export const ButtonTaximeterComponent = ({
  setModalTaximeter,
  selectedTripType,
}) => {
  const {userDriverFind} = useUserDriver();
  const {generalSettings, isNegativate, setVisibleNegativateModal} = useAuth();
  const {tripAccepted} = useTripProvider().stateTrip;

  const condition =
    userDriverFind?.status === 'disponivel' &&
    Object.keys(selectedTripType).length === 0 &&
    tripAccepted &&
    Object.keys(tripAccepted).length === 0;

  const clearStorage = () => {
    AsyncStorage.multiRemove([
      'startTaximetro',
      'currentTimeTaximeter',
      'priceTaximeter',
      'taximeterIsPause',
      'fare',
      'routeTraveledTaximeter',
      'lastKmTaximeter',
      'TX-timeBg',
    ]);
  };

  const openTaximeter = () => {
    if (isNegativate) {
      return setVisibleNegativateModal(true);
    }
    clearStorage();
    return setModalTaximeter(true);
  };

  return (
    <If
      condition={Helper.generalSettingsActive(
        generalSettings,
        'enable_taximeter',
      )}
    >
      <ButtonTaximeter openTaximeter={openTaximeter} disabled={condition} />
    </If>
  );
};
