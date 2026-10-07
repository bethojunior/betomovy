import {StyleSheet} from 'react-native';
import theme from '../../../../styles/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
  },
  image: {
    height: 300,
  },
  label: {
    textAlign: 'center',
  },
  button: {
    width: '90%',
    padding: 15,
    borderRadius: 5,
    margin: 10,
    borderWidth: 2,
    marginTop: 30,
  },
  buttonView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    color: theme.colors.black,
    fontWeight: 'bold',
  },
});
