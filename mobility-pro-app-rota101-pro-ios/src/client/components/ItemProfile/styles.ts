import {RFValue} from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

export const Container = styled.View<{noText?: boolean}>`
  flex-direction: column;
  align-items: flex-end;
  width: 100%;
  padding-top: ${RFValue(15)}px;
  padding-bottom: ${RFValue(15)}px;
  border-bottom-width: ${({theme}) => theme.borderWidth.small}px;
  border-bottom-color: ${({theme}) => theme.colors.border};
`;

export const ContentText = styled.View`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`;

export const Item = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.medium}px;
  font-family: ${({theme}) => theme.fonts.regular};
  color: ${({theme}) => theme.colors.secondary};
`;

export const Button = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
`;

export const LabelValue = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.medium}px;
  color: ${({theme}) => theme.colors.secondary};
  font-family: ${({theme}) => theme.fonts.regular};
  margin-right: ${RFValue(10)}px;
`;
