import React, { useState, FC, useEffect } from 'react';
import { Alert, Modal, ToastAndroid } from 'react-native';
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
import Helper from '../../utils/Helper';
import { translate } from '../../locales';
import { useAuth } from '../../../context/auth';

type Props = {
  visible: boolean;
  setVisible: (val: boolean) => void;
  currentEmail: string;
};

const ChangeEmailModal: FC<Props> = ({ visible, setVisible, currentEmail }) => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState(false);
  const [textError, setTextError] = useState('');
  const [loading, setLoading] = useState(false);

  const { user, setUser } = useAuth();

  useEffect(() => {
    setEmail(currentEmail);
  }, [currentEmail]);

  const updateEmail = () => {
    if (email === '') {
      setTextError(translate('changeEmail.text_empty'));
      return setError(true);
    }

    if (!Helper.isEmailValid(email)) {
      setTextError(translate('changeEmail.text_invalid'));
      return setError(true);
    }

    setError(false);
    setLoading(true);
    apiMain.post('Customer/EditProfile', { email }).then(result => {
      setLoading(false);

      if (!result.data.status) {
        return Alert.alert(
          translate('changeEmail.title_status_error'),
          translate('changeEmail.text_status_error'),
        );
      }

      setUser({ ...user, email });
      setVisible(false);
      return ToastAndroid.showWithGravity(
        translate('changeEmail.text_status_success'),
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
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
          <ModalContent style={{ padding: 20 }}>
            {error && <TextError>{textError}</TextError>}
            <SimpleText>{translate('changeEmail.text_email')}</SimpleText>
            <Input
              autoCapitalize="characters"
              keyboardType="email-address"
              value={email}
              onChangeText={(text: string) => setEmail(text)}
              style={{ padding: 5 }}
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
                  updateEmail();
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

export default ChangeEmailModal;
