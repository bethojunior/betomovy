import { forwardRef, memo, useImperativeHandle } from 'react';
import {
  ActionColumn,
  AddressContent,
  AddressLabel,
  CardContainer,
  EtaBadge,
  EtaUnit,
  EtaValue,
  MarkerCard,
  MarkerPin,
  NavigationIcon,
  PinContainer,
} from './styles';
import { useMarkerSync } from './useMarkerSync';
import { translate } from '~/client/locales';

export type MarkerVariant = 'origin' | 'destination';

export interface MapAddressMarkerRef {
  sync: () => Promise<void>;
}

export interface Coordinate {
  latitude: number;
  longitude: number;
}

export interface MapAddressMarkerProps {
  mapRef: React.RefObject<any>;
  coordinate: Coordinate | null | undefined;
  title: string;
  variant?: MarkerVariant;
  eta?: number;
  showNavigationIcon?: boolean;
  onPress?: () => void;
  conflictCoordinate?: Coordinate | null;
}

const MapAddressMarker = forwardRef<MapAddressMarkerRef, MapAddressMarkerProps>(
  (
    {
      mapRef,
      coordinate,
      eta,
      title,
      variant = 'destination',
      showNavigationIcon,
      onPress,
      conflictCoordinate,
    },
    ref,
  ) => {
    const { sync, cardAnimatedStyle, pinPos, onCardLayout } = useMarkerSync({
      mapRef,
      coordinate,
      variant,
      conflictCoordinate,
    });

    useImperativeHandle(ref, () => ({ sync }), [sync]);

    return (
      <>
        {pinPos && (
          <PinContainer pointerEvents="none" style={{ left: pinPos.x, top: pinPos.y }}>
            <MarkerPin $variant={variant} />
          </PinContainer>
        )}

        <CardContainer style={cardAnimatedStyle} pointerEvents="box-none">
          <MarkerCard onPress={onPress} onLayout={onCardLayout}>
            {eta != null && (
              <EtaBadge>
                <EtaValue numberOfLines={1} ellipsizeMode="tail">
                  {eta}
                </EtaValue>
                <EtaUnit>{translate('trip.minutes')}</EtaUnit>
              </EtaBadge>
            )}
            <AddressContent>
              <AddressLabel numberOfLines={2}>{title}</AddressLabel>
            </AddressContent>
            {showNavigationIcon && (
              <ActionColumn>
                <NavigationIcon />
              </ActionColumn>
            )}
          </MarkerCard>
        </CardContainer>
      </>
    );
  },
);

MapAddressMarker.displayName = 'MapAddressMarker';

export default memo(MapAddressMarker);
