// Formatação de placa veicular para padrão americano (US) e internacional:
// Permite de 2 a 8 caracteres alfanuméricos com hífen/espaço opcional, sem forçar regras Mercosul.
export function formatVehiclePlate(value: string): string {
  if (!value) return '';
  return value.toUpperCase().replace(/[^A-Z0-9 -]/g, '').slice(0, 8);
}
