import {Modal, View, Text, TouchableOpacity} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {
  Header,
  HeaderTitle,
  ContainersButton,
  Ball,
  Line,
  AddressTitle,
  ContainerAddress,
  Address,
  Logo,
} from './styles';
import theme from '../../styles/theme';
import {ContainerButtonsAcceptDelivery} from '../ContainerButtonsAcceptDelivery';
import LottieView from 'lottie-react-native';

import {useEffect, useState} from 'react';
import {Audio} from 'expo-av';
import {useDeliveryOrder} from '../../../../context/DeliveryOrder';
import {useAuth} from '../../../../context/auth';
import Helper from '../../utils/Helper';
import {OrderProps} from '../../../../context/DeliveryOrder/types';
import {AnimatedSource} from '../../../../client/pages/AppApresentation/constants';
import {RFValue} from 'react-native-responsive-fontsize';
import logo from '../../../../../assets/logo.png';
import {useSong} from '../../hooks/song';

export const ModalDeliveryCall = () => {
  const [sound, setSound] = useState(null);
  const {orderTrip, setOrderTrip} = useDeliveryOrder();
  const {cityConfig} = useAuth();
  const {mountSong: mountSongCall} = useSong();

  const mountSong = async () => {
    const sound = await mountSongCall(
      require('../../assets/songs/assobio.mp3'),
      true,
      'soundCallTrip',
    );
    setSound(sound);
  };

  useEffect(() => {
    mountSong();
  }, []);

  useEffect(() => {
    if (orderTrip?.id) {
      try {
        sound?.setIsLoopingAsync(true);
        sound?.playAsync();
      } catch (error) {
        console.log(error);
      }
    } else {
      try {
        sound?.stopAsync();
      } catch (error) {
        console.log(error);
      }
    }
  }, [orderTrip]);

  const handleClear = async () => {
    setOrderTrip({} as OrderProps);
    try {
      sound?.stopAsync();
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <Modal animationType="slide" visible={orderTrip?.id ? true : false}>
      <SafeAreaView style={{flex: 1}} edges={['top', 'bottom']}>
        <Logo source={theme.images.logo ? {uri: theme.images.logo} : logo} />
        <View style={{flex: 1}}>
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
              maxHeight: RFValue(100),
            }}
            source={AnimatedSource.COMPONENT_TRIP_DELIVERY.uri}
          />
        </View>
        <Header>
          <HeaderTitle size={15} color={theme.colors.secondary}>
            Nova entrega!
          </HeaderTitle>
          <HeaderTitle size={25} color={theme.colors.primary}>
            {(cityConfig?.typeMoney || 'R$') + ''}{' '}
            {Helper.maskMoney(Number(orderTrip?.value))}
          </HeaderTitle>
        </Header>
        <View style={{padding: 10}}>
          <View style={{flexDirection: 'row'}}>
            <View>
              <Ball color="primary" />
              <Line />
              <Ball color="primary" />
            </View>
            <ContainerAddress>
              <AddressTitle>Coletas</AddressTitle>
              <Address>
                {orderTrip?.company?.fantasyName} -{' '}
                {orderTrip?.company_address?.address}
              </Address>
            </ContainerAddress>
          </View>
          <View style={{flexDirection: 'row', marginTop: 20}}>
            <View>
              <Ball color="primary" />
              <Line />
              <Ball color="primary" />
            </View>
            <ContainerAddress>
              <AddressTitle>Entregas</AddressTitle>
              <Address>
                {orderTrip?.delivery_order_place?.place?.address} - Nº:{' '}
                {orderTrip?.delivery_order_place?.place?.number ||
                  'Não informado'}
              </Address>
            </ContainerAddress>
          </View>
        </View>
        </View>
        <ContainersButton>
          <ContainerButtonsAcceptDelivery
            callback={handleClear}
            orderId={orderTrip?.id}
          />
        </ContainersButton>
      </SafeAreaView>
    </Modal>
  );
};
