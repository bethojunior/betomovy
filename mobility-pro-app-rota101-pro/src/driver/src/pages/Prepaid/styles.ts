import {FlatList, FlatListProps, Platform} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import styled, {css} from 'styled-components/native';
import {PrepaidProps} from '../../context/prepaid/types';

export const Container = styled.View`
  flex: 1;
  background: ${({theme}) => theme.colors.background_global};
`;

export const ContentImage = styled.View`
  align-items: center;
`;

export const CardContent = styled(
  FlatList as new (
    props: FlatListProps<PrepaidProps>,
  ) => FlatList<PrepaidProps>,
).attrs({
  showsVerticalScrollIndicator: false,
  contentContainerStyle: {
    alignItems: 'center',
    flexGrow: 1,
  },
})`
  width: 100%;
  padding-left: ${RFValue(20)}px;
  padding-right: ${RFValue(20)}px;
  padding-top: ${RFValue(30)}px;
`;

export const Logo = styled.Image.attrs({
  resizeMode: 'stretch',
})`
  height: ${RFValue(130)}px;
  width: ${RFValue(130)}px;
  margin-bottom: ${RFValue(26)}px;
`;

export const NotPrepaid = styled.Text`
  font-size: ${RFValue(16)}px;
  font-family: ${({theme}) => theme.fonts.bold};
  color: ${({theme}) => theme.colors.primary};
  text-align: center;
  margin-top: ${RFValue(40)}px;
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
