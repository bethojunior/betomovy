/**
 * MOVY Mobile API Client V2
 * Conexão direta e tipada com o novo Core Backend NestJS V2 (HTTP & WebSockets)
 * Compatível 100% com os modos Estados Unidos (USD $) e Brasil (BRL R$)
 */

import { i18n } from '../i18n';

// Configuração dinâmica de host: permite alternar para a URL de produção na DigitalOcean
const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'https://api.movymob.com';

export interface UserProfile {
  id: number;
  name: string;
  email: string;
  phone: string;
  country_code: 'US' | 'BR';
  currency: 'USD' | 'BRL';
  user_type: 'passenger' | 'driver';
  token?: string;
}

export interface PublicSettings {
  enable_phone_login_otp: boolean;
  enable_municipal_fiscal_qrcode: boolean;
  enable_movy_negocia: boolean;
  default_country: 'US' | 'BR';
  default_currency: 'USD' | 'BRL';
  operational_hubs: string[];
}

export class MovyApiService {
  private static authToken: string | null = null;

  public static setAuthToken(token: string | null) {
    this.authToken = token;
  }

  private static getHeaders(): Record<string, string> {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    };
    if (this.authToken) {
      headers['Authorization'] = `Bearer ${this.authToken}`;
    }
    return headers;
  }

  /**
   * Obtém as configurações e Feature Flags públicas do Monitor
   */
  public static async getPublicSettings(): Promise<PublicSettings> {
    try {
      const response = await fetch(`${API_BASE_URL}/settings/public`, {
        method: 'GET',
        headers: this.getHeaders(),
      });
      if (!response.ok) throw new Error('Failed to load settings');
      return await response.json();
    } catch {
      // Fallback seguro caso backend offline
      return {
        enable_phone_login_otp: false,
        enable_municipal_fiscal_qrcode: false,
        enable_movy_negocia: true,
        default_country: 'US',
        default_currency: 'USD',
        operational_hubs: ['Miami (MIA)', 'Orlando (MCO)', 'São Paulo (GRU)'],
      };
    }
  }

  /**
   * Registro de novo usuário (Passageiro ou Motorista)
   * NUNCA envia CPF se country_code === 'US'
   */
  public static async register(data: {
    name: string;
    email: string;
    password: string;
    phone: string;
    country_code: 'US' | 'BR';
    cpf?: string;
    user_type: 'passenger' | 'driver';
  }) {
    const payload = { ...data };
    if (payload.country_code === 'US') {
      delete payload.cpf;
    }

    const response = await fetch(`${API_BASE_URL}/auth/register`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(payload),
    });

    const resData = await response.json();
    if (!response.ok) {
      throw new Error(resData.message || 'Registration failed');
    }

    if (resData.token) {
      this.setAuthToken(resData.token);
    }
    return resData;
  }

  /**
   * Login Principal (E-mail e Senha) ou Dinâmico (SMS OTP se liberado no Monitor)
   */
  public static async login(data: {
    email?: string;
    password?: string;
    phone?: string;
    otp_code?: string;
  }) {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });

    const resData = await response.json();
    if (!response.ok) {
      throw new Error(resData.message || 'Login failed');
    }

    if (resData.token) {
      this.setAuthToken(resData.token);
    }
    return resData;
  }

  /**
   * Solicita corrida (padrão ou MOVY Negocia)
   */
  public static async requestTrip(data: {
    passenger_id: number;
    origin_address: string;
    origin_lat: number;
    origin_lng: number;
    destination_address: string;
    destination_lat: number;
    destination_lng: number;
    category: 'eco' | 'comfort' | 'speed' | 'freight';
    currency: 'USD' | 'BRL';
    initial_offer?: number;
  }) {
    const response = await fetch(`${API_BASE_URL}/trips/request`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });

    return await response.json();
  }

  /**
   * MOVY NEGOCIA: Contraproposta do motorista (+1, +2, +3, +5 nos EUA | +2, +3, +5, +10 no Brasil)
   */
  public static async submitCounterOffer(data: {
    trip_id: string;
    driver_id: number;
    increment: number;
    currency: 'USD' | 'BRL';
  }) {
    const response = await fetch(`${API_BASE_URL}/trips/counter-offer`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });

    return await response.json();
  }

  /**
   * Validação de PIN de segurança de 4 dígitos para início da viagem
   */
  public static async verifyTripPin(tripId: string, pinCode: string) {
    const response = await fetch(`${API_BASE_URL}/trips/verify-pin`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ trip_id: tripId, pin_code: pinCode }),
    });

    return await response.json();
  }

  /**
   * Saque Instantâneo do Motorista: Zelle (EUA) ou Pix (Brasil)
   */
  public static async requestCashout(data: {
    driver_id: number;
    amount: number;
    method: 'zelle' | 'pix';
    destination_key: string;
  }) {
    const response = await fetch(`${API_BASE_URL}/drivers/wallet/cashout`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify(data),
    });

    return await response.json();
  }

  /**
   * Painel Cockpit do Motorista (Metas, ganhos e telemetria)
   */
  public static async getDriverCockpit(driverId: number) {
    const response = await fetch(`${API_BASE_URL}/drivers/cockpit/${driverId}`, {
      method: 'GET',
      headers: this.getHeaders(),
    });

    return await response.json();
  }
}
