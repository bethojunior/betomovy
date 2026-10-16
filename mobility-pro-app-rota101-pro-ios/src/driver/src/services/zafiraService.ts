import AsyncStorage from '@react-native-async-storage/async-storage';
import apiMainDriver from '../api/apiMain';
import {translate} from '../../../client/locales';
import {isZafiraValidationUserMessageLiteral} from '../components/Modal/ZafiraValidationResult/constants';

interface ZafiraValidationRequest {
  name: string;
  phone: string;
  document: string;
  email: string;
}

interface ZafiraValidationResponse {
  status: boolean;
  data?: {
    match: boolean;
    api_data?: {
      nome: string;
      cpf: string;
      nascimento: string;
      mae: string;
    };
    validation?: {
      cpf: string;
      nome: string;
    };
    error?: string;
    message?: string;
  };
  message?: string;
  errors?: {
    message?: string;
    code?: number;
    exception_code?: number;
  };
}

interface ZafiraTranslationMapping {
  key: string;
  params?: Record<string, string>;
}

const CPF_INVALID_USER_MESSAGE_KEY = 'doorHandle.invalid_cpf';
const GENERIC_VALIDATION_USER_MESSAGE_KEY = 'doorHandle.validation_error';
const FILL_FIELDS_USER_MESSAGE_KEY = 'doorHandle.fill_in_the_fields_for_validation';
const ZAFIRA_GUARDIAN_ENV_ERROR_KEY = 'doorHandle.zafira_guardian_api_url_not_configured';

const mapZafiraMessageToTranslation = (
  message: string,
): string | ZafiraTranslationMapping => {
  const trimmed = message.trim();
  if (trimmed.startsWith('doorHandle.')) {
    return trimmed;
  }
  if (trimmed.includes('ZAFIRA_GUARDIAN_API_URL')) {
    return ZAFIRA_GUARDIAN_ENV_ERROR_KEY;
  }
  if (/cpf\s+inv[aá]lido/i.test(trimmed)) {
    return CPF_INVALID_USER_MESSAGE_KEY;
  }
  if (/nome.*documento.*telefone.*e-?mail.*obrigat[oó]rios/i.test(trimmed)) {
    return FILL_FIELDS_USER_MESSAGE_KEY;
  }
  if (/valida[cç][aã]o j[aá] realizada recentemente/i.test(trimmed)) {
    return 'doorHandle.validation_recently_done';
  }
  if (/valida[cç][aã]o zafira n[aã]o est[aá] habilitada/i.test(trimmed)) {
    return 'doorHandle.zafira_not_enabled_in_city';
  }
  if (/configura[cç][aã]o da cidade n[aã]o encontrada/i.test(trimmed)) {
    return 'doorHandle.city_config_not_found';
  }
  if (/motorista n[aã]o encontrado/i.test(trimmed)) {
    return 'doorHandle.driver_not_found';
  }
  if (/saldo do motorista n[aã]o encontrado/i.test(trimmed)) {
    return 'doorHandle.driver_balance_not_found';
  }
  if (/tipo de fluxo de saldo zafira n[aã]o configurado/i.test(trimmed)) {
    return 'doorHandle.zafira_balance_flow_not_configured';
  }
  if (/cidade n[aã]o identificada/i.test(trimmed)) {
    return 'doorHandle.city_not_identified';
  }
  const insufficientBalanceMatch = trimmed.match(
    /Saldo insuficiente\. Você precisa de R\$ ([\d.,]+) para validar o cadastro\. Saldo atual: R\$ ([\d.,]+)/i,
  );
  if (insufficientBalanceMatch) {
    return {
      key: 'doorHandle.insufficient_balance_for_validation',
      params: {
        required: insufficientBalanceMatch[1],
        current: insufficientBalanceMatch[2],
      },
    };
  }
  if (/saldo insuficiente/i.test(trimmed)) {
    return 'doorHandle.insufficient_balance_for_validation_generic';
  }
  if (isZafiraValidationUserMessageLiteral(trimmed)) {
    return GENERIC_VALIDATION_USER_MESSAGE_KEY;
  }
  return trimmed;
};

const translateZafiraMapping = (
  mapping: string | ZafiraTranslationMapping,
): string => {
  if (typeof mapping === 'string') {
    if (mapping.startsWith('doorHandle.')) {
      return translate(mapping);
    }
    return mapping;
  }
  return translate(mapping.key, mapping.params);
};

const mapFriendlyZafiraErrorMessage = (message: string): string => {
  const mapping = mapZafiraMessageToTranslation(message);
  if (typeof mapping === 'string' && mapping.startsWith('doorHandle.')) {
    return mapping;
  }
  if (typeof mapping === 'object') {
    return translateZafiraMapping(mapping);
  }
  return message;
};

