import {useState} from 'react';
import {Alert, Text} from 'react-native';
import {
  NavigationProp,
  ParamListBase,
  useNavigation,
} from '@react-navigation/native';
import {useAuth} from '../../../../context/auth';
import {useTripProvider} from '../../context/Trip';
import {TripScheduleProps} from '../../context/Trip/types';
import {useUserDriver} from '../../context/userDriver';
import {
  convertDatetimeToDate,
  convertDatetimeToTime,
} from '../../utils/FormatDate';
import {maskMoney} from '../../utils/money';
import {ContainerRow} from '../ContainerRow';
import {
  ButtonCancel,
  Container,
  ContainerCancel,
  ContainerHeader,
  Content,
  ContentItem,
  ContentPhoto,
  ContentTrip,
  Footer,
  Photo,
  TextCancel,
  TextDescription,
} from './styles';
import {IfLoaderInsideScreen} from '../IfLoaderInsideScreen';
import {translate} from '../../../../client/locales';
import {customToast} from '../../../../utils/FlashMessage';
import {buildApp} from '../../../../constantBuild/config';

interface Props {
  trip: TripScheduleProps;
  onPress?: string;
}
export const CardSchedule = ({trip, onPress}: Props) => {
  const {cityConfig} = useAuth();
  const {userDriverFind} = useUserDriver();
  const {cancelTripSchedule, acceptScheduled} = useTripProvider();
  const {navigate, goBack}: NavigationProp<ParamListBase> = useNavigation();

  const [loading, setLoading] = useState(false);

  const postCancelTrip = async tripReference => {
    setLoading(true);
    const data = await cancelTripSchedule(
      '4',
      userDriverFind.idDriver,
      tripReference,
    );
    if (!data.status) {
      customToast(data.message, 'danger');
    }
    customToast(data.message, 'success');
    setLoading(false);
    goBack();
  };
  const postAcceptTrip = async tripReference => {
    setLoading(true);
    const data = await acceptScheduled(
      parseInt(userDriverFind?.idDriver),
      tripReference,
    );
    if (!data.status) {
      console.log(`error${data}`);
      return customToast(data.message, 'danger');
    }
    customToast(data.message, 'success');
    setLoading(false);
    goBack();
  };
  const handleAcceptTrip = trip => {
    Alert.alert(
      translate('tripDriver.accept_trip'),
      translate('tripDriver.want_to_accept_this_trip'),
      [
        {
          text: translate('tripDriver.no'),
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {
          text: translate('tripDriver.yes'),
          onPress: () => postAcceptTrip(trip.schedule.tripReference),
        },
      ],
      {cancelable: false},
    );
  };

  return (
    <Container>
      <ContainerHeader>
        <Content>
          <ContentPhoto>
            <Photo
              source={{
                uri:
                  buildApp().HOST_IMAGE_CUSTOMER + trip?.customer?.profileImage,
              }}
              resizeMode="contain"
            />
          </ContentPhoto>

          <ContentTrip>
            <TextDescription>{trip?.customer?.name}</TextDescription>

            <RenderItemRow
              title={translate('tripDriver.travel_date')}
              description={
                ' ' +
                  convertDatetimeToDate(trip?.schedule?.schedule) +
                  ' - ' +
                  convertDatetimeToTime(trip?.schedule?.schedule) || ''
              }
            />

            <RenderItemRow
              title={translate('tripDriver.origin')}
              description={' ' + trip?.origin?.address}
            />

            <RenderItemRow
              title={translate('tripDriver.destiny')}
              description={trip?.destination?.name}
            />

            <RenderItemRow
              title={cityConfig?.typeMoney + maskMoney(parseFloat(trip?.price))}
              description={''}
            />
            <RenderItemRow
              title={translate('tripDriver.Tipo')}
              description={trip?.tripType}
            />
          </ContentTrip>
        </Content>
      </ContainerHeader>
      <Footer>
        <ContainerCancel>
          <IfLoaderInsideScreen loading={loading}>
            <ButtonCancel
              mode="text"
              onPress={() => {
                setLoading(true);
                onPress
                  ? handleAcceptTrip(trip)
                  : Alert.alert(
                      translate('tripDriver.cancel_trip'),
                      translate('tripDriver.want_to_cancel_this_trip'),
                      [
                        {
                          text: translate('tripDriver.no'),
                          onPress: () => console.log('Cancel Pressed'),
                          style: 'cancel',
                        },
                        {
                          text: translate('tripDriver.yes'),
                          onPress: () =>
                            postCancelTrip(trip.schedule.tripReference),
                        },
                      ],
                      {cancelable: false},
                    );
                setLoading(false);
              }}
            >
              <TextCancel>
                {' '}
                {onPress
                  ? translate('tripDriver.accept')
                  : translate('tripDriver.cancel')}
              </TextCancel>
            </ButtonCancel>
          </IfLoaderInsideScreen>
        </ContainerCancel>
      </Footer>
    </Container>
  );
};

const RenderItemRow = ({title, description}) => {
  return (
    <ContentItem>
      <TextDescription numberOfLines={2}>
        {title}
        {description}
      </TextDescription>
    </ContentItem>
  );
};
