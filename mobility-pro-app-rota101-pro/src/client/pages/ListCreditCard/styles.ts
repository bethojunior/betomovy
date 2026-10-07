import {StyleSheet} from 'react-native';
import theme from '../../styles/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  buttonAddCard: {
    width: '100%',
    padding: 10,
    marginVertical: 20,
  },
  textAddCard: {
    width: '100%',
    textAlign: 'center',
    fontWeight: '600',
    fontSize: 14,
  },
  containerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  buttonCard: {
    flex: 1,
    padding: 15,
  },
  textItemCard: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  optionItemCard: {
    padding: 15,
  },
});
