import { Modal, View, Keyboard, Animated } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useRef, useState } from 'react';
import { Button, Container, ContainerContent, Content } from './styles';
import { TextEdit } from '../TextEdit';
import InputFrame from '../form/InputFrame';
import { useTrip } from '../../contexts/Trip';
import { BackPage } from '../BackPage';
import theme from '../../styles/theme';
import { translate } from '../../locales';
import { customToast } from '../../../utils/FlashMessage';

interface Props {
  setTripType?: (tripType: string) => void;
  setIsTripNoDestinationAnother?: (data: boolean | null) => void;
}

export const ModalPartner = ({
  setTripType,
  setIsTripNoDestinationAnother,
}: Props) => {
  const { calculateAll, stateTripCustomer, dispatchTripCustomer } = useTrip();
  const navigation = useNavigation();

  const {
    itsForMe,
    origin,
    destination: destiny,
    waypoints,
    inputWho,
  } = stateTripCustomer;

  const [name, setName] = useState(inputWho.name);
  const [phone, setPhone] = useState(inputWho.phone);

  const shift = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', (e) => {
      Animated.timing(shift, {
        toValue: -e.endCoordinates.height / 2.5,
        duration: 250,
        useNativeDriver: true,
      }).start();
    });

    const hideSub = Keyboard.addListener('keyboardDidHide', () => {
      Animated.timing(shift, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }).start();
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const onClose = async () => {
    const isNoDestinationAnother = JSON.parse(
      await AsyncStorage.getItem('@app:tripNoDestinationAnother'),
    );

    if (isNoDestinationAnother) {
      navigation.navigate('TripRoutes', { screen: 'Home' });
    }

    dispatchTripCustomer({
      type: 'update',
      field: 'itsForMe',
      arg: false,
    });
  };

  return (
    <Modal visible={itsForMe} transparent animationType="fade" onDismiss={onClose}>
      <Container>
        <Animated.View
          style={{
            transform: [{ translateY: shift }],
            width: '100%',
            alignItems: 'center',
          }}
        >
          <Content>
            <BackPage
              ml={-5}
              onPress={async () => {
                onClose();
                await AsyncStorage.removeItem('@app:tripNoDestination');
                await AsyncStorage.removeItem('@app:tripNoDestinationAnother');
                setIsTripNoDestinationAnother(null);
              }}
            />
            <ContainerContent>
              <View>
                <TextEdit color={theme.colors.secondary}>
                  {translate('myProfile.text_name')}
                </TextEdit>
                <InputFrame
                  value={name}
                  setValue={(value: string) => setName(value)}
                  editable
                  keyboradType="default"
                />
              </View>

              <View>
                <TextEdit color={theme.colors.secondary}>
                  {translate('changePhone.text_number')}
                </TextEdit>
                <InputFrame
                  value={phone}
                  setValue={(value: string) => setPhone(value)}
                  editable
                  keyboradType="numeric"
                  maxLength={11}
                />
              </View>

              <Button
                onPress={async () => {
                  if (name === '' || phone === '') {
                    customToast(translate('panic.alert_incomplete'), 'warning');
                    return;
                  }

                  dispatchTripCustomer({
                    type: 'update',
                    field: 'inputWho',
                    arg: { name, phone },
                  });
                  dispatchTripCustomer({
                    type: 'update',
                    field: 'itsForMe',
                    arg: false,
                  });

                  await setTripType('tripPartner');

                  const isTripNoDestinationAnother = JSON.parse(
                    await AsyncStorage.getItem('@app:tripNoDestinationAnother'),
                  );

                  const originFormated = {
                    ...origin,
                    latitude: Number(origin.latitude),
                    longitude: Number(origin.longitude),
                  };

                  const destinyCalc: any = isTripNoDestinationAnother
                    ? originFormated
                    : destiny;

                  dispatchTripCustomer({
                    type: 'update',
                    field: 'destination',
                    arg: destinyCalc,
                  });

                  await calculateAll(originFormated, destinyCalc, waypoints);
                  setIsTripNoDestinationAnother(null);
                }}
              >
                <TextEdit color={theme.colors.primaryText}>
                  {translate('trip.confirm')}
                </TextEdit>
              </Button>
            </ContainerContent>
          </Content>
        </Animated.View>
      </Container>
    </Modal>
  );
};
