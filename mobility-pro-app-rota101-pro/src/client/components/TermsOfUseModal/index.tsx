import { useState, FC, useEffect } from 'react';
import { Modal, ScrollView } from 'react-native';
import { Content, ModalContent, Button, SimpleText } from './styles';
import Preload from '../Preload';
import apiMain from '../../api/apiMain';

type Props = {
  visible: boolean;
  setVisible: (val: boolean) => void;
  colorText: string;
};

const TermsOfUseModal: FC<Props> = ({ visible, setVisible, colorText }) => {
  const [terms, setTerms] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    apiMain
      .get('termsUsePolicy/findByType?type=customer')
      .then(response => {
        setTerms(response?.data?.data?.description || '');
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={() => {
        setVisible(false);
      }}
    >
      <Preload visible={loading} />
      <Content>
        <ModalContent style={{ padding: 20 }}>
          <ScrollView>
            <SimpleText colorText={colorText}>{terms}</SimpleText>
          </ScrollView>
          <Button
            onPress={() => {
              setVisible(false);
            }}
          >
            <SimpleText colorText={colorText}>OK</SimpleText>
          </Button>
        </ModalContent>
      </Content>
    </Modal>
  );
};

export default TermsOfUseModal;
