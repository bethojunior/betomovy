import { TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';
import theme from '../../styles/theme';
import { DeliveryOrderService } from '../../../../context/DeliveryOrder/services';
import { useState } from 'react';
import { IfLoaderInsideScreen } from '../IfLoaderInsideScreen';

interface Props {
  callback?: () => void;
  orderId?: number;
}

export const ContainerButtonsAcceptDelivery = ({ callback, orderId }: Props) => {
  const [loading, setLoading] = useState({
    accept: false,
    refused: false,
  });
  const handleAccept = async () => {
    setLoading({
      ...loading,
      accept: true,
    });
    const response = await DeliveryOrderService.acceptOrder(orderId);
    if (!response?.status) {
      console.log('Erro ao aceitar pedido');
    }
    callback && callback();
    setLoading({
      ...loading,
      accept: false,
    });
  };

  const handleRefuse = async () => {
    setLoading({
      ...loading,
      refused: true,
    });
    const response = await DeliveryOrderService.refuseOrder(orderId);
    if (!response?.status) {
      console.log('Erro ao recusar pedido');
    }
    callback && callback();
    setLoading({
      ...loading,
      refused: false,
    });
  };

  return (
    <>
      <IfLoaderInsideScreen loading={loading.refused}>
        <TouchableOpacity
          onPress={handleRefuse}
          disabled={loading.accept || loading.refused}
        >
          <AntDesign
            size={RFValue(40)}
            name="close-circle"
            color={theme.colors.red}
          />
        </TouchableOpacity>
      </IfLoaderInsideScreen>
      <IfLoaderInsideScreen loading={loading.accept}>
        <TouchableOpacity
          onPress={handleAccept}
          disabled={loading.accept || loading.refused}
        >
          <AntDesign
            size={RFValue(40)}
            name="check-circle"
            color={theme.colors.primary}
          />
        </TouchableOpacity>
      </IfLoaderInsideScreen>
    </>
  );
};
