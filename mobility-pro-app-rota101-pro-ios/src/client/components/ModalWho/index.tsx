import {useNavigation} from '@react-navigation/native';
import {useTrip} from '../../contexts/Trip';
import {translate} from '../../locales';
import theme from '../../styles/theme';
import ModalFrame from '../form/Modal';
import {TextEdit} from '../TextEdit';
import {Button, Container, ContainerContent, Content} from './styles';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Props {
  visible: boolean;
  setVisible: (value: boolean) => void;
  setIsTripNoDestinationAnother?: (data: boolean | null) => void;
}

export const ModalWho = ({
  visible,
  setVisible,
  setIsTripNoDestinationAnother,
}: Props) => {
  const {dispatchTripCustomer} = useTrip();
  const {navigate} = useNavigation();
  const onClose = (navigation = false) => {
    setVisible(false);
    dispatchTripCustomer({
      type: 'update',
      field: 'hideTravelOptions',
      arg: false,
    });

    dispatchTripCustomer({
      type: 'update',
      field: 'visibleLookUpAddressesModal',
      arg: false,
    });

    if (navigation) {
      navigate('Home');
    }
  };

  const onCloseTripNoDestinationModal = async () => {
    await AsyncStorage.setItem(
      '@app:tripNoDestinationAnother',
      JSON.stringify(true),
    );
    setIsTripNoDestinationAnother(true);
    setVisible(false);
  };

  return (
    <ModalFrame
      hideConfirm
      visible={visible}
      onClose={() => onClose(true)}
      setVisible={setVisible}
    >
      <Container>
        <TextEdit color={theme.colors.secondary} size={'large'}>
          {translate('tripAnother.call_who')}
        </TextEdit>
        <Content>
          <ContainerContent>
            <Button
              activeOpacity={0.8}
              onPress={() => {
                dispatchTripCustomer({
                  type: 'update',
                  field: 'itsForMe',
                  arg: false,
                });
                onClose();
              }}
            >
              <TextEdit color={theme.colors.primaryText}>
                {translate('tripAnother.for_me')}
              </TextEdit>
            </Button>
            <Button
              activeOpacity={0.8}
              onPress={async () => {
                const tripNoDestination = JSON.parse(
                  await AsyncStorage.getItem('@app:tripNoDestination'),
                );

                dispatchTripCustomer({
                  type: 'update',
                  field: 'itsForMe',
                  arg: true,
                });

                tripNoDestination ? onCloseTripNoDestinationModal() : onClose();
              }}
            >
              <TextEdit color={theme.colors.primaryText}>
                {translate('tripAnother.for_another')}
              </TextEdit>
            </Button>
          </ContainerContent>
        </Content>
      </Container>
    </ModalFrame>
  );
};
