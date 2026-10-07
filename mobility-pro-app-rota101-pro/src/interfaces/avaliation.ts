export type BlacklistAddress = {
  address: string;
  latitude: number;
  longitude: number;
};

export type RiskAreaAddress = BlacklistAddress & {
  tripReference: string;
  userId: string | number;
};

export type AvaliationMap = {
  selectedOrigin: number;
  selectedDestination: number;
  securityOrigin: number;
  securityDestination: number;
};

export type AvaliationPayload = {
  tripReference: string;
  rating: number;
  blacklistAddresses: BlacklistAddress[];
  riskAreas: RiskAreaAddress[];
};
