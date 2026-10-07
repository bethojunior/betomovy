import { If } from '../../../../client/components/If';
import { STATUS_IN_PROGRESS } from '../../constants/trip';
import { useTripProvider } from '../../context/Trip';
import React, { useState } from 'react';
import { useRouteTraveled } from '../../context/RouteTraveled';
import { TripProgressInfo } from './TripProgressInfo';
import { TripProgressInfoModal } from './TripProgressInfoModal';
import { Trip } from '~/interfaces/trip';

interface TripProgressTopInfoProps {
  hide?: boolean;
}

const TripProgressTopInfo: React.FC<TripProgressTopInfoProps> = ({ hide }) => {
  const [openModal, setOpenModal] = useState(false);

  const { metersRound, minutesTraveled } = useRouteTraveled();
  const { stateTrip: { tripAccepted } } = useTripProvider((context) => context);

  return (
    <If condition={tripAccepted?.status === STATUS_IN_PROGRESS && !hide}>
      <TripProgressInfo
        onPressBar={() => setOpenModal(true)}
        tripAccepted={tripAccepted as unknown as Trip}
        metersRound={metersRound}
        minutesTraveled={minutesTraveled}
      />

      <TripProgressInfoModal
        visible={openModal}
        setVisible={setOpenModal}
        tripAccepted={tripAccepted as unknown as Trip}
        metersRound={metersRound}
        minutesTraveled={minutesTraveled}
      />
    </If>
  );
};

export default TripProgressTopInfo;
