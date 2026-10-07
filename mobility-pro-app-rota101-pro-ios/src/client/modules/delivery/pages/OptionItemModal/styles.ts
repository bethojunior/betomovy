import {StyleSheet} from 'react-native';
import Colors from '../../../../components/Colors';
import theme from '../../../../styles/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background_black_light,
    justifyContent: 'flex-end',
  },
  overlayModal: {
    flex: 1,
    backgroundColor: theme.colors.background_black_light,
  },
  modalView: {
    backgroundColor: theme.colors.white,
    paddingHorizontal: 15,
    paddingVertical: 15,
  },
  textDescription: {
    fontSize: 20,
    textAlign: 'center',
    padding: 15,
    marginBottom: 5,
    borderBottomColor: theme.colors.border,
    borderBottomWidth: 1,
  },
  btnOptionItem: {
    borderBottomWidth: 1,
    borderColor: theme.colors.border,
    padding: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  btnOptionItemText: {
    color: Colors.PRIMARY,
    fontSize: 18,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
});
