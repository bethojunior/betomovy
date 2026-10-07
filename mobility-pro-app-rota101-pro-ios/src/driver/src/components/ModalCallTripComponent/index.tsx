import {useTripProvider} from '../../context/Trip';
import {useUserDriver} from '../../context/userDriver';
import {If} from '../If';
import ModalCallTrip from '../Modal/ModalCallTrip';

export const ModalCallTripComponent = ({
  showInitModal,
  receivedNotification,
  setPreloadVisible,
}) => {
  const {userDriverFind} = useUserDriver();
  const {stateTrip} = useTripProvider();
  const {callDriverModal} = stateTrip;
  return (
    <If condition={callDriverModal}>
      <ModalCallTrip
        visible={callDriverModal}
        driverId={userDriverFind?.idDriver}
        showInitModal={showInitModal}
        receivedNotification={receivedNotification}
        setPreloadVisible={setPreloadVisible}
      />
    </If>
  );
};
