import React, {useState, FC, useEffect} from 'react';
import {Alert, Modal, Text, ToastAndroid} from 'react-native';
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
import theme from '../../styles/theme';
import {useAuth} from '../../../context/auth';

type Props = {
  visible: boolean;
  setVisible(boolean: boolean): () => void;
  currentPhone: string;
};

const ChangePhoneNumberModal: FC<Props> = ({
  visible,
  setVisible,
  currentPhone,
}) => {
  const [phone, setPhone] = useState('');
  const [error, setError] = useState(false);
  const [textError, setTextError] = useState('');
  const [loading, setLoading] = useState(false);

  const {user, setUser} = useAuth();

  useEffect(() => {
    setPhone(currentPhone);
  }, [currentPhone]);

  const updatePhone = () => {
    if (phone === '') {
      setTextError(translate('changePhone.text_empty'));
      return setError(true);
    }

    if (phone.length < 9) {
      setTextError(translate('changePhone.text_min_size'));
      return setError(true);
    }

    setLoading(true);
    apiMain.post('Customer/EditProfile', {phone}).then(result => {
      setLoading(false);
      if (!result.data.status) {
        return Alert.alert(
          translate('changePhone.title_status_error'),
          translate('changePhone.text_status_error'),
        );
      }

      user.phone = phone;
      setUser(user);
      setVisible(false);
      return ToastAndroid.showWithGravity(
        translate('changePhone.text_status_success'),
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
          <ModalContent style={{padding: 20}}>
            {error && <TextError>{textError}</TextError>}
            <SimpleText>{translate('changePhone.text_number')}</SimpleText>
            <Input
              autoCapitalize="characters"
              keyboardType="numeric"
              value={phone}
              onChangeText={(text: string) => setPhone(text)}
              style={{
                padding: 5,
                color: theme.colors.secondary,
              }}
            />
            <ContentButton>
              <Button
                onPress={() => {
                  setVisible(false);
                }}
              >
                <SimpleText>{translate('buttonModal.cancel')}</SimpleText>
              </Button>
              <Button
                onPress={() => {
                  updatePhone();
                }}
              >
                <SimpleText>{translate('buttonModal.update')}</SimpleText>
              </Button>
            </ContentButton>
          </ModalContent>
        </Content>
      </Modal>
    </>
  );
};

export default ChangePhoneNumberModal;
