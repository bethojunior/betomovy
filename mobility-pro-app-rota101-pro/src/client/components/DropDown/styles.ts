import styled from 'styled-components/native';
import Icon from '@expo/vector-icons/Entypo';
import {Menu, MenuItem} from 'react-native-material-menu';
import {RFValue} from 'react-native-responsive-fontsize';

type DropdownProps = {
  outlined: boolean;
};

export const Wrapper = styled.TouchableOpacity<DropdownProps>`
  padding: 10px;
  background-color: ${({theme, outlined}) =>
    outlined ? 'transparent' : theme.colors.background_global};
  height: 50px;
  justify-content: center;
  border-radius: 8px;
  border-width: 1.5px;
  border-color: ${({theme, outlined}) =>
    outlined ? 'transparent' : theme.colors.primary};
`;

export const AnchorText = styled.Text`
  font-size: ${RFValue(14)}px;
  font-family: ${({theme}) => theme.fonts.bold};
  color: ${({theme}) => theme.colors.primary};
`;

export const Text = styled.Text`
  width: 100%;
  background-color: red;
`;

export const ChevronDown = styled(Icon).attrs(({theme}) => ({
  name: 'chevron-small-down',
  size: 15,
  color: theme.colors.primary,
}))``;

export const SelectedWrapper = styled.TouchableOpacity`
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
`;

export const MenuForm = styled(Menu)`
  max-height: 400px;
`;

export const ItemWrapper = styled.View`
  background: ${({theme}) => theme.colors.background_global};
`;

export const Item = styled(MenuItem).attrs(({theme}) => ({
  textStyle: {
    fontSize: RFValue(14),
    fontFamily: theme.fonts.bold,
    color: theme.colors.primary,
    backgroundColor: 'transparent',
  },
}))``;
