import styled from 'styled-components/native';
import {lighten} from 'polished';
import { RFValue } from 'react-native-responsive-fontsize';

interface ViewedProps {
  viewed: string;
}
interface AlertProps {
  showAlert: boolean;
}

interface LinkProps {
  show: string | null;
}

interface BackgrounColorProps {
  isActive: boolean;
}

export const GeneralContent = styled.View`
  max-height: 500px;
`;

export const Content = styled.View<ViewedProps>`
  background-color: ${({viewed, theme}) =>
    viewed === '1'
      ? theme.colors.background_global
      : lighten(0.9, theme.colors.secondary)};
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  padding: 10px 5px 10px 5px;
  margin-bottom: 5px;
  border-bottom-width: 0.4px;
  border-color: ${({theme}) => theme.colors.primaryText};
  border-radius: 5px;
`;

export const Hearder = styled.View`
  display: flex;
  flex-direction: row;
  width: 100%;
  justify-content: space-between;
  align-items: center;

  border-bottom-width: 0.5px;
  border-bottom-color: ${({theme}) => theme.colors.secondary};
  padding-bottom: 5px;
  margin-bottom: 5px;
`;

export const ContentButtonFilter = styled.View`
  display: flex;
  flex-direction: row;
  margin-top: -5px;
`;

export const Title = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.xlarge}px;
  color: ${({theme}) => theme.colors.secondary};
  margin: 0 0 10px 5px;
`;

export const TextButtonFilter = styled.Text<BackgrounColorProps>`
  color: ${({isActive, theme}) =>
    isActive ? theme.colors.primaryText : theme.colors.secondary};
  font-size: 12px;
`;

export const TextNoNotify = styled.Text`
  padding: 10px;
  margin-top: 15px;
  color: ${({theme}) => theme.colors.secondary};
`;

export const ButtonFilterNew = styled.TouchableOpacity<BackgrounColorProps>`
  padding: 5px;
  background-color: ${({isActive, theme}) =>
    isActive ? theme.colors.primary : lighten(0.6, theme.colors.primary)};
  border-color: ${({isActive, theme}) =>
    isActive ? theme.colors.primary : theme.colors.primary};
  border-width: 0.5px;
  border-top-left-radius: 5px;
  border-bottom-left-radius: 5px;
`;

export const ButtonFilterAll = styled.TouchableOpacity<BackgrounColorProps>`
  padding: 5px;
  background-color: ${({isActive, theme}) =>
    isActive ? lighten(0.6, theme.colors.primary) : theme.colors.primary};
  border-color: ${({isActive, theme}) =>
    isActive ? theme.colors.primary : theme.colors.primary};
  border-width: 0.5px;
  border-top-right-radius: 5px;
  border-bottom-right-radius: 5px;
`;

export const ContentInfo = styled.View`
  width: 100%;
`;

export const ContentButtonNotify = styled.View`
  margin-top: 10px;
  display: flex;
  flex-direction: row;
`;

export const TitleNotify = styled.Text`
  color: ${({theme}) => theme.colors.secondary};
  font-weight: 700;
  margin-left: 10px;
`;

export const Message = styled.Text`
  color: gray;
  width: 70%;
  text-align: justify;
  color: ${({theme}) => theme.colors.secondary};
  margin-left: 10px;
`;

export const LinkButton = styled.TouchableOpacity<LinkProps>`
  display: ${props => (props.show !== null ? 'flex' : 'none')};
  margin-right: 7px;
  padding: 5px;
  border-radius: 5px;
  background-color: ${({theme}) => theme.colors.primary};
`;

export const ReadButton = styled.TouchableOpacity<ViewedProps>`
  display: ${props => (props.viewed === '0' ? 'flex' : 'none')};
  background-color: ${({theme}) => theme.colors.primary};
  padding: 5px;
  border-color: ${({theme}) => theme.colors.primaryText};
  border-radius: 5px;
`;

export const Alert = styled.View<AlertProps>`
  display: ${props => (props.showAlert ? 'flex' : 'none')};
  background-color: red;
  border-radius: 100px;
  width: 8px;
  height: 8px;
  position: absolute;
  top: 0;
  right: ${RFValue(2)}px;
  z-index: 2;
`;

export const IconNotify = styled.Image`
  width: 40px;
  height: 40px;
  border-radius: 100px;
`;
