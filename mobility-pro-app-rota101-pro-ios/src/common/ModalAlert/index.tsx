import {
  Container,
  Body,
  ContentIcon,
  Title,
  ContentButtonCloseModal,
  ButtonCloseModal,
  TextButtonCloseModal,
  ContentModal,
} from './styles';

import {Modal} from 'react-native';
import {AntDesign, MaterialIcons} from '@expo/vector-icons';
import {RFValue} from 'react-native-responsive-fontsize';

type IconsType = 'success' | 'warning' | 'error' | 'info';

interface ModalAlertProps {
  visibleModal: boolean;
  handleSubmissModal: () => void;
  title: string;
  body?: string;
  icon: IconsType;
}

export const ModalAlert = ({
  visibleModal,
  handleSubmissModal,
  icon,
  title,
  body,
}: ModalAlertProps) => {
  const SwitchIcon = (icon: IconsType) => {
    switch (icon) {
      case 'success':
        return (
          <AntDesign name="checkcircleo" size={RFValue(60)} color="#008000" />
        );

      case 'warning':
        return <AntDesign name="warning" size={RFValue(60)} color="#F7CB14" />;

      case 'error':
        return (
          <MaterialIcons
            name="error-outline"
            size={RFValue(60)}
            color="#DC143C"
          />
        );
      case 'info':
        return (
          <AntDesign name="infocirlceo" size={RFValue(60)} color="#1BA8F0" />
        );
    }
  };

  return (
    <Modal
      transparent
      visible={visibleModal}
      onRequestClose={handleSubmissModal}
    >
      <Container>
        <ContentModal>
          <ContentIcon>{SwitchIcon(icon)}</ContentIcon>
          <Title>{title}</Title>
          <Body>{body}</Body>
          <ContentButtonCloseModal>
            <ButtonCloseModal onPress={handleSubmissModal}>
              <TextButtonCloseModal>Fechar</TextButtonCloseModal>
            </ButtonCloseModal>
          </ContentButtonCloseModal>
        </ContentModal>
      </Container>
    </Modal>
  );
};
