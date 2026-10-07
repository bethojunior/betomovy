import {StyleSheet} from 'react-native';
import styled from 'styled-components/native';
import themeCss from '../../styles/theme';

export const ItemPlace = styled.View`
  padding: 15px;
  border-bottom-width: 1px;
  border-bottom-color: ${({theme}) => theme.colors.border};
  background-color: ${({theme}) => theme.colors.background_global};
`;

export const ListPlace = styled.ScrollView`
  background-color: ${({theme}) => theme.colors.background_global};
`;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listPlace: {
    flex: 1,
    backgroundColor: themeCss.colors.background_white_light,
  },
  itemPlace: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: themeCss.colors.border,
    backgroundColor: themeCss.colors.white,
  },
  simpleName: {
    fontSize: 18,
  },
  fullAddress: {
    fontSize: 14,
    color: themeCss.colors.text_gray,
  },
});
