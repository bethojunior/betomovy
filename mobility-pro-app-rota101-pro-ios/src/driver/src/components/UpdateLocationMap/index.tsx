import React from 'react';
import {RouteTraveledProvider} from '../../context/RouteTraveled';
import {OnListenerLocationComponent} from '../../components/OnListenerLocationComponent';

const UpdateLocationMap = (): JSX.Element => {
  return (
    // <RouteTraveledProvider>
    <OnListenerLocationComponent />
    // </RouteTraveledProvider>
  );
};

export default React.memo(UpdateLocationMap);
