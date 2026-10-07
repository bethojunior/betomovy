// @ts-nocheck

import React from 'react';
import {FlatList} from 'react-native';
import {
  Container,
  PaymentMethodName,
  SelectPaymentMethodButton,
  Title,
} from './styles';
import {translate} from '../../locales';
import {useTripGL} from '../../contexts/TripGL';
import ModalFrame from '../form/Modal';

interface Props {
  visible: boolean;
  setVisible: (visible: boolean) => void;
}

const PaymentMethodModal = ({visible, setVisible}: Props) => {
  const {tripPaymentMethods, handleSelectedPaymentMethod} = useTripGL();

  const PaymentMethod = ({item}) => (
    <SelectPaymentMethodButton
      onPress={() => {
        handleSelectedPaymentMethod(item);
        setVisible(false);
      }}
    >
      <PaymentMethodName>{item.name}</PaymentMethodName>
    </SelectPaymentMethodButton>
  );

  return (
    <ModalFrame
      visible={visible}
      setVisible={setVisible}
      onClose={() => setVisible(false)}
      hideConfirm
    >
      <Container>
        <Title>{translate('schedule.method_payment')}</Title>
        <FlatList
          data={tripPaymentMethods}
          renderItem={PaymentMethod}
          keyExtractor={item => item.idTripPaymentForm}
        />
      </Container>
    </ModalFrame>
  );
};

export default PaymentMethodModal;
