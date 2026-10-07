import Ionicons from '@expo/vector-icons/Ionicons';
import {shade} from 'polished';
import {useEffect, useState} from 'react';
import {useTheme} from 'styled-components';
import {useStationReturn} from '../../context/StationReturn';
import {useUserDriver} from '../../context/userDriver';
import {IfLoaderInsideScreen} from '../IfLoaderInsideScreen';
import {Container, styles, TextReturn} from './styles';

interface PropsData {
  address: string;
  latitude: number;
  longitude: number;
  name: string;
  stationId: string;
  stationTypeId: string;
}

interface Props {
  onPress?: () => void;
  data?: PropsData;
  onLongPress?: () => void;
  colorText?: string;
}

export function ReturnItem({onPress, data, onLongPress, colorText}: Props) {
  const {colors} = useTheme();
  const {selectedStation, loading} = useStationReturn();
  const {userDriverFind} = useUserDriver();

  return (
    <Container
      style={styles.shadow}
      selected={
        selectedStation.name === data?.name ||
        userDriverFind.stationId === data?.stationId
      }
      activeOpacity={0.8}
      onPress={onPress}
      onLongPress={onLongPress ? onLongPress : () => {}}
    >
      {data !== undefined && data !== null ? (
        <>
          <IfLoaderInsideScreen
            loading={loading && selectedStation.name === data?.name}
          >
            <TextReturn colorText={colorText}>{data.name}</TextReturn>
          </IfLoaderInsideScreen>
        </>
      ) : (
        <Ionicons name="add" size={24} color={shade(0.2, colors.white)} />
      )}
    </Container>
  );
}
