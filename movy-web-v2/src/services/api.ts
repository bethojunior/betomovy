/**
 * MOVY Web API Service V2
 * Conexão direta entre o painel Monitor / Central e a API NestJS V2
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

export interface PublicSettings {
  enable_phone_login_otp: boolean;
  enable_municipal_fiscal_qrcode: boolean;
  enable_movy_negocia: boolean;
  default_country: 'US' | 'BR';
  default_currency: 'USD' | 'BRL';
  operational_hubs: string[];
}

export class WebApiService {
  public static async getSettings(): Promise<PublicSettings> {
    try {
      const res = await fetch(`${API_BASE_URL}/settings/public`, { cache: 'no-store' });
      if (!res.ok) throw new Error('Network error');
      return await res.json();
    } catch {
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

  public static async toggleSetting(key: string, value: boolean) {
    const res = await fetch(`${API_BASE_URL}/settings/toggle`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ key, value }),
    });
    return await res.json();
  }

  public static async dispatchManualTrip(data: {
    customer_name: string;
    customer_phone: string;
    origin_address: string;
    destination_address: string;
    category: string;
    currency: 'USD' | 'BRL';
    fare_estimate: number;
  }) {
    const res = await fetch(`${API_BASE_URL}/trips/request`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        passenger_id: 999999, // ID reservado para despacho manual da central
        origin_address: data.origin_address,
        origin_lat: 25.7617,
        origin_lng: -80.1918,
        destination_address: data.destination_address,
        destination_lat: 25.7907,
        destination_lng: -80.1300,
        category: data.category,
        currency: data.currency,
        initial_offer: data.fare_estimate,
      }),
    });
    return await res.json();
  }
}
