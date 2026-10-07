import styled from 'styled-components/native';
import {RFValue} from 'react-native-responsive-fontsize';
import {SafeAreaView} from 'react-native-safe-area-context';

export const Content = styled.View`
  flex: 1;
  justify-content: flex-end;
  background-color: ${({theme}) => theme.colors.background_black_light};
`;

export const ModalContent = styled(SafeAreaView)`
  background-color: ${({theme}) => theme.colors.white};
  border-top-left-radius: ${({theme}) => theme.borderRadius.xlarge}px;
  border-top-right-radius: ${({theme}) => theme.borderRadius.xlarge}px;
`;

export const Handle = styled.View`
  align-self: center;
  width: ${RFValue(40)}px;
  height: ${RFValue(4)}px;
  border-radius: ${RFValue(2)}px;
  background-color: ${({theme}) => theme.colors.border};
  margin-top: ${({theme}) => theme.spacing.large}px;
  margin-bottom: ${({theme}) => theme.spacing.large}px;
`;
