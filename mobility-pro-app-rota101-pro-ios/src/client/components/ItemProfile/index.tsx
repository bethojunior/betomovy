import Feather from '@expo/vector-icons/Feather';
import theme from '../../styles/theme';
import {Button, Container, ContentText, Item, LabelValue} from './styles';
import {RFValue} from 'react-native-responsive-fontsize';
import { translate } from '../../locales';

interface ItemProfileProps {
  label: string;
  onPress: () => void;
  textValue: string;
  nameIconFeather?: any;
}

export function ItemProfile({
  label,
  onPress,
  textValue,
  nameIconFeather,
}: ItemProfileProps) {
  return (
    <Container noText={!textValue}>
      <ContentText>
        <Item>{label}</Item>
        <Button onPress={onPress}>
          <LabelValue>{textValue}</LabelValue>
          <Feather
            color={theme.colors.secondary}
            name={nameIconFeather || 'edit'}
          />
        </Button>
      </ContentText>
      {!textValue && (
        <Item
          style={{
            color: 'red',
            fontSize: RFValue(10),
          }}
        >
          {' '}
          {translate('paymentDriver.error_required')}{' '}
        </Item>
      )}
    </Container>
  );
}
