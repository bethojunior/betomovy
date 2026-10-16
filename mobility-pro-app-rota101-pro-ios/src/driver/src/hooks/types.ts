import { NativeScrollEvent, NativeSyntheticEvent, ScrollView } from 'react-native';

export interface WaypointState {
  id: string;
  value: string;
  data: Record<string, any> | null;
  suggestions: any[];
}

export interface WaypointForApi {
  address: string;
  latitude: number | string;
  longitude: number | string;
  neighborhood?: string | null;
  cityId?: number | null;
}

export interface DevicePermissionsStatus {
  foreground: boolean;
  background: boolean;
  media: boolean;
  camera: boolean;
  audio: boolean;
  notifications: boolean;
}

export interface DriverAppReportParams {
  driverId: number;
  userId: number;
  nickname: string;
}

export interface TripFareBreakdown {
  basePrice: number;
  distancePrice: number;
  timePrice: number;
  taxPrice: number;
  additionalValue: number;
  customerTaxes: { label: string; value: number }[];
  total: number;
}

export interface DriverAppReportResult {
  success: boolean;
  message: string | null;
}

export interface ScrollToFocusedInputResult {
  scrollRef: React.RefObject<ScrollView>;
  scrollToRow: (rowRef: React.RefObject<any>) => void;
  onScroll: (event: NativeSyntheticEvent<NativeScrollEvent>) => void;
}
