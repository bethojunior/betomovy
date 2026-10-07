import styled from 'styled-components/native';
import {Button as BaseButton} from '~/client/components/Button';
import {RFValue} from 'react-native-responsive-fontsize';

export const Container = styled.View`
  flex: 1;
  padding: 20px;
  background-color: ${({theme}) => theme.colors.background_global};
`;

export const Content = styled.View`
  border_bottom_color: ${({theme}) => theme.colors.secondary};
  border_bottom_width: 0.5px;
  padding_bottom: 10px;
`;

export const Title = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.medium}px;
  color: ${({theme}) => theme.colors.secondary};
  font-weight: bold;
  margin-top: 10px;
`;

export const Button = styled(BaseButton).attrs(props => ({
  textSize: 12,
  ...props,
}))`
  height: ${RFValue(32)}px;
  margin-top: 10px;
`;

export const CardPaymentForm = styled.View`
  display: flex;
  flex-direction: row;
  margin-left: 10px;
  margin-top: 10px;
  align-items: center;
  padding: 1px;
`;

export const Icon = styled.Image`
  width: 30px;
  height: 30px;
`;

export const TextPaymentType = styled.Text`
  margin-left: 10px;
  color: ${({theme}) => theme.colors.secondary};
`;

export const SimpleText = styled.Text`
  color: ${({theme}) => theme.colors.secondary};
`;
