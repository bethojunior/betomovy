import {shade} from 'polished';
import {StyleSheet} from 'react-native';
import theme from '../../../../styles/theme';

export const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: theme.colors.background_global},
  contentContainer: {
    flexGrow: 1,
  },
  navContainer: {
    height: 70,
    marginHorizontal: 10,
  },
  contentOptionBtn: {
    flex: 1,
    marginHorizontal: 5,
  },
  optionBtn: {
    flex: 1,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 25,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  btnBackNavBar: {
    marginTop: 5,
    padding: 10,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
    backgroundColor: theme.colors.primary
  },
  titleStyle: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 18,
  },
  contentRestaurant: {
    display: 'flex',
    flexDirection: 'row',
    paddingVertical: 25,
    backgroundColor: theme.colors.background_global,
    borderBottomColor: theme.colors.border,
    borderBottomWidth: 1,
  },
  titleContent: {
    fontSize: 18,
  },
  subTitleContent: {
    color: theme.colors.text_gray,
  },
  ratingTitlleContent: {
    textAlign: 'right',
    color: theme.colors.yellowStrong,
  },
  contentTimeDelivery: {
    display: 'flex',
    flexDirection: 'row',
    borderWidth: 1,
    padding: 10,
    borderColor: theme.colors.border,
    marginVertical: 10,
    borderRadius: 5,
    alignItems: 'center',
  },
  contentItemTimeDelivery: {
    marginHorizontal: 10,
  },
  listItems: {
    flex: 1,
    backgroundColor: theme.colors.background_global,
  },
  contentItem: {
    marginHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: theme.colors.background_global,
    display: 'flex',
    flexDirection: 'row',
    borderBottomColor: theme.colors.border,
    borderBottomWidth: 1,
    alignItems: 'center',
    marginBottom: 10,
  },
  detailsItem: {
    flex: 1,
    paddingHorizontal: 10,
  },
  logoItem: {
    width: 75,
    height: 75,
  },
  titleItem: {
    fontSize: 14,
    marginBottom: 5,
  },
  descriptionItem: {
    color: theme.colors.text_gray,
  },
  containerTab: {
    backgroundColor: theme.colors.background_global,
    elevation: 1,
  },
  tabItem: {
    padding: 15,
  },
  containeItem: {
    backgroundColor: theme.colors.background_global,
  },
  headerCategory: {
    backgroundColor: theme.colors.background_global,
    padding: 15,
  },
  headerTextCategory: {fontSize: 18, fontWeight: 'bold'},
  infoProduct: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomColor: theme.colors.border,
    borderBottomWidth: 1,
  },
  infoProductOffline: {
    flexDirection: 'row',
    paddingVertical: 10,
    borderBottomColor: theme.colors.border,
    borderBottomWidth: 1,
    opacity: 0.75,
    backgroundColor: theme.colors.background_white,
  },
  containerInfoProduct: {
    flex: 1,
    padding: 10,
  },
  titleProduct: {
    fontSize: 18,
    color: theme.colors.icon_gray,
  },
  descriptionProduct: {
    color: theme.colors.text_gray,
    marginVertical: 10,
  },
  priceProduct: {
    fontSize: 16,
  },
  logoProduct: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginVertical: 10,
    marginHorizontal: 10,
  },
  contentWithoutMenu: {
    marginVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  labelWithoutMenu: {
    color: theme.colors.text_gray,
    fontWeight: 'bold',
    fontSize: 16,
  },
  containerMinPrice: {
    backgroundColor: theme.colors.white,
    padding: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.border,
  },
  textMinPrice: {
    fontSize: 11,
  },
  contentOffline: {
    backgroundColor: theme.colors.black,
    padding: 5,
    color: theme.colors.white,
    marginTop: 10,
    borderRadius: 5,
    display: 'flex',
    alignItems: 'center',
    width: '50%',
    fontSize: 9,
  },
});
