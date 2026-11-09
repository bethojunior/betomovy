import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Platform,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { Feather, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import WebView from 'react-native-webview';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { RFValue } from 'react-native-responsive-fontsize';

import apiMain from '../../api/apiMain';
import { buildApp } from '../../../constantBuild/config';
import { useAuth } from '../../../context/auth';
import { useConfigAppPartner } from '../../../context/ConfigAppPartner/useConfigAppPartner';
import I18n, { translate } from '../../locales';
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
  PhotoUploadSection,
  PhotoAvatarWrapper,
  PhotoAvatarImage,
  PhotoAvatarPlaceholder,
  PhotoCameraBadge,
  PhotoActionsRow,
  PhotoChoiceButton,
  PhotoChoiceButtonText,
  PhotoRemoveBtn,
  PhotoRemoveBtnText,
  PhotoTipText,
  DocSectionHeader,
  DocSectionTitle,
  DocSectionDescription,
  DocCard,
  DocCardHeader,
  DocCardTitleRow,
  DocCardIconBadge,
  DocCardTitle,
  DocStatusPill,
  DocStatusPillText,
  DocRequirementText,
  DocPreviewContainer,
  DocPreviewThumbnail,
  DocPreviewInfo,
  DocPreviewFilename,
  DocPreviewHint,
  DocActionsRow,
  DocAttachButton,
  DocAttachButtonText,
  DocRemoveButton,
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

// Categorias padrão completas com descrições objetivas
const DEFAULT_DRIVER_CATEGORIES: DriverCategoryItem[] = [
  {
    idUserType: '3',
    name: 'Motorista Particular',
    description: 'Transporte de passageiros em carro particular com conforto',
  },
  {
    idUserType: '4',
    name: 'Motorista Mulher',
    description: 'Transporte exclusivo para passageiras por motoristas mulheres em carro',
  },
  {
    idUserType: '5',
    name: 'Mototaxista',
    description: 'Corridas rápidas e transporte de passageiros em moto',
  },
  {
    idUserType: '6',
    name: 'Delivery',
    description: 'Entregas expressas de encomendas e pacotes em carro',
  },
  {
    idUserType: '7',
    name: 'Entregador',
    description: 'Transporte e distribuição de mercadorias urbanas em carro',
  },
  {
    idUserType: '8',
    name: 'Motorista Utilitário',
    description: 'Transporte de cargas e fretes médios em veículos utilitários',
  },
];

const getCategoryIconName = (categoryName: string): any => {
  const name = (categoryName || '').toLowerCase().trim();

  // Regra estrita MOVY: SOMENTE mototaxista ou moto táxi deve ter ícone de moto
  // A palavra 'motorista' começa com 'moto', portanto NUNCA deve ser tratada como moto
  const isMotoOnly =
    name.includes('mototaxista') ||
    name.includes('mototaxi') ||
    name.includes('mototáxi') ||
    name.includes('moto taxi') ||
    name.includes('moto táxi') ||
    name.includes('duas rodas') ||
    (/\bmoto\b/i.test(name) && !name.includes('motorista'));

  if (isMotoOnly) {
    return 'motorbike';
  }

  // Todos os demais são ícones de carro de acordo com o nicho
  if (name.includes('utilit') || name.includes('furg') || name.includes('carga')) {
    return 'car-estate';
  }
  if (name.includes('delivery') || name.includes('entrega') || name.includes('encomenda')) {
    return 'car';
  }
  if (name.includes('mulher') || name.includes('feminino') || name.includes('rosa')) {
    return 'car-side';
  }
  return 'car';
};

function normalizeDateForApi(raw?: string | null, defaultYear = 2000): string {
  if (!raw || typeof raw !== 'string') return `${defaultYear}-01-01`;
  const clean = raw.trim();
  if (!clean) return `${defaultYear}-01-01`;

  if (/^\d{4}-\d{2}-\d{2}$/.test(clean)) {
    return clean;
  }

  const digits = clean.replace(/\D/g, '');
  if (digits.length === 8) {
    const first4 = parseInt(digits.substring(0, 4), 10);
    const last4 = parseInt(digits.substring(4, 8), 10);

    let year = defaultYear;
    let month = 1;
    let day = 1;

    if (first4 >= 1920 && first4 <= 2030) {
      year = first4;
      month = parseInt(digits.substring(4, 6), 10);
      day = parseInt(digits.substring(6, 8), 10);
    } else if (last4 >= 1920 && last4 <= 2030) {
      day = parseInt(digits.substring(0, 2), 10);
      month = parseInt(digits.substring(2, 4), 10);
      year = last4;
    } else {
      return `${defaultYear}-01-01`;
    }

    if (month < 1 || month > 12) month = 1;
    if (day < 1 || day > 31) day = 1;

    const mm = String(month).padStart(2, '0');
    const dd = String(day).padStart(2, '0');
    return `${year}-${mm}-${dd}`;
  }

  return `${defaultYear}-01-01`;
}

export function Register() {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { authenticateLogin, setDriverSelected, driverSelected, generalSettings, listCategories } = useAuth();
  const { appPartnerSelected } = useConfigAppPartner();

  // Perfil selecionado (false = Passageiro, true = Motorista)
  const isPt = (I18n.locale || '').startsWith('pt');
  const t = (enText: any, ptText?: any): string => {
    let enVal = '';
    if (typeof enText === 'string') {
      enVal = enText;
    } else if (typeof enText === 'object' && enText !== null) {
      enVal = enText.defaultValue || enText.message || '';
    }
    if (typeof ptText === 'string') {
      return isPt ? ptText : enVal;
    }
    if (typeof ptText === 'object' && ptText !== null) {
      const ptVal = ptText.defaultValue || ptText.message || '';
      return isPt ? (ptVal || enVal) : enVal;
    }
    return enVal;
  };

  const formatCategoryName = (rawName: string) => {
    if (isPt) return rawName;
    const lower = (rawName || '').toLowerCase();
    if (lower.includes('mulher')) return 'Women Driver';
    if (lower.includes('particular')) return 'Private Driver';
    if (lower.includes('mototaxi')) return 'Motorcycle Taxi';
    if (lower.includes('delivery')) return 'Delivery';
    if (lower.includes('entregador')) return 'Courier';
    if (lower.includes('utilit')) return 'Utility Vehicle';
    return rawName;
  };

  const formatCategoryDesc = (rawDesc: string) => {
    if (isPt) return rawDesc;
    const lower = (rawDesc || '').toLowerCase();
    if (lower.includes('mulher')) return 'Exclusive rides for women passengers by women drivers';
    if (lower.includes('particular')) return 'Passenger transportation in private car with comfort';
    if (lower.includes('moto')) return 'Fast rides and motorcycle passenger transport';
    if (lower.includes('delivery') || lower.includes('pacote')) return 'Express deliveries for packages and orders';
    if (lower.includes('mercadoria')) return 'Urban merchandise and package delivery';
    if (lower.includes('utilit')) return 'Cargo and medium haul transport in utility vehicles';
    return rawDesc || 'Professional driving with Movy';
  };
  const [isDriver, setIsDriver] = useState<boolean>(
    route.params?.isDriver !== undefined ? !!route.params.isDriver : !!driverSelected
  );

  // Monitorar altura do teclado virtual para evitar sobreposição total
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const scrollViewRef = useRef<ScrollView>(null);

  const scrollToInput = (yOffset?: number) => {
    setTimeout(() => {
      if (typeof yOffset === 'number') {
        scrollViewRef.current?.scrollTo({ y: yOffset, animated: true });
      } else {
        scrollViewRef.current?.scrollToEnd({ animated: true });
      }
    }, 100);
  };

  useEffect(() => {
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const showSub = Keyboard.addListener(showEvent, e => {
      setKeyboardHeight(e.endCoordinates.height);
    });
    const hideSub = Keyboard.addListener(hideEvent, () => {
      setKeyboardHeight(0);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  // Passos do cadastro:
  // Passageiro: 1 = Identificação, 2 = Contato/Cidade, 3 = Foto e Senha
  // Motorista: 1 = Categoria, 2 = Dados Pessoais, 3 = Veículo, 4 = Documentos EUA, 5 = Foto e Senha
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
  const [pSsn, setPSsn] = useState(''); // SSN / ITIN americano (9 números, sem foto)
  const [pBirthDate, setPBirthDate] = useState('');
  const [pPhone, setPPhone] = useState('');
  const [pEmail, setPEmail] = useState('');
  const [pCity, setPCity] = useState<CityItem | null>(null);
  const [pPhoto, setPPhoto] = useState<string | null>(null);
  const [pPassword, setPPassword] = useState('');
  const [pConfirmPassword, setPConfirmPassword] = useState('');
  const [pShowPassword, setPShowPassword] = useState(false);

  // Formulário do Motorista
  const [dName, setDName] = useState('');
  const [dSsn, setDSsn] = useState(''); // SSN / ITIN americano (9 números, sem foto)
  const [dBirthDate, setDBirthDate] = useState('');
  const [dPhone, setDPhone] = useState('');
  const [dEmail, setDEmail] = useState('');
  const [dCity, setDCity] = useState<CityItem | null>(null);

  // Veículo do Motorista (formato americano flexível de 1 a 8 caracteres alfanuméricos)
  const [dPlate, setDPlate] = useState('');
  const [dVehicleModel, setDVehicleModel] = useState('');
  const [dVehicleColor, setDVehicleColor] = useState('');
  const [dVehicleYear, setDVehicleYear] = useState('');

  // Documentação dos EUA do Motorista
  const [dDocLicense, setDDocLicense] = useState<string | null>(null); // Carteira de motorista americana (Driver's License)
  const [dDocRegistration, setDDocRegistration] = useState<string | null>(null); // Registro do veículo (Vehicle Registration)
  const [dDocInsurance, setDDocInsurance] = useState<string | null>(null); // Seguro do carro
  const [dDocResidence, setDDocResidence] = useState<string | null>(null); // Comprovante de residência

  // Foto de Perfil e Senha do Motorista
  const [dPhoto, setDPhoto] = useState<string | null>(null);
  const [dPassword, setDPassword] = useState('');
  const [dConfirmPassword, setDConfirmPassword] = useState('');
  const [dShowPassword, setDShowPassword] = useState(false);

  // Erros de validação
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  // Máscara SSN / ITIN dos EUA: 9 números (XXX-XX-XXXX), sem foto
  const maskSsnItin = useCallback((val: string) => {
    const raw = val.replace(/\D/g, '').slice(0, 9);
    if (raw.length <= 3) return raw;
    if (raw.length <= 5) return `${raw.slice(0, 3)}-${raw.slice(3)}`;
    return `${raw.slice(0, 3)}-${raw.slice(3, 5)}-${raw.slice(5, 9)}`;
  }, []);

  const maskDate = useCallback((val: string) => {
    const raw = val.replace(/\D/g, '').slice(0, 8);
    if (raw.length <= 2) return raw;
    if (raw.length <= 4) return `${raw.slice(0, 2)}/${raw.slice(2)}`;
    return `${raw.slice(0, 2)}/${raw.slice(2, 4)}/${raw.slice(4, 8)}`;
  }, []);

  const maskPhone = useCallback((val: string) => {
    const raw = val.replace(/\D/g, '').slice(0, 11);
    if (raw.length <= 3) return raw;
    if (raw.length <= 6) return `(${raw.slice(0, 3)}) ${raw.slice(3)}`;
    return `(${raw.slice(0, 3)}) ${raw.slice(3, 6)}-${raw.slice(6)}`;
  }, []);

  // Formato flexível para placa de veículos dos Estados Unidos (1 a 8 caracteres alfanuméricos)
  // Remove restrições e travamentos de placa brasileira
  const formatPlate = useCallback((val: string) => {
    return val.toUpperCase().replace(/[^A-Z0-9- ]/g, '').slice(0, 8);
  }, []);

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

  // Alternar o perfil (Passageiro vs Motorista)
  const handleToggleProfile = (driverOption: boolean) => {
    setIsDriver(driverOption);
    setDriverSelected(driverOption);
    setErrors({});
  };

  // Botão Voltar do Header
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

  // Selecionar ou Capturar Foto de Perfil
  const handlePickPhoto = async (forDriver: boolean, useCamera: boolean) => {
    try {
      let result: ImagePicker.ImagePickerResult;

      if (useCamera) {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permissão necessária', 'Permita o acesso à câmera para tirar sua foto de perfil.');
          return;
        }
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ['images'],
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });
      } else {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permissão necessária', 'Permita o acesso à galeria para selecionar sua foto de perfil.');
          return;
        }
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          allowsEditing: true,
          aspect: [1, 1],
          quality: 0.8,
        });
      }

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        if (forDriver) {
          setDPhoto(uri);
        } else {
          setPPhoto(uri);
        }
      }
    } catch (err) {
      Alert.alert('Aviso', 'Não foi possível carregar a imagem. Tente novamente.');
    }
  };

  // Selecionar ou Fotografar Documento Obrigatório do Motorista (EUA)
  const handlePickDocument = async (
    docType: 'license' | 'registration' | 'insurance' | 'residence',
    useCamera: boolean
  ) => {
    try {
      let result: ImagePicker.ImagePickerResult;

      if (useCamera) {
        const { status } = await ImagePicker.requestCameraPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permissão necessária', 'Permita o acesso à câmera para fotografar o documento.');
          return;
        }
        result = await ImagePicker.launchCameraAsync({
          mediaTypes: ['images'],
          allowsEditing: false,
          quality: 0.85,
        });
      } else {
        const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
        if (status !== 'granted') {
          Alert.alert('Permissão necessária', 'Permita o acesso à galeria para selecionar o documento.');
          return;
        }
        result = await ImagePicker.launchImageLibraryAsync({
          mediaTypes: ['images'],
          allowsEditing: false,
          quality: 0.85,
        });
      }

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const uri = result.assets[0].uri;
        if (docType === 'license') {
          setDDocLicense(uri);
          setErrors(prev => ({ ...prev, dDocLicense: '' }));
        } else if (docType === 'registration') {
          setDDocRegistration(uri);
          setErrors(prev => ({ ...prev, dDocRegistration: '' }));
        } else if (docType === 'insurance') {
          setDDocInsurance(uri);
          setErrors(prev => ({ ...prev, dDocInsurance: '' }));
        } else if (docType === 'residence') {
          setDDocResidence(uri);
          setErrors(prev => ({ ...prev, dDocResidence: '' }));
        }
      }
    } catch {
      Alert.alert('Aviso', 'Não foi possível carregar o documento. Tente novamente.');
    }
  };

  /* ===== VALIDAÇÕES E AVANÇO: PASSAGEIRO ===== */
  const handleNextPassengerStep = () => {
    const newErrors: { [key: string]: string } = {};

    if (passengerStep === 1) {
      if (!pName.trim()) newErrors.pName = t('Enter your full name', 'Informe seu nome completo');
      const cleanSsn = pSsn.replace(/\D/g, '');
      if (cleanSsn && cleanSsn.length > 0 && cleanSsn.length !== 9) {
        newErrors.pSsn = t('SSN / ITIN must have 9 digits', 'O SSN / ITIN deve ter 9 dígitos');
      }
      const cleanBirth = pBirthDate.replace(/\D/g, '');
      if (cleanBirth && cleanBirth.length > 0 && cleanBirth.length !== 8) {
        newErrors.pBirthDate = t('Incomplete date of birth', 'Data de nascimento incompleta (DD/MM/AAAA)');
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
      setErrors({});
      setPassengerStep(2);
    } else if (passengerStep === 2) {
      const cleanPhone = pPhone.replace(/\D/g, '');
      if (!cleanPhone || cleanPhone.length < 10) newErrors.pPhone = t('Enter a valid phone number', 'Informe um telefone válido');
      if (!pEmail.trim() || !pEmail.includes('@') || !pEmail.includes('.')) {
        newErrors.pEmail = t('Enter a valid email address', 'Informe um e-mail válido');
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
      newErrors.pPassword = t('Password must have at least 6 characters', 'A senha deve ter no mínimo 6 caracteres');
    }
    if (pPassword !== pConfirmPassword) {
      newErrors.pConfirmPassword = t('Passwords do not match', 'As senhas não coincidem');
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    setSubmitting(true);

    try {
      const formattedDate = normalizeDateForApi(pBirthDate, 2000);
      const cleanSsn = pSsn.replace(/\D/g, '');

      const payload = {
        name: pName.trim(),
        email: pEmail.trim().toLowerCase(),
        document: cleanSsn,
        dateOfBirth: formattedDate,
        nickname: pName.trim().split(' ')[0] || 'Cliente',
        registered_in: 'mobilidade',
        phone: pPhone.replace(/\D/g, ''),
        password: pPassword,
        cityId: pCity?.id || 5605,
      };

      const { data } = await apiMain.post('Customer/Register', {
        stdObject: [payload],
      });

      if (!data || data.status !== true) {
        Alert.alert(
          t('Attention', 'Atenção'),
          data?.message || t('Unable to complete registration. Please check your data and try again.', 'Não foi possível concluir o cadastro. Verifique os dados e tente novamente.')
        );
        return;
      }

      // Se o usuário selecionou uma foto de perfil, envia via multipart
      if (pPhoto) {
        try {
          const customerId =
            data?.data?.idCustomer ||
            data?.data?.customerId ||
            data?.data?.idUser ||
            data?.data?.userId ||
            data?.data?.[0]?.idCustomer ||
            data?.data?.[0]?.idUser ||
            data?.data?.id ||
            data?.idCustomer ||
            data?.idUser;
          if (customerId) {
            const formData = new FormData();
            formData.append('customerId', String(customerId));
            formData.append('userId', String(customerId));
            formData.append('idUser', String(customerId));
            formData.append('photo', {
              uri: pPhoto,
              type: 'image/jpeg',
              name: 'profile.jpg',
            } as any);
            await apiMain.post('Customer/UpdateProfileImage', formData, {
              headers: { 'Content-Type': 'multipart/form-data' },
              timeout: 30000,
            });
          }
        } catch (photoErr) {
          console.log('Upload de foto passageiro:', photoErr);
        }
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
        newErrors.category = t('Select a category to continue', 'Selecione uma categoria para continuar');
        setErrors(newErrors);
        return;
      }
      setErrors({});
      setDriverStep(2);
    } else if (driverStep === 2) {
      if (!dName.trim()) newErrors.dName = t('Enter your full name', 'Informe seu nome completo');
      const cleanSsn = dSsn.replace(/\D/g, '');
      if (!cleanSsn || cleanSsn.length !== 9) {
        newErrors.dSsn = t('Enter a valid 9-digit US SSN / ITIN', 'Informe o SSN / ITIN americano válido (9 números)');
      }
      const cleanBirth = dBirthDate.replace(/\D/g, '');
      if (cleanBirth && cleanBirth.length > 0 && cleanBirth.length !== 8) {
        newErrors.dBirthDate = t('Enter complete date of birth', 'Informe a data completa (DD/MM/AAAA)');
      } else if (cleanBirth && cleanBirth.length === 8) {
        const norm = normalizeDateForApi(dBirthDate, 1995);
        const [y, m, d] = norm.split('-').map(n => parseInt(n, 10));
        const currentYear = new Date().getFullYear();
        if (d < 1 || d > 31 || m < 1 || m > 12 || y < 1920 || y > currentYear - 18) {
          newErrors.dBirthDate = t('Invalid date of birth (minimum 18 years old)', 'Data de nascimento inválida (mínimo 18 anos)');
        }
      }
      const cleanPhone = dPhone.replace(/\D/g, '');
      if (!cleanPhone || cleanPhone.length < 10) newErrors.dPhone = t('Enter a valid phone number with area code', 'Informe um telefone válido com código de área');
      if (!dEmail.trim() || !dEmail.includes('@') || !dEmail.includes('.')) {
        newErrors.dEmail = t('Enter a valid email address', 'Informe um e-mail válido');
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
      setErrors({});
      setDriverStep(3);
    } else if (driverStep === 3) {
      // Placa de veículo dos Estados Unidos (1 a 8 caracteres alfanuméricos) - SEM TRAVAMENTO
      const cleanPlate = dPlate.toUpperCase().replace(/[^A-Z0-9]/g, '');
      if (!cleanPlate || cleanPlate.length < 2) {
        newErrors.dPlate = t('Enter a valid license plate (2 to 8 characters)', 'Informe uma placa de veículo válida (2 a 8 caracteres)');
      }
      if (!dVehicleModel.trim()) {
        newErrors.dVehicleModel = t('Enter vehicle make and model', 'Informe o modelo e marca do veículo');
      }

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
      setErrors({});
      setDriverStep(4);
    } else if (driverStep === 4) {
      // Documentação Americana Obrigatória
      if (!dDocLicense) newErrors.dDocLicense = t('Attach US Driver’s License', 'Anexe a Carteira de motorista americana (Driver’s License)');
      if (!dDocRegistration) newErrors.dDocRegistration = t('Attach Vehicle Registration', 'Anexe o Registro do veículo (Vehicle Registration)');
      if (!dDocInsurance) newErrors.dDocInsurance = t('Attach Proof of Vehicle Insurance', 'Anexe o Comprovante de seguro do carro');
      if (!dDocResidence) newErrors.dDocResidence = t('Attach Proof of Residence', 'Anexe o Comprovante de residência');

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }
      setErrors({});
      setDriverStep(5);
    }
  };

  /* ===== SUBMISSÃO FINAL: MOTORISTA ===== */
  const handleSubmitDriver = async () => {
    const newErrors: { [key: string]: string } = {};
    if (!dPhoto) {
      newErrors.dPhoto = t('Add a clear profile photo for identification', 'Adicione sua foto de perfil nítida para identificação');
    }
    if (!dPassword || dPassword.length < 6) {
      newErrors.dPassword = t('Password must have at least 6 characters', 'A senha deve ter no mínimo 6 caracteres');
    }
    if (dPassword !== dConfirmPassword) {
      newErrors.dConfirmPassword = t('Passwords do not match', 'As senhas não coincidem');
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    setSubmitting(true);

    try {
      const formattedDate = normalizeDateForApi(dBirthDate, 1995);
      const cleanSsn = dSsn.replace(/\D/g, '');

      const driverPayload: any = {
        user: {
          name: dName.trim(),
          email: dEmail.trim().toLowerCase(),
          document: cleanSsn,
          dateOfBirth: formattedDate,
          phone: dPhone.replace(/\D/g, ''),
          password: dPassword,
          userTypeId: selectedCategoryId,
          registered_in: 'mobilidade',
          cityId: dCity?.id || 1,
        },
        vehicle: {
          licensePlate: dPlate.toUpperCase().trim(),
          model: dVehicleModel.trim(),
          color: dVehicleColor.trim() || 'Padrão',
          year: dVehicleYear.trim() || '2020',
        },
      };

      if (dPhoto) {
        driverPayload.photo = dPhoto;
      }

      const driverObj = {
        name: dName.trim(),
        email: dEmail.trim().toLowerCase(),
        document: cleanSsn,
        dateOfBirth: formattedDate,
        phone: dPhone.replace(/\D/g, ''),
        password: dPassword,
        userTypeId: selectedCategoryId,
        registered_in: 'mobilidade',
        cityId: dCity?.id || 5605,
        docs: [
          { docId: 1, text: "Driver's License" },
          { docId: 2, text: "Vehicle insurance and registration" },
          { docId: 6, text: "Proof of residence" },
          { docId: 10, text: "SCN" },
        ],
      };

      const vehicleObj = {
        licensePlate: dPlate.toUpperCase().trim() || ('MOV' + Math.floor(1000 + Math.random() * 9000)),
        model: dVehicleModel.trim() || 'Standard',
        brand: (dVehicleModel.trim().split(' ')[0]) || 'Vehicle',
        color: dVehicleColor.trim() || 'Black',
        year: dVehicleYear.trim() || '2022',
      };

      const formData = new FormData();
      formData.append('stdObject', JSON.stringify({
        driver: driverObj,
        car: vehicleObj,
      }));

      if (dPhoto) {
        formData.append('PROFILE', {
          uri: dPhoto,
          type: 'image/jpeg',
          name: 'profile.jpg',
        } as any);
      }
      if (dDocLicense) {
        formData.append('DOC_1', {
          uri: dDocLicense,
          type: 'image/jpeg',
          name: 'drivers_license.jpg',
        } as any);
        formData.append('CNH', {
          uri: dDocLicense,
          type: 'image/jpeg',
          name: 'drivers_license.jpg',
        } as any);
      }
      if (dDocRegistration) {
        formData.append('DOC_2', {
          uri: dDocRegistration,
          type: 'image/jpeg',
          name: 'vehicle_registration.jpg',
        } as any);
        formData.append('CRLV', {
          uri: dDocRegistration,
          type: 'image/jpeg',
          name: 'vehicle_registration.jpg',
        } as any);
      }
      if (dDocResidence) {
        formData.append('DOC_6', {
          uri: dDocResidence,
          type: 'image/jpeg',
          name: 'proof_of_residence.jpg',
        } as any);
        formData.append('DOC_4', {
          uri: dDocResidence,
          type: 'image/jpeg',
          name: 'proof_of_residence.jpg',
        } as any);
      }
      if (dDocInsurance) {
        formData.append('DOC_10', {
          uri: dDocInsurance,
          type: 'image/jpeg',
          name: 'insurance.jpg',
        } as any);
        formData.append('DOC_3', {
          uri: dDocInsurance,
          type: 'image/jpeg',
          name: 'insurance.jpg',
        } as any);
      }

      let response: any;
      try {
        response = await apiMain.post('Driver/Register', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          timeout: 45000,
        });
      } catch (errMultipart) {
        response = await apiMain.post('Driver/Register', {
          stdObject: {
            driver: driverObj,
            car: vehicleObj,
          }
        }, { timeout: 30000 });
      }

      if (!response?.data || response.data.status !== true) {
        Alert.alert(
          t('Attention', 'Atenção'),
          response?.data?.message || t('Driver registration could not be completed. Please check your data.', 'Não foi possível concluir o cadastro de motorista. Verifique os dados.')
        );
        return;
      }

      const resolvedId =
        response?.data?.idDriver ||
        response?.data?.driverId ||
        response?.data?.data?.idDriver ||
        response?.data?.data?.driverId ||
        response?.data?.data?.idUser ||
        response?.data?.data?.userId ||
        response?.data?.idUser ||
        response?.data?.userId ||
        response?.data?.id;

      // 1. Upload de Foto de Perfil
      if (dPhoto && resolvedId) {
        try {
          const formData = new FormData();
          formData.append('driverId', String(resolvedId));
          formData.append('customerId', String(resolvedId));
          formData.append('userId', String(resolvedId));
          formData.append('idUser', String(resolvedId));
          formData.append('photo', {
            uri: dPhoto,
            type: 'image/jpeg',
            name: 'driver_profile.jpg',
          } as any);

          try {
            await apiMain.post('Driver/EditProfileImage', formData, {
              headers: { 'Content-Type': 'multipart/form-data' },
              timeout: 30000,
            });
          } catch {
            await apiMain.post('Customer/UpdateProfileImage', formData, {
              headers: { 'Content-Type': 'multipart/form-data' },
              timeout: 30000,
            });
          }
        } catch (photoErrDriver) {
          console.log('Upload foto driver:', photoErrDriver);
        }
      }

      // 2. Upload da Documentação Americana Obrigatória
      const docsToUpload = [
        { uri: dDocLicense, docId: '1', name: 'drivers_license.jpg' },
        { uri: dDocRegistration, docId: '2', name: 'vehicle_registration.jpg' },
        { uri: dDocInsurance, docId: '3', name: 'vehicle_insurance.jpg' },
        { uri: dDocResidence, docId: '4', name: 'proof_of_residency.jpg' },
      ];

      if (resolvedId) {
        for (const doc of docsToUpload) {
          if (doc.uri) {
            try {
              const docFormData = new FormData();
              docFormData.append('docId', doc.docId);
              docFormData.append('userId', String(resolvedId));
              docFormData.append(`DOC_${doc.docId}`, {
                uri: doc.uri,
                type: 'image/jpeg',
                name: doc.name,
              } as any);

              await apiMain.post('DocUser/Send', docFormData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                timeout: 30000,
              });
            } catch (docErr) {
              console.log('Envio doc ' + doc.name + ':', docErr);
            }
          }
        }
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
        <ScrollContainer extraPaddingBottom={Platform.OS === 'ios' ? 120 : 80}>
          <ContentWrapper>
            <TopNavHeader>
              <BackButton onPress={() => navigation.goBack()} activeOpacity={0.8}>
                <Feather name="arrow-left" size={22} color="#ffffff" />
              </BackButton>
              <HeaderTitleContainer>
                <HeaderLogo source={logoMovyWhite} />
                <HeaderSubtitle>{t('Registration Complete', 'Cadastro Realizado')}</HeaderSubtitle>
              </HeaderTitleContainer>
              <View style={{ width: 42 }} />
            </TopNavHeader>

            <GlassRegisterCard>
              <SuccessContainer>
                <SuccessIconBadge>
                  <Feather name="check" size={32} color="#22c55e" />
                </SuccessIconBadge>
                <SuccessTitle>
                  {!isDriver ? t('Registration completed successfully!', 'Cadastro concluído com sucesso!') : t('Driver registration submitted!', 'Cadastro de motorista enviado!')}
                </SuccessTitle>
                <SuccessDescription>
                  {!isDriver
                    ? 'Your Movy passenger account has been created successfully. You can now request fast, safe, and affordable rides.'
                    : 'We received your partner driver information and complete documentation. Our team is reviewing your documents for approval.'}
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
                    {!isDriver ? t('Sign in to Movy Now', 'Entrar na Movy Agora') : t('Go to Driver Login', 'Ir para Login de Motorista')}
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

  /* ===== FORMULÁRIO NATIVO PASSO A PASSO COM ANTI-OBSTRUÇÃO DE TECLADO ===== */
  return (
    <BackgroundContainer source={loginBg} resizeMode="cover">
      <DarkOverlay />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 20 : 0}
      >
        <ScrollContainer
          ref={scrollViewRef}
          contentContainerStyle={{
            flexGrow: 1,
            paddingVertical: 18,
            paddingBottom: keyboardHeight > 0 ? (Platform.OS === 'ios' ? keyboardHeight + 160 : 260) : (Platform.OS === 'ios' ? 140 : 100),
          }}
          keyboardShouldPersistTaps="handled"
          extraPaddingBottom={
            keyboardHeight > 0
              ? keyboardHeight + 160
              : (Platform.OS === 'ios' ? 140 : 100)
          }
        >
          <ContentWrapper>
            {/* Header Superior com Botão Voltar e Logo Movy */}
            <TopNavHeader>
              <BackButton onPress={handleBackNavigation} activeOpacity={0.8}>
                <Feather name="arrow-left" size={22} color="#ffffff" />
              </BackButton>
              <HeaderTitleContainer>
                <HeaderLogo source={logoMovyWhite} />
                <HeaderSubtitle>
                  {!isDriver ? t('Passenger Registration', 'Cadastro de Passageiro') : t('Driver Registration', 'Cadastro de Motorista')}
                </HeaderSubtitle>
              </HeaderTitleContainer>
              <View style={{ width: 42 }} />
            </TopNavHeader>

            {/* ===== GRID DE SELEÇÃO DE PERFIL: PASSAGEIRO / MOTORISTA ===== */}
            <ProfileGridContainer>
              {/* GRID PASSAGEIRO */}
              <ProfileGridItem
                active={!isDriver}
                activeOpacity={0.8}
                onPress={() => handleToggleProfile(false)}
              >
                <ProfileIconBadge active={!isDriver}>
                  <FontAwesome5
                    name="user"
                    size={RFValue(18)}
                    color={!isDriver ? '#ffffff' : 'rgba(255, 255, 255, 0.7)'}
                  />
                </ProfileIconBadge>
                <ProfileGridTitle active={!isDriver}>
                  {t('PASSENGER', 'PASSAGEIRO')}
                </ProfileGridTitle>
                <ProfileGridSubtitle active={!isDriver}>
                  {t('I want to travel', 'Quero viajar')}
                </ProfileGridSubtitle>
              </ProfileGridItem>

              {/* GRID MOTORISTA */}
              <ProfileGridItem
                active={isDriver}
                activeOpacity={0.8}
                onPress={() => handleToggleProfile(true)}
              >
                <ProfileIconBadge active={isDriver}>
                  <MaterialCommunityIcons
                    name="steering"
                    size={RFValue(20)}
                    color={isDriver ? '#ffffff' : 'rgba(255, 255, 255, 0.7)'}
                  />
                </ProfileIconBadge>
                <ProfileGridTitle active={isDriver}>
                  {t('DRIVER', 'MOTORISTA')}
                </ProfileGridTitle>
                <ProfileGridSubtitle active={isDriver}>
                  {t('I want to drive', 'Quero dirigir')}
                </ProfileGridSubtitle>
              </ProfileGridItem>
            </ProfileGridContainer>

            {/* ===== INDICADOR DE PASSOS: PASSAGEIRO (3 PASSOS) ===== */}
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
                  {passengerStep === 1 && t('Step 1 of 3: Identification', 'Etapa 1 de 3: Identificação')}
                  {passengerStep === 2 && t('Step 2 of 3: Contact & Location', 'Etapa 2 de 3: Contato e Localização')}
                  {passengerStep === 3 && t('Step 3 of 3: Profile Photo & Password', 'Etapa 3 de 3: Foto de Perfil e Senha')}
                </StepInfoLabel>

                {/* CARD PRINCIPAL DO PASSAGEIRO */}
                <GlassRegisterCard>
                  <CardHeaderRow>
                    <CardHeaderPill>
                      <Feather name="user-check" size={14} color="#ff80ab" />
                      <CardHeaderPillText>{t('Passenger Registration', 'Cadastro de Passageiro')}</CardHeaderPillText>
                    </CardHeaderPill>
                    <StepCounterBadge>{t(`Step ${passengerStep} of 3`, `Passo ${passengerStep} de 3`)}</StepCounterBadge>
                  </CardHeaderRow>

                  {/* PASSO 1: IDENTIFICAÇÃO (PASSAGEIRO) */}
                  {passengerStep === 1 && (
                    <View>
                      <InputGroup>
                        <ModernInputLabel>{t('Full Name *', 'Nome Completo *')}</ModernInputLabel>
                        <ModernInputBox hasError={!!errors.pName}>
                          <Feather name="user" size={18} color="#8A99AD" />
                          <ModernTextInput
                            placeholder={t('Enter your full name', 'Digite seu nome completo')}
                            placeholderTextColor="rgba(255, 255, 255, 0.35)"
                            value={pName}
                            onChangeText={setPName}
                            autoCapitalize="words"
                            autoCorrect={false}
                          />
                        </ModernInputBox>
                        {errors.pName && <InputErrorText>{errors.pName}</InputErrorText>}
                      </InputGroup>

                      {/* SSN / ITIN Americano (9 números, sem foto) */}
                      <InputGroup>
                        <ModernInputLabel>{t('SSN / ITIN (US Identification)', 'SSN / ITIN (Identificação Americana)')}</ModernInputLabel>
                        <ModernInputBox hasError={!!errors.pSsn}>
                          <MaterialCommunityIcons name="card-account-details-outline" size={18} color="#8A99AD" />
                          <ModernTextInput
                            placeholder={t('000-00-0000 (9 digits)', '000-00-0000 (9 números)')}
                            placeholderTextColor="rgba(255, 255, 255, 0.35)"
                            value={pSsn}
                            onChangeText={txt => setPSsn(maskSsnItin(txt))}
                            keyboardType="numeric"
                            maxLength={11}
                            autoCorrect={false}
                          />
                        </ModernInputBox>
                        {errors.pSsn && <InputErrorText>{errors.pSsn}</InputErrorText>}
                      </InputGroup>

                      <InputGroup>
                        <ModernInputLabel>{t('Date of Birth', 'Data de Nascimento')}</ModernInputLabel>
                        <ModernInputBox hasError={!!errors.pBirthDate}>
                          <Feather name="calendar" size={18} color="#8A99AD" />
                          <ModernTextInput
                            placeholder={t('MM/DD/YYYY', 'DD/MM/AAAA')}
                            placeholderTextColor="rgba(255, 255, 255, 0.35)"
                            value={pBirthDate}
                            onChangeText={txt => setPBirthDate(maskDate(txt))}
                            keyboardType="numeric"
                            maxLength={10}
                            autoCorrect={false}
                          />
                        </ModernInputBox>
                        {errors.pBirthDate && <InputErrorText>{errors.pBirthDate}</InputErrorText>}
                      </InputGroup>

                      <ButtonActionsRow>
                        <NextStepButton activeOpacity={0.8} onPress={handleNextPassengerStep}>
                          <NextStepButtonText>{t('Continue', 'Continuar')}</NextStepButtonText>
                          <Feather name="arrow-right" size={18} color="#ffffff" />
                        </NextStepButton>
                      </ButtonActionsRow>
                    </View>
                  )}

                  {/* PASSO 2: CONTATO E LOCALIZAÇÃO (PASSAGEIRO) */}
                  {passengerStep === 2 && (
                    <View>
                      <InputGroup>
                        <ModernInputLabel>{t('Phone Number *', 'Telefone / Celular *')}</ModernInputLabel>
                        <ModernInputBox hasError={!!errors.pPhone}>
                          <Feather name="phone" size={18} color="#8A99AD" />
                          <ModernTextInput
                            placeholder="(000) 000-0000"
                            placeholderTextColor="rgba(255, 255, 255, 0.35)"
                            value={pPhone}
                            onChangeText={txt => setPPhone(maskPhone(txt))}
                            keyboardType="phone-pad"
                            maxLength={16}
                            autoCorrect={false}
                          />
                        </ModernInputBox>
                        {errors.pPhone && <InputErrorText>{errors.pPhone}</InputErrorText>}
                      </InputGroup>

                      <InputGroup>
                        <ModernInputLabel>{t('Email Address *', 'E-mail *')}</ModernInputLabel>
                        <ModernInputBox hasError={!!errors.pEmail}>
                          <Feather name="mail" size={18} color="#8A99AD" />
                          <ModernTextInput
                            placeholder="seuemail@exemplo.com"
                            placeholderTextColor="rgba(255, 255, 255, 0.35)"
                            value={pEmail}
                            onChangeText={setPEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoCorrect={false}
                          />
                        </ModernInputBox>
                        {errors.pEmail && <InputErrorText>{errors.pEmail}</InputErrorText>}
                      </InputGroup>

                      <InputGroup>
                        <ModernInputLabel>{t('City / Area', 'Cidade')}</ModernInputLabel>
                        <DropdownButton
                          activeOpacity={0.8}
                          onPress={() => setShowCityPicker(true)}
                        >
                          <DropdownButtonText hasValue={!!pCity}>
                            {pCity ? pCity.nome : t('Select your city', 'Selecione sua cidade')}
                          </DropdownButtonText>
                          <Feather
                            name="chevron-down"
                            size={18}
                            color="#8A99AD"
                          />
                        </DropdownButton>

                        <Modal
                          visible={showCityPicker}
                          transparent
                          animationType="fade"
                          onRequestClose={() => setShowCityPicker(false)}
                        >
                          <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => setShowCityPicker(false)}
                            style={{
                              flex: 1,
                              backgroundColor: 'rgba(0, 0, 0, 0.75)',
                              justifyContent: 'center',
                              alignItems: 'center',
                              paddingHorizontal: 20,
                            }}
                          >
                            <TouchableOpacity
                              activeOpacity={1}
                              style={{
                                width: '100%',
                                maxWidth: 400,
                                maxHeight: '70%',
                                backgroundColor: '#131A26',
                                borderRadius: 16,
                                borderWidth: 1,
                                borderColor: 'rgba(255, 255, 255, 0.15)',
                                overflow: 'hidden',
                                elevation: 20,
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 10 },
                                shadowOpacity: 0.5,
                                shadowRadius: 20,
                              }}
                            >
                              <View
                                style={{
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  paddingHorizontal: 20,
                                  paddingVertical: 16,
                                  borderBottomWidth: 1,
                                  borderBottomColor: 'rgba(255, 255, 255, 0.1)',
                                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                                }}
                              >
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                  <Feather name="map-pin" size={18} color="#ff80ab" style={{ marginRight: 8 }} />
                                  <Text style={{ color: '#ffffff', fontSize: RFValue(15), fontWeight: '700' }}>
                                    {t('Select your City', 'Selecione sua Cidade')}
                                  </Text>
                                </View>
                                <TouchableOpacity
                                  activeOpacity={0.7}
                                  onPress={() => setShowCityPicker(false)}
                                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                >
                                  <Feather name="x" size={20} color="#8A99AD" />
                                </TouchableOpacity>
                              </View>

                              <ScrollView
                                style={{ maxHeight: 360 }}
                                contentContainerStyle={{ paddingVertical: 6 }}
                                showsVerticalScrollIndicator={true}
                                bounces={false}
                              >
                                {cities.map(item => {
                                  const isSelected = pCity?.id === item.id;
                                  return (
                                    <TouchableOpacity
                                      key={String(item.id)}
                                      style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        paddingVertical: 14,
                                        paddingHorizontal: 20,
                                        borderBottomWidth: 1,
                                        borderBottomColor: 'rgba(255, 255, 255, 0.05)',
                                        backgroundColor: isSelected ? 'rgba(255, 128, 171, 0.12)' : 'transparent',
                                      }}
                                      activeOpacity={0.7}
                                      onPress={() => {
                                        setPCity(item);
                                        setShowCityPicker(false);
                                      }}
                                    >
                                      <Text
                                        style={{
                                          color: isSelected ? '#ff80ab' : '#ffffff',
                                          fontWeight: isSelected ? '700' : '400',
                                          fontSize: RFValue(14),
                                          flex: 1,
                                        }}
                                      >
                                        {item.nome}
                                      </Text>
                                      {isSelected && (
                                        <Feather name="check" size={18} color="#ff80ab" />
                                      )}
                                    </TouchableOpacity>
                                  );
                                })}
                              </ScrollView>
                            </TouchableOpacity>
                          </TouchableOpacity>
                        </Modal>
                      </InputGroup>

                      <ButtonActionsRow>
                        <BackStepButton activeOpacity={0.8} onPress={() => setPassengerStep(1)}>
                          <Feather name="arrow-left" size={16} color="rgba(255, 255, 255, 0.8)" />
                          <BackStepButtonText>{t('Back', 'Voltar')}</BackStepButtonText>
                        </BackStepButton>

                        <NextStepButton activeOpacity={0.8} onPress={handleNextPassengerStep}>
                          <NextStepButtonText>{t('Continue', 'Continuar')}</NextStepButtonText>
                          <Feather name="arrow-right" size={18} color="#ffffff" />
                        </NextStepButton>
                      </ButtonActionsRow>
                    </View>
                  )}

                  {/* PASSO 3: FOTO DE PERFIL E SENHA (PASSAGEIRO) */}
                  {passengerStep === 3 && (
                    <View>
                      <PhotoUploadSection>
                        <PhotoAvatarWrapper
                          activeOpacity={0.8}
                          onPress={() => handlePickPhoto(false, false)}
                        >
                          {pPhoto ? (
                            <PhotoAvatarImage source={{ uri: pPhoto }} />
                          ) : (
                            <PhotoAvatarPlaceholder>
                              <Feather name="user" size={42} color="rgba(255, 255, 255, 0.45)" />
                            </PhotoAvatarPlaceholder>
                          )}
                          <PhotoCameraBadge>
                            <Feather name="camera" size={15} color="#ffffff" />
                          </PhotoCameraBadge>
                        </PhotoAvatarWrapper>

                        <PhotoTipText>
                          {pPhoto ? t('Profile photo selected', 'Foto de perfil selecionada') : t('Add a clear profile photo', 'Adicione uma foto de perfil nítida')}
                        </PhotoTipText>

                        <PhotoActionsRow>
                          <PhotoChoiceButton
                            variant="camera"
                            activeOpacity={0.8}
                            onPress={() => handlePickPhoto(false, true)}
                          >
                            <Feather name="camera" size={14} color="#ffffff" />
                            <PhotoChoiceButtonText>{t('Take Photo', 'Tirar Foto')}</PhotoChoiceButtonText>
                          </PhotoChoiceButton>

                          <PhotoChoiceButton
                            variant="gallery"
                            activeOpacity={0.8}
                            onPress={() => handlePickPhoto(false, false)}
                          >
                            <Feather name="image" size={14} color="#ffffff" />
                            <PhotoChoiceButtonText>{t('Gallery', 'Galeria')}</PhotoChoiceButtonText>
                          </PhotoChoiceButton>
                        </PhotoActionsRow>

                        {pPhoto && (
                          <PhotoRemoveBtn activeOpacity={0.7} onPress={() => setPPhoto(null)}>
                            <PhotoRemoveBtnText>{t('Remove Photo', 'Remover Foto')}</PhotoRemoveBtnText>
                          </PhotoRemoveBtn>
                        )}
                      </PhotoUploadSection>

                      <InputGroup>
                        <ModernInputLabel>{t('Password *', 'Senha de Acesso *')}</ModernInputLabel>
                        <ModernInputBox hasError={!!errors.pPassword}>
                          <Feather name="lock" size={18} color="#8A99AD" />
                          <ModernTextInput
                            placeholder={t('Minimum 6 characters', 'Mínimo de 6 caracteres')}
                            placeholderTextColor="rgba(255, 255, 255, 0.35)"
                            secureTextEntry={!pShowPassword}
                            value={pPassword}
                            onChangeText={setPPassword}
                            onFocus={() => scrollToInput(300)}
                            autoCorrect={false}
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
                        <ModernInputLabel>{t('Confirm Password *', 'Confirmar Senha *')}</ModernInputLabel>
                        <ModernInputBox hasError={!!errors.pConfirmPassword}>
                          <Feather name="lock" size={18} color="#8A99AD" />
                          <ModernTextInput
                            placeholder={t('Repeat your password', 'Repita a senha')}
                            placeholderTextColor="rgba(255, 255, 255, 0.35)"
                            secureTextEntry={!pShowPassword}
                            value={pConfirmPassword}
                            onChangeText={setPConfirmPassword}
                            onFocus={() => scrollToInput()}
                            autoCorrect={false}
                          />
                        </ModernInputBox>
                        {errors.pConfirmPassword && (
                          <InputErrorText>{errors.pConfirmPassword}</InputErrorText>
                        )}
                      </InputGroup>

                      <ButtonActionsRow>
                        <BackStepButton activeOpacity={0.8} onPress={() => setPassengerStep(2)}>
                          <Feather name="arrow-left" size={16} color="rgba(255, 255, 255, 0.8)" />
                          <BackStepButtonText>{t('Back', 'Voltar')}</BackStepButtonText>
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
                              <NextStepButtonText>{t('Submit Registration', 'Finalizar Cadastro')}</NextStepButtonText>
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

            {/* ===== INDICADOR DE PASSOS: MOTORISTA (5 ETAPAS) ===== */}
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
                    <StepCircle active={driverStep === 4} completed={driverStep > 4}>
                      {driverStep > 4 ? (
                        <Feather name="check" size={16} color="#ffffff" />
                      ) : (
                        <StepCircleText active={driverStep === 4} completed={false}>
                          4
                        </StepCircleText>
                      )}
                    </StepCircle>
                    <StepLine completed={driverStep > 4} />
                  </StepItemWrapper>

                  <StepItemWrapper>
                    <StepCircle active={driverStep === 5} completed={false}>
                      <StepCircleText active={driverStep === 5} completed={false}>
                        5
                      </StepCircleText>
                    </StepCircle>
                  </StepItemWrapper>
                </StepIndicatorContainer>

                <StepInfoLabel>
                  {driverStep === 1 && t('Step 1 of 5: Choose your Category', 'Etapa 1 de 5: Escolha sua Categoria')}
                  {driverStep === 2 && t('Step 2 of 5: Personal Details & SSN / ITIN', 'Etapa 2 de 5: Dados Pessoais e SSN / ITIN')}
                  {driverStep === 3 && t('Step 3 of 5: Vehicle Details', 'Etapa 3 de 5: Dados do Veículo')}
                  {driverStep === 4 && t('Step 4 of 5: US Documentation (USA)', 'Etapa 4 de 5: Documentação Americana (EUA)')}
                  {driverStep === 5 && t('Step 5 of 5: Profile Photo & Password', 'Etapa 5 de 5: Foto de Perfil e Senha')}
                </StepInfoLabel>

                {/* CARD PRINCIPAL DO MOTORISTA */}
                <GlassRegisterCard>
                  <CardHeaderRow>
                    <CardHeaderPill>
                      <MaterialCommunityIcons name="steering" size={15} color="#ff80ab" />
                      <CardHeaderPillText>{t('Driver Registration', 'Cadastro de Motorista')}</CardHeaderPillText>
                    </CardHeaderPill>
                    <StepCounterBadge>{t(`Step ${driverStep} of 5`, `Passo ${driverStep} de 5`)}</StepCounterBadge>
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
                        {t('Select the category you wish to drive with Movy to start earning:', 'Selecione a categoria em que você deseja atuar na Movy para iniciar suas corridas:')}
                      </Text>

                      {driverCategories.map(cat => {
                        const isSelected = selectedCategoryId === String(cat.idUserType);
                        const iconName = getCategoryIconName(cat.name);

                        return (
                          <CategoryOptionCard
                            key={String(cat.idUserType)}
                            isSelected={isSelected}
                            activeOpacity={0.8}
                            onPress={() => setSelectedCategoryId(String(cat.idUserType))}
                          >
                            <CategoryIconContainer isSelected={isSelected}>
                              <MaterialCommunityIcons
                                name={iconName}
                                size={RFValue(24)}
                                color={isSelected ? '#ffffff' : '#8A99AD'}
                              />
                            </CategoryIconContainer>

                            <CategoryInfoCol>
                              <CategoryTitle isSelected={isSelected}>{formatCategoryName(cat.name)}</CategoryTitle>
                              <CategoryDescription>
                                {formatCategoryDesc(cat.description)}
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
                          <NextStepButtonText>{t('Continue', 'Continuar')}</NextStepButtonText>
                          <Feather name="arrow-right" size={18} color="#ffffff" />
                        </NextStepButton>
                      </ButtonActionsRow>
                    </View>
                  )}

                  {/* PASSO 2 DO MOTORISTA: DADOS PESSOAIS E SSN / ITIN */}
                  {driverStep === 2 && (
                    <View>
                      <InputGroup>
                        <ModernInputLabel>{t('Full Name *', 'Nome Completo *')}</ModernInputLabel>
                        <ModernInputBox hasError={!!errors.dName}>
                          <Feather name="user" size={18} color="#8A99AD" />
                          <ModernTextInput
                            placeholder={t('Enter your full name', 'Digite seu nome completo')}
                            placeholderTextColor="rgba(255, 255, 255, 0.35)"
                            value={dName}
                            onChangeText={setDName}
                            autoCapitalize="words"
                            autoCorrect={false}
                          />
                        </ModernInputBox>
                        {errors.dName && <InputErrorText>{errors.dName}</InputErrorText>}
                      </InputGroup>

                      {/* SSN / ITIN Americano (9 números, sem foto) */}
                      <InputGroup>
                        <ModernInputLabel>{t('SSN / ITIN * (US Individual Identification)', 'SSN / ITIN * (Identificação Individual Americana)')}</ModernInputLabel>
                        <ModernInputBox hasError={!!errors.dSsn}>
                          <MaterialCommunityIcons name="card-account-details-outline" size={18} color="#8A99AD" />
                          <ModernTextInput
                            placeholder={t('000-00-0000 (9 digits)', '000-00-0000 (9 números)')}
                            placeholderTextColor="rgba(255, 255, 255, 0.35)"
                            value={dSsn}
                            onChangeText={txt => setDSsn(maskSsnItin(txt))}
                            keyboardType="numeric"
                            maxLength={11}
                            autoCorrect={false}
                          />
                        </ModernInputBox>
                        {errors.dSsn && <InputErrorText>{errors.dSsn}</InputErrorText>}
                      </InputGroup>

                      <InputGroup>
                        <ModernInputLabel>{t('Date of Birth *', 'Data de Nascimento *')}</ModernInputLabel>
                        <ModernInputBox hasError={!!errors.dBirthDate}>
                          <Feather name="calendar" size={18} color="#8A99AD" />
                          <ModernTextInput
                            placeholder={t('MM/DD/YYYY', 'DD/MM/AAAA')}
                            placeholderTextColor="rgba(255, 255, 255, 0.35)"
                            value={dBirthDate}
                            onChangeText={txt => setDBirthDate(maskDate(txt))}
                            keyboardType="numeric"
                            maxLength={10}
                            autoCorrect={false}
                          />
                        </ModernInputBox>
                        {errors.dBirthDate && <InputErrorText>{errors.dBirthDate}</InputErrorText>}
                      </InputGroup>

                      <InputGroup>
                        <ModernInputLabel>{t('Phone Number *', 'Telefone / Celular *')}</ModernInputLabel>
                        <ModernInputBox hasError={!!errors.dPhone}>
                          <Feather name="phone" size={18} color="#8A99AD" />
                          <ModernTextInput
                            placeholder="(000) 000-0000"
                            placeholderTextColor="rgba(255, 255, 255, 0.35)"
                            value={dPhone}
                            onChangeText={txt => setDPhone(maskPhone(txt))}
                            onFocus={() => scrollToInput(300)}
                            keyboardType="phone-pad"
                            maxLength={16}
                            autoCorrect={false}
                          />
                        </ModernInputBox>
                        {errors.dPhone && <InputErrorText>{errors.dPhone}</InputErrorText>}
                      </InputGroup>

                      <InputGroup>
                        <ModernInputLabel>{t('Email Address *', 'E-mail *')}</ModernInputLabel>
                        <ModernInputBox hasError={!!errors.dEmail}>
                          <Feather name="mail" size={18} color="#8A99AD" />
                          <ModernTextInput
                            placeholder="motorista@exemplo.com"
                            placeholderTextColor="rgba(255, 255, 255, 0.35)"
                            value={dEmail}
                            onChangeText={setDEmail}
                            onFocus={() => scrollToInput()}
                            keyboardType="email-address"
                            autoCapitalize="none"
                            autoCorrect={false}
                          />
                        </ModernInputBox>
                        {errors.dEmail && <InputErrorText>{errors.dEmail}</InputErrorText>}
                      </InputGroup>

                      <InputGroup>
                        <ModernInputLabel>{t('City / Area', 'Cidade')}</ModernInputLabel>
                        <DropdownButton
                          activeOpacity={0.8}
                          onPress={() => setShowCityPicker(true)}
                        >
                          <DropdownButtonText hasValue={!!dCity}>
                            {dCity ? dCity.nome : t('Select your city', 'Selecione sua cidade')}
                          </DropdownButtonText>
                          <Feather
                            name="chevron-down"
                            size={18}
                            color="#8A99AD"
                          />
                        </DropdownButton>

                        <Modal
                          visible={showCityPicker}
                          transparent
                          animationType="fade"
                          onRequestClose={() => setShowCityPicker(false)}
                        >
                          <TouchableOpacity
                            activeOpacity={1}
                            onPress={() => setShowCityPicker(false)}
                            style={{
                              flex: 1,
                              backgroundColor: 'rgba(0, 0, 0, 0.75)',
                              justifyContent: 'center',
                              alignItems: 'center',
                              paddingHorizontal: 20,
                            }}
                          >
                            <TouchableOpacity
                              activeOpacity={1}
                              style={{
                                width: '100%',
                                maxWidth: 400,
                                maxHeight: '70%',
                                backgroundColor: '#131A26',
                                borderRadius: 16,
                                borderWidth: 1,
                                borderColor: 'rgba(255, 255, 255, 0.15)',
                                overflow: 'hidden',
                                elevation: 20,
                                shadowColor: '#000',
                                shadowOffset: { width: 0, height: 10 },
                                shadowOpacity: 0.5,
                                shadowRadius: 20,
                              }}
                            >
                              <View
                                style={{
                                  flexDirection: 'row',
                                  alignItems: 'center',
                                  justifyContent: 'space-between',
                                  paddingHorizontal: 20,
                                  paddingVertical: 16,
                                  borderBottomWidth: 1,
                                  borderBottomColor: 'rgba(255, 255, 255, 0.1)',
                                  backgroundColor: 'rgba(255, 255, 255, 0.03)',
                                }}
                              >
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                  <Feather name="map-pin" size={18} color="#ff80ab" style={{ marginRight: 8 }} />
                                  <Text style={{ color: '#ffffff', fontSize: RFValue(15), fontWeight: '700' }}>
                                    {t('Select your City', 'Selecione sua Cidade')}
                                  </Text>
                                </View>
                                <TouchableOpacity
                                  activeOpacity={0.7}
                                  onPress={() => setShowCityPicker(false)}
                                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                                >
                                  <Feather name="x" size={20} color="#8A99AD" />
                                </TouchableOpacity>
                              </View>

                              <ScrollView
                                style={{ maxHeight: 360 }}
                                contentContainerStyle={{ paddingVertical: 6 }}
                                showsVerticalScrollIndicator={true}
                                bounces={false}
                              >
                                {cities.map(item => {
                                  const isSelected = dCity?.id === item.id;
                                  return (
                                    <TouchableOpacity
                                      key={String(item.id)}
                                      style={{
                                        flexDirection: 'row',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        paddingVertical: 14,
                                        paddingHorizontal: 20,
                                        borderBottomWidth: 1,
                                        borderBottomColor: 'rgba(255, 255, 255, 0.05)',
                                        backgroundColor: isSelected ? 'rgba(255, 128, 171, 0.12)' : 'transparent',
                                      }}
                                      activeOpacity={0.7}
                                      onPress={() => {
                                        setDCity(item);
                                        setShowCityPicker(false);
                                      }}
                                    >
                                      <Text
                                        style={{
                                          color: isSelected ? '#ff80ab' : '#ffffff',
                                          fontWeight: isSelected ? '700' : '400',
                                          fontSize: RFValue(14),
                                          flex: 1,
                                        }}
                                      >
                                        {item.nome}
                                      </Text>
                                      {isSelected && (
                                        <Feather name="check" size={18} color="#ff80ab" />
                                      )}
                                    </TouchableOpacity>
                                  );
                                })}
                              </ScrollView>
                            </TouchableOpacity>
                          </TouchableOpacity>
                        </Modal>
                      </InputGroup>

                      <ButtonActionsRow>
                        <BackStepButton activeOpacity={0.8} onPress={() => setDriverStep(1)}>
                          <Feather name="arrow-left" size={16} color="rgba(255, 255, 255, 0.8)" />
                          <BackStepButtonText>{t('Back', 'Voltar')}</BackStepButtonText>
                        </BackStepButton>

                        <NextStepButton activeOpacity={0.8} onPress={handleNextDriverStep}>
                          <NextStepButtonText>{t('Continue', 'Continuar')}</NextStepButtonText>
                          <Feather name="arrow-right" size={18} color="#ffffff" />
                        </NextStepButton>
                      </ButtonActionsRow>
                    </View>
                  )}

                  {/* PASSO 3 DO MOTORISTA: DADOS DO VEÍCULO (PLACA AMERICANA SEM TRAVAR) */}
                  {driverStep === 3 && (
                    <View>
                      <InputGroup>
                        <ModernInputLabel>{t('Vehicle License Plate *', 'Placa do Veículo (License Plate) *')}</ModernInputLabel>
                        <ModernInputBox hasError={!!errors.dPlate}>
                          <MaterialCommunityIcons name="card-text-outline" size={18} color="#8A99AD" />
                          <ModernTextInput
                            placeholder="Ex: 7ABC123 ou ABC-1234"
                            placeholderTextColor="rgba(255, 255, 255, 0.35)"
                            value={dPlate}
                            onChangeText={txt => setDPlate(formatPlate(txt))}
                            onFocus={() => scrollToInput(150)}
                            autoCapitalize="characters"
                            maxLength={8}
                            autoCorrect={false}
                          />
                        </ModernInputBox>
                        {errors.dPlate && <InputErrorText>{errors.dPlate}</InputErrorText>}
                      </InputGroup>

                      <InputGroup>
                        <ModernInputLabel>{t('Vehicle Make and Model *', 'Marca e Modelo do Veículo *')}</ModernInputLabel>
                        <ModernInputBox hasError={!!errors.dVehicleModel}>
                          <MaterialCommunityIcons name="car-info" size={18} color="#8A99AD" />
                          <ModernTextInput
                            placeholder="Ex: Toyota Camry, Honda Civic, Corolla"
                            placeholderTextColor="rgba(255, 255, 255, 0.35)"
                            value={dVehicleModel}
                            onChangeText={setDVehicleModel}
                            onFocus={() => scrollToInput(300)}
                            autoCapitalize="words"
                            autoCorrect={false}
                          />
                        </ModernInputBox>
                        {errors.dVehicleModel && (
                          <InputErrorText>{errors.dVehicleModel}</InputErrorText>
                        )}
                      </InputGroup>

                      <InputGroup>
                        <ModernInputLabel>{t('Vehicle Color', 'Cor do Veículo')}</ModernInputLabel>
                        <ModernInputBox>
                          <MaterialCommunityIcons name="palette-outline" size={18} color="#8A99AD" />
                          <ModernTextInput
                            placeholder={t('Ex: Silver, Black, White, Blue', 'Ex: Prata, Preto, Branco, Azul')}
                            placeholderTextColor="rgba(255, 255, 255, 0.35)"
                            value={dVehicleColor}
                            onChangeText={setDVehicleColor}
                            onFocus={() => scrollToInput()}
                            autoCapitalize="words"
                            autoCorrect={false}
                          />
                        </ModernInputBox>
                      </InputGroup>

                      <InputGroup>
                        <ModernInputLabel>{t('Year of Manufacture', 'Ano de Fabricação')}</ModernInputLabel>
                        <ModernInputBox>
                          <MaterialCommunityIcons name="calendar-clock" size={18} color="#8A99AD" />
                          <ModernTextInput
                            placeholder="Ex: 2021"
                            placeholderTextColor="rgba(255, 255, 255, 0.35)"
                            value={dVehicleYear}
                            onChangeText={setDVehicleYear}
                            onFocus={() => scrollToInput()}
                            keyboardType="numeric"
                            maxLength={4}
                            autoCorrect={false}
                          />
                        </ModernInputBox>
                      </InputGroup>

                      <ButtonActionsRow>
                        <BackStepButton activeOpacity={0.8} onPress={() => setDriverStep(2)}>
                          <Feather name="arrow-left" size={16} color="rgba(255, 255, 255, 0.8)" />
                          <BackStepButtonText>{t('Back', 'Voltar')}</BackStepButtonText>
                        </BackStepButton>

                        <NextStepButton activeOpacity={0.8} onPress={handleNextDriverStep}>
                          <NextStepButtonText>{t('Continue', 'Continuar')}</NextStepButtonText>
                          <Feather name="arrow-right" size={18} color="#ffffff" />
                        </NextStepButton>
                      </ButtonActionsRow>
                    </View>
                  )}

                  {/* PASSO 4 DO MOTORISTA: DOCUMENTAÇÃO AMERICANA OBRIGATÓRIA */}
                  {driverStep === 4 && (
                    <View>
                      <DocSectionHeader>
                        <DocSectionTitle>{t('United States Documentation', 'Documentação dos Estados Unidos')}</DocSectionTitle>
                        <DocSectionDescription>
                          {t('Movy operates in the US. Attach clear photos of the 4 required documents for validation:', 'A Movy opera nos EUA. Anexe fotos nítidas dos 4 documentos obrigatórios para validação:')}
                        </DocSectionDescription>
                      </DocSectionHeader>

                      {/* 1. Carteira de Motorista Americana */}
                      <DocCard isAttached={!!dDocLicense}>
                        <DocCardHeader>
                          <DocCardTitleRow>
                            <DocCardIconBadge isAttached={!!dDocLicense}>
                              <Feather name="credit-card" size={16} color={dDocLicense ? '#22c55e' : '#04F3FA'} />
                            </DocCardIconBadge>
                            <DocCardTitle>{t('US Driver’s License', 'Carteira de motorista americana')}</DocCardTitle>
                          </DocCardTitleRow>
                          <DocStatusPill isAttached={!!dDocLicense}>
                            <Feather name={dDocLicense ? 'check' : 'clock'} size={12} color={dDocLicense ? '#22c55e' : '#f59e0b'} />
                            <DocStatusPillText isAttached={!!dDocLicense}>
                              {dDocLicense ? t('Attached', 'Anexado') : t('Pending', 'Pendente')}
                            </DocStatusPillText>
                          </DocStatusPill>
                        </DocCardHeader>
                        <DocRequirementText>{t('Requirement: Valid Driver’s License.', 'O que apresentar: Driver’s License válida.')}</DocRequirementText>
                        {dDocLicense && (
                          <DocPreviewContainer>
                            <DocPreviewThumbnail source={{ uri: dDocLicense }} />
                            <DocPreviewInfo>
                              <DocPreviewFilename>{t('Driver’s License attached', 'Driver’s License anexada')}</DocPreviewFilename>
                              <DocPreviewHint>{t('Tap below to change or remove', 'Toque abaixo para alterar ou remover')}</DocPreviewHint>
                            </DocPreviewInfo>
                            <DocRemoveButton onPress={() => setDDocLicense(null)} activeOpacity={0.7}>
                              <Feather name="trash-2" size={16} color="#ef4444" />
                            </DocRemoveButton>
                          </DocPreviewContainer>
                        )}
                        <DocActionsRow>
                          <DocAttachButton variant="camera" activeOpacity={0.8} onPress={() => handlePickDocument('license', true)}>
                            <Feather name="camera" size={14} color="#ffffff" />
                            <DocAttachButtonText>{dDocLicense ? t('Retake', 'Tirar Outra') : t('Camera', 'Câmera')}</DocAttachButtonText>
                          </DocAttachButton>
                          <DocAttachButton variant="gallery" activeOpacity={0.8} onPress={() => handlePickDocument('license', false)}>
                            <Feather name="image" size={14} color="#ffffff" />
                            <DocAttachButtonText>Galeria</DocAttachButtonText>
                          </DocAttachButton>
                        </DocActionsRow>
                        {errors.dDocLicense && <InputErrorText>{errors.dDocLicense}</InputErrorText>}
                      </DocCard>

                      {/* 2. Registro do Veículo */}
                      <DocCard isAttached={!!dDocRegistration}>
                        <DocCardHeader>
                          <DocCardTitleRow>
                            <DocCardIconBadge isAttached={!!dDocRegistration}>
                              <MaterialCommunityIcons name="car-cog" size={18} color={dDocRegistration ? '#22c55e' : '#04F3FA'} />
                            </DocCardIconBadge>
                            <DocCardTitle>{t('Vehicle Registration', 'Registro do veículo')}</DocCardTitle>
                          </DocCardTitleRow>
                          <DocStatusPill isAttached={!!dDocRegistration}>
                            <Feather name={dDocRegistration ? 'check' : 'clock'} size={12} color={dDocRegistration ? '#22c55e' : '#f59e0b'} />
                            <DocStatusPillText isAttached={!!dDocRegistration}>
                              {dDocRegistration ? t('Attached', 'Anexado') : t('Pending', 'Pendente')}
                            </DocStatusPillText>
                          </DocStatusPill>
                        </DocCardHeader>
                        <DocRequirementText>{t('Requirement: Updated Vehicle Registration.', 'O que apresentar: Vehicle Registration atualizado.')}</DocRequirementText>
                        {dDocRegistration && (
                          <DocPreviewContainer>
                            <DocPreviewThumbnail source={{ uri: dDocRegistration }} />
                            <DocPreviewInfo>
                              <DocPreviewFilename>{t('Vehicle Registration attached', 'Vehicle Registration anexado')}</DocPreviewFilename>
                              <DocPreviewHint>{t('Tap below to change or remove', 'Toque abaixo para alterar ou remover')}</DocPreviewHint>
                            </DocPreviewInfo>
                            <DocRemoveButton onPress={() => setDDocRegistration(null)} activeOpacity={0.7}>
                              <Feather name="trash-2" size={16} color="#ef4444" />
                            </DocRemoveButton>
                          </DocPreviewContainer>
                        )}
                        <DocActionsRow>
                          <DocAttachButton variant="camera" activeOpacity={0.8} onPress={() => handlePickDocument('registration', true)}>
                            <Feather name="camera" size={14} color="#ffffff" />
                            <DocAttachButtonText>{dDocRegistration ? t('Retake', 'Tirar Outra') : t('Camera', 'Câmera')}</DocAttachButtonText>
                          </DocAttachButton>
                          <DocAttachButton variant="gallery" activeOpacity={0.8} onPress={() => handlePickDocument('registration', false)}>
                            <Feather name="image" size={14} color="#ffffff" />
                            <DocAttachButtonText>Galeria</DocAttachButtonText>
                          </DocAttachButton>
                        </DocActionsRow>
                        {errors.dDocRegistration && <InputErrorText>{errors.dDocRegistration}</InputErrorText>}
                      </DocCard>

                      {/* 3. Seguro do Carro */}
                      <DocCard isAttached={!!dDocInsurance}>
                        <DocCardHeader>
                          <DocCardTitleRow>
                            <DocCardIconBadge isAttached={!!dDocInsurance}>
                              <Feather name="shield" size={16} color={dDocInsurance ? '#22c55e' : '#04F3FA'} />
                            </DocCardIconBadge>
                            <DocCardTitle>{t('Vehicle Insurance', 'Seguro do carro')}</DocCardTitle>
                          </DocCardTitleRow>
                          <DocStatusPill isAttached={!!dDocInsurance}>
                            <Feather name={dDocInsurance ? 'check' : 'clock'} size={12} color={dDocInsurance ? '#22c55e' : '#f59e0b'} />
                            <DocStatusPillText isAttached={!!dDocInsurance}>
                              {dDocInsurance ? t('Attached', 'Anexado') : t('Pending', 'Pendente')}
                            </DocStatusPillText>
                          </DocStatusPill>
                        </DocCardHeader>
                        <DocRequirementText>{t('Requirement: Valid auto insurance policy document.', 'O que apresentar: Comprovante de seguro válido.')}</DocRequirementText>
                        {dDocInsurance && (
                          <DocPreviewContainer>
                            <DocPreviewThumbnail source={{ uri: dDocInsurance }} />
                            <DocPreviewInfo>
                              <DocPreviewFilename>{t('Vehicle insurance attached', 'Seguro de carro anexado')}</DocPreviewFilename>
                              <DocPreviewHint>{t('Tap below to change or remove', 'Toque abaixo para alterar ou remover')}</DocPreviewHint>
                            </DocPreviewInfo>
                            <DocRemoveButton onPress={() => setDDocInsurance(null)} activeOpacity={0.7}>
                              <Feather name="trash-2" size={16} color="#ef4444" />
                            </DocRemoveButton>
                          </DocPreviewContainer>
                        )}
                        <DocActionsRow>
                          <DocAttachButton variant="camera" activeOpacity={0.8} onPress={() => handlePickDocument('insurance', true)}>
                            <Feather name="camera" size={14} color="#ffffff" />
                            <DocAttachButtonText>{dDocInsurance ? t('Retake', 'Tirar Outra') : t('Camera', 'Câmera')}</DocAttachButtonText>
                          </DocAttachButton>
                          <DocAttachButton variant="gallery" activeOpacity={0.8} onPress={() => handlePickDocument('insurance', false)}>
                            <Feather name="image" size={14} color="#ffffff" />
                            <DocAttachButtonText>Galeria</DocAttachButtonText>
                          </DocAttachButton>
                        </DocActionsRow>
                        {errors.dDocInsurance && <InputErrorText>{errors.dDocInsurance}</InputErrorText>}
                      </DocCard>

                      {/* 4. Comprovante de Residência */}
                      <DocCard isAttached={!!dDocResidence}>
                        <DocCardHeader>
                          <DocCardTitleRow>
                            <DocCardIconBadge isAttached={!!dDocResidence}>
                              <Feather name="home" size={16} color={dDocResidence ? '#22c55e' : '#04F3FA'} />
                            </DocCardIconBadge>
                            <DocCardTitle>{t('Proof of Residence', 'Comprovante de residência')}</DocCardTitle>
                          </DocCardTitleRow>
                          <DocStatusPill isAttached={!!dDocResidence}>
                            <Feather name={dDocResidence ? 'check' : 'clock'} size={12} color={dDocResidence ? '#22c55e' : '#f59e0b'} />
                            <DocStatusPillText isAttached={!!dDocResidence}>
                              {dDocResidence ? t('Attached', 'Anexado') : t('Pending', 'Pendente')}
                            </DocStatusPillText>
                          </DocStatusPill>
                        </DocCardHeader>
                        <DocRequirementText>{t('Requirement: In the city or state where you intend to drive.', 'O que apresentar: Na cidade ou estado onde pretende dirigir.')}</DocRequirementText>
                        {dDocResidence && (
                          <DocPreviewContainer>
                            <DocPreviewThumbnail source={{ uri: dDocResidence }} />
                            <DocPreviewInfo>
                              <DocPreviewFilename>{t('Proof of residence attached', 'Comprovante de residência anexado')}</DocPreviewFilename>
                              <DocPreviewHint>{t('Tap below to change or remove', 'Toque abaixo para alterar ou remover')}</DocPreviewHint>
                            </DocPreviewInfo>
                            <DocRemoveButton onPress={() => setDDocResidence(null)} activeOpacity={0.7}>
                              <Feather name="trash-2" size={16} color="#ef4444" />
                            </DocRemoveButton>
                          </DocPreviewContainer>
                        )}
                        <DocActionsRow>
                          <DocAttachButton variant="camera" activeOpacity={0.8} onPress={() => handlePickDocument('residence', true)}>
                            <Feather name="camera" size={14} color="#ffffff" />
                            <DocAttachButtonText>{dDocResidence ? t('Retake', 'Tirar Outra') : t('Camera', 'Câmera')}</DocAttachButtonText>
                          </DocAttachButton>
                          <DocAttachButton variant="gallery" activeOpacity={0.8} onPress={() => handlePickDocument('residence', false)}>
                            <Feather name="image" size={14} color="#ffffff" />
                            <DocAttachButtonText>Galeria</DocAttachButtonText>
                          </DocAttachButton>
                        </DocActionsRow>
                        {errors.dDocResidence && <InputErrorText>{errors.dDocResidence}</InputErrorText>}
                      </DocCard>

                      <ButtonActionsRow>
                        <BackStepButton activeOpacity={0.8} onPress={() => setDriverStep(3)}>
                          <Feather name="arrow-left" size={16} color="rgba(255, 255, 255, 0.8)" />
                          <BackStepButtonText>{t('Back', 'Voltar')}</BackStepButtonText>
                        </BackStepButton>

                        <NextStepButton activeOpacity={0.8} onPress={handleNextDriverStep}>
                          <NextStepButtonText>{t('Continue', 'Continuar')}</NextStepButtonText>
                          <Feather name="arrow-right" size={18} color="#ffffff" />
                        </NextStepButton>
                      </ButtonActionsRow>
                    </View>
                  )}

                  {/* PASSO 5 DO MOTORISTA: FOTO DE PERFIL PROFISSIONAL E SENHA */}
                  {driverStep === 5 && (
                    <View>
                      {/* Seção de Foto de Perfil do Motorista */}
                      <PhotoUploadSection>
                        <PhotoAvatarWrapper
                          activeOpacity={0.8}
                          onPress={() => handlePickPhoto(true, false)}
                        >
                          {dPhoto ? (
                            <PhotoAvatarImage source={{ uri: dPhoto }} />
                          ) : (
                            <PhotoAvatarPlaceholder>
                              <Feather name="user" size={42} color="rgba(255, 255, 255, 0.45)" />
                            </PhotoAvatarPlaceholder>
                          )}
                          <PhotoCameraBadge>
                            <Feather name="camera" size={15} color="#ffffff" />
                          </PhotoCameraBadge>
                        </PhotoAvatarWrapper>

                        <PhotoTipText>
                          {dPhoto ? t('Driver profile photo selected', 'Foto de perfil do motorista selecionada') : t('Clear driver photo (front facing and visible)', 'Foto nítida do motorista, conforme as orientações (rosto frontal e visível)')}
                        </PhotoTipText>

                        <PhotoActionsRow>
                          <PhotoChoiceButton
                            variant="camera"
                            activeOpacity={0.8}
                            onPress={() => handlePickPhoto(true, true)}
                          >
                            <Feather name="camera" size={14} color="#ffffff" />
                            <PhotoChoiceButtonText>{t('Take Photo', 'Tirar Foto')}</PhotoChoiceButtonText>
                          </PhotoChoiceButton>

                          <PhotoChoiceButton
                            variant="gallery"
                            activeOpacity={0.8}
                            onPress={() => handlePickPhoto(true, false)}
                          >
                            <Feather name="image" size={14} color="#ffffff" />
                            <PhotoChoiceButtonText>{t('Gallery', 'Galeria')}</PhotoChoiceButtonText>
                          </PhotoChoiceButton>
                        </PhotoActionsRow>

                        {dPhoto && (
                          <PhotoRemoveBtn activeOpacity={0.7} onPress={() => setDPhoto(null)}>
                            <PhotoRemoveBtnText>{t('Remove Photo', 'Remover Foto')}</PhotoRemoveBtnText>
                          </PhotoRemoveBtn>
                        )}
                        {errors.dPhoto && <InputErrorText>{errors.dPhoto}</InputErrorText>}
                      </PhotoUploadSection>

                      <InputGroup>
                        <ModernInputLabel>{t('Driver Password *', 'Senha de Acesso de Motorista *')}</ModernInputLabel>
                        <ModernInputBox hasError={!!errors.dPassword}>
                          <Feather name="lock" size={18} color="#8A99AD" />
                          <ModernTextInput
                            placeholder={t('Minimum 6 characters', 'Mínimo de 6 caracteres')}
                            placeholderTextColor="rgba(255, 255, 255, 0.35)"
                            secureTextEntry={!dShowPassword}
                            value={dPassword}
                            onChangeText={setDPassword}
                            onFocus={() => scrollToInput(300)}
                            autoCorrect={false}
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
                        <ModernInputLabel>{t('Confirm Password *', 'Confirmar Senha *')}</ModernInputLabel>
                        <ModernInputBox hasError={!!errors.dConfirmPassword}>
                          <Feather name="lock" size={18} color="#8A99AD" />
                          <ModernTextInput
                            placeholder={t('Repeat your password', 'Repita a senha')}
                            placeholderTextColor="rgba(255, 255, 255, 0.35)"
                            secureTextEntry={!dShowPassword}
                            value={dConfirmPassword}
                            onChangeText={setDConfirmPassword}
                            onFocus={() => scrollToInput()}
                            autoCorrect={false}
                          />
                        </ModernInputBox>
                        {errors.dConfirmPassword && (
                          <InputErrorText>{errors.dConfirmPassword}</InputErrorText>
                        )}
                      </InputGroup>

                      <ButtonActionsRow>
                        <BackStepButton activeOpacity={0.8} onPress={() => setDriverStep(4)}>
                          <Feather name="arrow-left" size={16} color="rgba(255, 255, 255, 0.8)" />
                          <BackStepButtonText>{t('Back', 'Voltar')}</BackStepButtonText>
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
                              <NextStepButtonText>{t('Submit Registration', 'Concluir Cadastro')}</NextStepButtonText>
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
        {keyboardHeight > 0 && (
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => Keyboard.dismiss()}
            style={{
              position: 'absolute',
              right: 18,
              bottom: Platform.OS === 'ios' ? keyboardHeight + 10 : 20,
              backgroundColor: '#00349A',
              borderWidth: 1,
              borderColor: '#04F3FA',
              paddingVertical: 10,
              paddingHorizontal: 18,
              borderRadius: 24,
              flexDirection: 'row',
              alignItems: 'center',
              zIndex: 99999,
              elevation: 10,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.35,
              shadowRadius: 6,
            }}
          >
            <Feather name="check" size={16} color="#ffffff" style={{ marginRight: 6 }} />
            <Text style={{ color: '#ffffff', fontWeight: 'bold', fontSize: 13 }}>
              {t('Done', 'OK / Fechar')}
            </Text>
          </TouchableOpacity>
        )}
      </KeyboardAvoidingView>
    </BackgroundContainer>
  );
}
