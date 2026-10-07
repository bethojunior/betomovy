import {shade} from 'polished';
import {StyleSheet} from 'react-native';
import theme from '../../../../styles/theme';

export const styles = StyleSheet.create({
  container: {
    borderRadius: 5,
    padding: 20,
    margin: 10,
    borderWidth: 2,
    borderColor: theme.colors.border,
  },
  label: {
    fontWeight: 'bold',
    fontSize: 16,
  },
  contentCode: {
    flexDirection: 'row',
    backgroundColor: shade(0.05, theme.colors.background_global),
    padding: 10,
    marginTop: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textCode: {
    fontSize: 22,
    marginLeft: 5,
    fontWeight: 'bold',
  },
});
