import { Image, ImageStyle, StyleProp } from 'react-native';
import { RFValue } from 'react-native-responsive-fontsize';
import { buildApp } from '../../../../constantBuild/config';
import { useStoragePictures } from '../../hooks/useStoragePictures';
import { TripInfo } from '../../context/Trip/types';
import { RenderSvgImage } from '../../../../common/RenderSvgImage';

interface CustomerAvatarProps {
  trip?: TripInfo;
  size?: number;
  style?: StyleProp<ImageStyle>;
}

const DEFAULT_SIZE = RFValue(60);

export function useCustomerAvatarUri(trip?: TripInfo): string {
  const { getStoragePictureSpecific } = useStoragePictures();

  return trip?.customer?.profileImage
    ? `${getStoragePictureSpecific('customer') || buildApp().HOST_IMAGE_CUSTOMER}${trip.customer.profileImage}`
    : `${getStoragePictureSpecific('tripType') || buildApp().HOST_IMAGE_TRIP_TYPE}${trip?.fare?.picture}`;
}

export const CustomerAvatar = ({ trip, size = DEFAULT_SIZE, style }: CustomerAvatarProps) => {
  const uri = useCustomerAvatarUri(trip);

  if (!trip?.customer?.profileImage) {
    return <RenderSvgImage image={uri} width={size} heigth={size} />;
  }

  const dimensionStyle: ImageStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
  };

  return <Image style={[dimensionStyle, style]} source={{ uri }} />;
};
