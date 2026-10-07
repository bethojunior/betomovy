import {shade} from 'polished';
import {Dimensions, StyleSheet} from 'react-native';
import Colors from '../../../../components/Colors';
import theme from '../../../../styles/theme';

const windowWidth = Dimensions.get('window').width;

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background_global,
  },
  containerScroll: {
    flex: 1,
    backgroundColor: theme.colors.background_global,
  },
  logo: {
    height: 200,
    width: windowWidth - 20,
    marginVertical: 5,
    borderRadius: 5,
    marginHorizontal: 10,
  },
  content: {
    marginHorizontal: 10,
  },
  containerAddItem: {
    marginTop: 20,
  },
  descriptionItem: {
    marginVertical: 10,
    color: theme.colors.text_gray,
  },
  priceItem: {
    fontSize: 13,
    marginBottom: 20,
  },
  footer: {
    borderTopColor: theme.colors.border,
    borderTopWidth: 1,
    backgroundColor: shade(0.03, theme.colors.background_global),
    bottom: 0,
    padding: 10,
    display: 'flex',
    flexDirection: 'row',
  },
  btnContainerAddItem: {
    flex: 1,
  },
  btnAddItem: {
    flex: 1,
    borderRadius: 5,
    marginLeft: 5,
    backgroundColor: Colors.PRIMARY,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 10,
  },
  btnTextItemAdd: {
    color: theme.colors.primaryText,
    fontSize: 13,
  },
});
