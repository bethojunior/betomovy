import { Modal, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';
import {
  initialWindowMetrics,
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import { TripType } from '../../context/Trip/types';
import { buildApp } from '../../../../constantBuild/config';
import { useStoragePictures } from '../../hooks/useStoragePictures';
import { TripTypeCard } from '../../../../components/TripTypeCard';
import { ConfirmButton } from '../../../../components/ConfirmButton';
import {
  Backdrop,
  Sheet,
  Handle,
  HeaderRow,
  TitleText,
  SubtitleText,
  EmptyText,
  TripTypeList,
  ICON_COLOR_MUTED,
} from './styles';
import {
  TripTypePickerContentProps,
  TripTypePickerModalProps,
} from './types';
import { useState } from 'react';
import { translate } from '../../../../client/locales';

function isValidHttpUrl(value: string): boolean {
  return /^https?:\/\//i.test(value);
}

function resolveTripTypePictureUrl(
  item: TripType,
  baseUrl: string | null,
): string {
  const fullPicture = item.fullPicture?.trim() ?? '';
  if (fullPicture && isValidHttpUrl(fullPicture)) {
    return fullPicture;
  }
  const picture = item.picture?.trim() ?? '';
  if (!picture) return '';
  if (isValidHttpUrl(picture)) return picture;
  const base = baseUrl || buildApp().HOST_IMAGE_TRIP_TYPE;
  return `${base}${picture}`;
}

export const TripTypePickerModal = ({
  visible,
  tripTypes,
  onSelect,
  onClose,
}: TripTypePickerModalProps) => {
  const [selected, setSelected] = useState<TripType | null>(null);
  const { getStoragePictureSpecific } = useStoragePictures();
  const tripTypeImageBaseUrl = getStoragePictureSpecific('tripType');

  const handleClose = () => {
    setSelected(null);
    onClose?.();
  };

  const handleConfirm = () => {
    if (!selected) return;
    onSelect(selected);
    setSelected(null);
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
        <TripTypePickerContent
          tripTypes={tripTypes}
          selected={selected}
          setSelected={setSelected}
          tripTypeImageBaseUrl={tripTypeImageBaseUrl}
          onConfirm={handleConfirm}
          onClose={handleClose}
        />
      </SafeAreaProvider>
    </Modal>
  );
};

function TripTypePickerContent({
  tripTypes,
  selected,
  setSelected,
  tripTypeImageBaseUrl,
  onConfirm,
  onClose,
}: TripTypePickerContentProps) {
  const insets = useSafeAreaInsets();
  const sheetBottomPadding = RFValue(12) + insets.bottom;

  return (
    <Backdrop>
      <Sheet bottomInset={sheetBottomPadding}>
        <Handle />

        <HeaderRow>
          <View>
            <TitleText>{translate('tripTypePicker.title')}</TitleText>
            <SubtitleText>{translate('tripTypePicker.subtitle')}</SubtitleText>
          </View>
          <Ionicons
            name="close"
            size={RFValue(28)}
            color={ICON_COLOR_MUTED}
            onPress={onClose}
          />
        </HeaderRow>

        {tripTypes.length === 0 ? (
          <EmptyText>{translate('tripTypePicker.no_types_available')}</EmptyText>
        ) : (
          <TripTypeList
            data={tripTypes}
            keyExtractor={(item: TripType) => String(item.tripTypeId)}
            renderItem={({ item }: { item: TripType }) => {
              const isSelected = selected?.tripTypeId === item.tripTypeId;
              const pictureUrl = resolveTripTypePictureUrl(item, tripTypeImageBaseUrl);
              return (
                <TripTypeCard
                  name={item.name}
                  description={item.description}
                  pictureUrl={pictureUrl}
                  selected={isSelected}
                  onPress={() => setSelected(item)}
                />
              );
            }}
          />
        )}

        <ConfirmButton
          selected={!!selected}
          onPress={onConfirm}
          label={
            selected
              ? `${translate('tripTypePicker.confirm')} — ${selected.name}`
              : translate('tripTypePicker.select_type')
          }
        />
      </Sheet>
    </Backdrop>
  );
}
