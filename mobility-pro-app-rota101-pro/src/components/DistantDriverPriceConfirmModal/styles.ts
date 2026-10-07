import {RFValue} from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';
import {Card as CardBase, CardTitle as CardTitleBase} from '../ui/Card';
import {Text} from '../ui/Text';
import theme from '~/client/styles/theme';
import {rgba} from 'polished';

export const ModalContent = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: ${theme.spacing.large}px;
  background-color: ${({theme}) => theme.colors.background_black_light};
`;

export const Card = styled(CardBase)`
  border-radius: ${theme.borderRadius.large}px;
  background-color: ${({theme}) => theme.colors.background_white};
`;

export const CardTitle = styled(CardTitleBase)`
  font-family: ${({theme}) => theme.fonts.secondary_bold};
  font-size: ${({theme}) => theme.fontSizes.large}px;
  color: ${({theme}) => theme.colors.black};
`;

export const Button = styled.TouchableOpacity`
  flex: 1;
  gap: ${theme.spacing.medium}px;
  padding: ${theme.spacing.medium}px;
  border-radius: ${theme.borderRadius.medium}px;
  flex-direction: row;
  align-items: center;
  background-color: ${({theme}) => theme.colors.primary};
`;

export const ButtonText = styled(Text)`
  font-family: ${({theme, font}) => theme.fonts[font ?? 'secondary_bold']};
  font-size: ${({theme, size}) => theme.fontSizes[size ?? 'smalls']}px;
  color: ${({theme}) => theme.colors.primaryText};
`;

export const CardHeader = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
  min-height: ${RFValue(50)}px;
  gap: ${theme.spacing.medium}px;
  padding: ${theme.spacing.large}px ${theme.spacing.xlarge}px;
  border-bottom-width: 1px;
  border-bottom-color: ${({theme}) => theme.colors.border};
`;

export const CardBody = styled.View`
  gap: ${theme.spacing.xlarge}px;
  padding: ${theme.spacing.large}px ${theme.spacing.xlarge}px;
  padding-bottom: 0;
`;

export const Description = styled.Text`
  font-family: ${({theme}) => theme.fonts.secondary_regular};
  font-size: ${({theme}) => theme.fontSizes.medium - 1}px;
  line-height: ${({theme}) => theme.fontSizes.medium + 4}px;
  color: ${({theme}) => theme.colors.text_gray};
`;

export const CardFooter = styled.View`
  flex-direction: row;
  justify-content: space-around;
  padding: ${theme.spacing.xlarge}px;
  gap: ${theme.spacing.medium}px;
`;

export const ButtonOutlined = styled(Button)`
  border-width: 1px;
  border-color: ${({theme}) => theme.colors.border};
  background-color: transparent;
  flex-direction: row;
  align-items: center;
`;

export const ButtonOutlinedText = styled(ButtonText)`
  color: ${({theme}) => theme.colors.black};
`;

export const NewPriceContainer = styled.View`
  align-items: center;
  padding-top: ${theme.spacing.medium}px;
  padding-bottom: ${theme.spacing.small}px;
  border-radius: ${theme.radius.medium}px;
  background-color: ${({theme}) => rgba(theme.colors.yellowStrong, 0.2)};
`;

export const NewPriceTitle = styled.Text`
  font-family: ${({theme}) => theme.fonts.secondary_regular};
  font-size: ${({theme}) => theme.fontSizes.medium - 1}px;
  color: ${({theme}) => theme.colors.text_gray};
`;

export const NewPriceValue = styled.Text`
  font-family: ${({theme}) => theme.fonts.bold};
  font-size: ${({theme}) => theme.fontSizes.xxxlarge}px;
  color: ${({theme}) => theme.colors.secondary};
`;

export const CheckItemsContainer = styled.View`
  gap: ${RFValue(6)}px;
`;

export const CheckItem = styled.View`
  flex-direction: row;
  align-items: center;
  gap: ${RFValue(6)}px;
`;

export const CheckItemLabel = styled.Text`
  font-family: ${({theme}) => theme.fonts.secondary_regular};
  font-size: ${({theme}) => theme.fontSizes.smalls}px;
  color: ${({theme}) => theme.colors.text_gray};
  flex: 1;
`;
