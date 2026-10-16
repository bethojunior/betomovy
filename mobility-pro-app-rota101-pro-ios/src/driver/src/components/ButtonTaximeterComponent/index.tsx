import { useAuth } from '../../../../context/auth';
import { useTripProvider } from '../../context/Trip';
import { useUserDriver } from '../../context/userDriver';
import Helper from '../../utils/Helper';
import { ButtonTaximeter } from '../ButtonTaximeter';
import { If } from '../If';
import { useTaximeter } from '../../context/Taximeter';

export const ButtonTaximeterComponent = ({
  setModalTaximeter,
  selectedTripType,
  onPress,
}) => {
  const { userDriverFind } = useUserDriver();
  const { generalSettings, isNegativate, setVisibleNegativateModal } = useAuth();
  const tripAccepted: any = useTripProvider(
    (context: any) => context.stateTrip.tripAccepted,
  );

  const { clearStorage } = useTaximeter();

  const condition =
    userDriverFind?.status === 'disponivel' &&
    Object.keys(selectedTripType).length === 0 &&
    tripAccepted &&
    Object.keys(tripAccepted).length === 0;

  const openTaximeter = () => {
    if (isNegativate) {
      return setVisibleNegativateModal(true);
    }
    clearStorage();
    setModalTaximeter(true);
    onPress?.();
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
