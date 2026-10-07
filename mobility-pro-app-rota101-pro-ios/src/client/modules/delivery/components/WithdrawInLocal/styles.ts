import {StyleSheet} from 'react-native';
import theme from '../../../../styles/theme';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white,
    flexDirection: 'row',
    paddingTop: 20,
    paddingBottom: 20,
  },
  container_icon: {
    height: '80%',
  },
  icon: {
    paddingLeft: 10,
  },
  container_information: {
    height: '80%',
    overflow: 'scroll',
    width: '80%',
    marginLeft: 10,
  },
  withdrawal_label: {
    color: theme.colors.text_gray,
    fontSize: 12,
    marginBottom: 5,
  },
  withdrawal_address: {
    fontSize: 16,
  },
});
