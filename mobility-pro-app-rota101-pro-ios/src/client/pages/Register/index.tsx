import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  Platform,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Feather, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import WebView from 'react-native-webview';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RFValue } from 'react-native-responsive-fontsize';

import apiMain from '../../api/apiMain';
import { buildApp } from '../../../constantBuild/config';
import { useAuth } from '../../../context/auth';
import { useConfigAppPartner } from '../../../context/ConfigAppPartner/useConfigAppPartner';
import { translate } from '../../locales';
import { injectDynamic } from './webViewInject';
import loginBg from '../../../../assets/login-bg.png';
import logoMovyWhite from '../../../../assets/logo_movy_white_text.png';

import {
  BackgroundContainer,
  DarkOverlay,
  ScrollContainer,
  ContentWrapper,
  TopNavHeader,
  BackButton,
  HeaderTitleContainer,
  HeaderLogo,
  HeaderSubtitle,
  WebviewToggleBtn,
  WebviewToggleText,
  ProfileGridContainer,
  ProfileGridItem,
  ProfileIconBadge,
  ProfileGridTitle,
  ProfileGridSubtitle,
  StepIndicatorContainer,
  StepItemWrapper,
  StepCircle,
  StepCircleText,
  StepLine,
  StepInfoLabel,
  GlassRegisterCard,
  CardHeaderRow,
  CardHeaderPill,
  CardHeaderPillText,
  StepCounterBadge,
  InputGroup,
  ModernInputLabel,
  ModernInputBox,
  ModernTextInput,
  InputErrorText,
  CategoryOptionCard,
  CategoryIconContainer,
  CategoryInfoCol,
  CategoryTitle,
  CategoryDescription,
  CategoryCheckBadge,
  ButtonActionsRow,
  BackStepButton,
  BackStepButtonText,
  NextStepButton,
  NextStepButtonText,
  SuccessContainer,
  SuccessIconBadge,
  SuccessTitle,
  SuccessDescription,
  DropdownButton,
  DropdownButtonText,
} from './styles';

interface CityItem {
  id: number | string;
  nome: string;
  estado?: string;
}

interface DriverCategoryItem {
  idUserType: string | number;
  name: string;
  description?: string;
  picture?: string;
  isDriver?: string;
}

const DEFAULT_DRIVER_CATEGORIES: DriverCategoryItem[] = [
  {
    idUserType: '3',
    name: 'Movy Carro',
    description: 'Transporte particular de passageiros com conforto e segurança',
  },
  {
    idUserType: '5',
    name: 'Movy Moto',
    description: 'Viagens rápidas e entregas expressas com agilidade',
  },
  {
    idUserType: '4',
    name: 'Movy Mulher',
    description: 'Transporte exclusivo para passageiras por motoristas mulheres',
  },
];

