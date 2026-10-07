import styled, {css} from 'styled-components/native';
import {Platform} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {Button} from 'react-native-paper';

export const Content = styled.View`
  flex-direction: row;
  align-items: flex-end;
  justify-content: space-between;
`;

export const Title = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.xxxlarge}px;
  color: ${({theme}) => theme.colors.secondary};
`;

export const SubTitle = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.small}px;
  color: ${({theme}) => theme.colors.secondary};
`;

export const ContentPicker = styled.View`
  ${Platform.OS === 'ios' &&
  css`
    margin-top: 10px;
    padding: 25px 0;
    overflow: hidden;
  `}
`;

export const ContentSelectCard = styled.View`
  ${Platform.OS === 'ios' &&
  css`
    margin-top: ${RFValue(12)}px;
  `}
`;

export const ContainerCard = styled.View`
  flex-direction: column;
  width: 100%;
`;

export const ContentButton = styled(Button)`
  flex-direction: row;
`;
