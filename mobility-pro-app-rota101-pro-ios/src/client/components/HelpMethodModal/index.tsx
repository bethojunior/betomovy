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
  tripReference: string;
}

export default function HelpMethodModal({
  visible,
  setVisible,
  tripReference,
}: Props) {
  const [helpers, setHelpers] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigation = useNavigation();
  const listMethodsHelp = async () => {
    setLoading(true);
    try {
      const {data} = await apiMain.get('/cancellationReasons/getReports');
      if (!data?.status) {
        throw new Error(data?.message || 'Não foi possível carregar as opções de ajuda');
      }
      setHelpers(data?.data || []);
    } catch (error: any) {
      setHelpers([]);
      console.warn('HelpMethodModal:', error?.message || error);
    }
    setLoading(false);
  };

  useEffect(() => {
    listMethodsHelp();
  }, []);

  const navigateToHelp = (item: any) => {
    setVisible(false);
    navigation.navigate('ContactUs', {
      title: item.name,
      id: item?.idCancellationReasons,
      tripReference,
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
          <IfLoaderInsideScreen loading={loading}>
            <FlatList
              style={{paddingBottom: 10}}
              data={helpers}
              renderItem={PaymentMethod}
              keyExtractor={(item: any) => item?.idCancellationReasons}
            />
          </IfLoaderInsideScreen>
          {!loading && !helpers.length && <Title>Sem dados no momento</Title>}
        </Content>
      </View>
    </ModalFrame>
  );
}
