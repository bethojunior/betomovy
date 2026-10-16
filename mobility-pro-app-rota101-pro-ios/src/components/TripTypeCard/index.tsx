import { Ionicons } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';
import { SvgUri } from 'react-native-svg';
import { useTheme } from 'styled-components/native';
import AnimationIconRocket from '../../client/components/AnimatedIconRocket';
import { convertMoney } from '../../driver/src/utils/money';
import {
  ItemCard,
  ItemCardSelected,
  ItemImageWrap,
  ItemImagePlaceholder,
  TripTypeImage,
  TurbineBadge,
  ItemTextWrap,
  ItemName,
  ItemDescription,
  ItemPrice,
  ItemCheckWrap,
  TRIP_TYPE_IMAGE_WIDTH,
  TRIP_TYPE_IMAGE_HEIGHT,
  ICON_COLOR_MUTED,
  ICON_COLOR_UNSELECTED,
} from './styles';

function isSvgUrl(url: string): boolean {
  return url.split('?')[0].toLowerCase().endsWith('.svg');
}

interface TripTypeCardProps {
  name: string;
  description?: string;
  price?: string;
  turbine?: boolean;
  pictureUrl?: string;
  selected?: boolean;
  onPress: () => void;
}

export function TripTypeCard({
  name,
  description,
  price,
  turbine,
  pictureUrl,
  selected,
  onPress,
}: TripTypeCardProps) {
  const theme = useTheme();
  const CardComponent = selected ? ItemCardSelected : ItemCard;

  return (
    <CardComponent onPress={onPress} activeOpacity={0.75}>
      <ItemImageWrap>
        {pictureUrl ? (
          isSvgUrl(pictureUrl) ? (
            <SvgUri
              width={TRIP_TYPE_IMAGE_WIDTH}
              height={TRIP_TYPE_IMAGE_HEIGHT}
              uri={pictureUrl}
            />
          ) : (
            <TripTypeImage source={{ uri: pictureUrl }} />
          )
        ) : (
          <ItemImagePlaceholder>
            <Ionicons
              name="car-outline"
              size={RFValue(24)}
              color={selected ? theme.colors.primary : ICON_COLOR_MUTED}
            />
          </ItemImagePlaceholder>
        )}

        {turbine && (
          <TurbineBadge>
            <AnimationIconRocket size={RFValue(16)} />
          </TurbineBadge>
        )}
      </ItemImageWrap>

      <ItemTextWrap>
        <ItemName selected={selected}>{name}</ItemName>
        {!!description && (
          <ItemDescription numberOfLines={2}>{description}</ItemDescription>
        )}
        {!!price && <ItemPrice turbine={turbine}>{convertMoney(price)}</ItemPrice>}
      </ItemTextWrap>

      <ItemCheckWrap>
        {selected ? (
          <Ionicons name="checkmark-circle" size={RFValue(22)} color={theme.colors.primary} />
        ) : (
          <Ionicons name="ellipse-outline" size={RFValue(22)} color={ICON_COLOR_UNSELECTED} />
        )}
      </ItemCheckWrap>
    </CardComponent>
  );
}
