import Helper from './Helper';
import { translate } from '../locales';

export const MOBILITY_ROUTE_ACCESSIBILITY_TEST_ID = 'mobility_trip_route_semantics' as const;

export const MOBILITY_ROUTE_PARSER_PREFIX = '[mobility_route] ' as const;

export type GeneralSettingEntry = { key?: string; value?: string };

export function buildTripRouteAccessibilityLabel(
  originAddress: string,
  destinationAddress: string,
  distanceLabel: string,
): string {
  const unknown = translate('trip.a11y_unknown_address');
  const origin = originAddress.trim() || unknown;
  const dest = destinationAddress.trim() || unknown;
  const dist = distanceLabel.trim();
  const distPart =
    dist.length > 0
      ? ` ${translate('trip.a11y_distance')}: ${dist}.`
      : '';
  const body = translate('trip.a11y_route_summary', {
    origin,
    dest,
    distance: distPart,
    originLabel: translate('trip.a11y_origin'),
    destLabel: translate('trip.a11y_destination'),
  });
  return `${MOBILITY_ROUTE_PARSER_PREFIX}${body}`;
}

export function formatDistanceForAccessibility(
  distance: number | string | null | undefined,
  generalSettings: GeneralSettingEntry[] | null | undefined,
): string {
  if (distance === null || distance === undefined || distance === '') {
    return '';
  }
  const km = Number(distance);
  if (Number.isNaN(km) || km <= 0) {
    return '';
  }
  const useMiles = Helper.generalSettingsActive(
    generalSettings,
    'enable_transform_km_for_mi',
  );
  return `${Helper.kmToMiles(km.toFixed(1), useMiles)}`;
}

export function shouldRenderTripRouteSemantics(
  originAddress: string | undefined,
  destinationAddress: string | undefined,
): boolean {
  const hasOrigin = Boolean(originAddress?.trim().length);
  const hasDestination = Boolean(destinationAddress?.trim().length);
  return hasOrigin || hasDestination;
}

export function buildAddressFieldAccessibilityLabel(
  semanticPrefix: string,
  value: string,
): string {
  const emptyLabel = translate('trip.a11y_empty_field');
  const display = value.trim().length > 0 ? value : emptyLabel;
  return `${semanticPrefix}: ${display}`;
}

export function buildDestinationMarkerAccessibilityLabel(address: string): string {
  const text = address.trim() || translate('trip.a11y_unknown_address');
  return translate('trip.a11y_map_destination_marker', { address: text });
}
