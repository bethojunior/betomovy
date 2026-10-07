import {RFValue} from 'react-native-responsive-fontsize';
import theme from '../../styles/theme';
import {StyleSheet} from 'react-native';

export const styles = StyleSheet.create({
  circle: {
    borderRadius: 150,
    height: RFValue(90),
    width: RFValue(90),
    borderColor: theme.colors.white,
    borderWidth: 2,
    marginTop: 10,
    zIndex: 1,
  },
  shadow: {
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowColor: theme.colors.black,
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 24,
  },
  bell: {
    shadowColor: theme.colors.black,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 0.3,
    shadowRadius: 6.9,

    elevation: 13,
  },
});
