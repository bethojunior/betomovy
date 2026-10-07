import {StyleSheet} from 'react-native';
import theme from '../../styles/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.white,
  },
  containerNav: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.white,
  },
  containerButtonNav: {
    paddingVertical: 10,
    paddingHorizontal: 20,
  },
  titleNav: {
    fontWeight: 'bold',
    fontSize: 14,
  },
  labelNav: {
    color: theme.colors.text_gray,
    fontSize: 11,
  },
  content: {
    flex: 1,
  },
  inputFooter: {
    flex: 1,
  },
  containerFooter: {
    backgroundColor: theme.colors.background_white_light,
    borderRadius: 25,
    paddingHorizontal: 10,
    paddingVertical: 5,
    marginHorizontal: 10,
    marginBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  containerMessageSent: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginVertical: 10,
  },
  containerMessageReceived: {
    justifyContent: 'flex-start',
  },
  contentMessage: {
    maxWidth: '80%',
    padding: 20,
    marginHorizontal: 10,
    backgroundColor: theme.colors.background_white_light,
    borderRadius: 10,
  },
});
