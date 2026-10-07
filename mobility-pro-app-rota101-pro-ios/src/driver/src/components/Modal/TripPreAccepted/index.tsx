import {useState} from 'react';
import {AntDesign, Feather} from '@expo/vector-icons';
import {Alert, View} from 'react-native';
import {useTheme} from 'styled-components';
import {
  NavigationProp,
  ParamListBase,
  useNavigation,
} from '@react-navigation/native';
import {
  ButtonCancel,
  ButtonMessage,
  ButtonSection,
  ClientSection,
  Container,
  Info,
  NameClient,
  Photo,
  TextCancel,
  TextMessage,
  TitleInfo,
} from './styles';
import ModalFrame from '../ModalFrame';
import {maskMoney} from '../../../../../client/utils/money';
import {IsToShowField} from '../../../utils/cityConfig';
import {useAuth} from '../../../../../context/auth';
import {useTripProvider} from '../../../context/Trip';
import {ModalCancellationReasons} from '../CancellationReason';
import {useUserDriver} from '../../../context/userDriver';
import {translate} from '../../../../../client/locales';
import {buildApp} from '../../../../../constantBuild/config';
import {customToast} from '../../../../../utils/FlashMessage';

interface ModalProps {
  visible: boolean;
  setVisible: (visible: boolean) => void;
}

export const ModalTripPreAccepted = ({visible, setVisible}: ModalProps) => {
  const [cancellationReasonsModal, setCancellationReasonsModal] =
    useState(false);

  const {cancel, stateTrip, dispatchTrip} = useTripProvider();
  const {cancelTrip, tripPreAccepted} = stateTrip;
  const {navigate}: NavigationProp<ParamListBase> = useNavigation();
  const {cityConfig} = useAuth();
  const {colors} = useTheme();
  const {userDriverFind} = useUserDriver();

  const cancelTripPreAccepted = (cancellationReasonId: number) => {
    if (cancellationReasonId === null) {
      return customToast(
        translate('tripPreAccepted.text_select_reason_to_cancel'),
        'warning',
      );
    }

    cancelTrip.tripReference = tripPreAccepted.tripReference;
    cancelTrip.generateCancellationFee = false;
    cancelTrip.driverId = Number(userDriverFind.idDriver);
    dispatchTrip({type: 'update', field: 'cancelTrip', arg: cancelTrip});

    return Alert.alert(
      translate('tripPreAccepted.title_attention'),
      translate('tripPreAccepted.text_attention'),
      [
        {
          text: translate('tripPreAccepted.text_continue'),
          onPress: () => {
            cancel(true);
          },
        },
        {
          text: translate('tripPreAccepted.text_cancel'),
          onPress: () => {
            return false;
          },
        },
      ],
    );
  };

  return (
    <>
      <ModalFrame
        visible={visible}
        onClose={() => setVisible(false)}
        setVisible={setVisible}
        title={translate('tripPreAccepted.title_trip_pre_accepted')}
        textCancel={translate('tripPreAccepted.text_close')}
        hideConfirm
      >
        <Container>
          <Photo
            source={{
              uri:
                tripPreAccepted?.centralId === null
                  ? `${buildApp().HOST_IMAGE_CUSTOMER}${
                      tripPreAccepted?.customer?.profileImage
                    }`
                  : `${buildApp().HOST_IMAGE_TRIP_TYPE}${
                      tripPreAccepted?.fare?.picture
                    }`,
            }}
          />
          <ClientSection>
            <NameClient>{tripPreAccepted?.customer?.name}</NameClient>
            <ButtonSection>
              <ButtonMessage
                onPress={() => {
                  setVisible(false);
                  navigate('TripChatDriver', {trip: tripPreAccepted});
                }}
              >
                <TextMessage>
                  {translate('tripPreAccepted.text_message')}
                </TextMessage>
                <AntDesign
                  name="message1"
                  size={20}
                  color={colors.secondary}
                  style={{marginLeft: 5}}
                />
              </ButtonMessage>
              <ButtonCancel
                onPress={() => {
                  setVisible(false);
                  setCancellationReasonsModal(true);
                }}
              >
                <TextCancel>
                  {translate('tripPreAccepted.text_cancel')}
                </TextCancel>
                <Feather
                  name="x"
                  size={20}
                  color={colors.primaryText}
                  style={{marginLeft: 5}}
                />
              </ButtonCancel>
            </ButtonSection>
          </ClientSection>
        </Container>

        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            width: '90%',
          }}
        >
          <View>
            {IsToShowField('paymentForm') && (
              <>
                <TitleInfo>
                  {translate('tripPreAccepted.text_payment_form')}
                </TitleInfo>

                <Info>{tripPreAccepted?.tripPaymentForm}</Info>
              </>
            )}
          </View>
          <View>
            <TitleInfo>{translate('tripPreAccepted.text_value')}</TitleInfo>
            <Info>
              {cityConfig?.typeMoney}{' '}
              {maskMoney(Number(tripPreAccepted?.price || 0))}
            </Info>
          </View>
        </View>

        {IsToShowField('origin') && (
          <>
            <TitleInfo>{translate('tripPreAccepted.text_origin')}</TitleInfo>
            <Info>{tripPreAccepted?.origin?.address}</Info>
          </>
        )}

        {tripPreAccepted?.tripWayPoints?.length !== 0 &&
          IsToShowField('quantityWaypoints') &&
          tripPreAccepted?.tripWayPoints?.map(waypoint => (
            <View key={waypoint.id}>
              <TitleInfo>
                {translate('tripPreAccepted.text_waypoint')}
              </TitleInfo>
              <Info>{waypoint.address}</Info>
            </View>
          ))}

        {IsToShowField('destination') && (
          <View style={{marginBottom: 20}}>
            <TitleInfo>
              {translate('tripPreAccepted.text_destination')}
            </TitleInfo>
            <Info>{tripPreAccepted?.destination?.name}</Info>
          </View>
        )}
      </ModalFrame>
      <ModalCancellationReasons
        visible={cancellationReasonsModal}
        setVisible={setCancellationReasonsModal}
        cancelTripAccepted={cancelTripPreAccepted}
      />
    </>
  );
};
