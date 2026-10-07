import {StyleSheet} from 'react-native';
import theme from '../../../../styles/theme';

export const styles = StyleSheet.create({
  header: {
    backgroundColor: theme.colors.white,
    padding: 10,
  },
  titleDeliveryLocal: {
    fontSize: 12,
    color: theme.colors.text_gray,
    left: 45,
    bottom: -10,
  },
  btnLocation: {
    display: 'flex',
    flexDirection: 'row',
    marginVertical: 5,
    borderBottomColor: theme.colors.border,
    borderBottomWidth: 1,
    paddingHorizontal: 5,
    paddingVertical: 10,
  },
  iconLocal: {
    width: 40,
    marginTop: -20,
  },
  contentLocal: {
    flex: 1,
    flexDirection: 'column',
    flexShrink: 1,
  },
  titleLocal: {
    fontSize: 16,
    marginRight: 10,
    flexWrap: 'wrap',
  },
  subtitleLocal: {
    fontSize: 13,
    color: theme.colors.text_gray,
  },
  contentDescriptionInfoDelivery: {
    padding: 10,
  },
  descriptionTitleLocal: {
    fontSize: 14,
  },
});
