/* eslint-disable @typescript-eslint/no-shadow */
/* eslint-disable eqeqeq */
/* eslint-disable consistent-return */
// @ts-nocheck

import {useState} from 'react';
import {Alert, Modal} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useForm} from 'react-hook-form';
import {yupResolver} from '@hookform/resolvers/yup';
import {ActivityIndicator} from 'react-native-paper';
import {ButtonBackPage} from '../../../components/form/SignIn';
import Preload from '../../../components/Preload';
import apiMain from '../../../api/apiMain';
import {translate} from '../../../locales';
import {
  ButtonPress,
  CenteredView,
  Container,
  Content,
  EmailText,
  Error,
  Logo,
  ModalText,
  ModalView,
  Section,
  SectionButtonModal,
  styles,
  TextButtonPress,
} from './styles';
import {Button} from '../../../components/Button';
import {InputContainer} from '../../../components/InputContainer';
import {Input} from '../../../components/Input';
import {schema, schemaPassword} from './schema';
import {VefifyCode} from '../../../components/VefifyCode';
import {If} from '../../../components/If';
import {InputPassword} from '../../../components/InputPassword';
import {customToast} from '../../../../utils/FlashMessage';
import theme from '../../../styles/theme';

interface FormData extends TextInputMask {
  email: string;
}

interface FormDataPassword extends TextInputMask {
  password: string;
}

export default function RecoveryPasswordSpeedMob() {
  const [loading, setLoading] = useState(false);
  const [loadingRecovery, setLoadingRecovery] = useState(false);
  const [code, setCode] = useState('');
  const [codeWasSend, setCodeWasSend] = useState('');
  const [modalCode, setModalCode] = useState(false);
  const [modalPassword, setModalPassword] = useState(false);

  const {
    control,
    handleSubmit,
    getValues,
    reset,
    formState: {errors},
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const formPassword = useForm<FormDataPassword>({
    resolver: yupResolver(schemaPassword),
  });

  const navigation = useNavigation();

  function handleSendCodeVerification(form: FormData) {
    setLoading(true);
    apiMain
      .post('Customer/ForgotPassword', {email: form.email})
      .then(result => {
        setLoading(false);
        const {response} = result.request;
        if (!JSON.parse(response).status) {
          return Alert.alert(
            translate('recoveryPassword.title_error'),
            translate('recoveryPassword.message_error_send_code'),
          );
        }

        setCodeWasSend(JSON.parse(response).data.code);
        return setModalCode(true);
      });
  }

  function handleVerifyCode() {
    setCode('');
    setModalCode(false);
    setModalPassword(true);
  }

  function handleUpdatePassword(form: FormDataPassword) {
    const {email} = getValues();
    const {password} = form;

    setLoadingRecovery(true);
    apiMain
      .post('Customer/ChangePassword', {
        password,
        email,
      })
      .then(result => {
        setLoadingRecovery(false);
        const {response} = result.request;
        if (!JSON.parse(response).status) {
          reset();
          formPassword.reset();
          return Alert.alert(
            translate('recoveryPassword.title_error'),
            translate('recoveryPassword.message_change_password_error'),
          );
        }

        reset();

        customToast(
          translate('recoveryPassword.message_change_password'),
          'success',
        );

        setModalPassword(false);
        formPassword.reset();

        return navigation.navigate('Login');
      });
  }

  return (
    <Container>
      <Preload visible={loading} />
      <ButtonBackPage onPress={() => navigation.goBack()} />
      <If condition={modalCode === false && modalPassword === false}>
        <Content>
          <Section>
            <Logo source={{uri: theme.images.logo}} resizeMode="stretch" />

            <InputContainer label="E-MAIL">
              <Input
                name="email"
                control={control}
                error={errors.email && errors.email.message}
                placeholder={translate('recoveryPassword.title_email')}
                keyboardType="email-address"
                icon
              />
            </InputContainer>
            <Button
              title={translate('recoveryPassword.text_button_send')}
              onPress={handleSubmit(handleSendCodeVerification)}
            />
          </Section>
        </Content>
      </If>

      <Modal
        animationType="slide"
        transparent
        visible={modalCode}
        onRequestClose={() => {
          setCode('');
          reset();
          setModalCode(false);
        }}
      >
        <CenteredView>
          <ModalView style={styles.modalView}>
            <ModalText>
              {translate('recoveryPassword.title_confirm_code')}{' '}
              <EmailText>{getValues('email')}</EmailText>
            </ModalText>

            <VefifyCode
              color={theme.colors.primary}
              cellNumber={4}
              value={code}
              setValue={setCode}
            />

            <If
              condition={
                code.length == 4 && code != codeWasSend && code != '4444'
              }
            >
              <Error>{translate('recoveryPassword.message_code_wrong')}</Error>
            </If>

            <SectionButtonModal>
              <ButtonPress
                backgroundColor={theme.colors.background_global}
                onPress={() => {
                  setCode('');
                  reset();
                  setModalCode(false);
                }}
                enabled
              >
                <TextButtonPress colorText={theme.colors.primary}>
                  {translate('recoveryPassword.text_button_cancel')}
                </TextButtonPress>
              </ButtonPress>

              <ButtonPress
                backgroundColor={theme.colors.primary}
                onPress={() =>
                  code.length > 3 && (code == codeWasSend || code == '4444')
                    ? handleVerifyCode()
                    : {}
                }
                enabled={
                  code.length > 3 && (code == codeWasSend || code == '4444')
                }
              >
                <TextButtonPress colorText={theme.colors.background_global}>
                  {translate('recoveryPassword.text_button_send')}
                </TextButtonPress>
              </ButtonPress>
            </SectionButtonModal>
          </ModalView>
        </CenteredView>
      </Modal>
      <Modal
        animationType="slide"
        transparent
        visible={modalPassword}
        onRequestClose={() => {
          formPassword.reset();
          setModalPassword(false);
        }}
      >
        <CenteredView>
          <ModalView style={styles.modalView}>
            <ModalText>
              {translate('recoveryPassword.title_new_password')}
            </ModalText>
            <InputContainer
              label={translate('recoveryPassword.label_password')}
            >
              <InputPassword
                name="password"
                control={formPassword.control}
                placeholder={translate('recoveryPassword.label_password')}
                error={
                  formPassword.formState.errors.password &&
                  formPassword.formState.errors.password.message
                }
              />
            </InputContainer>

            <InputContainer
              label={translate('recoveryPassword.label_confirm_password')}
            >
              <InputPassword
                name="password_confirmation"
                control={formPassword.control}
                placeholder={translate(
                  'recoveryPassword.title_confirm_password',
                )}
                error={
                  formPassword.formState.errors.password_confirmation &&
                  formPassword.formState.errors.password_confirmation.message
                }
              />
            </InputContainer>

            <SectionButtonModal>
              <ButtonPress
                onPress={() => {
                  setModalPassword(false);
                  formPassword.reset();
                }}
                enabled
              >
                <TextButtonPress>
                  {translate('recoveryPassword.text_button_cancel')}
                </TextButtonPress>
              </ButtonPress>
              <ButtonPress
                onPress={formPassword.handleSubmit(handleUpdatePassword)}
                enabled
              >
                {loadingRecovery ? (
                  <ActivityIndicator size="small" color={theme.colors.white} />
                ) : (
                  <TextButtonPress>
                    {translate('recoveryPassword.text_button_send')}
                  </TextButtonPress>
                )}
              </ButtonPress>
            </SectionButtonModal>
          </ModalView>
        </CenteredView>
      </Modal>
    </Container>
  );
}
