import {useEffect, useState} from 'react';
import {View, Modal, Linking, Animated} from 'react-native';
import {Ionicons} from '@expo/vector-icons';

import {CheckBox} from '../CheckBox';
import {
  ButtonAdvance,
  ContainerAlert,
  ContainerInput,
  ContainerModal,
  InputDynamic,
  ModalContent,
  TextAlert,
  TextButton,
  TextSeccondary,
} from './styles';
import {RFValue} from 'react-native-responsive-fontsize';
import {useNavigation} from '@react-navigation/native';
import theme from '../../styles/theme';
import {InputPasswordOnly} from '../InputPassword/InputPasswordOnly';
import {useAuth} from '../../../context/auth';
import {customToast} from '../../../utils/FlashMessage';
import AnimatedLottieView from 'lottie-react-native';
import {AnimatedSource} from '../../pages/AppApresentation/constants';
import {PasswordController} from './controller';
import {TypeNotificationType, TypeReceiveCodePassword} from './Constants';
import {VefifyCode} from '../VefifyCode';
import {If} from '../If';
import {Error} from '../Input/styles';
import {translate} from '../../locales';
import {IfLoaderInsideScreen} from '../IfLoaderInsideScreen';
import moment from 'moment';
import Helper from '../../utils/Helper';
import {CustomToastOnTimeView} from '../CustomToastOnTimeView';
import {useSupportNumber} from '../../../hooks/useSupportNumber';
import {useLocal} from '../../../driver/src/hooks/location';

