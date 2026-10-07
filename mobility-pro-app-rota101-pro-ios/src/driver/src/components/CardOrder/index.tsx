import {View} from 'react-native';
import {SimpleLineIcons, Ionicons} from '@expo/vector-icons';
import {useSharedValue, withRepeat, withTiming} from 'react-native-reanimated';
import {
  CardContainer,
  Title,
  Subtitle,
  TouchFlex,
  ContainerEnd,
} from './styles';
import {useAuth} from '../../../../context/auth';
import {OrderProps} from '../../../../context/DeliveryOrder/types';
import {DragButtonDelivery} from '../ButtonOrderDelivery/DragButton';
import {OrderStatus} from './Constants';
import {DeliveryOrderService} from '../../../../context/DeliveryOrder/services';
import {useEffect, useState} from 'react';
import {useUserDriver} from '../../context/userDriver';
import {useDeliveryOrder} from '../../../../context/DeliveryOrder';
import {RFValue} from 'react-native-responsive-fontsize';
import theme from '../../styles/theme';
import {TimeLineDelivery} from '../TimeLineDelivery';
import {FloatButton} from '../FloatButton';
import {AnimatedSource} from '../../../../client/pages/AppApresentation/constants';
import LottieView from 'lottie-react-native';
import {ModalNavigation} from '../ModalNavigation';
import {useNavigation} from '@react-navigation/native';
import {ConfirmationCodeDelivery} from '../ConfirmationCodeDelivery';
import Helper from '../../utils/Helper';
import io from 'socket.io-client';
import {buildApp} from '../../../../constantBuild/config';
import {customToast} from '../../../../utils/FlashMessage';
interface Props {
  order: OrderProps;
}

