import {shade} from 'polished';
import {RFValue} from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';

interface PropsInput {
  disabled?: boolean;
  backgroundColor?: string;
}

export const AddressList = styled.FlatList``;

export const AddressItemContent = styled.TouchableOpacity`
  border: 1px solid transparent;
  border-bottom-color: ${({theme}) => theme.colors.border};
  padding: 15px 10px;
  flex-direction: row;
  margin-bottom: ${RFValue(5)}px;
`;

export const ButtonSearch = styled.TouchableOpacity<PropsInput>`
  background-color: ${({theme, disabled, backgroundColor}) =>
    !disabled
      ? backgroundColor
        ? backgroundColor
        : theme.colors.primary
      : shade(0.3, theme.colors.background_white_light)};
  padding: 10px;

  align-items: center;
  justify-content: center;
`;

export const ButtonAddress = styled.TouchableOpacity<PropsInput>`
  padding: 10px;
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

export const AddressText = styled.Text`
  flex: 1;
  font-size: 16px;
  font-weight: bold;
  color: ${({theme}) => theme.colors.secondary};
  margin-left: 10px;
`;

export const ButtonBack = styled.TouchableOpacity`
  margin: 10px 10px 0;
  max-width: 8%;
`;

export const ButtonMic = styled.TouchableOpacity`
  align-self: center;
  margin-left: 10px;
`;

export const Container = styled.View`
  flex-direction: row;
  background-color: ${({theme}) => theme.colors.background_global};
  width: 100%;
  padding: 10px 0;
  margin-bottom: 5px;
  border: 1px solid transparent;
  border-bottom-color: ${({theme}) => theme.colors.border};
`;

export const Input = styled.TextInput.attrs(({theme}) => ({}))<PropsInput>`
  background-color: ${({theme, disabled}) =>
    !disabled
      ? theme.colors.background_white_light
      : shade(0.3, theme.colors.background_white_light)};
  padding: 8px;
  border-radius: 5px;
  width: 75%;
`;

export const ShowMoreContent = styled.View`
  align-items: center;
  justify-content: center;
  padding: 2px 0px;
`;

export const ShowMoreButton = styled.Pressable`
  background-color: ${({theme}) => theme.colors.primary};
  align-items: center;
  justify-content: center;
  padding: 15px;
  border-radius: 5px;
  margin-bottom: ${RFValue(5)}px;
`;

export const ShowMoreText = styled.Text`
  font-weight: 700;
  color: ${({theme}) => theme.colors.primaryText};
  text-transform: uppercase;
`;

export const EmptyListText = styled.Text`
  text-align: center;
  color: ${({theme}) => theme.colors.secondary};
  padding: 16px;
`;

export const EmptyListContainer = styled.View`
  flex-direction: row;
  align-items: center;
  justify-content: center;
`;

export const Loading = styled.ActivityIndicator.attrs(({theme}) => ({
  size: 'large',
  color: theme.colors.black,
}))`
  margin-top: 13px;
`;
