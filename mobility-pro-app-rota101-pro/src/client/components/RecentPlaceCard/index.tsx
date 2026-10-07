import {RFValue} from 'react-native-responsive-fontsize';
import {useTheme} from 'styled-components/native';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import Ionicons from '@expo/vector-icons/Ionicons';
import {
  AddressText,
  Card,
  DistanceText,
  IconWrapper,
  OptionsButton,
} from './styles';
import {RecentPlaceCardProps} from './types';

export function RecentPlaceCard({
  place,
  distanceLabel,
  onPress,
  onOptionsPress,
  hasBorder,
}: RecentPlaceCardProps) {
  const {colors} = useTheme();

  return (
    <Card onPress={onPress} hasBorder={hasBorder} activeOpacity={0.7}>
      <IconWrapper>
        <SimpleLineIcons name="clock" size={RFValue(15)} color={colors.icon_gray} />
      </IconWrapper>

      <AddressText numberOfLines={2}>{place.address}</AddressText>

      {place.isFavorite && (
        <Ionicons name="star" size={RFValue(14)} color={colors.primary} />
      )}

      {distanceLabel && <DistanceText>{distanceLabel}</DistanceText>}

      <OptionsButton onPress={onOptionsPress} hitSlop={8}>
        <Ionicons name="ellipsis-vertical" size={RFValue(18)} color={colors.text_gray} />
      </OptionsButton>
    </Card>
  );
}
