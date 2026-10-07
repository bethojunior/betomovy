// @ts-nocheck

import {useCallback, useEffect} from 'react';
import {Calendar} from '../Calendar';
import ModalFrame from '../../../../components/form/Modal';

export function ModalSchedule({setModal, date, setDate, hours, visible}) {
  const handleConfirmDate = useCallback(() => {
    setModal(false);
  }, []);

  useEffect(() => {
    if (date !== '') {
      handleConfirmDate();
    }
  }, [date, hours]);

  return (
    <ModalFrame
      visible={visible}
      setVisible={setModal}
      onClose={() => setModal(false)}
      hideConfirm
    >
      <>
        <Calendar
          dateSelected={date}
          onDaySelected={day => {
            setDate(day);
          }}
          onMinToday
        />
      </>
    </ModalFrame>
  );
}
