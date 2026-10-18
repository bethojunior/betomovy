import { Injectable } from '@nestjs/common';

export interface SystemFeatureSettings {
  default_country: 'US' | 'BR';
  default_currency: 'USD' | 'BRL';
  enable_phone_login_otp: boolean;
  enable_municipal_fiscal_qrcode: boolean;
  enable_movy_negocia: boolean;
  us_instant_cashout_method: 'zelle';
  br_instant_cashout_method: 'pix';
}

@Injectable()
export class SettingsService {
  private settings: SystemFeatureSettings = {
    default_country: 'US',
    default_currency: 'USD',
    enable_phone_login_otp: false, // Padrão: Desativado (Principal é Email/Senha)
    enable_municipal_fiscal_qrcode: false, // Padrão: Desativado no app do motorista
    enable_movy_negocia: true, // Padrão: Ativado (MOVY Negocia)
    us_instant_cashout_method: 'zelle',
    br_instant_cashout_method: 'pix',
  };

  async getPublicSettings(): Promise<SystemFeatureSettings> {
    return { ...this.settings };
  }

  async updateSetting(key: keyof SystemFeatureSettings, value: any): Promise<SystemFeatureSettings> {
    (this.settings as any)[key] = value;
    return { ...this.settings };
  }
}
