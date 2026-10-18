import { Injectable, BadRequestException } from '@nestjs/common';

export interface UpdateLocationDto {
  driver_id: number;
  latitude: number;
  longitude: number;
  bearing: number; // Ângulo de rotação de 0 a 360 graus para o carrinho virar suave
  speed_mph?: number;
}

export interface CashoutDto {
  driver_id: number;
  amount: number;
  method: 'zelle' | 'pix';
  destination_key: string; // E-mail/telefone Zelle nos EUA ou chave Pix no Brasil
}

@Injectable()
export class DriversService {
  private driverBalances = new Map<number, number>([
    [1, 385.50], // Saldo mock inicial do motorista em Dólar
  ]);

  async updateLocation(dto: UpdateLocationDto) {
    return {
      success: true,
      driver_id: dto.driver_id,
      latitude: dto.latitude,
      longitude: dto.longitude,
      bearing: dto.bearing,
      timestamp: new Date(),
    };
  }

  async processCashout(dto: CashoutDto) {
    const currentBalance = this.driverBalances.get(dto.driver_id) || 0;
    if (dto.amount > currentBalance) {
      throw new BadRequestException('Insufficient available balance for cashout.');
    }

    const updatedBalance = currentBalance - dto.amount;
    this.driverBalances.set(dto.driver_id, updatedBalance);

    return {
      success: true,
      message: dto.method === 'zelle'
        ? `Instant Cashout of $${dto.amount.toFixed(2)} sent via Zelle to ${dto.destination_key}!`
        : `Saque instantâneo de R$${dto.amount.toFixed(2)} enviado via Pix para ${dto.destination_key}!`,
      transaction_id: 'cashout_' + Math.random().toString(36).substring(2, 10).toUpperCase(),
      method: dto.method,
      amount: dto.amount,
      remaining_balance: updatedBalance,
      timestamp: new Date(),
    };
  }

  async getDriverCockpit(driverId: number) {
    const balance = this.driverBalances.get(driverId) || 0;
    const dailyGoal = 250.00; // Meta diária em Dólar
    const progressPercent = Math.min(Math.round((balance / dailyGoal) * 100), 100);

    return {
      driver_id: driverId,
      available_balance: balance,
      currency: 'USD',
      daily_goal: dailyGoal,
      daily_goal_progress_percent: progressPercent,
      completed_trips_today: 8,
      hours_online_today: 4.5,
      rating: 4.98,
    };
  }
}
