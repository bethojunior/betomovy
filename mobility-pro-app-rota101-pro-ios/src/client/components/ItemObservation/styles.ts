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
    fontSize: 18,
    color: theme.colors.text_gray,
    marginHorizontal: 5,
    fontWeight: 'bold',
  },
  countDescription: {
    color: theme.colors.text_gray,
    fontSize: 11,
    fontWeight: 'bold',
  },
  buttonObservation: {
    marginTop: 8,
  },
  contentTextContainer: {
    borderWidth: 1.5,
    borderColor: theme.colors.border || '#E0E0E0',
    borderRadius: 8,
    padding: 12,
    backgroundColor: theme.colors.background_white_light || '#FAFAFA',
    minHeight: 50,
    justifyContent: 'center',
  },
  contentText: {
    fontSize: 16,
    color: theme.colors.text_gray || '#333',
    lineHeight: 22,
  },
  placeholderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    width: '100%',
  },
  placeholderText: {
    fontSize: 16,
    color: theme.colors.text_gray || '#999',
    fontStyle: 'italic',
    flex: 1,
    flexShrink: 1,
  },
  containerModal: {
    flex: 1,
    backgroundColor: theme.colors.white,
    padding: 15,
    width: '100%',
  },
  navModal: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textNavModal: {
    fontSize: 16,
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
  textInputContainer: {
    flex: 1,
    paddingHorizontal: 15,
    paddingVertical: 10,
    width: '100%',
  },
  textInput: {
    color: theme.colors.text_gray || theme.colors.black,
    fontSize: 18,
    lineHeight: 24,
    padding: 0,
    margin: 0,
    width: '100%',
    minHeight: 100,
    maxHeight: '100%',
  },
});
