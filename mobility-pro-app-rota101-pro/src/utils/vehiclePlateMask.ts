// Máscara progressiva de placa (Mercosul/antiga) — mesma regra do mobilidade-site-novo (utils/Masks.ts, setMaskPlateVehicle).
export function formatVehiclePlate(value: string): string {
  const clean = value.replace(/[^a-zA-Z0-9]/g, '');

  if (clean.length <= 3) {
    return clean.toUpperCase().replace(/[^A-Z]/g, '');
  }
  if (clean.length <= 7) {
    return `${clean.slice(0, 3).toUpperCase()}-${clean.slice(3).toUpperCase()}`;
  }
  return `${clean.slice(0, 3).toUpperCase()}-${clean.slice(4).toUpperCase()}`;
}
