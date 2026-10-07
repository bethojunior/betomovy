import {Ionicons} from '@expo/vector-icons';
import {Image, Modal, View} from 'react-native';
import {RFValue} from 'react-native-responsive-fontsize';
import {Container, ContainerImage, ImageExp} from './styles';

interface ImageExpandedProps {
  modalImage: boolean;
  setModalImage: any;
  source: string;
}

export const ImageExpanded = (props: ImageExpandedProps) => {
  const {modalImage, setModalImage, source} = props;

  return (
    <Modal
      visible={modalImage}
      transparent={true}
      animationType="slide"
      onRequestClose={() => {
        setModalImage(false);
      }}
    >
      <Container>
        <Ionicons
          style={{
            position: 'absolute',
            top: RFValue(40),
            right: RFValue(10),
            zIndex: 1,
          }}
          onPress={() => {
            setModalImage(false);
          }}
          name="close-circle-outline"
          size={RFValue(40)}
          color="#fff"
        />
        <ContainerImage>
          <ImageExp source={{uri: source}} resizeMode="contain" />
        </ContainerImage>
      </Container>
    </Modal>
  );
};
