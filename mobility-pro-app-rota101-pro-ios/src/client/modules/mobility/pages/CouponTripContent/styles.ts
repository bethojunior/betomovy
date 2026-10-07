import {Platform} from 'react-native';
import styled from 'styled-components/native';

export const Container = styled.View`
  flex: 1;
  padding: 0px 20px 0px 20px;
`;

export const Content = styled.View`
  margin-top: ${Platform.OS === 'ios' ? '50px' : '10px'};
  flex: 1;
`;

export const ContainerCoupons = styled.ScrollView`
  margin-top: ${({theme}) => theme.spacing.large}px;
  width: 100%;
  max-height: 400px;
  min-height: 200px;
`;

export const ContainerButton = styled.View`
  margin-bottom: ${({theme}) => theme.spacing.large}px;
`;
