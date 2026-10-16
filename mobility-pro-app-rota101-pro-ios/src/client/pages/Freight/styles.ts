import {RFValue} from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  align-items: center;
  justify-content: center;
  padding: ${({theme}) => theme.spacing.xlarge}px;
  background-color: ${({theme}) => theme.colors.background_global};
`;

export const IconCircle = styled.View`
  width: ${RFValue(96)}px;
  height: ${RFValue(96)}px;
  border-radius: ${RFValue(48)}px;
  align-items: center;
  justify-content: center;
  background-color: ${({theme}) => `${theme.colors.primary}1A`};
  margin-bottom: ${({theme}) => theme.spacing.large}px;
`;

export const Title = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.large}px;
  font-weight: 700;
  color: ${({theme}) => theme.colors.secondary};
  text-align: center;
  margin-bottom: ${({theme}) => theme.spacing.small}px;
`;

export const Subtitle = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.medium}px;
  color: ${({theme}) => theme.colors.text_gray};
  text-align: center;
  line-height: ${RFValue(20)}px;
  margin-bottom: ${({theme}) => theme.spacing.xlarge}px;
`;

export const BackButton = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  gap: ${({theme}) => theme.spacing.small}px;
  padding: ${({theme}) => theme.spacing.medium}px ${({theme}) => theme.spacing.large}px;
  border-radius: ${({theme}) => theme.borderRadius.large}px;
  background-color: ${({theme}) => theme.colors.primary};
`;

export const BackButtonText = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.medium}px;
  font-weight: 600;
  color: ${({theme}) => theme.colors.primaryText};
`;
