import { StyleSheet } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import themeClient from '../../styles/theme';

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: themeClient.colors.background_global,
  },
  animation: {
    width: RFValue(300),
    height: RFValue(300),
  }
});
