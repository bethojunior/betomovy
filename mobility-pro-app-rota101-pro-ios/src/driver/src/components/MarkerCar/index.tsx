import {Image, ImageStyle} from 'react-native';
import {Marker} from 'react-native-maps';
// import LocationIcon from '../../../assets/navigation.png';
import Car from '../../../assets/car.png';

interface Props {
  latitude: number;
  longitude: number;
  onPress?: () => void;
}

export const MarkerCar = ({latitude, longitude, onPress}: Props) => {
  return (
    <Marker
      coordinate={{
        latitude,
        longitude,
      }}
      onPress={onPress}
    >
      <Image
        source={Car}
        style={
          {
            width: 50,
            height: 50,
            resizeMode: 'contain',
          } as ImageStyle
        }
      />
    </Marker>
  );
};
