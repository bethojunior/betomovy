import React, {useEffect, useState} from 'react';
import {FlatList, View} from 'react-native';
import {AntDesign} from '@expo/vector-icons';
import {useNavigation} from '@react-navigation/native';
import {
  Content,
  PaymentMethodName,
  SelectPaymentMethodButton,
  Title,
} from './styles';
import {translate} from '../../locales';
import apiMain from '../../api/apiMain';
import {IfLoaderInsideScreen} from '../IfLoaderInsideScreen';
import ModalFrame from '../form/Modal';

interface Props {
  visible: boolean;
  setVisible: (visible: boolean) => void;
}

export default function HelpMethodModal({visible, setVisible}: Props) {
  const [helpers, setHelpers] = useState([]);
  const navigation = useNavigation();
  const listMethodsHelp = async () => {
    try {
      const {data} = await apiMain.get('/TripReportType/GetAll');
      setHelpers(data.data);
    } catch {
      console.log('error');
    }
  };

  useEffect(() => {
    listMethodsHelp();
  }, []);

  const navigateToHelp = (item: any) => {
    setVisible(false);
    navigation.navigate('ContactUs', {
      title: item.name,
      id: item.idTripReportType,
    });
  };

  const PaymentMethod = ({item}: any) => (
    <SelectPaymentMethodButton
      onPress={() => {
        navigateToHelp(item);
      }}
    >
      <PaymentMethodName>{item.name}</PaymentMethodName>
      <AntDesign name="right" size={15} color="black" />
    </SelectPaymentMethodButton>
  );

  return (
    <ModalFrame
      visible={visible}
      setVisible={setVisible}
      onClose={() => setVisible(false)}
      hideConfirm
    >
      <View style={{maxHeight: 400}}>
        <Title>{translate('detailsTrip.types_help')}</Title>
        <Content>
          <IfLoaderInsideScreen loading={helpers.length === 0}>
            <FlatList
              style={{paddingBottom: 10}}
              data={helpers}
              renderItem={PaymentMethod}
              keyExtractor={(item: any) => item.idTripReportType}
            />
          </IfLoaderInsideScreen>
        </Content>
      </View>
    </ModalFrame>
  );
}
