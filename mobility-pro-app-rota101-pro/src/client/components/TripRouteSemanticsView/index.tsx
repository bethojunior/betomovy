import React from 'react';
import { StyleSheet, View } from 'react-native';
import {
  MOBILITY_ROUTE_ACCESSIBILITY_TEST_ID,
  buildTripRouteAccessibilityLabel,
} from '../../utils/trip-route-accessibility';

type TripRouteSemanticsViewProps = {
  readonly originAddress: string;
  readonly destinationAddress: string;
  readonly distanceLabel: string;
};

const styles = StyleSheet.create({
  offscreenHost: {
    position: 'absolute',
    width: 1,
    height: 1,
    opacity: 0,
    left: 0,
    top: 0,
  },
});

export default function TripRouteSemanticsView({
  originAddress,
  destinationAddress,
  distanceLabel,
}: TripRouteSemanticsViewProps): React.ReactElement {
  const label = buildTripRouteAccessibilityLabel(
    originAddress,
    destinationAddress,
    distanceLabel,
  );
  return (
    <View
      accessible
      accessibilityLabel={label}
      accessibilityRole="none"
      collapsable={false}
      importantForAccessibility="yes"
      nativeID={MOBILITY_ROUTE_ACCESSIBILITY_TEST_ID}
      testID={MOBILITY_ROUTE_ACCESSIBILITY_TEST_ID}
      pointerEvents="none"
      style={styles.offscreenHost}
    />
  );
}
