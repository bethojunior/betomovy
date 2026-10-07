import {useEffect, useRef} from 'react';
import {Dimensions, Platform, View} from 'react-native';
import {AnimatedRegion, MarkerAnimated} from 'react-native-maps';
import FastImage from 'react-native-fast-image';
import iconDriver from '../../../assets/compass2.png';
import {RFValue} from 'react-native-responsive-fontsize';
import {NavigationMapConfig} from '../../../constants/map';
import {If} from '../If';

type DriverMarkerProps = {
  latitude: number;
  longitude: number;
  markerRotate?: number;
  onMarkerRef?: (markerDriverRef: MarkerAnimated) => void;
  markerSize?: number;
};

export default function DriverMarker(props: DriverMarkerProps) {
  const {latitude, longitude, markerRotate, onMarkerRef, markerSize} = props;

  const {width, height} = Dimensions.get('window');
  const ASPECT_RATIO = width / height;
  const LATITUDE_DELTA = 0.003;
  const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

  const initialLocation = useRef(
    new AnimatedRegion({
      latitude: latitude || 0,
      longitude: longitude || 0,
      latitudeDelta: LATITUDE_DELTA,
      longitudeDelta: LONGITUDE_DELTA,
    }),
  );

  useEffect(() => {
    if (Platform.OS === 'ios' && latitude) {
      const timingConfig = {
        latitude: latitude || 0,
        longitude: longitude || 0,
        duration: NavigationMapConfig.duration,
        useNativeDriver: false,
      };
      initialLocation.current.timing(timingConfig).start();
    }
  }, [latitude]);

  return (
    <If condition={latitude}>
      <MarkerAnimated
        ref={ref => onMarkerRef && onMarkerRef(ref)}
        coordinate={
          initialLocation?.current || {
            latitude: latitude || 0,
            longitude: longitude || 0,
          }
        }
        anchor={{y: 0.5, x: 0.5}}
      >
        <View
          style={{
            padding: RFValue(15),
            position: 'relative',
            borderRadius: RFValue(100),
          }}
        >
          <FastImage
            source={iconDriver}
            style={{
              width: markerSize || RFValue(46),
              height:
                (markerSize <= 16 ? markerSize : markerSize - 16) ||
                RFValue(30),
              transform: [{rotate: `${markerRotate || 0}deg`}],
            }}
            resizeMode={FastImage.resizeMode.cover}
          />
        </View>
      </MarkerAnimated>
    </If>
  );
}
