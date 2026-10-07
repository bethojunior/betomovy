import {Dimensions, StyleSheet} from 'react-native';
import theme from '../../styles/theme';

const windowWidth = Dimensions.get('window').width;

export const styles = StyleSheet.create({
  container: {flex: 1},
  containerCategory: {
    flex: 1,
  },
  contentCategory: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  boxCategory: {
    height: 100,
    width: windowWidth / 2 - 30,
    margin: 15,
  },
  boxShadowCategory: {
    flex: 1,
    backgroundColor: theme.colors.background_black_light,
    borderRadius: 10,
    padding: 10,
  },
  textCategory: {
    color: theme.colors.white,
    fontWeight: 'bold',
    fontSize: 16,
  },
  contentItem: {
    flex: 1,
    marginLeft: 10,
  },
  nameItem: {
    // fontSize: 14,
    fontSize: 16,
  },
  detailsItem: {
    fontSize: 14,
    color: theme.colors.text_gray,
  },
  estimativeItem: {
    fontSize: 12,
    color: theme.colors.text_gray,
  },
  logoItem: {
    width: 100,
    height: 100,
  },
  containerItem: {
    display: 'flex',
    flexDirection: 'row',
    borderColor: theme.colors.border,
    borderWidth: 1,
    padding: 5,
    marginVertical: 5,
    borderRadius: 10,
    backgroundColor: theme.colors.white,
    marginHorizontal: 10,
  },
  banner: {
    width: windowWidth - 20,
    height: 120,
    marginVertical: 10,
    marginHorizontal: 10,
  },
  labelError: {
    textAlign: 'center',
    color: theme.colors.text_gray,
    marginTop: 10,
  },
  containerLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textRating: {
    alignItems: 'center',
    flexDirection: 'row',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  contentFilter: {
    backgroundColor: theme.colors.white,
    elevation: 1,
    paddingHorizontal: 10,
    paddingBottom: 10,
  },
  buttonFilter: {
    backgroundColor: theme.colors.black,
    borderRadius: 5,
    width: '40%',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 5,
  },
  contentFilterModal: {
    backgroundColor: theme.colors.white,
    flex: 1,
  },
  btnItemFilter: {
    borderRadius: 5,
    alignItems: 'center',
    padding: 10,
    margin: 10,
    borderWidth: 2,
    borderColor: theme.colors.border,
    opacity: 0.75,
  },
  btnItemFilterActive: {
    opacity: 1,
    backgroundColor: theme.colors.background_greenLight,
    borderColor: theme.colors.border_green,
  },
  btnFilter: {
    alignItems: 'center',
    padding: 10,
    borderRadius: 5,
    backgroundColor: theme.colors.black,
    margin: 10,
  },
});