export function Register() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { authenticateLogin, setDriverSelected, driverSelected, generalSettings, listCategories } = useAuth();
  const { appPartnerSelected } = useConfigAppPartner();

  // Modo: nativo passo a passo ou webview alternativo
  const [useWebView, setUseWebView] = useState(false);
  const [loadWebView, setLoadWebView] = useState(false);

  // Perfil selecionado (false = Passageiro, true = Motorista)
  const [isDriver, setIsDriver] = useState<boolean>(
    route.params?.isDriver !== undefined ? !!route.params.isDriver : !!driverSelected
  );

  // Passo atual
  const [passengerStep, setPassengerStep] = useState(1);
  const [driverStep, setDriverStep] = useState(1);

  // Status de loading e conclusão
  const [submitting, setSubmitting] = useState(false);
  const [registrationSuccess, setRegistrationSuccess] = useState(false);

  // Cidades da API
  const [cities, setCities] = useState<CityItem[]>([]);
  const [showCityPicker, setShowCityPicker] = useState(false);

  // Categorias de motorista da API
  const [driverCategories, setDriverCategories] = useState<DriverCategoryItem[]>(DEFAULT_DRIVER_CATEGORIES);
  const [selectedCategoryId, setSelectedCategoryId] = useState<string>('3');

  // Formulário do Passageiro
  const [pName, setPName] = useState('');
  const [pCpf, setPCpf] = useState('');
  const [pBirthDate, setPBirthDate] = useState('');
  const [pPhone, setPPhone] = useState('');
  const [pEmail, setPEmail] = useState('');
  const [pCity, setPCity] = useState<CityItem | null>(null);
  const [pPassword, setPPassword] = useState('');
  const [pConfirmPassword, setPConfirmPassword] = useState('');
  const [pShowPassword, setPShowPassword] = useState(false);

  // Formulário do Motorista
  const [dName, setDName] = useState('');
  const [dCpf, setDCpf] = useState('');
  const [dBirthDate, setDBirthDate] = useState('');
  const [dPhone, setDPhone] = useState('');
  const [dEmail, setDEmail] = useState('');
  const [dCity, setDCity] = useState<CityItem | null>(null);
  const [dPlate, setDPlate] = useState('');
  const [dVehicleModel, setDVehicleModel] = useState('');
  const [dVehicleColor, setDVehicleColor] = useState('');
  const [dVehicleYear, setDVehicleYear] = useState('');
  const [dPassword, setDPassword] = useState('');
  const [dConfirmPassword, setDConfirmPassword] = useState('');
  const [dShowPassword, setDShowPassword] = useState(false);

  // Erros de validação
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Máscaras de formatação
  const maskCpf = (val: string) => {
    const raw = val.replace(/\D/g, '').slice(0, 11);
    if (raw.length <= 3) return raw;
    if (raw.length <= 6) return `${raw.slice(0, 3)}.${raw.slice(3)}`;
    if (raw.length <= 9) return `${raw.slice(0, 3)}.${raw.slice(3, 6)}.${raw.slice(6)}`;
    return `${raw.slice(0, 3)}.${raw.slice(3, 6)}.${raw.slice(6, 9)}-${raw.slice(9, 11)}`;
  };

  const maskDate = (val: string) => {
    const raw = val.replace(/\D/g, '').slice(0, 8);
    if (raw.length <= 2) return raw;
    if (raw.length <= 4) return `${raw.slice(0, 2)}/${raw.slice(2)}`;
    return `${raw.slice(0, 2)}/${raw.slice(2, 4)}/${raw.slice(4, 8)}`;
  };

  const maskPhone = (val: string) => {
    const raw = val.replace(/\D/g, '').slice(0, 11);
    if (raw.length <= 2) return raw;
    if (raw.length <= 7) return `(${raw.slice(0, 2)}) ${raw.slice(2)}`;
    return `(${raw.slice(0, 2)}) ${raw.slice(2, 7)}-${raw.slice(7)}`;
  };

  const maskPlate = (val: string) => {
    const clean = val.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 7);
    if (clean.length > 3) {
      return `${clean.slice(0, 3)}-${clean.slice(3)}`;
    }
    return clean;
  };

  // Carregar Cidades da API
  const fetchCities = useCallback(async () => {
    try {
      const { data } = await apiMain.get('city/getactives');
      if (data && data.status && Array.isArray(data.data)) {
        setCities(data.data);
        if (data.data.length > 0) {
          setPCity(data.data[0]);
          setDCity(data.data[0]);
        }
      }
    } catch (e) {
      console.log('Erro ao buscar cidades:', e);
    }
  }, []);

  // Carregar Categorias de Motorista
  const fetchCategories = useCallback(async () => {
    try {
      if (listCategories) {
        const response = await listCategories();
        if (Array.isArray(response) && response.length > 0) {
          setDriverCategories(response);
          setSelectedCategoryId(String(response[0].idUserType || '3'));
          return;
        }
      }
      const { data } = await apiMain.get('usertype/driversbyapppartners');
      if (data && data.status && Array.isArray(data.data) && data.data.length > 0) {
        setDriverCategories(data.data);
        setSelectedCategoryId(String(data.data[0].idUserType || '3'));
      }
    } catch (e) {
      console.log('Erro ao buscar categorias de motorista:', e);
    }
  }, [listCategories]);

  useEffect(() => {
    fetchCities();
    fetchCategories();
  }, [fetchCities, fetchCategories]);

  // Alterne o perfil (Passageiro vs Motorista)
  const handleToggleProfile = (driverOption: boolean) => {
    setIsDriver(driverOption);
    setDriverSelected(driverOption);
    setErrors({});
  };

  // Botão Voltar
  const handleBackNavigation = () => {
    if (registrationSuccess) {
      navigation.goBack();
      return;
    }

    if (!isDriver) {
      if (passengerStep > 1) {
        setPassengerStep(passengerStep - 1);
        setErrors({});
      } else {
        navigation.goBack();
      }
    } else {
      if (driverStep > 1) {
        setDriverStep(driverStep - 1);
        setErrors({});
      } else {
        navigation.goBack();
      }
    }
  };

  /* ===== VALIDAÇÕES E AVANÇO: PASSAGEIRO ===== */
  const handleNextPassengerStep = () => {
    const newErrors: { [key: string]: string } = {};

    if (passengerStep === 1) {
      if (!pName.trim()) newErrors.pName = 'Informe seu nome completo';
      const cleanCpf = pCpf.replace(/\D/g, '');
      if (cleanCpf && cleanCpf.length !== 11) newErrors.pCpf = 'CPF deve ter 11 dígitos';
      const cleanBirth = pBirthDate.replace(/\D/g, '');
      if (cleanBirth && cleanBirth.length !== 8) newErrors.pBirthDate = 'Data de nascimento incompleta';

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
      setErrors({});
      setPassengerStep(2);
    } else if (passengerStep === 2) {
      const cleanPhone = pPhone.replace(/\D/g, '');
      if (!cleanPhone || cleanPhone.length < 10) newErrors.pPhone = 'Informe um celular válido com DDD';
      if (!pEmail.trim() || !pEmail.includes('@') || !pEmail.includes('.')) {
        newErrors.pEmail = 'Informe um e-mail válido';
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
      setErrors({});
      setPassengerStep(3);
    }
  };

  /* ===== SUBMISSÃO FINAL: PASSAGEIRO ===== */
  const handleSubmitPassenger = async () => {
    const newErrors: { [key: string]: string } = {};
    if (!pPassword || pPassword.length < 6) {
      newErrors.pPassword = 'A senha deve ter no mínimo 6 caracteres';
    }
    if (pPassword !== pConfirmPassword) {
      newErrors.pConfirmPassword = 'As senhas não coincidem';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    setSubmitting(true);

    try {
      const cleanBirth = pBirthDate.replace(/\D/g, '');
      const formattedDate =
        cleanBirth.length === 8
          ? cleanBirth.substring(4, 8) + cleanBirth.substring(2, 4) + cleanBirth.substring(0, 2)
          : '20000101';

      const payload = {
        name: pName.trim(),
        email: pEmail.trim().toLowerCase(),
        document: pCpf.replace(/\D/g, ''),
        dateOfBirth: formattedDate,
        nickname: pName.trim().split(' ')[0] || 'Cliente',
        registered_in: 'mobilidade',
        phone: pPhone.replace(/\D/g, ''),
        password: pPassword,
        cityId: pCity?.id || 1,
      };

      const { data } = await apiMain.post('Customer/Register', {
        stdObject: [payload],
      });

      if (!data || !data.status) {
        Alert.alert(
          'Atenção',
          data?.message || 'Não foi possível concluir o cadastro. Verifique os dados e tente novamente.'
        );
        return;
      }

      setRegistrationSuccess(true);
    } catch (err: any) {
      const msg = err?.response?.data?.message || err?.message || 'Erro ao conectar ao servidor de cadastro.';
      Alert.alert('Erro', msg);
    } finally {
      setSubmitting(false);
    }
  };

  /* ===== VALIDAÇÕES E AVANÇO: MOTORISTA ===== */
  const handleNextDriverStep = () => {
    const newErrors: { [key: string]: string } = {};

    if (driverStep === 1) {
      if (!selectedCategoryId) {
        newErrors.category = 'Selecione uma categoria para continuar';
        setErrors(newErrors);
        return;
      }
      setErrors({});
      setDriverStep(2);
    } else if (driverStep === 2) {
      if (!dName.trim()) newErrors.dName = 'Informe seu nome completo';
      const cleanCpf = dCpf.replace(/\D/g, '');
      if (!cleanCpf || cleanCpf.length !== 11) newErrors.dCpf = 'CPF é obrigatório para motoristas';
      const cleanPhone = dPhone.replace(/\D/g, '');
      if (!cleanPhone || cleanPhone.length < 10) newErrors.dPhone = 'Informe um celular válido com DDD';
      if (!dEmail.trim() || !dEmail.includes('@') || !dEmail.includes('.')) {
        newErrors.dEmail = 'Informe um e-mail válido';
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
      setErrors({});
      setDriverStep(3);
    } else if (driverStep === 3) {
      const cleanPlate = dPlate.replace(/[^A-Z0-9]/g, '');
      if (!cleanPlate || cleanPlate.length < 7) newErrors.dPlate = 'Informe uma placa de veículo válida';
      if (!dVehicleModel.trim()) newErrors.dVehicleModel = 'Informe o modelo e marca do veículo';

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
      setErrors({});
      setDriverStep(4);
    }
  };

  /* ===== SUBMISSÃO FINAL: MOTORISTA ===== */
  const handleSubmitDriver = async () => {
    const newErrors: { [key: string]: string } = {};
    if (!dPassword || dPassword.length < 6) {
      newErrors.dPassword = 'A senha deve ter no mínimo 6 caracteres';
    }
    if (dPassword !== dConfirmPassword) {
      newErrors.dConfirmPassword = 'As senhas não coincidem';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    setSubmitting(true);

    try {
      const cleanBirth = dBirthDate.replace(/\D/g, '');
      const formattedDate =
        cleanBirth.length === 8
          ? cleanBirth.substring(4, 8) + cleanBirth.substring(2, 4) + cleanBirth.substring(0, 2)
          : '19950101';

      const driverPayload = {
        user: {
          name: dName.trim(),
          email: dEmail.trim().toLowerCase(),
          document: dCpf.replace(/\D/g, ''),
          dateOfBirth: formattedDate,
          phone: dPhone.replace(/\D/g, ''),
          password: dPassword,
          userTypeId: selectedCategoryId,
          registered_in: 'mobilidade',
          cityId: dCity?.id || 1,
        },
        vehicle: {
          licensePlate: dPlate.toUpperCase().replace(/[^A-Z0-9]/g, ''),
          model: dVehicleModel.trim(),
          color: dVehicleColor.trim() || 'Padrão',
          year: dVehicleYear.trim() || '2020',
        },
      };

      // Tenta registrar na API de parceiros/motoristas
      let response;
      try {
        response = await apiMain.post('Customer/registerPartner', driverPayload);
      } catch (errPartner) {
        // Fallback para PreRegisterDriver
        response = await apiMain.post('PreRegisterDriverMk/insert', driverPayload);
      }

      setRegistrationSuccess(true);
    } catch (err: any) {
      const msg =
        err?.response?.data?.message ||
        err?.message ||
        'Não foi possível finalizar o cadastro de motorista agora. Verifique seus dados.';
      Alert.alert('Atenção', msg);
    } finally {
      setSubmitting(false);
    }
  };

  /* ===== TELA DE SUCESSO ===== */
  if (registrationSuccess) {
    return (
      <BackgroundContainer source={loginBg} resizeMode="cover">
        <DarkOverlay />
        <ScrollContainer>
          <ContentWrapper>
            <TopNavHeader>
              <BackButton onPress={() => navigation.goBack()} activeOpacity={0.8}>
                <Feather name="arrow-left" size={22} color="#ffffff" />
              </BackButton>
              <HeaderTitleContainer>
                <HeaderLogo source={logoMovyWhite} />
                <HeaderSubtitle>Cadastro Realizado</HeaderSubtitle>
              </HeaderTitleContainer>
              <View style={{ width: 42 }} />
            </TopNavHeader>

            <GlassRegisterCard>
              <SuccessContainer>
                <SuccessIconBadge>
                  <Feather name="check" size={32} color="#22c55e" />
                </SuccessIconBadge>
                <SuccessTitle>
                  {!isDriver ? 'Cadastro concluído com sucesso!' : 'Pré-cadastro de motorista enviado!'}
                </SuccessTitle>
                <SuccessDescription>
                  {!isDriver
                    ? 'Sua conta de passageiro na Movy foi criada com sucesso. Agora você já pode solicitar corridas rápidas, seguras e econômicas.'
                    : 'Recebemos as suas informações de motorista parceiro. Você já pode efetuar login e enviar os documentos necessários para aprovação.'}
                </SuccessDescription>

                <NextStepButton
                  activeOpacity={0.8}
                  style={{ width: '100%' }}
                  onPress={async () => {
                    if (!isDriver) {
                      try {
                        await authenticateLogin({
                          email: pEmail,
                          password: pPassword,
                          setModal: () => {},
                        });
                      } catch {
                        navigation.goBack();
                      }
                    } else {
                      navigation.goBack();
                    }
                  }}
                >
                  <NextStepButtonText>
                    {!isDriver ? 'Entrar na Movy Agora' : 'Ir para Login de Motorista'}
                  </NextStepButtonText>
                  <Feather name="arrow-right" size={18} color="#ffffff" />
                </NextStepButton>
              </SuccessContainer>
            </GlassRegisterCard>
          </ContentWrapper>
        </ScrollContainer>
      </BackgroundContainer>
    );
  }

  /* ===== FORMULÁRIO NATIVO PASSO A PASSO ===== */
  return (
    <BackgroundContainer source={loginBg} resizeMode="cover">
      <DarkOverlay />

      <ScrollContainer>
        <ContentWrapper>
          {/* Header Superior com Botão Voltar e Logo Movy */}
          <TopNavHeader>
            <BackButton onPress={handleBackNavigation} activeOpacity={0.8}>
              <Feather name="arrow-left" size={22} color="#ffffff" />
            </BackButton>
            <HeaderTitleContainer>
              <HeaderLogo source={logoMovyWhite} />
              <HeaderSubtitle>
                {!isDriver ? 'Passo a passo Passageiro' : 'Passo a passo Motorista'}
              </HeaderSubtitle>
            </HeaderTitleContainer>
            <View style={{ width: 42 }} />
          </TopNavHeader>

          {/* Grid de Seleção de Perfil (Passageiro / Motorista) */}
          <ProfileGridContainer>
            <ProfileGridItem
              active={!isDriver}
              activeOpacity={0.8}
              onPress={() => handleToggleProfile(false)}
            >
              <ProfileIconBadge active={!isDriver}>
                <FontAwesome5 name="user" size={RFValue(18)} color="#ffffff" />
              </ProfileIconBadge>
              <ProfileGridTitle active={!isDriver}>SOU PASSAGEIRO</ProfileGridTitle>
              <ProfileGridSubtitle active={!isDriver}>Quero viajar</ProfileGridSubtitle>
            </ProfileGridItem>

            <ProfileGridItem
              active={isDriver}
              activeOpacity={0.8}
              onPress={() => handleToggleProfile(true)}
            >
              <ProfileIconBadge active={isDriver}>
                <MaterialCommunityIcons name="steering" size={RFValue(22)} color="#ffffff" />
              </ProfileIconBadge>
              <ProfileGridTitle active={isDriver}>SOU MOTORISTA</ProfileGridTitle>
              <ProfileGridSubtitle active={isDriver}>Quero dirigir</ProfileGridSubtitle>
            </ProfileGridItem>
          </ProfileGridContainer>

          {/* ===== INDICADOR DE PASSOS: PASSAGEIRO ===== */}
          {!isDriver && (
            <>
              <StepIndicatorContainer>
                <StepItemWrapper>
                  <StepCircle active={passengerStep === 1} completed={passengerStep > 1}>
                    {passengerStep > 1 ? (
                      <Feather name="check" size={16} color="#ffffff" />
                    ) : (
                      <StepCircleText active={passengerStep === 1} completed={false}>
                        1
                      </StepCircleText>
                    )}
                  </StepCircle>
                  <StepLine completed={passengerStep > 1} />
                </StepItemWrapper>

                <StepItemWrapper>
                  <StepCircle active={passengerStep === 2} completed={passengerStep > 2}>
                    {passengerStep > 2 ? (
                      <Feather name="check" size={16} color="#ffffff" />
                    ) : (
                      <StepCircleText active={passengerStep === 2} completed={false}>
                        2
                      </StepCircleText>
                    )}
                  </StepCircle>
                  <StepLine completed={passengerStep > 2} />
                </StepItemWrapper>

                <StepItemWrapper>
                  <StepCircle active={passengerStep === 3} completed={false}>
                    <StepCircleText active={passengerStep === 3} completed={false}>
                      3
                    </StepCircleText>
                  </StepCircle>
                </StepItemWrapper>
              </StepIndicatorContainer>

              <StepInfoLabel>
                {passengerStep === 1 && 'Etapa 1: Dados Pessoais'}
                {passengerStep === 2 && 'Etapa 2: Contato e Localização'}
                {passengerStep === 3 && 'Etapa 3: Senha e Conclusão'}
              </StepInfoLabel>

              {/* CARD PRINCIPAL DO PASSAGEIRO */}
              <GlassRegisterCard>
                <CardHeaderRow>
                  <CardHeaderPill>
                    <Feather name="user-check" size={14} color="#ff80ab" />
                    <CardHeaderPillText>Cadastro de Passageiro</CardHeaderPillText>
                  </CardHeaderPill>
                  <StepCounterBadge>Passo {passengerStep} de 3</StepCounterBadge>
                </CardHeaderRow>

                {/* PASSO 1: DADOS PESSOAIS */}
                {passengerStep === 1 && (
                  <View>
                    <InputGroup>
                      <ModernInputLabel>Nome Completo *</ModernInputLabel>
                      <ModernInputBox hasError={!!errors.pName}>
                        <Feather name="user" size={18} color="#8A99AD" />
                        <ModernTextInput
                          placeholder="Digite seu nome completo"
                          placeholderTextColor="rgba(255, 255, 255, 0.35)"
                          value={pName}
                          onChangeText={setPName}
                          autoCapitalize="words"
                        />
                      </ModernInputBox>
                      {errors.pName && <InputErrorText>{errors.pName}</InputErrorText>}
                    </InputGroup>

                    <InputGroup>
                      <ModernInputLabel>CPF</ModernInputLabel>
                      <ModernInputBox hasError={!!errors.pCpf}>
                        <Feather name="file-text" size={18} color="#8A99AD" />
                        <ModernTextInput
                          placeholder="000.000.000-00"
                          placeholderTextColor="rgba(255, 255, 255, 0.35)"
                          value={pCpf}
                          onChangeText={txt => setPCpf(maskCpf(txt))}
                          keyboardType="numeric"
                          maxLength={14}
                        />
                      </ModernInputBox>
                      {errors.pCpf && <InputErrorText>{errors.pCpf}</InputErrorText>}
                    </InputGroup>

                    <InputGroup>
                      <ModernInputLabel>Data de Nascimento</ModernInputLabel>
                      <ModernInputBox hasError={!!errors.pBirthDate}>
                        <Feather name="calendar" size={18} color="#8A99AD" />
                        <ModernTextInput
                          placeholder="DD/MM/AAAA"
                          placeholderTextColor="rgba(255, 255, 255, 0.35)"
                          value={pBirthDate}
                          onChangeText={txt => setPBirthDate(maskDate(txt))}
                          keyboardType="numeric"
                          maxLength={10}
                        />
                      </ModernInputBox>
                      {errors.pBirthDate && <InputErrorText>{errors.pBirthDate}</InputErrorText>}
                    </InputGroup>

                    <ButtonActionsRow>
                      <NextStepButton activeOpacity={0.8} onPress={handleNextPassengerStep}>
                        <NextStepButtonText>Continuar</NextStepButtonText>
                        <Feather name="arrow-right" size={18} color="#ffffff" />
                      </NextStepButton>
                    </ButtonActionsRow>
                  </View>
                )}

                {/* PASSO 2: CONTATO E LOCALIZAÇÃO */}
                {passengerStep === 2 && (
                  <View>
                    <InputGroup>
                      <ModernInputLabel>Celular com DDD *</ModernInputLabel>
                      <ModernInputBox hasError={!!errors.pPhone}>
                        <Feather name="phone" size={18} color="#8A99AD" />
                        <ModernTextInput
                          placeholder="(00) 00000-0000"
                          placeholderTextColor="rgba(255, 255, 255, 0.35)"
                          value={pPhone}
                          onChangeText={txt => setPPhone(maskPhone(txt))}
                          keyboardType="phone-pad"
                          maxLength={15}
                        />
                      </ModernInputBox>
                      {errors.pPhone && <InputErrorText>{errors.pPhone}</InputErrorText>}
                    </InputGroup>

                    <InputGroup>
                      <ModernInputLabel>E-mail *</ModernInputLabel>
                      <ModernInputBox hasError={!!errors.pEmail}>
                        <Feather name="mail" size={18} color="#8A99AD" />
                        <ModernTextInput
                          placeholder="seuemail@exemplo.com"
                          placeholderTextColor="rgba(255, 255, 255, 0.35)"
                          value={pEmail}
                          onChangeText={setPEmail}
                          keyboardType="email-address"
                          autoCapitalize="none"
                        />
                      </ModernInputBox>
                      {errors.pEmail && <InputErrorText>{errors.pEmail}</InputErrorText>}
                    </InputGroup>

                    <InputGroup>
                      <ModernInputLabel>Cidade</ModernInputLabel>
                      <DropdownButton
                        activeOpacity={0.8}
                        onPress={() => setShowCityPicker(!showCityPicker)}
                      >
                        <DropdownButtonText hasValue={!!pCity}>
                          {pCity ? pCity.nome : 'Selecione sua cidade'}
                        </DropdownButtonText>
                        <Feather
                          name={showCityPicker ? 'chevron-up' : 'chevron-down'}
                          size={18}
                          color="#8A99AD"
                        />
                      </DropdownButton>

                      {showCityPicker && (
                        <View
                          style={{
                            marginTop: 6,
                            backgroundColor: 'rgba(255, 255, 255, 0.08)',
                            borderRadius: 12,
                            padding: 8,
                            maxHeight: 150,
                          }}
                        >
                          {cities.map(item => (
                            <TouchableOpacity
                              key={String(item.id)}
                              style={{
                                paddingVertical: 8,
                                paddingHorizontal: 12,
                                borderBottomWidth: 1,
                                borderBottomColor: 'rgba(255, 255, 255, 0.06)',
                              }}
                              onPress={() => {
                                setPCity(item);
                                setShowCityPicker(false);
                              }}
                            >
                              <Text style={{ color: '#ffffff', fontSize: 13 }}>{item.nome}</Text>
                            </TouchableOpacity>
                          ))}
                        </View>
                      )}
                    </InputGroup>

                    <ButtonActionsRow>
                      <BackStepButton activeOpacity={0.8} onPress={() => setPassengerStep(1)}>
                        <Feather name="arrow-left" size={16} color="rgba(255, 255, 255, 0.8)" />
                        <BackStepButtonText>Voltar</BackStepButtonText>
                      </BackStepButton>

                      <NextStepButton activeOpacity={0.8} onPress={handleNextPassengerStep}>
                        <NextStepButtonText>Continuar</NextStepButtonText>
                        <Feather name="arrow-right" size={18} color="#ffffff" />
                      </NextStepButton>
                    </ButtonActionsRow>
                  </View>
                )}

                {/* PASSO 3: SENHA E CONCLUSÃO */}
                {passengerStep === 3 && (
                  <View>
                    <InputGroup>
                      <ModernInputLabel>Senha de Acesso *</ModernInputLabel>
                      <ModernInputBox hasError={!!errors.pPassword}>
                        <Feather name="lock" size={18} color="#8A99AD" />
                        <ModernTextInput
                          placeholder="Mínimo de 6 caracteres"
                          placeholderTextColor="rgba(255, 255, 255, 0.35)"
                          secureTextEntry={!pShowPassword}
                          value={pPassword}
                          onChangeText={setPPassword}
                        />
                        <TouchableOpacity
                          onPress={() => setPShowPassword(!pShowPassword)}
                          activeOpacity={0.7}
                        >
                          <Feather
                            name={pShowPassword ? 'eye-off' : 'eye'}
                            size={18}
                            color="#8A99AD"
                          />
                        </TouchableOpacity>
                      </ModernInputBox>
                      {errors.pPassword && <InputErrorText>{errors.pPassword}</InputErrorText>}
                    </InputGroup>

                    <InputGroup>
                      <ModernInputLabel>Confirmar Senha *</ModernInputLabel>
                      <ModernInputBox hasError={!!errors.pConfirmPassword}>
                        <Feather name="lock" size={18} color="#8A99AD" />
                        <ModernTextInput
                          placeholder="Repita a senha"
                          placeholderTextColor="rgba(255, 255, 255, 0.35)"
                          secureTextEntry={!pShowPassword}
                          value={pConfirmPassword}
                          onChangeText={setPConfirmPassword}
                        />
                      </ModernInputBox>
                      {errors.pConfirmPassword && (
                        <InputErrorText>{errors.pConfirmPassword}</InputErrorText>
                      )}
                    </InputGroup>

                    <ButtonActionsRow>
                      <BackStepButton activeOpacity={0.8} onPress={() => setPassengerStep(2)}>
                        <Feather name="arrow-left" size={16} color="rgba(255, 255, 255, 0.8)" />
                        <BackStepButtonText>Voltar</BackStepButtonText>
                      </BackStepButton>

                      <NextStepButton
                        activeOpacity={0.8}
                        disabled={submitting}
                        onPress={handleSubmitPassenger}
                      >
                        {submitting ? (
                          <ActivityIndicator size="small" color="#ffffff" />
                        ) : (
                          <>
                            <NextStepButtonText>Finalizar Cadastro</NextStepButtonText>
                            <Feather name="check" size={18} color="#ffffff" />
                          </>
                        )}
                      </NextStepButton>
                    </ButtonActionsRow>
                  </View>
                )}
              </GlassRegisterCard>
            </>
          )}

          {/* ===== INDICADOR DE PASSOS: MOTORISTA ===== */}
          {isDriver && (
            <>
              <StepIndicatorContainer>
                <StepItemWrapper>
                  <StepCircle active={driverStep === 1} completed={driverStep > 1}>
                    {driverStep > 1 ? (
                      <Feather name="check" size={16} color="#ffffff" />
                    ) : (
                      <StepCircleText active={driverStep === 1} completed={false}>
                        1
                      </StepCircleText>
                    )}
                  </StepCircle>
                  <StepLine completed={driverStep > 1} />
                </StepItemWrapper>

                <StepItemWrapper>
                  <StepCircle active={driverStep === 2} completed={driverStep > 2}>
                    {driverStep > 2 ? (
                      <Feather name="check" size={16} color="#ffffff" />
                    ) : (
                      <StepCircleText active={driverStep === 2} completed={false}>
                        2
                      </StepCircleText>
                    )}
                  </StepCircle>
                  <StepLine completed={driverStep > 2} />
                </StepItemWrapper>

                <StepItemWrapper>
                  <StepCircle active={driverStep === 3} completed={driverStep > 3}>
                    {driverStep > 3 ? (
                      <Feather name="check" size={16} color="#ffffff" />
                    ) : (
                      <StepCircleText active={driverStep === 3} completed={false}>
                        3
                      </StepCircleText>
                    )}
                  </StepCircle>
                  <StepLine completed={driverStep > 3} />
                </StepItemWrapper>

                <StepItemWrapper>
                  <StepCircle active={driverStep === 4} completed={false}>
                    <StepCircleText active={driverStep === 4} completed={false}>
                      4
                    </StepCircleText>
                  </StepCircle>
                </StepItemWrapper>
              </StepIndicatorContainer>

              <StepInfoLabel>
                {driverStep === 1 && 'Etapa 1: Escolha a Categoria'}
                {driverStep === 2 && 'Etapa 2: Dados Pessoais'}
                {driverStep === 3 && 'Etapa 3: Dados do Veículo'}
                {driverStep === 4 && 'Etapa 4: Senha e Conclusão'}
              </StepInfoLabel>

              {/* CARD PRINCIPAL DO MOTORISTA */}
              <GlassRegisterCard>
                <CardHeaderRow>
                  <CardHeaderPill>
                    <MaterialCommunityIcons name="steering" size={15} color="#ff80ab" />
                    <CardHeaderPillText>Cadastro de Motorista</CardHeaderPillText>
                  </CardHeaderPill>
                  <StepCounterBadge>Passo {driverStep} de 4</StepCounterBadge>
                </CardHeaderRow>

                {/* PASSO 1 DO MOTORISTA: ESCOLHA DA CATEGORIA */}
                {driverStep === 1 && (
                  <View>
                    <Text
                      style={{
                        color: 'rgba(255, 255, 255, 0.75)',
                        fontSize: RFValue(12),
                        marginBottom: 14,
                        lineHeight: 18,
                      }}
                    >
                      Selecione a categoria em que você deseja atuar na Movy para iniciar suas corridas:
                    </Text>

                    {driverCategories.map(cat => {
                      const isSelected = selectedCategoryId === String(cat.idUserType);
                      const isMoto =
                        cat.name.toLowerCase().includes('moto') ||
                        cat.name.toLowerCase().includes('entrega');

                      return (
                        <CategoryOptionCard
                          key={String(cat.idUserType)}
                          isSelected={isSelected}
                          activeOpacity={0.8}
                          onPress={() => setSelectedCategoryId(String(cat.idUserType))}
                        >
                          <CategoryIconContainer isSelected={isSelected}>
                            <MaterialCommunityIcons
                              name={isMoto ? 'motorbike' : 'car'}
                              size={RFValue(24)}
                              color={isSelected ? '#ffffff' : '#8A99AD'}
                            />
                          </CategoryIconContainer>

                          <CategoryInfoCol>
                            <CategoryTitle isSelected={isSelected}>{cat.name}</CategoryTitle>
                            <CategoryDescription>
                              {cat.description ||
                                (isMoto
                                  ? 'Corridas rápidas e entregas de encomendas'
                                  : 'Transporte de passageiros')}
                            </CategoryDescription>
                          </CategoryInfoCol>

                          <CategoryCheckBadge isSelected={isSelected}>
                            {isSelected && <Feather name="check" size={14} color="#ffffff" />}
                          </CategoryCheckBadge>
                        </CategoryOptionCard>
                      );
                    })}

                    <ButtonActionsRow>
                      <NextStepButton activeOpacity={0.8} onPress={handleNextDriverStep}>
                        <NextStepButtonText>Continuar</NextStepButtonText>
                        <Feather name="arrow-right" size={18} color="#ffffff" />
                      </NextStepButton>
                    </ButtonActionsRow>
                  </View>
                )}

                {/* PASSO 2 DO MOTORISTA: DADOS PESSOAIS */}
                {driverStep === 2 && (
                  <View>
                    <InputGroup>
                      <ModernInputLabel>Nome Completo *</ModernInputLabel>
                      <ModernInputBox hasError={!!errors.dName}>
                        <Feather name="user" size={18} color="#8A99AD" />
                        <ModernTextInput
                          placeholder="Digite seu nome completo"
                          placeholderTextColor="rgba(255, 255, 255, 0.35)"
                          value={dName}
                          onChangeText={setDName}
                          autoCapitalize="words"
                        />
                      </ModernInputBox>
                      {errors.dName && <InputErrorText>{errors.dName}</InputErrorText>}
                    </InputGroup>

                    <InputGroup>
                      <ModernInputLabel>CPF *</ModernInputLabel>
                      <ModernInputBox hasError={!!errors.dCpf}>
                        <Feather name="file-text" size={18} color="#8A99AD" />
                        <ModernTextInput
                          placeholder="000.000.000-00"
                          placeholderTextColor="rgba(255, 255, 255, 0.35)"
                          value={dCpf}
                          onChangeText={txt => setDCpf(maskCpf(txt))}
                          keyboardType="numeric"
                          maxLength={14}
                        />
                      </ModernInputBox>
                      {errors.dCpf && <InputErrorText>{errors.dCpf}</InputErrorText>}
                    </InputGroup>

                    <InputGroup>
                      <ModernInputLabel>Data de Nascimento</ModernInputLabel>
                      <ModernInputBox>
                        <Feather name="calendar" size={18} color="#8A99AD" />
                        <ModernTextInput
                          placeholder="DD/MM/AAAA"
                          placeholderTextColor="rgba(255, 255, 255, 0.35)"
                          value={dBirthDate}
                          onChangeText={txt => setDBirthDate(maskDate(txt))}
                          keyboardType="numeric"
                          maxLength={10}
                        />
                      </ModernInputBox>
                    </InputGroup>

                    <InputGroup>
                      <ModernInputLabel>Celular com DDD *</ModernInputLabel>
                      <ModernInputBox hasError={!!errors.dPhone}>
                        <Feather name="phone" size={18} color="#8A99AD" />
                        <ModernTextInput
                          placeholder="(00) 00000-0000"
                          placeholderTextColor="rgba(255, 255, 255, 0.35)"
                          value={dPhone}
                          onChangeText={txt => setDPhone(maskPhone(txt))}
                          keyboardType="phone-pad"
                          maxLength={15}
                        />
                      </ModernInputBox>
                      {errors.dPhone && <InputErrorText>{errors.dPhone}</InputErrorText>}
                    </InputGroup>

                    <InputGroup>
                      <ModernInputLabel>E-mail *</ModernInputLabel>
                      <ModernInputBox hasError={!!errors.dEmail}>
                        <Feather name="mail" size={18} color="#8A99AD" />
                        <ModernTextInput
                          placeholder="motorista@exemplo.com"
                          placeholderTextColor="rgba(255, 255, 255, 0.35)"
                          value={dEmail}
                          onChangeText={setDEmail}
                          keyboardType="email-address"
                          autoCapitalize="none"
                        />
                      </ModernInputBox>
                      {errors.dEmail && <InputErrorText>{errors.dEmail}</InputErrorText>}
                    </InputGroup>

                    <ButtonActionsRow>
                      <BackStepButton activeOpacity={0.8} onPress={() => setDriverStep(1)}>
                        <Feather name="arrow-left" size={16} color="rgba(255, 255, 255, 0.8)" />
                        <BackStepButtonText>Voltar</BackStepButtonText>
                      </BackStepButton>

                      <NextStepButton activeOpacity={0.8} onPress={handleNextDriverStep}>
                        <NextStepButtonText>Continuar</NextStepButtonText>
                        <Feather name="arrow-right" size={18} color="#ffffff" />
                      </NextStepButton>
                    </ButtonActionsRow>
                  </View>
                )}

                {/* PASSO 3 DO MOTORISTA: DADOS DO VEÍCULO */}
                {driverStep === 3 && (
                  <View>
                    <InputGroup>
                      <ModernInputLabel>Placa do Veículo *</ModernInputLabel>
                      <ModernInputBox hasError={!!errors.dPlate}>
                        <MaterialCommunityIcons name="card-text-outline" size={18} color="#8A99AD" />
                        <ModernTextInput
                          placeholder="ABC-1234 ou ABC1D23"
                          placeholderTextColor="rgba(255, 255, 255, 0.35)"
                          value={dPlate}
                          onChangeText={txt => setDPlate(maskPlate(txt))}
                          autoCapitalize="characters"
                          maxLength={8}
                        />
                      </ModernInputBox>
                      {errors.dPlate && <InputErrorText>{errors.dPlate}</InputErrorText>}
                    </InputGroup>

                    <InputGroup>
                      <ModernInputLabel>Marca e Modelo do Veículo *</ModernInputLabel>
                      <ModernInputBox hasError={!!errors.dVehicleModel}>
                        <MaterialCommunityIcons name="car-info" size={18} color="#8A99AD" />
                        <ModernTextInput
                          placeholder="Ex: Fiat Argo 1.0 ou Honda CG 160"
                          placeholderTextColor="rgba(255, 255, 255, 0.35)"
                          value={dVehicleModel}
                          onChangeText={setDVehicleModel}
                          autoCapitalize="words"
                        />
                      </ModernInputBox>
                      {errors.dVehicleModel && (
                        <InputErrorText>{errors.dVehicleModel}</InputErrorText>
                      )}
                    </InputGroup>

                    <InputGroup>
                      <ModernInputLabel>Cor do Veículo</ModernInputLabel>
                      <ModernInputBox>
                        <MaterialCommunityIcons name="palette-outline" size={18} color="#8A99AD" />
                        <ModernTextInput
                          placeholder="Ex: Prata, Preto, Branco"
                          placeholderTextColor="rgba(255, 255, 255, 0.35)"
                          value={dVehicleColor}
                          onChangeText={setDVehicleColor}
                          autoCapitalize="words"
                        />
                      </ModernInputBox>
                    </InputGroup>

                    <InputGroup>
                      <ModernInputLabel>Ano de Fabricação</ModernInputLabel>
                      <ModernInputBox>
                        <MaterialCommunityIcons name="calendar-clock" size={18} color="#8A99AD" />
                        <ModernTextInput
                          placeholder="Ex: 2021"
                          placeholderTextColor="rgba(255, 255, 255, 0.35)"
                          value={dVehicleYear}
                          onChangeText={setDVehicleYear}
                          keyboardType="numeric"
                          maxLength={4}
                        />
                      </ModernInputBox>
                    </InputGroup>

                    <ButtonActionsRow>
                      <BackStepButton activeOpacity={0.8} onPress={() => setDriverStep(2)}>
                        <Feather name="arrow-left" size={16} color="rgba(255, 255, 255, 0.8)" />
                        <BackStepButtonText>Voltar</BackStepButtonText>
                      </BackStepButton>

                      <NextStepButton activeOpacity={0.8} onPress={handleNextDriverStep}>
                        <NextStepButtonText>Continuar</NextStepButtonText>
                        <Feather name="arrow-right" size={18} color="#ffffff" />
                      </NextStepButton>
                    </ButtonActionsRow>
                  </View>
                )}

                {/* PASSO 4 DO MOTORISTA: SENHA E FINALIZAÇÃO */}
                {driverStep === 4 && (
                  <View>
                    <InputGroup>
                      <ModernInputLabel>Senha de Acesso de Motorista *</ModernInputLabel>
                      <ModernInputBox hasError={!!errors.dPassword}>
                        <Feather name="lock" size={18} color="#8A99AD" />
                        <ModernTextInput
                          placeholder="Mínimo de 6 caracteres"
                          placeholderTextColor="rgba(255, 255, 255, 0.35)"
                          secureTextEntry={!dShowPassword}
                          value={dPassword}
                          onChangeText={setDPassword}
                        />
                        <TouchableOpacity
                          onPress={() => setDShowPassword(!dShowPassword)}
                          activeOpacity={0.7}
                        >
                          <Feather
                            name={dShowPassword ? 'eye-off' : 'eye'}
                            size={18}
                            color="#8A99AD"
                          />
                        </TouchableOpacity>
                      </ModernInputBox>
                      {errors.dPassword && <InputErrorText>{errors.dPassword}</InputErrorText>}
                    </InputGroup>

                    <InputGroup>
                      <ModernInputLabel>Confirmar Senha *</ModernInputLabel>
                      <ModernInputBox hasError={!!errors.dConfirmPassword}>
                        <Feather name="lock" size={18} color="#8A99AD" />
                        <ModernTextInput
                          placeholder="Repita a senha"
                          placeholderTextColor="rgba(255, 255, 255, 0.35)"
                          secureTextEntry={!dShowPassword}
                          value={dConfirmPassword}
                          onChangeText={setDConfirmPassword}
                        />
                      </ModernInputBox>
                      {errors.dConfirmPassword && (
                        <InputErrorText>{errors.dConfirmPassword}</InputErrorText>
                      )}
                    </InputGroup>

                    <ButtonActionsRow>
                      <BackStepButton activeOpacity={0.8} onPress={() => setDriverStep(3)}>
                        <Feather name="arrow-left" size={16} color="rgba(255, 255, 255, 0.8)" />
                        <BackStepButtonText>Voltar</BackStepButtonText>
                      </BackStepButton>

                      <NextStepButton
                        activeOpacity={0.8}
                        disabled={submitting}
                        onPress={handleSubmitDriver}
                      >
                        {submitting ? (
                          <ActivityIndicator size="small" color="#ffffff" />
                        ) : (
                          <>
                            <NextStepButtonText>Concluir Cadastro</NextStepButtonText>
                            <Feather name="check" size={18} color="#ffffff" />
                          </>
                        )}
                      </NextStepButton>
                    </ButtonActionsRow>
                  </View>
                )}
              </GlassRegisterCard>
            </>
          )}
        </ContentWrapper>
      </ScrollContainer>
    </BackgroundContainer>
  );
}
