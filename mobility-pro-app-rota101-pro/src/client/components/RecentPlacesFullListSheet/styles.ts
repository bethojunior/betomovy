import {RFValue} from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

export const Title = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.large}px;
  font-weight: 700;
  color: ${({theme}) => theme.colors.secondary};
  margin-bottom: ${({theme}) => theme.spacing.medium}px;
  padding: 0 ${({theme}) => theme.spacing.xlarge}px;
`;

export const ListCard = styled.View`
  background-color: ${({theme}) => theme.colors.background_white};
  border-radius: ${({theme}) => theme.borderRadius.large}px;
  margin: 0 ${({theme}) => theme.spacing.xlarge}px;
  padding: 0 ${({theme}) => theme.spacing.medium}px;
`;

export const List = styled.ScrollView`
  max-height: ${RFValue(420)}px;
`;

export const EmptyText = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.medium}px;
  color: ${({theme}) => theme.colors.text_gray};
  padding: ${({theme}) => theme.spacing.large}px ${({theme}) => theme.spacing.xlarge}px;
`;
