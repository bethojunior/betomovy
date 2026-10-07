import {
  Container,
  Body,
  ContentIcon,
  Title,
  ButtonCloseModal,
  ContentModal,
} from './styles';

import { Modal } from 'react-native';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';
import { RFValue } from 'react-native-responsive-fontsize';

type IconsType = 'success' | 'warning' | 'error' | 'info';

interface ModalAlertProps {
  visibleModal: boolean;
  handleSubmissModal: () => void;
  title: string;
  body?: string;
  icon?: IconsType;
  width?: number;
  height?: number | string;
}

export const ModalAlert = ({
  visibleModal,
  handleSubmissModal,
  icon,
  title,
  body,
  width,
  height,
}: ModalAlertProps) => {
  const SwitchIcon = (icon: IconsType) => {
    switch (icon) {
      case 'success':
        return (
          <AntDesign name="check-circle" size={RFValue(40)} color="#008000" />
        );

      case 'warning':
        return <AntDesign name="warning" size={RFValue(40)} color="#F7CB14" />;

      case 'error':
        return (
          <MaterialIcons
            name="error-outline"
            size={RFValue(40)}
            color="#DC143C"
          />
        );
      case 'info':
        return (
          <AntDesign name="info-circle" size={RFValue(40)} color="#1BA8F0" />
        );
      default:
        return null;
    }
  };

  return (
    <Modal
      transparent
      visible={visibleModal}
      onRequestClose={handleSubmissModal}
    >
      <Container>
        <ContentModal style={{ height: height ? (height as number) : 'auto' }}>
          <ContentIcon>{SwitchIcon(icon)}</ContentIcon>
          {title && <Title>{title}</Title>}
          {body && <Body>{body}</Body>}
          <ButtonCloseModal title='Fechar' onPress={handleSubmissModal} />
        </ContentModal>
      </Container>
    </Modal>
  );
};
