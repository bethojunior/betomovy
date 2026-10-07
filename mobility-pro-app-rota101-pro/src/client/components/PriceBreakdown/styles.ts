import { StyleSheet } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import theme from '../../styles/theme';

const styles = StyleSheet.create({
  container: {
    borderRadius: RFValue(6),
    marginTop: RFValue(1),
    marginBottom: RFValue(2),
  },
  trigger: {
    alignSelf: 'flex-start',
    paddingVertical: RFValue(2),
    paddingHorizontal: 0,
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: RFValue(6),
  },
  helpIcon: {
    width: RFValue(14),
    height: RFValue(14),
    borderRadius: RFValue(7),
    textAlign: 'center',
    lineHeight: RFValue(14),
    marginRight: RFValue(5),
    color: theme.colors.light_gray,
    borderWidth: 1,
    borderColor: theme.colors.light_gray,
    fontWeight: '700',
    fontSize: RFValue(9),
  },
  triggerTitle: {
    fontSize: RFValue(11),
    color: theme.colors.blue,
    fontWeight: '700',
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.08)',
  },
  popover: {
    position: 'absolute',
    left: RFValue(16),
    right: RFValue(16),
    minHeight: RFValue(150),
    padding: RFValue(12),
    borderRadius: RFValue(12),
    backgroundColor: '#FFFFFF',
    shadowColor: '#000000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.15,
    shadowRadius: RFValue(6),
    elevation: 5,
  },
  popoverHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: RFValue(6),
  },
  helpButton: {
    padding: RFValue(4),
  },
  title: {
    fontSize: RFValue(12),
    color: theme.colors.secondary,
    flex: 1,
    fontWeight: '600',
  },
  description: {
    fontSize: RFValue(10),
    color: theme.colors.text_gray,
    lineHeight: RFValue(14),
    marginBottom: RFValue(6),
  },
  disclaimer: {
    marginTop: RFValue(4),
    fontSize: RFValue(10),
    color: theme.colors.light_gray,
    fontStyle: 'italic',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: RFValue(2),
  },
  label: {
    fontSize: RFValue(12),
    color: theme.colors.text_gray,
  },
  value: {
    fontSize: RFValue(12),
    color: theme.colors.secondary,
  },
  emphasis: {
    fontWeight: '700',
    color: theme.colors.secondary,
  },
});

export default styles;
