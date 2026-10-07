import { useEffect, useRef, useState } from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';
import { useTheme } from 'styled-components/native';
import { translate } from '../../../../../../client/locales';
import { formatVehiclePlate } from '../../../../../../utils/vehiclePlateMask';
import { vehicleBrandIcons, vehicleBrandNames } from '../../../../constants/vehicleBrands';
import { VehicleBrandPickerModal } from '../VehicleBrandPickerModal';
import {
  Card,
  SectionTitleRow,
  SectionTitle,
  Row,
  RowIconWrapper,
  RowContent,
  RowLabel,
  RowValue,
  RowInput,
  BrandPickerButton,
  BrandPickerButtonText,
  BackToBrandListButton,
  BackToBrandListText,
  Divider,
} from './styles';
import { VehicleFieldKey, VehicleInfoCardProps } from './types';

const ROW_ICON_SIZE = RFValue(16);

const FIELD_CONFIG: { key: VehicleFieldKey; icon: keyof typeof Ionicons.glyphMap }[] = [
  { key: 'brand', icon: 'pricetag-outline' },
  { key: 'model', icon: 'car-outline' },
  { key: 'plate', icon: 'card-outline' },
  { key: 'color', icon: 'color-palette-outline' },
  { key: 'year', icon: 'calendar-outline' },
  { key: 'renavam', icon: 'document-text-outline' },
];

export const VehicleInfoCard = ({ car, editable, onChangeField, scrollToRow }: VehicleInfoCardProps) => {
  const theme = useTheme();
  const [isOtherBrand, setIsOtherBrand] = useState(false);
  const [brandPickerVisible, setBrandPickerVisible] = useState(false);
  const rowRefs = useRef<Record<string, any>>({});

  useEffect(() => {
    if (editable) {
      setIsOtherBrand(!!car.brand && !vehicleBrandNames.includes(car.brand));
    }
  }, [editable]);

  const handleSelectBrand = (brand: string) => {
    onChangeField('brand', brand);
    setIsOtherBrand(false);
    setBrandPickerVisible(false);
  };

  const handleSelectOtherBrand = () => {
    onChangeField('brand', '');
    setIsOtherBrand(true);
    setBrandPickerVisible(false);
  };

  const handleBackToBrandList = () => {
    onChangeField('brand', '');
    setIsOtherBrand(false);
  };

  const handleFieldChange = (key: VehicleFieldKey, value: string) => {
    onChangeField(key, key === 'plate' ? formatVehiclePlate(value) : value);
  };

  const renderBrandField = () => {
    if (!editable) {
      return <RowValue>{car.brand || '-'}</RowValue>;
    }

    if (isOtherBrand) {
      return (
        <>
          <RowInput
            value={car.brand}
            onChangeText={value => onChangeField('brand', value)}
            onPressIn={() => scrollToRow({ current: rowRefs.current.brand })}
          />
          <BackToBrandListButton onPress={handleBackToBrandList}>
            <Ionicons name="chevron-back" size={RFValue(14)} color={theme.colors.black} />
            <BackToBrandListText>{translate('vehicle.brand_back_to_list')}</BackToBrandListText>
          </BackToBrandListButton>
        </>
      );
    }

    return (
      <BrandPickerButton onPress={() => setBrandPickerVisible(true)}>
        <BrandPickerButtonText placeholder={!car.brand}>
          {car.brand || translate('vehicle.brand_picker_select')}
        </BrandPickerButtonText>
        <Ionicons name="chevron-down" size={RFValue(16)} color={theme.colors.black} />
      </BrandPickerButton>
    );
  };

  return (
    <Card>
      <SectionTitleRow>
        <SectionTitle>{translate('vehicle.section_title')}</SectionTitle>
      </SectionTitleRow>

      {FIELD_CONFIG.map(({ key, icon }, index) => {
        const brandIcon = key === 'brand' ? vehicleBrandIcons[car.brand] : null;

        return (
          <View key={key}>
            <Row ref={(el: any) => { rowRefs.current[key] = el; }}>
              <RowIconWrapper>
                {typeof brandIcon === 'function' ? (
                  <BrandLogoIcon icon={brandIcon} />
                ) : (
                  <Ionicons name={icon} size={ROW_ICON_SIZE} color={theme.colors.black} />
                )}
              </RowIconWrapper>
              <RowContent>
                <RowLabel>{translate(`vehicle.${key}`)}</RowLabel>
                {key === 'brand' ? (
                  renderBrandField()
                ) : editable ? (
                  <RowInput
                    value={car[key]}
                    onChangeText={value => handleFieldChange(key, value)}
                    onPressIn={() => scrollToRow({ current: rowRefs.current[key] })}
                    autoCapitalize={key === 'plate' ? 'characters' : 'sentences'}
                    maxLength={key === 'plate' ? 8 : undefined}
                  />
                ) : (
                  <RowValue>{car[key] || '-'}</RowValue>
                )}
              </RowContent>
            </Row>
            {index < FIELD_CONFIG.length - 1 && <Divider />}
          </View>
        );
      })}

      <VehicleBrandPickerModal
        visible={brandPickerVisible}
        onSelect={handleSelectBrand}
        onSelectOther={handleSelectOtherBrand}
        onClose={() => setBrandPickerVisible(false)}
      />
    </Card>
  );
};

function BrandLogoIcon({ icon: Icon }: { icon: React.FC<import('react-native-svg').SvgProps> }) {
  return <Icon width={ROW_ICON_SIZE} height={ROW_ICON_SIZE} />;
}
