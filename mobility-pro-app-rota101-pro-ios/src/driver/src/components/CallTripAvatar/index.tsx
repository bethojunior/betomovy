import { Image, ImageStyle, StyleProp } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { buildApp } from '../../../../constantBuild/config';
import { useStoragePictures } from '../../hooks/useStoragePictures';
import { TripInfo } from '../../context/Trip/types';
import { RenderSvgImage } from '../../../../common/RenderSvgImage';

interface CallTripAvatarProps {
  trip?: TripInfo;
  size?: number;
  style?: StyleProp<ImageStyle>;
}

const DEFAULT_SIZE = RFValue(60);

export function useCallTripAvatarUri(trip?: TripInfo): string {
  const { getStoragePictureSpecific } = useStoragePictures();

  return trip?.customerImage
    ? `${getStoragePictureSpecific('customer') || buildApp().HOST_IMAGE_CUSTOMER}${trip.customerImage}`
    : trip?.tripTypePicture;
}

export const CallTripAvatar = ({ trip, size = DEFAULT_SIZE, style }: CallTripAvatarProps) => {
  const uri = useCallTripAvatarUri(trip);

  if (!trip?.customerImage) {
    return <RenderSvgImage image={uri} width={size} heigth={size} />;
  }

  const dimensionStyle: ImageStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
  };

  return <Image style={[dimensionStyle, style]} source={{ uri }} />;
};
