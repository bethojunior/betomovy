import React from 'react';
import { TripRealtimeComponent, TripRealtimeProps } from '../TripRealtimeComponent';

export const TripRealtimeInit: React.FC<TripRealtimeProps> = (props) => {
  return <TripRealtimeComponent {...props} />;
};
