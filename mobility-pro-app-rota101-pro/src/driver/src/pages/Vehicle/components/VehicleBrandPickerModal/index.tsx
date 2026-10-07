import { useMemo, useState } from 'react';
import { Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';
import {
  initialWindowMetrics,
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { useTheme } from 'styled-components/native';
import { ConfirmButton } from '../../../../../../components/ConfirmButton';
import { translate } from '../../../../../../client/locales';
import {
  vehicleBrandIcons,
  vehicleBrandNames,
  OTHER_VEHICLE_BRAND_OPTION,
} from '../../../../constants/vehicleBrands';
import {
  Backdrop,
  Sheet,
  Handle,
  HeaderRow,
  TitleText,
  EmptyText,
  BrandList,
  BrandRow,
  BrandIconWrapper,
  BrandIconImage,
  BrandLabel,
} from './styles';
import { BrandListItem, VehicleBrandPickerModalProps } from './types';

function buildBrandListItems(): BrandListItem[] {
  const brandItems: BrandListItem[] = vehicleBrandNames.map(name => ({
    key: name,
    label: name,
    icon: vehicleBrandIcons[name] ?? null,
    isOtherOption: false,
  }));

  return [
    ...brandItems,
    {
      key: OTHER_VEHICLE_BRAND_OPTION,
      label: translate('vehicle.brand_other_option'),
      icon: null,
      isOtherOption: true,
    },
  ];
}

function BrandIcon({ icon }: { icon: BrandListItem['icon'] }) {
  const theme = useTheme();

  if (!icon) {
    return <Ionicons name="car-sport-outline" size={RFValue(18)} color={theme.colors.black} />;
  }
  if (typeof icon === 'function') {
    const Icon = icon;
    return <Icon width={RFValue(22)} height={RFValue(22)} />;
  }
  return <BrandIconImage source={icon} resizeMode="contain" />;
}

export const VehicleBrandPickerModal = ({
  visible,
  onSelect,
  onSelectOther,
  onClose,
}: VehicleBrandPickerModalProps) => {
  const [selectedKey, setSelectedKey] = useState<string | null>(null);

  const handleClose = () => {
    setSelectedKey(null);
    onClose();
  };

  const handleConfirm = () => {
    if (!selectedKey) return;
    if (selectedKey === OTHER_VEHICLE_BRAND_OPTION) {
      onSelectOther();
    } else {
      onSelect(selectedKey);
    }
    setSelectedKey(null);
  };

  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      statusBarTranslucent
      onRequestClose={handleClose}
    >
      <SafeAreaProvider initialMetrics={initialWindowMetrics}>
        <VehicleBrandPickerContent
          selectedKey={selectedKey}
          setSelectedKey={setSelectedKey}
          onClose={handleClose}
          onConfirm={handleConfirm}
        />
      </SafeAreaProvider>
    </Modal>
  );
};

function VehicleBrandPickerContent({
  selectedKey,
  setSelectedKey,
  onClose,
  onConfirm,
}: {
  selectedKey: string | null;
  setSelectedKey: (key: string) => void;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const items = useMemo(buildBrandListItems, []);
  const insets = useSafeAreaInsets();
  const sheetBottomPadding = RFValue(12) + insets.bottom;
  const selectedItem = items.find(item => item.key === selectedKey);

  return (
    <Backdrop>
      <Sheet bottomInset={sheetBottomPadding}>
        <Handle />
        <HeaderRow>
          <TitleText>{translate('vehicle.brand_picker_title')}</TitleText>
          <Ionicons name="close" size={RFValue(24)} onPress={onClose} />
        </HeaderRow>

        {items.length === 0 ? (
          <EmptyText>{translate('vehicle.brand_picker_empty')}</EmptyText>
        ) : (
          <BrandList
            data={items}
            keyExtractor={item => item.key}
            renderItem={({ item }) => (
              <BrandRow
                selected={item.key === selectedKey}
                onPress={() => setSelectedKey(item.key)}
              >
                <BrandIconWrapper>
                  <BrandIcon icon={item.icon} />
                </BrandIconWrapper>
                <BrandLabel selected={item.key === selectedKey}>{item.label}</BrandLabel>
              </BrandRow>
            )}
          />
        )}

        <ConfirmButton
          selected={!!selectedKey}
          onPress={onConfirm}
          label={
            selectedItem
              ? `${translate('vehicle.brand_picker_confirm')} — ${selectedItem.label}`
              : translate('vehicle.brand_picker_select')
          }
        />
      </Sheet>
    </Backdrop>
  );
}
