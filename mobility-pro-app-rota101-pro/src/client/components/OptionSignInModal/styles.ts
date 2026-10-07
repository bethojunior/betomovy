import {StyleSheet} from 'react-native';
import theme from '../../styles/theme';

export const styles = StyleSheet.create({
  containerModal: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: theme.colors.background_black_light,
  },
  contentModal: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    backgroundColor: theme.colors.white,
    padding: 20,
  },
  optionButton: {
    padding: 10,
    borderWidth: 1,
    borderColor: theme.colors.black,
    borderRadius: 5,
    marginVertical: 5,
    alignItems: 'center',
  },
  optionTextButton: {
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  optionButtonCancel: {
    borderWidth: 0,
  },
  optionButtonCancelText: {
    color: theme.colors.text_gray,
  },
});
