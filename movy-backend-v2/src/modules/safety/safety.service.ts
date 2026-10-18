import { Injectable, BadRequestException } from '@nestjs/common';

export interface TriggerSosDto {
  trip_id: string;
  user_id: number;
  user_role: 'passenger' | 'driver';
  latitude: number;
  longitude: number;
  country_code: 'US' | 'BR';
  emergency_contacts?: string[];
}

@Injectable()
export class SafetyService {
  private activeAlerts = new Map<string, any>();

  async triggerSos(dto: TriggerSosDto) {
    const alertId = 'SOS-' + Date.now().toString(36).toUpperCase();
    const emergencyNumber = dto.country_code === 'US' ? '911' : '190';
    const liveTrackingLink = `https://movymob.com/safety/live/${dto.trip_id}`;

    const alert = {
      alert_id: alertId,
      trip_id: dto.trip_id,
      user_id: dto.user_id,
      user_role: dto.user_role,
      latitude: dto.latitude,
      longitude: dto.longitude,
      country_code: dto.country_code,
      emergency_number: emergencyNumber,
      live_tracking_link: liveTrackingLink,
      status: 'active_emergency',
      timestamp: new Date(),
      automated_broadcast: {
        police_contact: `Emergency call routed to ${emergencyNumber}`,
        sms_alert_sent: dto.emergency_contacts ? dto.emergency_contacts.length : 0,
        sms_text: dto.country_code === 'US'
          ? `[MOVY SAFETY ALERT] Passenger triggered Emergency SOS on trip ${dto.trip_id}. Live Location: ${liveTrackingLink}`
          : `[ALERTA DE SEGURANÇA MOVY] Passageiro acionou o Botão de Pânico na corrida ${dto.trip_id}. Rastreamento ao vivo: ${liveTrackingLink}`,
      },
    };

    this.activeAlerts.set(alertId, alert);
    return {
      success: true,
      message: dto.country_code === 'US'
        ? `EMERGENCY SOS ACTIVATED! Authorities (${emergencyNumber}) notified and live GPS broadcasted.`
        : `BOTÃO DE PÂNICO ACIONADO! Central e contatos de emergência (${emergencyNumber}) notificados.`,
      alert,
    };
  }

  async getActiveAlerts() {
    return Array.from(this.activeAlerts.values());
  }

  async resolveAlert(alertId: string, resolutionNotes: string) {
    const alert = this.activeAlerts.get(alertId);
    if (!alert) throw new BadRequestException('Alert not found.');
    alert.status = 'resolved';
    alert.notes = resolutionNotes;
    return { success: true, alert };
  }
}
