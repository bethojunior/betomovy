import {FlatList, FlatListProps} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import styled from 'styled-components/native';
import {IndicatorList} from '../../context/userDriver/types';

export const Container = styled.View`
  flex: 1;
  background: ${({theme}) => theme.colors.background_global};
`;

export const Title = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.medium}px;
  font-family: ${({theme}) => theme.fonts.bold};
  color: ${({theme}) => theme.colors.secondary};
  margin-top: ${RFValue(10)}px;
  margin-right: ${RFValue(10)}px;
  text-align: right;
`;

export const IndicatorListData = styled(
  FlatList as new (
    props: FlatListProps<IndicatorList>,
  ) => FlatList<IndicatorList>,
).attrs({
  showsVerticalScrollIndicator: false,
})`
  margin-top: ${RFValue(20)}px;
`;

export const NotFavorites = styled.Text`
  font-size: ${({theme}) => theme.fontSizes.medium}px;
  font-family: ${({theme}) => theme.fonts.regular};
  color: ${({theme}) => theme.colors.secondary};
  margin-top: ${RFValue(15)}px;
  text-align: center;
`;
