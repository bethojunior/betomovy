import {StyleSheet} from 'react-native';
import Colors from '../../components/Colors';
import theme from '../../styles/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
  list: {
    flex: 1,
  },
  containerItem: {
    backgroundColor: theme.colors.white,
    padding: 15,
    borderRadius: 5,
    margin: 10,
  },
  groupDescription: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  valueText: {
    fontSize: 24,
    fontWeight: '900',
  },
  smallInfo: {
    color: theme.colors.icon_gray,
    fontSize: 11,
  },
  itemActive: {
    borderColor: Colors.PRIMARY,
    borderWidth: 2,
  },
});
