import {useEffect, useState} from 'react';
import {OrderProps} from '../../../../context/DeliveryOrder/types';
import {useAuth} from '../../../../context/auth';
import Helper from '../../utils/Helper';
import {ModalCode} from './ModalCode';
import {View} from 'react-native';
import {OrderStatus} from '../CardOrder/Constants';

interface Props {
  order: OrderProps;
  callbackContinue: () => void;
}

export const ConfirmationCodeDelivery = ({order, callbackContinue}: Props) => {
  const {generalSettings} = useAuth();
  const [modalCode, setModalCode] = useState(false);

  const haveCode = () => {
    if (
      Helper.generalSettingsActive(
        generalSettings,
        'enable_delivery_confirmation_code',
      ) &&
      order?.deliveryOrderStatusId === OrderStatus.ORDER_ARRIVED
    ) {
      setModalCode(true);
    }
  };

  const handleCode = async (code: string) => {
    if (Number(code) === Number(order?.verificationCode)) {
      callbackContinue && callbackContinue();
      setModalCode(false);
    }
  };

  useEffect(() => {
    haveCode();
  }, [order]);

  return (
    <ModalCode
      isVisible={modalCode}
      onClose={() => setModalCode(false)}
      onConfirm={handleCode}
    />
  );
};
