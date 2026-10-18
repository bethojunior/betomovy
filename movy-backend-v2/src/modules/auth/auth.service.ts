import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { SettingsService } from '../settings/settings.service';

export interface RegisterDto {
  name: string;
  email: string;
  password: string;
  phone: string;
  country_code: 'US' | 'BR';
  cpf?: string; // Obrigatório apenas se country_code === 'BR'
  user_type: 'passenger' | 'driver';
}

export interface LoginDto {
  email?: string;
  password?: string;
  phone?: string;
  otp_code?: string;
}

@Injectable()
export class AuthService {
  constructor(private readonly settingsService: SettingsService) {}

  async register(data: RegisterDto) {
    if (!data.name || !data.email || !data.password) {
      throw new BadRequestException('Name, email, and password are required.');
    }

    // Regra estrita: CPF só é validado/exigido para o Brasil
    if (data.country_code === 'BR') {
      if (!data.cpf || data.cpf.replace(/\D/g, '').length !== 11) {
        throw new BadRequestException('CPF válido com 11 dígitos é obrigatório para cadastros no Brasil.');
      }
    } else {
      // Nos Estados Unidos NUNCA exige ou armazena CPF
      delete data.cpf;
    }

    return {
      success: true,
      message: data.country_code === 'US' 
        ? 'Account successfully created in the United States!' 
        : 'Conta criada com sucesso no Brasil!',
      user: {
        id: Math.floor(Math.random() * 100000),
        name: data.name,
        email: data.email,
        phone: data.phone,
        country_code: data.country_code,
        currency: data.country_code === 'US' ? 'USD' : 'BRL',
        user_type: data.user_type,
      },
      token: 'jwt_mock_token_' + Date.now(),
    };
  }

  async login(data: LoginDto) {
    const settings = await this.settingsService.getPublicSettings();

    // 1. Login por Telefone / SMS OTP (Apenas se ativado pelo Monitor)
    if (data.phone && data.otp_code) {
      if (!settings.enable_phone_login_otp) {
        throw new BadRequestException('Phone SMS login is currently disabled by administrator. Please use Email and Password.');
      }
      return {
        success: true,
        user: { email: 'phone_user@movymob.com', phone: data.phone },
        token: 'jwt_phone_token_' + Date.now(),
      };
    }

    // 2. Login Principal Ativo: E-mail e Senha
    if (!data.email || !data.password) {
      throw new BadRequestException('Email and password are required for login.');
    }

    return {
      success: true,
      user: {
        id: 1,
        name: 'Alexandre User',
        email: data.email,
        country_code: settings.default_country,
        currency: settings.default_currency,
      },
      token: 'jwt_session_token_' + Date.now(),
    };
  }
}
