import {shade} from 'polished';
import {StyleSheet} from 'react-native';
import styled from 'styled-components/native';
import themeCss from '../../styles/theme';

export const HeaderOrderText = styled.Text`
  font-weight: bold;
  font-size: 18px;
  color: ${({theme}) => theme.colors.secondary};
`;

export const SimpleText = styled.Text`
  color: ${({theme}) => theme.colors.secondary};
`;

export const styles = StyleSheet.create({
  headerOrder: {
    padding: 10,
    backgroundColor: shade(0.05, themeCss.colors.background_global),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  containerItem: {
    borderBottomColor: themeCss.colors.border,
    borderBottomWidth: 1,
    paddingVertical: 15,
    justifyContent: 'center',
    marginHorizontal: 10,
  },
  dataItem: {
    flexDirection: 'row',
    marginVertical: 5,
  },
  descriptionItem: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center',
  },
  containerQuantityItem: {
    backgroundColor: themeCss.colors.border,
    borderRadius: 5,
    width: 30,
    height: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 15,
  },
  nameItemText: {
    fontSize: 14,
  },
  priceItem: {
    fontSize: 14,
    fontWeight: '500',
  },
});