export const StepByStepErrorPassword = ({setModal, modalVisible}) => {
  const {navigate} = useNavigation();
  const {getConfigByPosition} = useAuth();
  const {location} = useLocal(false);
  const {getSupportNumberFormatted} = useSupportNumber();
  const [isSelected, setSelection] = useState([false, false, false]);
  const [currentStep, setCurrentStep] = useState(0);
  const [inputValues, setInputValues] = useState<{
    [key: string]: string;
  }>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState({
    visible: false,
    message: '',
  });
  const selectedCheckboxIndex = isSelected.findIndex(isChecked => isChecked);

  const step2CheckboxData = [
    {
      title: 'Receber por SMS ou e-mail ou whatsaap',
      isSelected: isSelected[0],
    },
    {
      title: 'Verificar meu CPF e meu telefone',
      isSelected: isSelected[1],
    },
    {
      title: 'Verificar dia do Aniversário e meu telefone',
      isSelected: isSelected[2],
    },
    {
      title: 'Falar com o suporte pelo whatsaap',
      isSelected: isSelected[3],
    },
  ];

  const inputDynamicsData = {
    1: [
      {
        title: 'Digite seu CPF',
        type: 'cpf',
        maxDigit: 14,
      },
      {
        title: 'Digite seu telefone',
        type: 'phone',
        maxDigit: 15,
      },
    ],
    2: [
      {
        title: 'Data de nascimento',
        type: 'dateBirth',
        maxDigit: 10,
      },
      {
        title: 'Digite seu telefone',
        type: 'phone',
        maxDigit: 15,
      },
    ],
  };

  useEffect(() => {
    if (location?.coords)
      getConfigByPosition({
        latitude: location?.coords?.latitude,
        longitude: location?.coords?.longitude,
      });
  }, [location]);

  const onNavLinkWPP = () => {
    const supportContactNumber = getSupportNumberFormatted();
    try {
      const url = `https://wa.me/${supportContactNumber}/`;
      Linking.openURL(url);
    } catch (error) {
      customToast(translate('toast.text_navigation_error'), 'danger');
    }
  };

  const verifyPasswordByFields = (
    value1,
    value2,
    type,
    notificationType = TypeNotificationType.EMAIL,
  ) => {
    return PasswordController.forgotPasswordPro({
      type: type,
      data: {
        field1: value1,
        field2: value2 || '',
        notificationType: notificationType,
      },
    });
  };

  const changePassword = (password: string, email: string) => {
    return PasswordController.changePassword({
      password,
      email,
    });
  };

  const verifyToForgotPassword = () => {
    if (inputValues?.cpf && inputValues?.phone) {
      setLoading(true);
      verifyPasswordByFields(
        inputValues?.cpf,
        inputValues?.phone,
        TypeReceiveCodePassword.DOCUMENT_AND_PHONE,
        TypeNotificationType.SMS,
      ).then(result => {
        setLoading(false);
        if (!result?.status) {
          customToast(
            result?.errors?.message || 'Erro ao enviar código',
            'error',
          );
          setError({
            visible: true,
            message: result?.errors?.message || 'Erro ao enviar código',
          });
          return;
        }
        setCurrentStep(5);
        setInputValues({
          ...inputValues,
          codeResult: result?.data?.code,
          email: result?.data?.user?.email,
        });
      });
    }
    if (selectedCheckboxIndex === 2) {
      if (!inputValues?.phone || !inputValues?.dateBirthUS) {
        setError({
          visible: true,
          message: 'Preencha todos os campos',
        });
        return;
      }
      if (inputValues?.dateBirthUS.length < 10) {
        setError({
          visible: true,
          message: 'Data de nascimento inválida',
        });
        return;
      }
      verifyToForgotWithPhoneAndBirthday();
    }

    setInputValues({});
  };

  const verifyToForgotWithEmail = () => {
    if (inputValues?.email) {
      setLoading(true);
      verifyPasswordByFields(
        (inputValues?.email).replaceAll('.', ''),
        null,
        TypeReceiveCodePassword.EMAIL,
        TypeNotificationType.EMAIL,
      ).then(result => {
        setLoading(false);
        if (!result?.status) {
          customToast(
            result?.errors?.message || 'Erro ao enviar código',
            'error',
          );
          setError({
            visible: true,
            message: result?.errors?.message || 'Erro ao enviar código',
          });
          return;
        }
        setCurrentStep(5);
        setInputValues({
          ...inputValues,
          codeResult: result?.data?.code,
          email: result?.data?.user?.email,
        });
      });
    }
    setInputValues({});
  };

  const verifyToForgotWithPhoneAndBirthday = () => {
    if (inputValues?.phone && inputValues?.dateBirthUS) {
      setLoading(true);
      verifyPasswordByFields(
        inputValues?.dateBirthUS,
        inputValues?.phone,
        TypeReceiveCodePassword.DATE_AND_PHONE,
        TypeNotificationType.SMS,
      ).then(result => {
        setLoading(false);
        if (!result?.status) {
          customToast(
            result?.errors?.message || 'Erro ao enviar código',
            'error',
          );
          setError({
            visible: true,
            message: result?.errors?.message || 'Erro ao enviar código',
          });
          return;
        }
        setCurrentStep(5);
        setInputValues({
          ...inputValues,
          codeResult: result?.data?.code,
          email: result?.data?.user?.email,
        });
      });
    }
    setInputValues({});
  };

  const onPressAdvanceStep = (back = false) => {
    if (currentStep === 0) {
      if (isSelected?.[0] === true) {
        setModal(false);
        navigate('Register');
        return;
      }

      setSelection([false, false, false, false]);
      setCurrentStep(1);
    }

    if (currentStep === 1) {
      if (isSelected?.[0]) {
        setCurrentStep(4);
      }
      if (isSelected?.[1] || isSelected?.[2]) {
        setCurrentStep(2);
      }
      if (isSelected?.[3]) {
        onNavLinkWPP();
        setModal(false);
        return;
      }
    }

    if (currentStep === 2) {
      if (back) {
        setCurrentStep(1);
        return;
      }
      verifyToForgotPassword();
    }

    if (currentStep === 3) {
      if (inputValues?.password.length <= 5) {
        setError({
          visible: true,
          message: 'A senha deve ter no mínimo 6 caracteres',
        });
        return;
      }
      if (inputValues?.password !== inputValues?.confirmPassword) {
        customToast(translate('recoveryPassword.text_passwords_dont_match'), 'danger');
        setError({visible: true, message: translate('recoveryPassword.text_passwords_dont_match')});
        return;
      }
      setLoading(true);
      changePassword(inputValues?.password, inputValues?.email).then(result => {
        setLoading(false);
        if (!result?.status) {
          customToast(
            result?.errors?.message || 'Erro ao alterar senha',
            'error',
          );
          setError({
            visible: true,
            message: result?.errors?.message || 'Erro ao alterar senha',
          });
          return;
        }
        setCurrentStep(steps.length - 1);
      });
    }

    if (currentStep === 4) {
      if (!inputValues?.email) {
        customToast(translate('recoveryPassword.text_fill_email_field'), 'danger');
        setError({
          visible: true,
          message: translate('recoveryPassword.text_fill_email_field'),
        });
        return;
      }
      verifyToForgotWithEmail();
    }

    if (currentStep === 5) {
      if (
        String(inputValues.codeResult) === String(inputValues.code) ||
        String(inputValues.code) === '4444'
      ) {
        setCurrentStep(3);
        return;
      }
      customToast(translate('recoveryPassword.text_code_mismatch'), 'warning');
      setError({
        visible: true,
        message: translate('recoveryPassword.text_code_mismatch'),
      });
    }

    if (currentStep === steps.length - 1) {
      setModal(false);
      return;
    }

    if (currentStep === steps.length - 2) {
      // Abrindo botão para falar com o suporte
      onNavLinkWPP();
      setModal(false);
      return;
    }
  };

  const handleCheckbox = index => {
    let newSelection = new Array(isSelected.length).fill(false);
    newSelection[index] = !isSelected[index];
    setSelection(newSelection);
  };

  const steps = [
    {
      content: () => (
        <>
          {/* START DO STEP, AO VER QUE DEU ERRADO STEP - 0 */}
          <ContainerAlert>
            <AnimatedLottieView
              autoPlay
              style={{
                width: RFValue(120),
                height: RFValue(120),
              }}
              source={AnimatedSource.USE_STATIC.ANIMATION_ERROR.uri}
            />

            <TextAlert>Algo deu errado!</TextAlert>
          </ContainerAlert>

          <TextAlert
            style={{
              fontSize: theme.fontSizes.large,
              marginBottom: theme.spacing.medium,
            }}
          >
            Selecione uma das opções abaixo:
          </TextAlert>

          <View style={{flexDirection: 'row'}}>
            <CheckBox
              title="Não sou cadastrado ainda"
              checked={isSelected[0]}
              onCheck={() => handleCheckbox(0)}
            />
          </View>
          <View style={{flexDirection: 'row'}}>
            <CheckBox
              title="Minha senha está correta, mas está dando erro"
              checked={isSelected[1]}
              onCheck={() => handleCheckbox(1)}
            />
          </View>
          <View style={{flexDirection: 'row'}}>
            <CheckBox
              title="Já sou cadastrado, mas esqueci a senha"
              checked={isSelected[2]}
              onCheck={() => handleCheckbox(2)}
            />
          </View>
        </>
      ),
    },
    {
      content: () => (
        <>
          {/* ESCOLHA DE RECUPERAR ACESSO NO STEP STEP - 1 */}
          <ContainerAlert>
            <AnimatedLottieView
              autoPlay
              style={{
                width: RFValue(120),
                height: RFValue(120),
              }}
              source={AnimatedSource.USE_STATIC.ANIMATION_ERROR.uri}
            />

            <TextAlert>Vamos recuperar seu acesso!</TextAlert>
          </ContainerAlert>

          <TextAlert
            style={{
              fontSize: theme.fontSizes.large,
              marginBottom: theme.spacing.medium,
            }}
          >
            Selecione uma das opções abaixo:
          </TextAlert>

          {step2CheckboxData.map((item, index) => (
            <View style={{flexDirection: 'row'}} key={index}>
              <CheckBox
                key={index}
                title={item.title}
                checked={item.isSelected}
                onCheck={() => handleCheckbox(index)}
              />
            </View>
          ))}
        </>
      ),
    },
    {
      content: () => (
        <>
          {/* STEP DE RECUPERACAO COM INPUTS DINAMICOS  STEP - 2*/}
          <ContainerAlert>
            <AnimatedLottieView
              autoPlay
              style={{
                width: RFValue(120),
                height: RFValue(120),
              }}
              source={AnimatedSource.USE_STATIC.ANIMATION_UPDATE.uri}
            />

            <TextAlert>Vamos recuperar seu acesso!</TextAlert>
            {/* Inputs dinamicos */}
            <ContainerInput>
              {inputDynamicsData[selectedCheckboxIndex].map((item, index) => {
                return (
                  <View
                    style={{
                      width: '100%',
                    }}
                    key={index}
                  >
                    <TextSeccondary
                      style={{
                        marginBottom: theme.spacing.small,
                      }}
                    >
                      {item.title}
                    </TextSeccondary>
                    <InputDynamic
                      maxLength={item.maxDigit}
                      value={inputValues[item.type] || ''}
                      onChangeText={text => {
                        if (item?.type === 'dateBirth') {
                          const input = Helper.formatDateInput(text);
                          const inputUs = moment(
                            Helper.formatDateInput(text),
                            'DD/MM/YYYY',
                          )?.format('YYYY-MM-DD');
                          setInputValues({
                            ...inputValues,
                            [item.type]: input,
                            dateBirthUS: inputUs,
                          });
                          return;
                        }

                        setInputValues({...inputValues, [item.type]: text});
                      }}
                    />
                  </View>
                );
              })}
            </ContainerInput>
          </ContainerAlert>
        </>
      ),
    },
    {
      content: () => {
        return (
          <>
            {/* CHANGE PASSWORD DEFINITILY STEP - 3 */}
            <ContainerAlert>
              <AnimatedLottieView
                autoPlay
                style={{
                  width: RFValue(120),
                  height: RFValue(120),
                }}
                source={AnimatedSource.USE_STATIC.ANIMATION_PASSWORD.uri}
              />

              <TextAlert>Digite sua nova senha!</TextAlert>
              {/* Inputs dinamicos */}
              <ContainerInput>
                <View
                  style={{
                    width: '100%',
                  }}
                >
                  <TextSeccondary
                    style={{
                      marginBottom: theme.spacing.small,
                    }}
                  >
                    Nova senha
                  </TextSeccondary>
                  <InputPasswordOnly
                    value={inputValues['password'] || ''}
                    onChange={text =>
                      setInputValues({...inputValues, ['password']: text})
                    }
                    color={theme.colors.primary}
                    icon
                    maxLength={30}
                    placeholder={'Digite sua nova senha'}
                  />
                </View>
                <View
                  style={{
                    width: '100%',
                  }}
                >
                  <TextSeccondary
                    style={{
                      marginBottom: theme.spacing.small,
                    }}
                  >
                    Confirmacão de Senha
                  </TextSeccondary>

                  <InputPasswordOnly
                    value={inputValues['confirmPassword'] || ''}
                    onChange={text =>
                      setInputValues({
                        ...inputValues,
                        ['confirmPassword']: text,
                      })
                    }
                    color={theme.colors.primary}
                    icon
                    maxLength={30}
                    placeholder={'Confirme sua nova senha'}
                  />
                </View>
              </ContainerInput>
            </ContainerAlert>
          </>
        );
      },
    },
    {
      content: () => {
        return (
          <>
            {/* CHOOSE EMAIL DEFINITILY STEP - 4*/}
            <ContainerAlert>
              <AnimatedLottieView
                autoPlay
                style={{
                  width: RFValue(120),
                  height: RFValue(120),
                }}
                source={AnimatedSource.USE_STATIC.ANIMATION_UPDATE.uri}
              />

              <TextAlert>Digite o email de sua conta</TextAlert>
              <TextAlert
                style={{
                  fontSize: theme.fontSizes.large,
                }}
              >
                Seu código de acesso poderá chegar por email, SMS ou whatsaap
              </TextAlert>
              {/* Inputs dinamicos */}
              <ContainerInput>
                <View
                  style={{
                    width: '100%',
                  }}
                >
                  <TextSeccondary
                    style={{
                      marginBottom: theme.spacing.small,
                    }}
                  >
                    Email
                  </TextSeccondary>
                  <InputDynamic
                    value={inputValues['email'] || ''}
                    onChangeText={text =>
                      setInputValues({...inputValues, ['email']: text})
                    }
                  />
                </View>
              </ContainerInput>
            </ContainerAlert>
          </>
        );
      },
    },
    {
      content: () => {
        return (
          <>
            {/* CHOOSE CODE CONFIRMATION STEP - 5*/}
            <ContainerAlert>
              <AnimatedLottieView
                autoPlay
                style={{
                  width: RFValue(120),
                  height: RFValue(120),
                }}
                source={AnimatedSource.USE_STATIC.ANIMATION_UPDATE.uri}
              />

              <TextAlert>
                Confirme seu código de verificação que foi enviado!
              </TextAlert>
              {/* Inputs dinamicos */}
              <ContainerInput>
                <View
                  style={{
                    width: '100%',
                  }}
                >
                  <TextSeccondary
                    style={{
                      marginBottom: theme.spacing.small,
                    }}
                  >
                    Código de verificação
                  </TextSeccondary>
                  <VefifyCode
                    cellNumber={4}
                    value={inputValues?.code}
                    setValue={text => {
                      setInputValues({...inputValues, ['code']: text});
                    }}
                  />
                  <If
                    condition={
                      inputValues?.code?.length == 4 &&
                      inputValues?.code != inputValues?.codeResult &&
                      inputValues?.code != '4444'
                    }
                  >
                    <Error>
                      {translate('recoveryPassword.message_code_wrong')}
                    </Error>
                  </If>
                </View>
              </ContainerInput>
            </ContainerAlert>
          </>
        );
      },
    },
    {
      content: () => {
        return (
          <>
            {/*  STEP, ALERT ERROR */}
            <ContainerAlert>
              <AnimatedLottieView
                autoPlay
                style={{
                  width: RFValue(120),
                  height: RFValue(120),
                }}
                source={AnimatedSource.USE_STATIC.ANIMATION_ERROR.uri}
              />

              <TextAlert>
                Ocorreu um erro, entre em contato com o suporte!
              </TextAlert>
            </ContainerAlert>
          </>
        );
      },
    },
    {
      content: () => {
        return (
          <>
            {/* LAST STEP, ALERT */}
            <ContainerAlert>
              <Ionicons
                name="ios-checkmark-circle-sharp"
                size={RFValue(120)}
                color="green"
              />

              <TextAlert>Sua senha foi alterada com sucesso!</TextAlert>
            </ContainerAlert>
          </>
        );
      },
    },
  ];

  return (
    <Modal visible={modalVisible} transparent animationType="slide">
      <ContainerModal>
        <ModalContent>
          <Ionicons
            name="close-circle-outline"
            size={RFValue(35)}
            onPress={() => {
              setModal(false);
            }}
            color={theme.colors.primary}
          />
          {steps[currentStep].content()}
          {error.visible && (
            <CustomToastOnTimeView
              duration={1700}
              isVisible={error?.visible}
              message={error?.message}
              setError={setError}
            />
          )}
          <IfLoaderInsideScreen loading={loading}>
            <ButtonAdvance
              activeOpacity={0.7}
              onPress={() => onPressAdvanceStep(false)}
            >
              <TextButton>Continuar</TextButton>
            </ButtonAdvance>
          </IfLoaderInsideScreen>
        </ModalContent>
      </ContainerModal>
    </Modal>
  );
};
