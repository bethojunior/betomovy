import {If} from '../If';
import {ModalFinishTrip} from '../Modal/FinishTrip';

export const ModalFinishTripComponent = ({
  visible,
  setVisible,
  showInitModal,
}) => {
  return (
    <If condition={visible}>
      <ModalFinishTrip
        visible={visible}
        setVisible={setVisible}
        showInitModal={showInitModal}
      />
    </If>
  );
};
