import React, {useState, FC, useEffect} from 'react';
import {Alert, Modal, Text, ToastAndroid} from 'react-native';
import I18n from "i18n-js";
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
import { formatPhone } from '../../utils/formatPhone';

type Props = {
  visible: boolean;
  setVisible: (visible: boolean) => void;
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

  const locale = I18n.locale;

  useEffect(() => {
    setPhone(formatPhone(currentPhone, false));
  }, [currentPhone]);

  const updatePhone = () => {
    const unmaskedPhone = formatPhone(phone, false);

    if (unmaskedPhone === '') {
      setTextError(translate('changePhone.text_empty'));
      return setError(true);
    }else {
      setError(false);
    }

    if (locale === 'pt_BR' && unmaskedPhone.length < 11) {
      setTextError(translate('changePhone.text_min_size'));
      return setError(true);
    }else {
      setError(false);
    }

    setLoading(true);
    apiMain.post('Customer/EditProfile', {phone: unmaskedPhone}).then(result => {
      setLoading(false);
      if (!result.data.status) {
        return Alert.alert(
          translate('changePhone.title_status_error'),
          translate('changePhone.text_status_error'),
        );
      }

      setUser({ ...user, phone: unmaskedPhone });
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
              value={formatPhone(phone)}
              onChangeText={(text: string) => setPhone(formatPhone(text, false))}
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