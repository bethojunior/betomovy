import Feather from '@expo/vector-icons/Feather';
import Ionicons from '@expo/vector-icons/Ionicons';
import {useTheme} from 'styled-components/native';
import {RFValue} from 'react-native-responsive-fontsize';
import {translate} from '../../locales';
import {ItemProfileProps} from './types';
import {
  Button,
  Container,
  ContentText,
  Item,
  LabelValue,
  RequiredContainer,
  RequiredLabel,
  TextGroup,
} from './styles';

export function ItemProfile({
  label,
  onPress,
  textValue,
  icon,
  nameIconFeather,
  isLast,
}: ItemProfileProps) {
  const theme = useTheme();

  return (
    <Container isLast={isLast}>
      <ContentText>
        {icon && (
          <Ionicons name={icon} size={RFValue(18)} color={theme.colors.icon_gray} />
        )}

        <TextGroup>
          <Item>{label}</Item>
          {!textValue && (
            <RequiredContainer>
              <Feather name="alert-circle" size={RFValue(11)} color={theme.colors.red} />
              <RequiredLabel>{translate('paymentDriver.error_required')}</RequiredLabel>
            </RequiredContainer>
          )}
        </TextGroup>

        <Button onPress={onPress} activeOpacity={0.7}>
          <LabelValue numberOfLines={1}>{textValue}</LabelValue>
          <Feather
            color={theme.colors.grayLight}
            size={RFValue(15)}
            name={nameIconFeather || 'edit-2'}
          />
        </Button>
      </ContentText>
    </Container>
  );
}
