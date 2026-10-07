import { Text, TouchableOpacity, View } from 'react-native';
import {
  Address,
  AddressContent,
  Ball,
  ButtonImage,
  Container,
  ContainerClose,
  ContainerPrice,
  ContainerRow,
  ImageClient,
  Line,
  Price,
  SimpleText,
  SimpleTitle,
  Square,
  TextClient,
} from './styles';
import theme from '../../styles/theme';
import { Ionicons } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';
import { maskMoney } from '../../utils/money';
import {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import { Dimensions } from 'react-native';
import { useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../../context/auth';
import { useTrip } from '../../contexts/Trip';
import { buildApp } from '../../../constantBuild/config';
import { translate } from '../../locales';
import { ImageExpanded } from '../ImageExpanded';

interface CardInfoDriverProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
}

export const CardInfoClient = ({ visible, setVisible }: CardInfoDriverProps) => {
  const { cityConfig } = useAuth();
  const { stateTripCustomer } = useTrip();
  const { trip: tripAccepted } = stateTripCustomer;
  const [modalImage, setModalImage] = useState(false);

  const windowHeight = Dimensions.get('window').height;
  const positionY = useSharedValue(visible ? 0 : windowHeight);

  useEffect(() => {
    positionY.value = withTiming(visible ? 0 : windowHeight, { duration: 500 });
  }, [visible]);

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: positionY.value }],
  }));

  return (
    <Container style={[containerStyle]}>
      <ContainerClose>
        <Ionicons
          onPress={() => setVisible(false)}
          name="close"
          size={RFValue(20)}
          color={theme.colors.primary}
        />
      </ContainerClose>
      <ButtonImage
        onPress={() => {
          setModalImage(true);
        }}
      >
        <ImageClient
          source={{
            uri:
              tripAccepted?.centralId === null
                ? `${buildApp().HOST_IMAGE_DRIVER}${tripAccepted?.driver?.profileImage
                }`
                : `${buildApp().HOST_IMAGE_TRIP_TYPE}${tripAccepted?.fare?.picture
                }`,
          }}
        />
      </ButtonImage>

      <TextClient>
        {tripAccepted?.driver?.name?.split(' ')[0]}{' '}
        {
          tripAccepted?.driver?.name?.split(' ')[
          tripAccepted?.driver?.name?.split(' ').length - 1
          ]
        }
      </TextClient>
      <AddressContent>
        <View style={{ alignItems: 'center' }}>
          <Ball style={{ marginTop: 5 }} />
          <Line />
          {tripAccepted?.tripWayPoints?.length !== 0 &&
            tripAccepted?.tripWayPoints?.map(() => (
              <>
                <Ball />
                <Line />
              </>
            ))}
          <Square />
        </View>
        <View>
          <Address
            selected={tripAccepted?.status === translate('statusTrip.accepted')}
          >
            {tripAccepted?.origin?.address}
          </Address>
          {tripAccepted?.tripWayPoints?.length !== 0 &&
            tripAccepted?.tripWayPoints?.map((waypoint, index) => {
              return (
                <Address style={{ marginTop: 5 }} key={index} selected={false}>
                  {waypoint?.address}
                </Address>
              );
            })}
          <Address
            style={{ marginTop: 10 }}
            selected={
              tripAccepted?.status === translate('statusTrip.in_progress')
            }
          >
            {tripAccepted?.destination?.name}
          </Address>
        </View>
      </AddressContent>
      <ContainerPrice>
        <View>
          <Price>
            {cityConfig?.typeMoney}
            {maskMoney(
              Number(tripAccepted?.price)
            )}
          </Price>
        </View>
        <ContainerRow>
          <SimpleTitle>{translate('service.payment_by')} </SimpleTitle>
          <SimpleText>{tripAccepted?.tripPaymentForm}</SimpleText>
        </ContainerRow>
      </ContainerPrice>

      <ImageExpanded
        modalImage={modalImage}
        setModalImage={setModalImage}
        source={
          tripAccepted?.centralId === null
            ? `${buildApp().HOST_IMAGE_DRIVER}${tripAccepted?.driver?.profileImage
            }`
            : `${buildApp().HOST_IMAGE_TRIP_TYPE}${tripAccepted?.fare?.picture}`
        }
      />
    </Container>
  );
};
