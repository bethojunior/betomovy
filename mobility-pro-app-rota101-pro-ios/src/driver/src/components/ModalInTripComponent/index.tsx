import {If} from '../If';
import {ModalInTrip} from '../Modal/InTrip';

export const ModalInTripComponent = ({visible, setVisible, countVisible}) => {
  return (
    <If condition={visible}>
      <ModalInTrip
        visible={visible}
        setVisible={setVisible}
        visibleCountPanic={countVisible}
      />
    </If>
  );
};
