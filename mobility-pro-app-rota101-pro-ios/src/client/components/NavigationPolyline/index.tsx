import { Polyline } from 'react-native-maps';
import { RFValue } from 'react-native-responsive-fontsize';

type Coordinate = { latitude: number; longitude: number };

type Props = {
  coordinates: Coordinate[];
};

export const NavigationPolyline = ({ coordinates }: Props) => (
  <>
    <Polyline
      coordinates={coordinates}
      strokeColor="#FFFFFF"
      strokeWidth={RFValue(7)}
      lineCap="round"
      lineJoin="round"
      zIndex={1}
    />
    <Polyline
      coordinates={coordinates}
      strokeColor="#0A84FF"
      strokeWidth={RFValue(4)}
      lineCap="round"
      lineJoin="round"
      zIndex={2}
    />
  </>
);
