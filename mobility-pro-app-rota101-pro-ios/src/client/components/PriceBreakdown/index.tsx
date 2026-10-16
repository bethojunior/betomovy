import { useRef, useState } from 'react';
import {
  Dimensions,
  LayoutChangeEvent,
  Modal,
  Pressable,
  View,
  Text,
  TouchableOpacity,
} from 'react-native';
import { translate } from '../../locales';
import { coinTypePerApi, maskMoney } from '../../utils/money';
import PriceBreakdownRow from './PriceBreakdownRow';
import styles from './styles';
import { PopoverPosition, PriceBreakdownProps } from './types';

const SCREEN_MARGIN = 16;
const POPOVER_MIN_HEIGHT = 220;
const POPOVER_GAP = 8;
const HEIGHT_CHANGE_THRESHOLD = 1;

const formatCurrency = (value: number | null, coin: string): string => {
  if (value === null || !Number.isFinite(value)) return '—';
  return `${coin} ${maskMoney(value)}`.trim();
};

const PriceBreakdown = ({
  total,
  platformAmount = null,
  driverAmount = null,
  typeMoney,
  showTitle = true,
  showDisclaimer = true,
}: PriceBreakdownProps) => {
  const triggerRef = useRef<View>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isLawVisible, setIsLawVisible] = useState(false);
  const [popoverHeight, setPopoverHeight] = useState(POPOVER_MIN_HEIGHT);
  const [anchorY, setAnchorY] = useState(SCREEN_MARGIN);
  const [anchorHeight, setAnchorHeight] = useState(0);
  const [popoverPosition, setPopoverPosition] = useState<PopoverPosition>({
    top: SCREEN_MARGIN,
  });
  const coin = coinTypePerApi(typeMoney) ?? '';
  const calculatePopoverTop = (
    baseY: number,
    baseHeight: number,
    currentPopoverHeight: number,
  ): number => {
    const windowHeight = Dimensions.get('window').height;
    const shouldOpenAbove = baseY > windowHeight / 2;
    const lowerTop = baseY + baseHeight + POPOVER_GAP;
    const upperTop = baseY - currentPopoverHeight - POPOVER_GAP;
    const preferredTop = shouldOpenAbove ? upperTop : lowerTop;
    return Math.min(
      Math.max(preferredTop, SCREEN_MARGIN),
      windowHeight - currentPopoverHeight - SCREEN_MARGIN,
    );
  };
  const handleClose = (): void => {
    setIsVisible(false);
    setIsLawVisible(false);
  };
  const handleToggleLaw = (): void => {
    setIsLawVisible(currentValue => !currentValue);
  };
  const handleOpenDetails = (): void => {
    triggerRef.current?.measureInWindow((_x, y, _width, height) => {
      setAnchorY(y);
      setAnchorHeight(height);
      const top = calculatePopoverTop(y, height, popoverHeight);
      setPopoverPosition({ top });
      setIsVisible(true);
    });
  };
  const handlePopoverLayout = (event: LayoutChangeEvent): void => {
    const measuredHeight = event?.nativeEvent?.layout?.height;
    if (!Number.isFinite(measuredHeight)) return;
    if (Math.abs(measuredHeight - popoverHeight) < HEIGHT_CHANGE_THRESHOLD) return;
    setPopoverHeight(measuredHeight);
    if (!isVisible) return;
    const top = calculatePopoverTop(anchorY, anchorHeight, measuredHeight);
    setPopoverPosition({ top });
  };

  return (
    <View style={styles.container} accessibilityLabel="senacon-price-breakdown">
      <View ref={triggerRef}>
        <TouchableOpacity
          style={styles.trigger}
          onPress={handleOpenDetails}
          accessibilityRole="button"
          accessibilityLabel={translate('trip.senacon_action')}
        >
          <Text style={styles.triggerTitle}>
            {showTitle ? translate('trip.senacon_action') : translate('trip.senacon_title')}
          </Text>
        </TouchableOpacity>
      </View>

      <Modal
        visible={isVisible}
        transparent
        animationType="fade"
        onRequestClose={handleClose}
      >
        <Pressable style={styles.backdrop} onPress={handleClose} />
        <View style={[styles.popover, popoverPosition]} onLayout={handlePopoverLayout}>
          <View style={styles.popoverHeader}>
            <Text style={styles.title}>{translate('trip.senacon_title')}</Text>
            <TouchableOpacity
              style={styles.helpButton}
              onPress={handleToggleLaw}
              accessibilityRole="button"
              accessibilityLabel={translate('trip.senacon_law_description')}
            >
              <Text style={styles.helpIcon}>?</Text>
            </TouchableOpacity>
          </View>
          {isLawVisible && (
            <Text style={styles.description}>
              {translate('trip.senacon_law_description')}
            </Text>
          )}
          <PriceBreakdownRow
            label={translate('trip.senacon_total')}
            value={formatCurrency(total, coin)}
            emphasis
          />
          <PriceBreakdownRow
            label={translate('trip.senacon_platform')}
            value={formatCurrency(platformAmount, coin)}
          />
          <PriceBreakdownRow
            label={translate('trip.senacon_driver')}
            value={formatCurrency(driverAmount, coin)}
          />

          {showDisclaimer && (
            <Text style={styles.disclaimer}>{translate('trip.senacon_disclaimer')}</Text>
          )}
        </View>
      </Modal>
    </View>
  );
};

export default PriceBreakdown;
