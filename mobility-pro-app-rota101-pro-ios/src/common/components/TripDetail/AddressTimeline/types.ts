export interface AddressPoint {
  label: string;
  primaryText: string;
  secondaryText?: string;
}

export interface AddressTimelineProps {
  origin: AddressPoint;
  waypoints?: AddressPoint[];
  destination: AddressPoint;
  stopsToggleLabel?: string;
}
