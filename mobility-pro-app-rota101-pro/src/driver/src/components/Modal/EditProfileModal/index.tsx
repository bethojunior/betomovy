import {useEffect, useState} from 'react';
import I18n from "i18n-js";
import {View} from 'react-native';
import ModalFrame from '../../../../../client/components/form/Modal';
import {translate} from '../../../../../client/locales';
import {useAuth} from '../../../../../context/auth';
import {customToast} from '../../../../../utils/FlashMessage';
import apiMainDriver from '../../../api/apiMain';
import {useUserDriver} from '../../../context/userDriver';
import {Content, Input, SimpleText, Title} from './styles';
import { formatPhone } from '../../../../../client/utils/formatPhone';

interface Props {
  visible: boolean;
  setVisible: (value: boolean) => void;
  type: 'email' | 'password' | 'phone';
}

export default function EditProfileModal({visible, setVisible, type}: Props) {
  const [value, setValue] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState(false);
  const [textError, setTextError] = useState('');
  const [loading, setLoading] = useState(false);
  const locale = I18n.locale;
  const {userDriverFind, setUserDriverFind} = useUserDriver();
  const {userDriver, setUserDriver} = useAuth();

  async function updatePassword() {
    if (value === '' || currentPassword === '' || confirmPassword === '') {
      setTextError(translate('driverProfile.text_required_fields'));
      return setError(true);
    }

    if (value.length < 6) {
      setTextError(translate('driverProfile.text_min_password'));
      return setError(true);
    }

    if (value !== confirmPassword) {
      setTextError(translate('driverProfile.text_password_not_match'));
      return setError(true);
    }

    setLoading(true);
    await apiMainDriver
      .post('Driver/CheckPassword', {
        password: currentPassword,
      })
      .then(({data}) => {
        if (!data.status) {
          setLoading(false);
          setTextError(data.message);
          return setError(true);
        }

        return updateData();
      });
    return '';
  }

  async function updateData() {
    setError(false);

    if (value === '') {
      setTextError(translate('driverProfile.text_empty_field'));
      return setError(true);
    }

    if (locale === 'pt_BR' && value.length < 11) {
      setTextError(translate('changePhone.text_min_size'));
      return setError(true);
    }

    const formattedValue = formatPhone(value, false);

    setLoading(true);
    await apiMainDriver
      .post('driver/edit', {
        stdObject: [
          {
            [type]: formattedValue,
            driverId: userDriverFind.idDriver,
            idUser: userDriverFind.userId,
          },
        ],
      })
      .then(({data}) => {
        setLoading(false);
        if (!data.status) {
          setTextError(data.message);
          return setError(true);
        }

        if (type === 'email') {
          userDriver.email = formattedValue;
          setUserDriver(userDriver);
        }
        if (type === 'phone') {
          userDriverFind.phone = formattedValue;
          setUserDriverFind(userDriverFind);
        }

        setVisible(false);
        setError(false);
        setValue('');
        setCurrentPassword('');
        setConfirmPassword('');
        return customToast(translate('driverProfile.text_success'), 'success');
      });
    return '';
  }

  return (
    <ModalFrame
      visible={visible}
      setVisible={setVisible}
      onClose={() => {
        setVisible(false);
        setError(false);
        setValue('');
        setCurrentPassword('');
        setConfirmPassword('');
      }}
      onPressConfirm={() => {
        // eslint-disable-next-line no-unused-expressions
        type === 'password' ? updatePassword() : updateData();
      }}
      textError={textError}
      error={error}
      isLoading={loading}
    >
      <Content>
        <Title>
          {translate('driverProfile.modal_title')}{' '}
          {translate(`driverProfile.type_${type}`)}
        </Title>
        {type === 'password' ? (
          <View>
            <SimpleText>
              {translate('driverProfile.text_current_password')}
            </SimpleText>
            <Input
              autoCapitalize="none"
              secureTextEntry
              value={currentPassword}
              onChangeText={text => setCurrentPassword(text)}
            />
            <SimpleText>
              {translate('driverProfile.text_new_password')}
            </SimpleText>
            <Input
              autoCapitalize="none"
              secureTextEntry
              value={value}
              onChangeText={text => setValue(text)}
            />
            <SimpleText>
              {translate('driverProfile.text_confirm_password')}
            </SimpleText>
            <Input
              autoCapitalize="none"
              secureTextEntry
              value={confirmPassword}
              onChangeText={text => setConfirmPassword(text)}
            />
          </View>
        ) : (
          <View>
            <SimpleText>
              {translate('driverProfile.text_inform_your')}{' '}
              {translate(`driverProfile.type_${type}`)}{' '}
            </SimpleText>
            <Input
              keyboardType={type === 'email' ? 'email-address' : 'numeric'}
              value={formatPhone(value)}
              onChangeText={text => setValue(formatPhone(text, false))}
            />
          </View>
        )}
      </Content>
    </ModalFrame>
  );
}