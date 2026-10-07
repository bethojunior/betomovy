import {Button} from 'react-native-paper';
import styled from 'styled-components/native';

export const ButtonOk = styled(Button)`
  width: 100%;
  padding: ${({theme}) => theme.spacing.small}px;
  border-radius: ${({theme}) => theme.borderRadius.medium}px;
`;

export const ContainerText = styled.View`
  border-bottom-width: 0.5px;
  padding-bottom: 5px;
  border-bottom-color: ${({theme}) => theme.colors.border};
`;
