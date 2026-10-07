import {StyleSheet} from 'react-native';
import Colors from '../../components/Colors';
import theme from '../../styles/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  map: {flex: 1},
  header: {
    position: 'absolute',
    display: 'flex',
    flexDirection: 'row',
    width: '100%',
    padding: 5,
    paddingVertical: 10,
    backgroundColor: theme.colors.white,
    elevation: 1,
  },
  simpleAddress: {
    fontSize: 16,
  },
  fullName: {
    fontSize: 14,
    color: theme.colors.text_gray,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    marginBottom: 20,
    padding: 10,
    width: '100%',
  },
  btn: {
    backgroundColor: Colors.PRIMARY,
    alignItems: 'center',
    padding: 10,
    borderRadius: 5,
  },
  btnText: {
    fontSize: 16,
    color: theme.colors.white,
  },
});
