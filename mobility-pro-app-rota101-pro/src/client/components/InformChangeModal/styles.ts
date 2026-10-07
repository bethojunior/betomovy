import {StyleSheet} from 'react-native';
import theme from '../../styles/theme';
import Colors from '../Colors';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.black,
    justifyContent: 'flex-end',
  },
  content: {
    paddingVertical: 20,
    paddingHorizontal: 50,
    backgroundColor: theme.colors.white,
    alignItems: 'center',
  },
  title: {
    fontSize: 18,
    fontWeight: '400',
    marginBottom: 10,
  },
  label: {
    textAlign: 'center',
    fontSize: 14,
    color: theme.colors.icon_gray,
  },
  input: {
    width: '100%',
    backgroundColor: theme.colors.white_light,
    marginVertical: 10,
    marginBottom: 30,
    borderRadius: 5,
    fontSize: 20,
    textAlign: 'center',
  },
  button: {
    width: '100%',
    borderRadius: 5,
    padding: 10,
    backgroundColor: Colors.PRIMARY,
    alignItems: 'center',
  },
  textButton: {
    color: theme.colors.primaryText,
    fontSize: 16,
  },
});
