import {Platform, StyleSheet, TouchableOpacity} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import styled, {css} from 'styled-components/native';
import themeCss from '../../styles/theme';

export const Container = styled.View`
  flex: 1;
  background-color: ${({theme}) => theme.colors.background_global};
`;

export const Content = styled.ScrollView.attrs({
  showsVerticalScrollIndicator: false,
})`
  flex: 1;
  margin-bottom: ${RFValue(8)}px;
`;

export const ContentButton = styled.View`
  padding-left: ${({theme}) => theme.spacing.xslarge}px;
  padding-right: ${({theme}) => theme.spacing.xslarge}px;
  padding-bottom: ${RFValue(5)}px;
  ${Platform.OS === 'android' &&
  css`
    padding-bottom: ${RFValue(15)}px;
  `}
`;

export const ButtonDialog = styled(TouchableOpacity)`
  margin-left: ${RFValue(15)}px;
`;

export const TextButtonDialog = styled.Text`
  font-size: ${RFValue(13)}px;
  font-family: ${({theme}) => theme.fonts.regular};
  color: ${({theme}) => theme.colors.primary};
`;

export const styleDialog = StyleSheet.create({
  container: {
    marginLeft: RFValue(40),
    marginRight: RFValue(40),
    borderRadius: 10,
    backgroundColor: themeCss.colors.background_global,
    paddingBottom: RFValue(15),
    paddingRight: RFValue(5),
  },
  title: {
    fontSize: RFValue(14),
    fontFamily: themeCss.fonts.regular,
    color: themeCss.colors.primary,
    marginBottom: RFValue(12),
  },
  text: {
    fontSize: RFValue(14),
    fontFamily: themeCss.fonts.regular,
    color: themeCss.colors.secondary,
  },
});
