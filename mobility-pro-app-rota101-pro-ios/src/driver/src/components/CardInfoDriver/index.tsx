import {TouchableOpacity, View} from 'react-native';
import {
  Address,
  AddressContent,
  Ball,
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
import {Ionicons} from '@expo/vector-icons';
import {RFValue} from 'react-native-responsive-fontsize';
import {useTripProvider} from '../../context/Trip';
import {buildApp} from '../../../../constantBuild/config';
import {translate} from '../../../../client/locales';
import {useTripStatusProvider} from '../../context/TripStatus';
import {useAuth} from '../../../../context/auth';
import {IsToShowField} from '../../utils/cityConfig';
import {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
} from 'react-native-reanimated';
import {Dimensions} from 'react-native';
import {useEffect, useState} from 'react';
import {RenderSvgImage} from '../../../../common/RenderSvgImage';
import {ImageExpanded} from '../../../../client/components/ImageExpanded';
import Helper from '../../utils/Helper';

interface CardInfoDriverProps {
  markWaypoint: number;
  visible: boolean;
  setVisible: (visible: boolean) => void;
}

export const CardInfoDriver = ({
  markWaypoint,
  visible,
  setVisible,
}: CardInfoDriverProps) => {
  const [expand, setExpand] = useState(false);
  const {stateTrip, priceToShow} = useTripProvider();
  const {statusTrip} = useTripStatusProvider();
  const {cityConfig} = useAuth();
  const {tripAccepted} = stateTrip;

  const windowHeight = Dimensions.get('window').height;
  const positionY = useSharedValue(visible ? 0 : windowHeight);

  useEffect(() => {
    positionY.value = withTiming(visible ? 0 : windowHeight, {duration: 500});
  }, [visible]);

  const containerStyle = useAnimatedStyle(() => ({
    transform: [{translateY: positionY.value}],
  }));

  return (
    <Container style={[containerStyle]}>
      <ImageExpanded
        modalImage={expand}
        setModalImage={setExpand}
        source={
          tripAccepted?.centralId === null
            ? `${buildApp().HOST_IMAGE_CUSTOMER}${
                tripAccepted?.customer?.profileImage
              }`
            : `${buildApp().HOST_IMAGE_TRIP_TYPE}${tripAccepted?.fare?.picture}`
        }
      />
      <ContainerClose>
        <Ionicons
          onPress={() => setVisible(false)}
          name="close"
          size={RFValue(20)}
          color={theme.colors.primary}
        />
      </ContainerClose>
      {tripAccepted?.centralId === null ? (
        <TouchableOpacity onPress={() => setExpand(true)}>
          <ImageClient
            source={{
              uri: `${buildApp().HOST_IMAGE_CUSTOMER}${
                tripAccepted?.customer?.profileImage
              }`,
            }}
          />
        </TouchableOpacity>
      ) : (
        <RenderSvgImage
          image={`${buildApp().HOST_IMAGE_TRIP_TYPE}${
            tripAccepted?.fare?.picture
          }`}
          width={75}
          heigth={75}
        />
      )}

      <TextClient>
        {tripAccepted?.customer?.name?.split(' ')[0]}{' '}
        {
          tripAccepted?.customer?.name?.split(' ')[
            tripAccepted?.customer?.name?.split(' ').length - 1
          ]
        }
      </TextClient>
      <AddressContent>
        <View style={{alignItems: 'center'}}>
          <Ball style={{marginTop: 5}} />
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
          {IsToShowField('origin') && (
            <Address selected={statusTrip === translate('statusTrip.accepted')}>
              {tripAccepted?.origin?.address}
            </Address>
          )}

          {tripAccepted?.tripWayPoints?.length !== 0 &&
            tripAccepted?.tripWayPoints?.map((waypoint, index) => {
              return (
                <Address
                  style={{marginTop: 5}}
                  key={index}
                  selected={
                    statusTrip === translate('statusTrip.waypoint') &&
                    markWaypoint === index
                  }
                >
                  {waypoint?.address}
                </Address>
              );
            })}
          {IsToShowField('destination') && (
            <Address
              style={{marginTop: 10}}
              selected={statusTrip === translate('statusTrip.in_progress')}
            >
              {tripAccepted?.destination?.name}
            </Address>
          )}
        </View>
      </AddressContent>
      <ContainerPrice>
        {IsToShowField('price') && cityConfig !== null && (
          <View>
            <Price>
              {cityConfig?.typeMoney}
              {Helper.maskMoney(priceToShow())}
            </Price>
          </View>
        )}
        {IsToShowField('paymentForm') && (
          <ContainerRow>
            <SimpleTitle>{translate('service.payment_by')} </SimpleTitle>
            <SimpleText>{tripAccepted?.tripPaymentForm}</SimpleText>
          </ContainerRow>
        )}
      </ContainerPrice>
    </Container>
  );
};
