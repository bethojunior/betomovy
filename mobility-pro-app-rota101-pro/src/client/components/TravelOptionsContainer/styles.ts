import { StyleSheet } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import theme from '../../styles/theme';

const styles = StyleSheet.create({
  cancelationFeeText: {
    color: theme.colors.secondary,
  },
  paymentMethodAlignedStart: {
    justifyContent: 'flex-start',
  },
  confirmButtonShadow: {
    elevation: 6,
    shadowColor: 'black',
    shadowOffset: { width: 5, height: 5 },
    shadowOpacity: 0.4,
    shadowRadius: 5,
  },
  tripFocusCard: {
    marginTop: RFValue(4),
    marginBottom: RFValue(6),
  },
  tripFocusHeaderContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  tripFocusImageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: RFValue(6),
    marginBottom: RFValue(5),
  },
  tripFocusImage: {
    width: RFValue(92),
    height: RFValue(92),
  },
  tripFocusName: {
    flex: 1,
    textAlign: 'left',
    color: theme.colors.secondary,
    fontWeight: '700',
    fontSize: RFValue(16),
    marginRight: RFValue(10),
  },
  tripFocusMainRow: {
    marginTop: RFValue(4),
    marginBottom: RFValue(2),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tripFocusPriceColumn: {
    alignItems: 'flex-end',
  },
  tripFocusPrice: {
    color: theme.colors.secondary,
    fontWeight: '700',
    fontSize: RFValue(18),
  },
  tripFocusEstimate: {
    color: theme.colors.text_gray,
    fontSize: RFValue(11),
    marginTop: RFValue(2),
  },
  tripDetailsCloseButton: {
    position: 'absolute',
    right: 0,
    padding: RFValue(4),
  },
  tripDetailsDescriptionRow: {
    marginTop: RFValue(6),
    flexDirection: 'row',
    alignItems: 'center',
  },
  tripDetailsDescriptionPreview: {
    flex: 1,
    color: theme.colors.text_gray,
    fontSize: RFValue(9),
    lineHeight: RFValue(12),
    marginRight: RFValue(6),
  },
  tripDetailsActionButton: {
    flexShrink: 0,
    maxWidth: RFValue(102),
    paddingHorizontal: RFValue(8),
    paddingVertical: RFValue(6),
    borderRadius: RFValue(12),
    alignItems: 'center',
    justifyContent: 'center',
  },
  tripDetailsActionContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: RFValue(4),
  },
  tripDetailsActionText: {
    flexShrink: 1,
    color: theme.colors.blue,
    fontWeight: '700',
    fontSize: RFValue(10),
    lineHeight: RFValue(12),
  },
  priceCompositionCard: {
    marginTop: RFValue(8),
    marginBottom: RFValue(10),
  },
  priceCompositionBackButton: {
    position: 'absolute',
    left: 0,
    flexDirection: 'row',
    alignItems: 'center',
    padding: RFValue(4),
  },
  priceCompositionDescription: {
    color: theme.colors.text_gray,
    fontSize: RFValue(11),
    lineHeight: RFValue(16),
    marginTop: RFValue(10),
    marginBottom: RFValue(8),
  },
  priceCompositionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: RFValue(6),
    borderBottomWidth: RFValue(1),
    borderBottomColor: theme.colors.border,
  },
  priceCompositionLabel: {
    flex: 1,
    color: theme.colors.text_gray,
    fontSize: RFValue(12),
    marginRight: RFValue(8),
  },
  priceCompositionValue: {
    color: theme.colors.secondary,
    fontSize: RFValue(12),
    textAlign: 'right',
  },
  priceCompositionEmphasis: {
    color: theme.colors.secondary,
    fontWeight: '700',
  },
  priceCompositionDisclaimer: {
    color: theme.colors.light_gray,
    fontSize: RFValue(10),
    fontStyle: 'italic',
    marginTop: RFValue(8),
  },
});

export default styles;