export const CardOrder = ({order}: Props) => {
  const {cityConfig, generalSettings} = useAuth();
  const {userDriverFind} = useUserDriver();
  const {setOrdersActive} = useDeliveryOrder();
  const blinkAnim = useSharedValue(1);
  blinkAnim.value = withRepeat(withTiming(0, {duration: 1000}), -1, true);
  const [buttonText, setButtonText] = useState('Cheguei na coleta');
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const [modalNavigation, setModalNavigation] = useState(false);
  const {navigate} = useNavigation();

  useEffect(() => {
    // Verifique se o usuário é um entregador
    if (
      userDriverFind?.isDeliveryMan === '0' ||
      !userDriverFind?.isDeliveryMan
    ) {
      return;
    }
    // Inicialize a conexão de socket diretamente com a URL e opções desejadas
    const socket = io(buildApp().HOST_SOCKETV2, {
      query: `driverId=${userDriverFind?.idDriver}`,
    });

    socket.on(`trackOrder_${order?.id}`, order => {
      if (order?.canceledBy) {
        //@ts-ignore
        setOrdersActive(prev => {
          const newOrders = prev?.filter(
            item => Number(item?.id) !== Number(order?.id),
          );
          return newOrders || [];
        });
        customToast(
          `O pedido ${order?.company?.fantasyName || ''} foi cancelado`,
          'warning',
        );
        return;
      }
    });

    // Limpeza da conexão de socket quando o componente é desmontado
    return () => {
      socket.close();
    };
  }, []);

  const getActiveDeliveryOrder = async () => {
    if (userDriverFind?.isDeliveryMan === '1') {
      const data = await DeliveryOrderService.getActiveOrders(
        cityConfig?.cityId,
      );
      if (!data?.status) {
        setOrdersActive([]);
        return;
      }
      if (data?.response && data?.response?.length > 0) {
        setOrdersActive(data?.response);
      }
    }
  };

  const haveCode = () => {
    return Helper.generalSettingsActive(
      generalSettings,
      'enable_delivery_confirmation_code',
    );
  };

  const handleChangeOrder = async (status: string) => {
    try {
      setLoading(true);
      const response = await DeliveryOrderService.changeOrderStatus(
        order?.id,
        status,
      );
      if (!response?.status) {
        setLoading(false);

        return;
      }
      await getActiveDeliveryOrder();
      setLoading(false);

      return response;
    } catch (error) {
      console.log('Erro ao informar chegada:', JSON.stringify(error));
    }
  };

  const actionInformArrival = async () => {
    try {
      await handleChangeOrder('informArrival');
    } catch (error) {
      console.error('Erro ao informar chegada:', error);
    }
  };

  const actionWithdrawing = async () => {
    try {
      await handleChangeOrder('goOutForDelivery');
    } catch (error) {
      console.error('Erro ao informar chegada:', error);
    }
  };

  const actionOutForDelivery = async () => {
    try {
      await handleChangeOrder('arriveOnDelivery');
    } catch (error) {
      console.error('Erro ao informar chegada:', error);
    }
  };

  const actionArrived = async () => {
    try {
      if (haveCode()) {
        return;
      }
      await handleChangeOrder('deliver').then(async () => {
        setLoading(true);
        await finishedDeliveryOrder();
        setLoading(false);
      });
    } catch (error) {
      console.error('Erro ao informar chegada:', error);
    }
  };

  const finishedDeliveryOrder = async () => {
    try {
      await handleChangeOrder('finish');
      //@ts-ignore
      setOrdersActive(prev => {
        const newOrders = prev?.filter(
          item => Number(item?.id) !== Number(order?.id),
        );
        return newOrders || [];
      });
    } catch (error) {
      console.error('Erro ao informar chegada:', error);
    }
  };

  const handleActionButtonPress = () => {
    switch (order?.deliveryOrderStatusId) {
      case OrderStatus.ORDER_ACCEPTED_DELIVERY_MAN:
        actionInformArrival();
        break;
      case OrderStatus.ORDER_WITHDRAWING:
        actionWithdrawing();
        break;
      case OrderStatus.ORDER_OUT_FOR_DELIVERY:
        actionOutForDelivery();
        break;
      case OrderStatus.ORDER_ARRIVED:
        actionArrived();
        break;
      case OrderStatus.ORDER_DELIVERED:
        finishedDeliveryOrder();
        break;
    }
  };

  const getDragButtonDeliveryText = () => {
    switch (order?.deliveryOrderStatusId) {
      case OrderStatus.ORDER_ACCEPTED_DELIVERY_MAN:
        setButtonText('Cheguei na coleta');
        break;
      case OrderStatus.ORDER_WITHDRAWING:
        setButtonText('Saí da coleta');
        break;
      case OrderStatus.ORDER_OUT_FOR_DELIVERY:
        setButtonText('Cheguei na entrega');
        break;
      case OrderStatus.ORDER_ARRIVED:
        setButtonText('Confirmar entrega');
        break;
      case OrderStatus.ORDER_DELIVERED:
        setButtonText('Finalizando entrega');
        finishedDeliveryOrder();
        break;
    }
  };

  useEffect(() => {
    getDragButtonDeliveryText();
  }, [order]);

  return (
    <>
      <CardContainer>
        <ContainerEnd>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            <LottieView
              autoPlay
              style={{
                width: '100%',
                maxHeight: RFValue(50),
              }}
              source={AnimatedSource.COMPONENT_TRIP_ACTIVE_DELIVERY.uri}
            />
          </View>
          <View
            style={{
              flexDirection: 'row',
            }}
          >
            <FloatButton
              icon={
                <Ionicons
                  name={'ios-navigate-outline'}
                  color={theme.colors.primaryText}
                  size={RFValue(20)}
                />
              }
              onPress={() => {
                setModalNavigation(true);
              }}
            />
            <View
              style={{
                marginLeft: 10,
              }}
            >
              <FloatButton
                icon={
                  <Ionicons
                    name={'chatbox'}
                    color={theme.colors.primaryText}
                    size={RFValue(20)}
                  />
                }
                onPress={() => {
                  navigate('OrderMessageOption', {order});
                }}
              />
            </View>
          </View>
        </ContainerEnd>
        <TouchFlex
          onPress={() => {
            setOpen(value => !value);
          }}
        >
          <View>
            <Title>{order?.company?.fantasyName}</Title>
            <Subtitle>Cliente: {order?.customer?.name}</Subtitle>
          </View>

          <SimpleLineIcons
            name={open ? 'arrow-up' : 'arrow-down'}
            size={RFValue(15)}
            color={theme.colors.secondary}
            style={{
              alignSelf: 'center',
            }}
          />
        </TouchFlex>
        <TimeLineDelivery open={open} order={order} cityConfig={cityConfig} />

        <View
          style={{
            marginTop: 20,
          }}
        >
          <DragButtonDelivery
            statusTrip={loading ? 'loading' : order?.deliveryOrderStatusId}
            onPressButton={handleActionButtonPress}
            text={buttonText}
          />
        </View>
        <ModalNavigation
          modalNavigation={modalNavigation}
          setModalNavigation={setModalNavigation}
          delivery={order}
        />
      </CardContainer>
      <ConfirmationCodeDelivery
        order={order}
        callbackContinue={async () => {
          await handleChangeOrder('deliver').then(async () => {
            setLoading(true);
            await finishedDeliveryOrder();
            setLoading(false);
          });
        }}
      />
    </>
  );
};
