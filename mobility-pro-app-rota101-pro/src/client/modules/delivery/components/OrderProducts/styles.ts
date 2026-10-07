import {StyleSheet} from 'react-native';
import theme from '../../../../styles/theme';

export const styles = StyleSheet.create({
  listItens: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  containerItem: {
    display: 'flex',
    flexDirection: 'row',
    marginHorizontal: 15,
    paddingVertical: 20,
    borderColor: theme.colors.border,
    borderBottomWidth: 1,
    alignItems: 'center',
  },
  contentTitleItem: {
    flex: 1,
  },
  titleItem: {
    display: 'flex',
    flexDirection: 'row',
  },
  titleItemText: {
    fontSize: 16,
    flex: 1,
    left: 10,
    marginRight: 25,
  },
  titleAmountItem: {
    fontSize: 16,
  },
  textComplementItem: {
    fontSize: 11,
    color: theme.colors.text_gray,
    marginLeft: 5,
  },
  btnOptionItem: {
    padding: 10,
  },
});
