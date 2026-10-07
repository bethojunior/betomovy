import React from 'react';
import { If } from '../If';
import { ModalInTrip } from '../Modal/InTrip';

type Props = {
  visible: boolean;
  setVisible: (value: boolean) => void;
};

export const ModalInTripComponent: React.FC<Props> = ({ visible, setVisible }) => {

  return (
    <If condition={visible}>
      <ModalInTrip
        visible={visible}
        setVisible={setVisible}
      />
    </If>
  );
};
