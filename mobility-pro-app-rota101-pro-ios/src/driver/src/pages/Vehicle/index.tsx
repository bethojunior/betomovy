import { useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from 'styled-components/native';
import { translate } from '../../../../client/locales';
import { customToast } from '../../../../utils/FlashMessage';
import { VehicleDocumentUpload } from '../../components/VehicleDocumentUpload';
import { VehicleDocumentAsset } from '../../components/VehicleDocumentUpload/types';
import { IfLoaderInsideScreen } from '../../components/IfLoaderInsideScreen';
import { useKeyboardHeight } from '../../../../common/hooks/useKeyboardHeight';
import { useScrollToFocusedInput } from '../../hooks/useScrollToFocusedInput';
import { useUserDriver } from '../../context/userDriver';
import { useVehicle } from '../../context/Vehicle';
import { VehicleProps } from '../../context/Vehicle/types';
import { VehicleInfoCard } from './components/VehicleInfoCard';

import { ActionButton, ActionButtonText, ActionsRow, Container, ContentVehicle } from './styles';

export default function Vehicle() {
  const theme = useTheme();
  const { userDriverFind, getDriverFind } = useUserDriver();
  const { pendingVehicle, changeCar } = useVehicle();
  const keyboardHeight = useKeyboardHeight();
  const { scrollRef, scrollToRow, onScroll } = useScrollToFocusedInput(keyboardHeight);
  const [car, setCar] = useState(userDriverFind.car);
  const [documentAsset, setDocumentAsset] = useState<VehicleDocumentAsset | null>(null);
  const [haveVehicle, setHaveVehicle] = useState({});
  const [loading, setLoading] = useState(false);
  const [editable, setEditable] = useState(false);

  const hasPendingRequest = haveVehicle && Object.keys(haveVehicle).length > 0;

  const getPendingVehicle = async () => {
    const { data } = await pendingVehicle();
    setHaveVehicle(data);
  };

  const handleChangeField = (field: keyof VehicleProps, value: string) => {
    setCar({ ...car, [field]: value });
  };

  const handleSend = async () => {
    if (!car.brand || !car.model || !car.plate || !car.color || !car.year || !car.renavam) {
      return customToast(translate('myTravels.fill_all_fields'), 'warning');
    }
    if (!documentAsset) {
      return customToast(translate('vehicle.document_required_warning'), 'warning');
    }
    setLoading(true);
    const response = await changeCar(car, documentAsset);
    if (!response.status) {
      setLoading(false);
      return customToast(response.message, 'danger');
    }
    getPendingVehicle();
    customToast(response.message, 'success');
    setEditable(false);
    setDocumentAsset(null);
    setLoading(false);
  };

  const handleCancel = () => {
    setCar(userDriverFind.car);
    setDocumentAsset(null);
    setEditable(false);
  };

  useEffect(() => {
    getPendingVehicle().then(async () => {
      await getDriverFind();
    });
  }, []);

  return (
    <Container>
      <ContentVehicle
        ref={scrollRef}
        keyboardHeight={keyboardHeight}
        onScroll={onScroll}
        scrollEventThrottle={16}
      >
        <VehicleInfoCard
          car={car}
          editable={editable}
          onChangeField={handleChangeField}
          scrollToRow={scrollToRow}
        />

        {editable && (
          <VehicleDocumentUpload
            label={translate('vehicle.document_label')}
            title={translate('vehicle.document_upload_title')}
            value={documentAsset}
            onChange={setDocumentAsset}
          />
        )}

        <IfLoaderInsideScreen loading={loading}>
          {editable ? (
            <ActionsRow>
              <ActionButton variant="secondary" onPress={handleCancel}>
                <ActionButtonText variant="secondary">{translate('vehicle.cancel')}</ActionButtonText>
              </ActionButton>
              <ActionButton variant="primary" onPress={handleSend}>
                <Ionicons name="checkmark-circle-outline" size={RFValue(18)} color={theme.colors.primaryText} />
                <ActionButtonText>{translate('vehicle.send')}</ActionButtonText>
              </ActionButton>
            </ActionsRow>
          ) : (
            <ActionButton
              variant="primary"
              disabled={hasPendingRequest}
              onPress={() => setEditable(true)}
            >
              <Ionicons
                name="swap-horizontal-outline"
                size={RFValue(18)}
                color={theme.colors.primaryText}
              />
              <ActionButtonText>
                {hasPendingRequest
                  ? translate('vehicle.under_analysis')
                  : translate('vehicle.request_vehicle_change')}
              </ActionButtonText>
            </ActionButton>
          )}
        </IfLoaderInsideScreen>
      </ContentVehicle>
    </Container>
  );
}
