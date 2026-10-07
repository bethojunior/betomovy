export const SHARE_TRIP_ADDRESS_MAX_LENGTH = 120;

export const SHARE_TRIP_ROUTE_DOT = {
  origin: "#069509",
  waypoint: "#999999",
  destination: "#f30000",
} as const;

export type ShareTripRouteDotVariant = keyof typeof SHARE_TRIP_ROUTE_DOT;
