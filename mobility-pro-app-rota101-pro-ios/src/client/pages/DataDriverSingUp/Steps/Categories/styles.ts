import {FlatList, FlatListProps, Platform} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import styled, {css} from 'styled-components/native';
import {CategoryDriver} from '../../../../../context/auth/types';

export const Container = styled.View`
  flex: 1;
`;

export const CategoryList = styled(
  FlatList as new (
    props: FlatListProps<CategoryDriver>,
  ) => FlatList<CategoryDriver>,
).attrs({
  contentContainerStyle: {
    paddingLeft: 20,
    paddingRight: 20,
    marginTop: 20,
    paddingBottom: 20,
  },
  showsVerticalScrollIndicator: false,
})`
  ${Platform.OS === 'android' &&
  css`
    margin-bottom: ${RFValue(30)}px;
  `}
`;
