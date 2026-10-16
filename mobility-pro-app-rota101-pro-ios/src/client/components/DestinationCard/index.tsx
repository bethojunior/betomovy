import { Button } from 'react-native-paper';
import { MaterialIcons } from '@expo/vector-icons';
import theme from '../../styles/theme';
import { translate } from '../../locales';
import { TextEdit } from '../TextEdit';
import { Wrapper, ErrorCard, ErrorText, CardContainer } from './styles';

type DestinationCardProps = {
  destinationPerson: boolean;
  loadingTrip: boolean;
  loadingAddress: boolean;
  errorMessage: string;
  address?: string;
  onConfirmAddress: () => void;
  onRetry: () => void;
  onSetLocationOnMap: () => void;
};

export const DestinationCard = ({
  destinationPerson,
  loadingTrip,
  loadingAddress,
  errorMessage,
  address,
  onConfirmAddress,
  onRetry,
  onSetLocationOnMap,
}: DestinationCardProps) => {
  const hasError = !loadingAddress && errorMessage.length > 0;

  const handlePressDestination = () => {
    if (hasError) {
      onRetry();
      return;
    }
    onConfirmAddress();
  };

  return (
    <Wrapper>
      {destinationPerson && hasError && (
        <ErrorCard>
          <MaterialIcons
            name="error-outline"
            size={18}
            color={theme.colors.red}
          />
          <ErrorText numberOfLines={2}>{errorMessage}</ErrorText>
        </ErrorCard>
      )}
      {destinationPerson && (
        <CardContainer>
          <Button
            style={{ width: '100%', padding: 5 }}
            onPress={handlePressDestination}
            disabled={loadingAddress}
          >
            <TextEdit color={theme.colors.primaryText} size="medium">
              {loadingAddress
                ? '...'
                : hasError
                  ? translate('trip.try_again')
                  : address}
            </TextEdit>
          </Button>
        </CardContainer>
      )}
      {destinationPerson === false && !loadingTrip && (
        <CardContainer>
          <Button
            style={{ width: '100%', padding: 5 }}
            onPress={onSetLocationOnMap}
          >
            <TextEdit color={theme.colors.primaryText} size="medium">
              {translate('trip.text_set_location_on_map')}
            </TextEdit>
          </Button>
        </CardContainer>
      )}
    </Wrapper>
  );
};
