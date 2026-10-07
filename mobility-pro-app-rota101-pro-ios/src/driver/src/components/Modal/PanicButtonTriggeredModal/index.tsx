import {Linking, Modal} from 'react-native';
import {Ionicons} from '@expo/vector-icons';
import {
  Button,
  CloseButton,
  Content,
  Info,
  ModalContent,
  TextButton,
  Title,
} from './styles';
import {useAuth} from '../../../../../context/auth';
import {translate} from '../../../../../client/locales';

export const PanicButtonTriggeredModal = () => {
  const {showModalPanicButton, setShowModalPanicButton} = useAuth();
  const {status, body, additionalData} = showModalPanicButton;

  const openWindow = async () => {
    const {link, lat, lng} = JSON.parse(String(additionalData));

    if (link === null) {
      Linking.openURL(
        `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`,
      );
      return;
    }

    await Linking.openURL(`${link}`);
  };

  return (
    <Modal visible={status} animationType="slide" transparent>
      <Content>
        <ModalContent>
          <Title>
            {translate('dataAdditionalUserToOrder.title_alert_attention')}!
          </Title>
          <CloseButton
            onPress={() =>
              setShowModalPanicButton({
                status: false,
                body: '',
                additionalData: '',
              })
            }
          >
            <Ionicons
              name="close"
              size={25}
              color={'black'}
              style={{marginRight: 15}}
            />
          </CloseButton>

          <Info>{body}</Info>

          <Button onPress={openWindow}>
            <TextButton>{translate('trip.text_accompany')}</TextButton>
          </Button>
        </ModalContent>
      </Content>
    </Modal>
  );
};
