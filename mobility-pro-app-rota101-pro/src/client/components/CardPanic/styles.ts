import {MotiView} from 'moti';
import {Platform} from 'react-native';
import styled from 'styled-components/native';
import theme from '../../styles/theme';

export const ContainerCardColumn = styled(MotiView)`
  flex-direction: column;
  align-items: center;
  height: 100%;
  width: 100%;
  border-top-left-radius: 25px;
  border-top-right-radius: 25px;
  z-index: 1;
  padding: 0 ${theme.spacing.xlarge}px;
  background-color: ${({theme}) => theme.colors.background_global};
`;

export const CallIcon = styled.TouchableOpacity`
  flex-direction: row-reverse;
  margin-top: ${theme.spacing.xlarge}px;
  margin-bottom: ${theme.spacing.large}px;
  background-color: ${({theme}) => theme.colors.primary};
  padding: 15px;
  border-radius: 10px;
`;
