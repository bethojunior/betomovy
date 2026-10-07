import {StyleSheet} from 'react-native';
import Colors from '../../components/Colors';
import theme from '../../styles/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    height: '25%',
    width: '100%',
  },
  map: {
    flex: 1,
  },
  btnBack: {
    position: 'absolute',
    zIndex: 1,
  },
  content: {
    flex: 1,
    backgroundColor: theme.colors.white,
    paddingHorizontal: 15,
  },
  simpleAddress: {
    fontSize: 16,
  },
  fullName: {
    fontSize: 14,
    color: theme.colors.text_gray,
    marginBottom: 15,
  },
  contentInputs: {
    display: 'flex',
    flexDirection: 'row',
    marginVertical: 10,
  },
  textInput: {
    marginLeft: 10,
    color: theme.colors.text_gray,
    fontWeight: 'bold',
    fontSize: 16,
  },
  btnSaveAddress: {
    backgroundColor: Colors.PRIMARY,
    alignItems: 'center',
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  btnSaveAddressText: {
    color: theme.colors.primaryText,
    fontSize: 16,
  },
});
