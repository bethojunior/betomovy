import {StyleSheet, TouchableOpacity} from 'react-native';
import styled from 'styled-components/native';
import {RFValue} from 'react-native-responsive-fontsize';
import theme from '../../styles/theme';

export const ButtonDialog = styled(TouchableOpacity)`
  margin-left: ${RFValue(15)}px;
`;

export const TextButtonDialog = styled.Text`
  font-size: ${RFValue(13)}px;
  font-family: ${({theme}) => theme.fonts.bold};
  color: ${({theme}) => theme.colors.primary};
`;

export const styleDialog = StyleSheet.create({
  container: {
    marginLeft: RFValue(40),
    marginRight: RFValue(40),
    borderRadius: 10,
    backgroundColor: theme.colors.background_global,
    paddingBottom: RFValue(15),
    paddingRight: RFValue(5),
  },
  title: {
    fontSize: RFValue(15),
    fontFamily: theme.fonts.black,
    color: theme.colors.primary,
    marginBottom: RFValue(12),
  },
  text: {
    fontSize: RFValue(14),
    fontFamily: theme.fonts.regular,
    color: theme.colors.secondary,
  },
});
