import type { SpecificNotificationRow } from "./specific-notifications.types";
import { SCHEDULED_TRIP_REFERENCE } from "../management-wpp-scheduled-trip.helpers";

export { SCHEDULED_TRIP_REFERENCE };

export const pickSpecificRows = (rows: SpecificNotificationRow[]): SpecificNotificationRow[] => {
  return rows.filter(
    (r) => r.reference === SCHEDULED_TRIP_REFERENCE && (r.cityId != null || r.tripTypeId != null),
  );
};

export const buildRowScopeLabel = (row: SpecificNotificationRow): string => {
  const parts: string[] = [];
  if (row.city) {
    parts.push(`Cidade: ${row.city.nome}`);
  }
  if (row.trip_type) {
    parts.push(`Tipo: ${row.trip_type.type}`);
  }
  return parts.length > 0 ? parts.join(" · ") : "Sem filtro";
};

export const buildDefaultMessage = (cityName: string | null, tripTypeName: string | null): string => {
  const parts: string[] = [];
  if (cityName) {
    parts.push(`cidade ${cityName}`);
  }
  if (tripTypeName) {
    parts.push(`tipo de chamado ${tripTypeName}`);
  }
  const scope = parts.length > 0 ? parts.join(" e ") : "todas as viagens agendadas";
  return `Notificação de viagem agendada para ${scope}.`;
};