export const pickMobilidadeApiErrorMessage = (body: unknown): string | undefined => {
  if (!body || typeof body !== 'object') {
    return undefined;
  }
  const record = body as Record<string, unknown>;
  const top = record.message;
  if (typeof top === 'string' && top.trim() !== '') {
    return top.trim();
  }
  const errors = record.errors;
  if (errors && typeof errors === 'object' && errors !== null) {
    const nested = (errors as Record<string, unknown>).message;
    if (typeof nested === 'string' && nested.trim() !== '') {
      return nested.trim();
    }
  }
  return undefined;
};

export const resolveZafiraDisplayMessage = (message: string): string => {
  const mapping = mapZafiraMessageToTranslation(message);
  return translateZafiraMapping(mapping);
};

const CACHE_EXPIRATION = 10 * 60 * 1000; // 10 minutos

const getCacheKey = (customerData: ZafiraValidationRequest): string => {
  const documentClean = (customerData.document || '').replace(/\D/g, '');
  const phoneClean = (customerData.phone || '').replace(/\D/g, '');
  const emailClean = (customerData.email || '').toLowerCase();
  const nameClean = (customerData.name || '').toLowerCase().replace(/\s+/g, '_');
  return `zafira_validation_${documentClean}_${phoneClean}_${emailClean}_${nameClean}`;
};

const getCachedValidation = async (cacheKey: string): Promise<ZafiraValidationResponse['data'] | null> => {
  try {
    const cached = await AsyncStorage.getItem(cacheKey);
    if (!cached) return null;

    const cachedData = JSON.parse(cached);
    const now = Date.now();

    if (!cachedData || typeof cachedData !== 'object' || typeof cachedData.timestamp !== 'number') {
      await AsyncStorage.removeItem(cacheKey);
      return null;
    }

    if (now - cachedData.timestamp > CACHE_EXPIRATION) {
      await AsyncStorage.removeItem(cacheKey);
      return null;
    }

    return cachedData.data;
  } catch (err) {
    console.warn('[zafiraService] getCachedValidation', err);
    return null;
  }
};

const saveCachedValidation = async (
  cacheKey: string,
  data: ZafiraValidationResponse['data'],
): Promise<void> => {
  try {
    await AsyncStorage.setItem(
      cacheKey,
      JSON.stringify({
        data,
        timestamp: Date.now(),
      }),
    );
  } catch (err) {
    console.warn('[zafiraService] saveCachedValidation', err);
  }
};

export const validateRegistration = async (
  customerData: ZafiraValidationRequest,
): Promise<ZafiraValidationResponse> => {
  const cacheKey = getCacheKey(customerData);
  const cachedResult = await getCachedValidation(cacheKey);

  if (cachedResult) {
    const hasSuccessfulCache =
      cachedResult.match === true && cachedResult.api_data != null;
    if (hasSuccessfulCache) {
      return {
        status: true,
        data: cachedResult,
      };
    }
    await AsyncStorage.removeItem(cacheKey);
  }

  const VALIDATION_ERROR_KEY = 'doorHandle.validation_error';

  const isServerErrorMessage = (msg: string | undefined): boolean =>
    !!msg &&
    /Internal Server Error|Server error|500|502|503|validar-dados|resulted in|Action não existe|Action nao existe|Action does not exist|Action no existe/i.test(
      String(msg),
    );

  try {
    const response = await apiMainDriver.post<ZafiraValidationResponse>(
      'Customer/ValidateRegistration',
      customerData,
    );
    const data = response?.data;

    if (data && data.status && data.data?.match === true && data.data?.api_data) {
      await saveCachedValidation(cacheKey, data.data);
    }

    if (!data || !data.status) {
      const apiMessage =
        mapFriendlyZafiraErrorMessage(
          pickMobilidadeApiErrorMessage(data) ?? 'Erro ao validar cadastro',
        );
      if (isServerErrorMessage(apiMessage)) {
        return { status: false, ...data, message: VALIDATION_ERROR_KEY };
      }
      return { status: false, ...data, message: apiMessage };
    }
    return data;
  } catch (error: any) {
    const responseData = error?.response?.data;
    const rawMessage = mapFriendlyZafiraErrorMessage(
      pickMobilidadeApiErrorMessage(responseData) ||
      error?.message ||
      'Erro ao validar cadastro',
    );
    const isServerError =
      error?.response?.status >= 500 ||
      isServerErrorMessage(rawMessage);
    const message = isServerError ? VALIDATION_ERROR_KEY : rawMessage;
    return {
      status: false,
      message,
    };
  }
};
