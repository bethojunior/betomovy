// @ts-nocheck

import {FlatList} from 'react-native';
import {
  Content,
  PaymentMethodName,
  SelectPaymentMethodButton,
  Title,
  TitleSpeedMob,
  SelectPaymentMethodButtonSpeedMob
} from './styles';
import {useTrip} from '../../contexts/Trip';
import {translate} from '../../locales';
import ModalFrame from '../form/Modal';

import { FontAwesome } from '@expo/vector-icons'; 

interface PaymentMethodModalProps{
  visible: boolean;
  setVisible: (data: boolean) => void;
  isSpeedmob?:boolean;
}

export default function PaymentMethodModal({visible, setVisible, isSpeedmob}: PaymentMethodModalProps) {
  const {handleSelectedPaymentMethod, stateTripCustomer} = useTrip();
  const {tripPaymentMethods} = stateTripCustomer;

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

  const PaymentMethodSpeedmob = ({item}) => (
    <SelectPaymentMethodButtonSpeedMob
      onPress={() => {
        handleSelectedPaymentMethod(item);
        setVisible(false);
      }}
    >
      <FontAwesome style={{ marginRight: 5 }} name="money" size={24} color="black" />
      <PaymentMethodName>
        {item.name}
      </PaymentMethodName>
    </SelectPaymentMethodButtonSpeedMob>
  );

  return (
    <ModalFrame
      visible={visible}
      setVisible={setVisible}
      onClose={() => setVisible(false)}
      hideConfirm
    >
      {isSpeedmob && (
        <Content>
          <TitleSpeedMob>{translate('schedule.method_payment')}</TitleSpeedMob>
          <FlatList
            data={tripPaymentMethods}
            renderItem={PaymentMethodSpeedmob}
            keyExtractor={item => item.idTripPaymentForm}
          />
        </Content>
      )}
      {!isSpeedmob && (
        <Content>
          <Title>{translate('schedule.method_payment')}</Title>
          <FlatList
            data={tripPaymentMethods}
            renderItem={PaymentMethod}
            keyExtractor={item => item.idTripPaymentForm}
          />
        </Content>
      )}
    </ModalFrame>
  );
}
