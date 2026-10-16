import styled from 'styled-components/native';
import {RFValue} from 'react-native-responsive-fontsize';

export const Container = styled.View`
  margin-top: ${RFValue(16)}px;
  padding-horizontal: ${RFValue(20)}px;
  align-items: center;
`;

export const SupportText = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.medium}px;
  color: #000;
  text-align: center;
  line-height: ${RFValue(18)}px;
`;

export const SupportLink = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.medium}px;
  color: #007AFF;
  text-decoration-line: underline;
  font-weight: 500;
`;
