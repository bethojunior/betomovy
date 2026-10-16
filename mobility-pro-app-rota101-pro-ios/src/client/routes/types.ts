import { NavigatorScreenParams } from '@react-navigation/native';

type PixConfirmedParams = { pixResult?: 'confirmed'; idTransaction?: string } | undefined;

export type TripRoutesParamList = {
  AppPermissions: undefined;
  Home: { noUnsubscribe?: boolean; pixCacheAction?: 'cancel' } | undefined;
  Trip: PixConfirmedParams;
  TripView: undefined;
  TripChat: undefined;
  TripChatView: undefined;
  TripSpeedMob: undefined;
  SharedTrips: undefined;
  SharedTripsChat: undefined;
  SuggestionTrips: undefined;
  TripPixPayment: {
    origin: 'TravelOptions' | 'Home';
    pixCode?: string;
    amount?: number | string;
    turbined?: boolean;
    offerInDriver?: number;
  };
};

export type AppParamList = {
  TripRoutes: NavigatorScreenParams<TripRoutesParamList>;
};
