import {StyleSheet} from 'react-native';
import theme from '../../styles/theme';
import Colors from '../Colors';

export const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderTopColor: theme.colors.border_white_light,
    borderTopWidth: 1,
  },
  contentDescription: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  contentTextDescription: {
    flexDirection: 'row',
  },
  textDescription: {
    fontSize: 12,
    color: theme.colors.text_gray,
    marginHorizontal: 5,
    fontWeight: 'bold',
  },
  countDescription: {
    color: theme.colors.text_gray,
    fontSize: 11,
    fontWeight: 'bold',
  },
  contentText: {
    borderWidth: 1,
    borderColor: theme.colors.border,
    fontSize: 11,
    color: theme.colors.text_gray,
    fontWeight: 'bold',
    padding: 5,
    paddingVertical: 10,
    borderRadius: 5,
  },
  containerModal: {
    flex: 1,
    backgroundColor: theme.colors.white,
    padding: 15,
  },
  navModal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textNavModal: {
    fontSize: 12,
    color: theme.colors.text_gray,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    position: 'absolute',
    width: '100%',
  },
  countNavModal: {
    fontSize: 10,
    color: theme.colors.text_gray,
    textAlign: 'center',
  },
  btnSaveObservation: {
    backgroundColor: Colors.PRIMARY,
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
  },
});
