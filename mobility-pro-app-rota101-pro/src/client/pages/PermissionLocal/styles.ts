import {StyleSheet} from 'react-native';
import theme from '../../styles/theme';

export const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.colors.white,
    height: '100%',
    width: '100%',
    paddingHorizontal: 10,
    alignSelf: 'center',
    paddingTop: 20,
    paddingBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
  },
  icon: {
    width: 140,
    height: 140,
    alignSelf: 'center',
    margin: 30,
  },
  subTitle: {
    fontWeight: 'bold',
    alignSelf: 'center',
    textAlign: 'center',
    fontSize: 15,
  },
  contentText: {
    display: 'flex',
    maxHeight: '30%',
    alignSelf: 'center',
    marginVertical: 20,
    marginHorizontal: 10,
  },
  text: {
    fontSize: 15,
    padding: 10,
    textAlign: 'justify',
  },
  buttonContent: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 20,
  },
  button: {
    color: theme.colors.background_blue_light,
    fontSize: 15,
  },
});
