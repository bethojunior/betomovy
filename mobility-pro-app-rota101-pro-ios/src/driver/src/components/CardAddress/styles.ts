import {shade} from 'polished';
import styled from 'styled-components/native';

export const Container = styled.TouchableOpacity`
  flex-direction: row;
  align-items: center;
  width: 100%;
  padding: ${({theme}) => theme.spacing.medium}px;
  margin-bottom: ${({theme}) => theme.spacing.small}px;
  border: 0.5px solid ${({theme}) => shade(0.2, theme.colors.secondary)};
  border-radius: ${({theme}) => theme.borderRadius.small}px;
`;

export const ContainerText = styled.View`
  padding-left: ${({theme}) => theme.spacing.medium}px;
  padding-right: ${({theme}) => theme.spacing.medium}px;
`;
