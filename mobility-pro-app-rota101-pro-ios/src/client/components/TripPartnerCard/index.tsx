import { Fragment, useEffect, useState } from 'react';
import { Alert, Share, View } from 'react-native';
import { TripProps } from '../../contexts/Trip/types';
import { useTrip } from '../../contexts/Trip';
import { useNavigation } from '@react-navigation/native';
import { AntDesign, Feather, MaterialIcons, Ionicons } from '@expo/vector-icons';
import {
  ButtonCancel,
  ButtonMessage,
  ButtonSection,
  ClientSection,
  Container,
  Info,
  NameClient,
  RowStyle,
  TextCancel,
  TextMessage,
  TitleInfo,
  ImageClient,
} from './styles';
import theme from '../../styles/theme';
import { buildApp } from '../../../constantBuild/config';
import { RenderSvgImage } from '../../../common/RenderSvgImage';
import { translate } from '../../locales';
import { useAuth } from '../../../context/auth';
import { maskMoney } from '../../utils/money';
import { TripPartnerCardProps } from './types';
import Collapse from '../Collapse';
import { If } from '../If';
import { STATUS_IN_PROGRESS } from '../../constants/trip';
import { customToast } from '../../../utils/FlashMessage';
import apiMain from '../../api/apiMain';
import { useStoragePictures } from '../../../driver/src/hooks/useStoragePictures';

const TripPartnerCard = ({ trip, setVisible }: TripPartnerCardProps) => {
  const { cancelParterTripByCustomer } = useTrip();
  const { cityConfig } = useAuth();
  const navigation = useNavigation();
  const [linkShare, setLinkShare] = useState<string>('');

  const [detailsVisibility, setDetailsVisibility] = useState(false);
  const { getStoragePictureSpecific } = useStoragePictures();

  const whatchTrip = async (trip: TripProps) => {
    setVisible(false);
    navigation.navigate('TripRoutes', { screen: 'TripView', params: trip });
  };
  const shareTrip = async (tripReference: string) => {
    const { data } = await apiMain.get(
      `Trip/GetShareLink?tripReference=${tripReference}`,
    );

    if (!data.status) {
      console.log(data.message);
    }
    setLinkShare(data?.data);
    return data.data;
  };

  const onShare = async linkShare => {
    const message = `Estou indo, placa ${trip?.driver?.car?.plate} com motorista ${trip?.driver?.nickname} , Clique e acompanhe a minha corrida. ${linkShare}`;
    try {
      await Share.share({
        message: `${message}`,
      });
    } catch (error) {
      customToast(translate('toast.text_share_error'), 'danger');
    }
  };

  useEffect(() => {
    shareTrip(trip.tripReference);
  }, []);

  const cancelTrip = () => {
    Alert.alert(
      translate('trip.cancel_trip'),
      translate('trip.text_dialog_cancel'),
      [
        {
          text: translate('trip.acccept'),
          onPress: async () => {
            cancelParterTripByCustomer(trip.tripReference);
            setVisible(false);
          },
        },

        {
          text: translate('trip.recuse'),
          onPress: () => {
            console.log('Cancel Pressed');
          },
        },
      ],
      { cancelable: false },
    );
  };

  return (
    <Fragment>
      <Container onPress={() => setDetailsVisibility(!detailsVisibility)}>
        <RenderSvgImage
          width={70}
          heigth={70}
          image={`${getStoragePictureSpecific('tripType') ||
            buildApp().HOST_IMAGE_TRIP_TYPE
            }${trip?.fare?.picture}`}
        />
        <ClientSection>
          <NameClient>{trip?.customer?.name}</NameClient>
          <MaterialIcons
            name={
              !detailsVisibility ? 'keyboard-arrow-down' : 'keyboard-arrow-up'
            }
            color={theme.colors.primary}
            j
            size={30}
          />
        </ClientSection>
      </Container>

      <Collapse open={detailsVisibility}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '100%',
          }}
        >
          <View>
            <TitleInfo>
              {translate('tripPreAccepted.text_payment_form')}
            </TitleInfo>

            <Info
              style={{
                maxWidth: '80%',
              }}
            >
              {trip?.tripPaymentForm}
            </Info>
          </View>
          <View>
            <TitleInfo>{translate('tripPreAccepted.text_value')}</TitleInfo>
            <Info>
              {cityConfig?.typeMoney} {maskMoney(Number(trip?.price || 0))}
            </Info>
          </View>
        </View>

        <>
          <TitleInfo>{translate('tripPreAccepted.text_origin')}</TitleInfo>
          <Info>{trip?.origin?.address}</Info>
        </>

        {trip?.tripWayPoints?.length !== 0 &&
          trip?.tripWayPoints?.map(waypoint => (
            <View key={waypoint.id}>
              <TitleInfo>
                {translate('tripPreAccepted.text_waypoint')}
              </TitleInfo>
              <Info>{waypoint.address}</Info>
            </View>
          ))}
        <View style={{ marginBottom: 20 }}>
          <TitleInfo>{translate('tripPreAccepted.text_destination')}</TitleInfo>
          <Info>{trip?.destination?.name}</Info>
        </View>
        <View>
          <RowStyle
            style={{
              justifyContent: 'space-between',
            }}
          >
            <RowStyle>
              <ImageClient
                source={{
                  uri:
                    trip?.centralId === null
                      ? `${getStoragePictureSpecific('driver') ||
                      buildApp().HOST_IMAGE_DRIVER
                      }${trip?.driver?.profileImage}`
                      : `${getStoragePictureSpecific('tripType') ||
                      buildApp().HOST_IMAGE_TRIP_TYPE
                      }${trip?.fare?.picture}`,
                }}
              />
              <Info
                style={{
                  maxWidth: '80%',
                }}
              >
                {trip?.driver?.name?.split(' ')[0]}{' '}
                {
                  trip?.driver?.name?.split(' ')[
                  trip?.driver?.name?.split(' ').length - 1
                  ]
                }
              </Info>
            </RowStyle>

            <Ionicons
              style={{ marginTop: 5 }}
              name="md-share-social-sharp"
              size={30}
              color={theme.colors.primary}
              onPress={() => {
                onShare(linkShare);
              }}
            />
          </RowStyle>
        </View>
        <ButtonSection>
          <ButtonMessage
            onPress={() => {
              whatchTrip(trip);
            }}
          >
            <TextMessage>{'Visualizar'}</TextMessage>
            <AntDesign
              name="eye"
              size={20}
              color={theme.colors.secondary}
              style={{ marginLeft: 5 }}
            />
          </ButtonMessage>

          <ButtonCancel
            onPress={() => cancelTrip()}
            disabled={trip?.status === STATUS_IN_PROGRESS}
          >
            <TextCancel>{translate('tripPreAccepted.text_cancel')}</TextCancel>
            <Feather
              name="x"
              size={20}
              color={theme.colors.primaryText}
              style={{ marginLeft: 5 }}
            />
          </ButtonCancel>
        </ButtonSection>
      </Collapse>
    </Fragment>
  );
};

export default TripPartnerCard;
