import {StyleSheet} from 'react-native';
import theme from '../../styles/theme';
import Colors from '../Colors';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    elevation: 5,
    paddingVertical: 15,
    paddingHorizontal: 15,
    backgroundColor: theme.colors.white,
    justifyContent: 'space-between',
    alignItems: 'center',
    margin: 10,
    borderRadius: 5,
  },
  message: {
    fontWeight: 'bold',
  },
  textButton: {
    color: theme.colors.border_green,
    fontWeight: 'bold',
    padding: 5,
  },
  containerModal: {
    backgroundColor: theme.colors.black,
    flex: 1,
    justifyContent: 'flex-end',
  },
  contentModal: {
    backgroundColor: theme.colors.white,
    padding: 10,
    paddingVertical: 20,
    borderTopLeftRadius: 5,
    borderTopRightRadius: 5,
  },
  title: {
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  button: {
    backgroundColor: Colors.PRIMARY,
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
    alignItems: 'center',
  },
  textColor: {
    color: theme.colors.white,
    fontSize: 18,
  },
  containerRated: {
    padding: 10,
    margin: 10,
    borderColor: theme.colors.border_green,
    borderWidth: 2,
    borderRadius: 5,
    alignItems: 'center',
  },
  textRated: {
    fontWeight: 'bold',
    color: theme.colors.border_green,
    fontSize: 12,
    textTransform: 'uppercase',
  },
});
