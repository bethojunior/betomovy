import {StyleSheet} from 'react-native';
import theme from '../../../../styles/theme';

export const styles = StyleSheet.create({
  contentGroup: {
    padding: 20,
    backgroundColor: theme.colors.background_white,
  },
  nameGroup: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  contentRequiredItem: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  textAmountItem: {
    fontSize: 12,
    color: theme.colors.text_gray,
  },
  tagRequired: {
    backgroundColor: theme.colors.icon_gray,
    borderRadius: 2,
    paddingHorizontal: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  tagRequiredText: {
    fontSize: 8,
    color: theme.colors.white,
  },
  contentComplementOption: {
    paddingHorizontal: 20,
  },
  complementItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.background_white,
    flexDirection: 'row',
  },
  complementItemText: {
    fontSize: 13,
    fontWeight: 'bold',
    color: theme.colors.text_gray,
  },
  complementItemPrice: {
    fontSize: 11,
    color: theme.colors.text_gray,
  },
  containerOptionQuantity: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  textOptionQuantity: {
    fontSize: 20,
    marginHorizontal: 10,
    width: 35,
    textAlign: 'center',
  },
});
