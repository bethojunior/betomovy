import React, {useState, FC} from 'react';
import {Alert, Modal, Text, ToastAndroid} from 'react-native';
import {
  Content,
  ModalContent,
  Input,
  Button,
  ContentButton,
  TextError,
  SimpleText,
} from './styles';
import apiMain from '../../api/apiMain';
import Preload from '../Preload';
import {translate} from '../../locales';
import theme from '../../styles/theme';

type Props = {
  visible: boolean;
  setVisible(boolean: boolean): () => void;
  email: string;
};

const ChangePasswordModal: FC<Props> = ({visible, setVisible, email}) => {
  const [loading, setLoading] = useState(false);
  const [currentPassoword, setCurrentPassoword] = useState('');
  const [newPassoword, setNewPassoword] = useState('');
  const [confirmPassoword, setConfirmPassoword] = useState('');
  const [error, setError] = useState(false);
  const [textError, setTextError] = useState('');

  const updatePassword = () => {
    if (
      currentPassoword === '' ||
      newPassoword === '' ||
      confirmPassoword === ''
    ) {
      setTextError(translate('changePassword.text_empty'));
      return setError(true);
    }

    if (confirmPassoword !== newPassoword) {
      setTextError(translate('changePassword.text_dont_match'));
      return setError(true);
    }

    setLoading(true);
    apiMain
      .post('Customer/CheckPassword', {password: currentPassoword})
      .then(result => {
        if (!result.data.status) {
          setLoading(false);
          setTextError(translate('changePassword.text_invalid'));
          return setError(true);
        }

        return '';
      });

    setError(false);
    apiMain
      .post('Customer/UpdatePassword', {
        password: newPassoword,
        email,
        withoutCode: true,
      })
      .then(result => {
        setLoading(false);
        if (!result.data.status) {
          return Alert.alert(
            translate('changePassword.title_status_error'),
            translate('changePassword.text_status_error'),
          );
        }

        setVisible(false);
        setCurrentPassoword('');
        setNewPassoword('');
        setConfirmPassoword('');
        return ToastAndroid.showWithGravity(
          translate('changePassword.text_status_success'),
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
          setCurrentPassoword('');
          setNewPassoword('');
          setConfirmPassoword('');
        }}
      >
        <Content>
          <ModalContent style={{padding: 20}}>
            {error && <TextError>{textError}</TextError>}

            <SimpleText>
              {translate('changePassword.text_current_password')}
            </SimpleText>
            <Input
              autoCapitalize="characters"
              secureTextEntry
              value={currentPassoword}
              onChangeText={(text: string) => setCurrentPassoword(text)}
              style={{padding: 5, color: theme.colors.secondary}}
            />
            <SimpleText>
              {translate('changePassword.text_new_password')}
            </SimpleText>
            <Input
              autoCapitalize="characters"
              secureTextEntry
              value={newPassoword}
              onChangeText={(text: string) => setNewPassoword(text)}
              style={{padding: 5, color: theme.colors.secondary}}
            />
            <SimpleText>
              {translate('changePassword.text_confirm_new_password')}
            </SimpleText>
            <Input
              autoCapitalize="characters"
              secureTextEntry
              value={confirmPassoword}
              onChangeText={(text: string) => setConfirmPassoword(text)}
              style={{padding: 5, color: theme.colors.secondary}}
            />
            <ContentButton>
              <Button
                onPress={() => {
                  setVisible(false);
                  setCurrentPassoword('');
                  setNewPassoword('');
                  setConfirmPassoword('');
                }}
              >
                <SimpleText>{translate('buttonModal.cancel')}</SimpleText>
              </Button>
              <Button
                onPress={() => {
                  updatePassword();
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

export default ChangePasswordModal;
