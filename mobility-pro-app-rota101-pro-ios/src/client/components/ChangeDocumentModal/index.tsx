import React, {useState, FC, useEffect} from 'react';
import {Alert, Modal, ToastAndroid} from 'react-native';
import {
  Content,
  ModalContent,
  ContentButton,
  Button,
  Input,
  TextError,
  SimpleText,
} from './styles';
import Preload from '../Preload';
import apiMain from '../../api/apiMain';
import {translate} from '../../locales';
import {useAuth} from '../../../context/auth';
import {customToast} from '../../../utils/FlashMessage';

type Props = {
  visible: boolean;
  setVisible(boolean: boolean): () => void;
  currentDocument: string;
};

const ChangeDocumentModal: FC<Props> = ({
  visible,
  setVisible,
  currentDocument,
}) => {
  const [document, setDocument] = useState('');
  const [error, setError] = useState(false);
  const [textError, setTextError] = useState('');
  const [loading, setLoading] = useState(false);

  const {user, setUser, setUserData, userData} = useAuth();

  useEffect(() => {
    setDocument(currentDocument);
  }, [currentDocument]);

  const updateDocument = () => {
    if (document === '') {
      setTextError(translate('changeDocument.text_empty'));
      return setError(true);
    }

    setError(false);
    setLoading(true);
    apiMain.post('Customer/EditProfile', {document}).then(result => {
      setLoading(false);
      if (!result.data.status) {
        return Alert.alert(
          translate('changeDocument.title_status_error'),
          translate('changeDocument.text_status_error'),
        );
      }

      user.document = document;
      userData.document = document;
      setUserData(userData);
      setUser(user);
      setVisible(false);
      return customToast(
        translate('changeDocument.text_status_success'),
        'warning',
      );
    });
    return '';
  };

  return (
    <>
      <Preload visible={loading} />
      <Modal
        animationType="slide"
        transparent
        visible={visible}
        onRequestClose={() => {
          setVisible(false);
        }}
      >
        <Content>
          <ModalContent style={{padding: 20}}>
            {error && <TextError>{textError}</TextError>}
            <SimpleText>{translate('changeDocument.text_document')}</SimpleText>
            <Input
              autoCapitalize="characters"
              keyboardType="numeric"
              value={document}
              onChangeText={(text: string) => setDocument(text)}
              style={{padding: 5}}
            />
            <ContentButton>
              <Button
                onPress={() => {
                  setVisible(false);
                  setError(false);
                }}
              >
                <SimpleText>{translate('buttonModal.cancel')}</SimpleText>
              </Button>
              <Button
                onPress={() => {
                  updateDocument();
                }}
              >
                <SimpleText>{translate('buttonModal.confirm')}</SimpleText>
              </Button>
            </ContentButton>
          </ModalContent>
        </Content>
      </Modal>
    </>
  );
};

export default ChangeDocumentModal;
