/**
 * Calcula a distância entre duas coordenadas geográficas usando a fórmula de Haversine
 * @param lat1 Latitude do primeiro ponto
 * @param lon1 Longitude do primeiro ponto
 * @param lat2 Latitude do segundo ponto
 * @param lon2 Longitude do segundo ponto
 * @returns Distância em quilômetros
 */
// Essa mesma fórmula foi reutilizada na apiv2 para:
// - calcular a progressão da viagem
// - calcular a estimativa do deslocamento do motorista até o passageiro
//
// e esse calculateDistance foi criado pra resolver o problema de APIs (geocoding/search, City/getConfig, advertising/get) sendo chamadas
// a cada pequena mudança de GPS (centenas/minuto). E a correcao foi throttling por distância, só chama após 100m (geocoding) ou 1km (config/publicidade),
// reduzindo muito as chamadas desnecessárias.

export function calculateDistance(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number,
): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
