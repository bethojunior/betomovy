import {lighten, shade} from 'polished';
import {TextInputMask} from 'react-native-masked-text';
import {RFValue} from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

interface PropsTip {
  selected?: boolean;
}

export const Container = styled.View`
  width: 100%;
  padding: 0 ${({theme}) => theme.spacing.large}px;
  margin: ${({theme}) => theme.spacing.large}px 0;
  elevation: 5;
`;

export const Header = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

export const ContainerColumn = styled.View`
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;

export const Image = styled.Image`
  width: ${RFValue(50)}px;
  height: ${RFValue(50)}px;
  border-radius: ${RFValue(25)}px;
`;

export const ContainerTips = styled.View`
  flex-direction: row;
  justify-content: space-between;
`;

export const ButtonTip = styled.TouchableOpacity<PropsTip>`
  border: 1px solid
    ${({theme, selected}) =>
      !selected ? theme.colors.primary : shade(0.2, theme.colors.border_green)};
  background-color: ${({theme, selected}) =>
    !selected ? 'transparent' : shade(0.2, theme.colors.primary)};
  border-radius: ${({theme}) => theme.borderRadius.medium}px;
  padding: 10px;
  margin: ${({theme}) => theme.spacing.medium}px 0;
`;

export const InputMask = styled(TextInputMask)`
  border: 1px solid ${({theme}) => theme.colors.primary};
  border-radius: ${({theme}) => theme.borderRadius.small}px;
  padding: 10px;
  width: 100%;
  margin: ${({theme}) => theme.spacing.medium}px 0;
`;

export const ButtonNegociate = styled.TouchableOpacity`
  width: 100%;
  padding: ${({theme}) => theme.spacing.medium}px;
  margin-top: ${({theme}) => theme.spacing.medium}px;
  border-radius: 10px;

  border: 1px solid ${({theme}) => theme.colors.primary};
  border-radius: ${({theme}) => theme.borderRadius.medium}px;
  padding: 10px;
  margin: ${({theme}) => theme.spacing.medium}px 0;

  align-items: center;
  background-color: transparent;
`;

export const ButtonSend = styled.TouchableOpacity`
  width: 100%;
  padding: ${({theme}) => theme.spacing.medium}px;
  border-radius: 10px;
  align-items: center;
  background-color: ${({theme}) => theme.colors.primary};
  shadow-color: #000;
  shadow-offset: 0px 2px;
  shadow-opacity: 0.25;
  shadow-radius: 3.84px;
  elevation: 5;
`;
