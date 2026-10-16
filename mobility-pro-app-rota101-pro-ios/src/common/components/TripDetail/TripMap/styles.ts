import styled from 'styled-components/native';
import { RFValue } from 'react-native-responsive-fontsize';
import MapView from 'react-native-maps';

export const MapWrapper = styled.View`
  width: 100%;
  height: ${RFValue(240)}px;
`;

export const Map = styled(MapView)`
  width: 100%;
  height: 100%;
`;
