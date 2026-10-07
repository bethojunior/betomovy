import { DriverDataProps, EventItemInterface } from '../components/Trip/Details/Header/types';
import { normalizeTripEvent } from './tripEventUtils';

/**
 * Calcula a distância de deslocamento do motorista até a origem da viagem
 * @param drivers - Lista de motoristas chamados para a viagem
 * @param driverCalledId - ID do motorista que aceitou a viagem
 * @returns Distância em km ou null se não encontrada
 */
export const calculateDriverDisplacementDistance = (
  drivers: DriverDataProps[] | undefined,
  driverCalledId: number | undefined
): number | null => {
  if (!drivers || drivers.length === 0 || !driverCalledId) {
    return null;
  }

  const acceptedDriver = drivers.find(
    (item: DriverDataProps) => item.driver?.idDriver === driverCalledId
  );

  if (acceptedDriver?.proximity != null) {
    return acceptedDriver.proximity;
  }

  return null;
};

/**
 * Calcula o tempo de deslocamento do motorista até a origem da viagem
 * @param drivers - Lista de motoristas chamados para a viagem
 * @param driverCalledId - ID do motorista que aceitou a viagem
 * @param hourTripStarted - Data/hora de início da viagem (fallback)
 * @param eventsTrip - Lista de eventos da viagem para encontrar o evento pela message
 * @returns Tempo em minutos ou null se não encontrado
 */
export const calculateDriverDisplacementTime = (
  drivers: DriverDataProps[] | undefined,
  driverCalledId: number | undefined,
  hourTripStarted: string | undefined,
  eventsTrip?: EventItemInterface[] | undefined
): number | null => {
  if (!drivers || drivers.length === 0 || !driverCalledId || !hourTripStarted) {
    return null;
  }

  const acceptedDriver = drivers.find(
    (item: DriverDataProps) => item.driver?.idDriver === driverCalledId
  );

  if (!acceptedDriver?.created_at) {
    return null;
  }

  const driverCalledDate = new Date(acceptedDriver.created_at);
  
  if (isNaN(driverCalledDate.getTime())) {
    return null;
  }

  let tripStartDate: Date | null = null;
  const driverCalledTimestamp = driverCalledDate.getTime();
  const maxValidTimestamp = driverCalledTimestamp + (2 * 60 * 60 * 1000);
  
  if (eventsTrip && eventsTrip.length > 0) {
    let arrivedEvent: Date | null = null;
    let startedEvent: Date | null = null;
    
    for (const event of eventsTrip) {
      const message = event.message?.toLowerCase() || '';
      const eventDateIso = normalizeTripEvent(event).timestampIso;
      const eventDate = new Date(eventDateIso ?? '');
      const eventTimestamp = eventDate.getTime();
      
      if (isNaN(eventTimestamp) || eventTimestamp < driverCalledTimestamp || eventTimestamp > maxValidTimestamp) {
        continue;
      }
      
      if (!arrivedEvent && message.includes('motorista chegou ao ponto de origem')) {
        arrivedEvent = eventDate;
      } else if (!startedEvent && message.includes('motorista iniciou a viagem')) {
        startedEvent = eventDate;
      }
      
      if (arrivedEvent) {
        break;
      }
    }
    
    tripStartDate = arrivedEvent || startedEvent;
  }
  
  if (!tripStartDate && acceptedDriver.updated_at && acceptedDriver.updated_at !== acceptedDriver.created_at) {
    const updatedDate = new Date(acceptedDriver.updated_at);
    const timeDifferenceInMilliseconds = updatedDate.getTime() - driverCalledTimestamp;
    const maxTimeDifferenceInMilliseconds = 2 * 60 * 60 * 1000;
    
    if (timeDifferenceInMilliseconds > 0 && timeDifferenceInMilliseconds <= maxTimeDifferenceInMilliseconds && !isNaN(updatedDate.getTime())) {
      tripStartDate = updatedDate;
    }
  }
  
  if (!tripStartDate) {
    tripStartDate = new Date(hourTripStarted);
    
    if (tripStartDate.getTime() === driverCalledTimestamp) {
      return 0;
    }
  }

  if (isNaN(tripStartDate.getTime())) {
    return null;
  }

  const timeDifferenceInMilliseconds = tripStartDate.getTime() - driverCalledTimestamp;
  
  if (timeDifferenceInMilliseconds < 0) {
    return null;
  }

  const millisecondsPerMinute = 1000 * 60;
  return Math.round(timeDifferenceInMilliseconds / millisecondsPerMinute);
};

/**
 * Calcula a distância entre dois pontos usando fórmula de Haversine
 * @param latitude1 - Latitude do ponto 1
 * @param longitude1 - Longitude do ponto 1
 * @param latitude2 - Latitude do ponto 2
 * @param longitude2 - Longitude do ponto 2
 * @returns Distância em km
 */
const calculateHaversineDistance = (
  latitude1: number,
  longitude1: number,
  latitude2: number,
  longitude2: number
): number => {
  const earthRadiusInKilometers = 6371;
  const degreesToRadians = Math.PI / 180;
  const latitudeDifferenceInRadians = ((latitude2 - latitude1) * degreesToRadians);
  const longitudeDifferenceInRadians = ((longitude2 - longitude1) * degreesToRadians);
  
  const latitude1InRadians = latitude1 * degreesToRadians;
  const latitude2InRadians = latitude2 * degreesToRadians;
  
  const haversineIntermediateValue =
    Math.sin(latitudeDifferenceInRadians / 2) * Math.sin(latitudeDifferenceInRadians / 2) +
    Math.cos(latitude1InRadians) *
      Math.cos(latitude2InRadians) *
      Math.sin(longitudeDifferenceInRadians / 2) *
      Math.sin(longitudeDifferenceInRadians / 2);
  
  const angularDistanceInRadians = 2 * Math.atan2(Math.sqrt(haversineIntermediateValue), Math.sqrt(1 - haversineIntermediateValue));
  const distanceInKilometers = earthRadiusInKilometers * angularDistanceInRadians;

  return distanceInKilometers;
};

/**
 * Calcula a distância total percorrida somando as distâncias entre todos os pontos GPS consecutivos
 * @param coordinates - Array de coordenadas [longitude, latitude]
 * @returns Distância total em km ou null se não puder calcular
 */
export const calculateTotalDistanceFromPolyline = (
  coordinates: [number, number][]
): number | null => {
  if (!coordinates || coordinates.length < 2) {
    return null;
  }

  let totalDistanceInKilometers = 0;

  for (let i = 0; i < coordinates.length - 1; i++) {
    const [longitude1, latitude1] = coordinates[i];
    const [longitude2, latitude2] = coordinates[i + 1];

    if (
      isNaN(latitude1) || isNaN(longitude1) ||
      isNaN(latitude2) || isNaN(longitude2)
    ) {
      continue;
    }

    const segmentDistance = calculateHaversineDistance(
      latitude1,
      longitude1,
      latitude2,
      longitude2
    );

    totalDistanceInKilometers += segmentDistance;
  }

  return totalDistanceInKilometers > 0 ? Number(totalDistanceInKilometers.toFixed(3)) : null;
};

/**
 * Calcula a distância entre origem e destino usando fórmula de Haversine
 * @param originLatitude - Latitude da origem
 * @param originLongitude - Longitude da origem
 * @param destinationLatitude - Latitude do destino
 * @param destinationLongitude - Longitude do destino
 * @returns Distância em km ou null se não puder calcular
 */
export const calculateDistanceBetweenPoints = (
  originLatitude: string | number,
  originLongitude: string | number,
  destinationLatitude: string | number,
  destinationLongitude: string | number
): number | null => {
  const originLatitudeInDegrees = parseFloat(String(originLatitude));
  const originLongitudeInDegrees = parseFloat(String(originLongitude));
  const destinationLatitudeInDegrees = parseFloat(String(destinationLatitude));
  const destinationLongitudeInDegrees = parseFloat(String(destinationLongitude));

  if (isNaN(originLatitudeInDegrees) || isNaN(originLongitudeInDegrees) || isNaN(destinationLatitudeInDegrees) || isNaN(destinationLongitudeInDegrees)) {
    return null;
  }

  const distanceInKilometers = calculateHaversineDistance(
    originLatitudeInDegrees,
    originLongitudeInDegrees,
    destinationLatitudeInDegrees,
    destinationLongitudeInDegrees
  );

  return distanceInKilometers > 0 ? Number(distanceInKilometers.toFixed(3)) : null;
};

/**
 * Calcula o tempo total da viagem baseado nos eventos de início e fim
 * @param eventsTrip - Lista de eventos da viagem
 * @returns Tempo em minutos ou null se não encontrado
 */
export const calculateTotalTripTimeFromEvents = (
  eventsTrip?: EventItemInterface[] | undefined
): number | null => {
  if (!eventsTrip || eventsTrip.length === 0) {
    return null;
  }

  let tripStartDate: Date | null = null;
  let tripEndDate: Date | null = null;

  for (const event of eventsTrip) {
    const message = event.message?.toLowerCase() || '';
    const eventDateIso = normalizeTripEvent(event).timestampIso;
    const eventDate = new Date(eventDateIso ?? '');
    const eventTime = eventDate.getTime();

    if (isNaN(eventTime)) {
      continue;
    }

    if (!tripStartDate && message.includes('motorista iniciou a viagem')) {
      tripStartDate = eventDate;
    }

    if (message.includes('motorista finalizou a viagem')) {
      tripEndDate = eventDate;
    }
  }

  if (!tripStartDate || !tripEndDate) {
    return null;
  }

  const timeDifferenceInMilliseconds = tripEndDate.getTime() - tripStartDate.getTime();

  if (timeDifferenceInMilliseconds < 0) {
    return null;
  }

  const millisecondsPerMinute = 1000 * 60;
  return Math.round(timeDifferenceInMilliseconds / millisecondsPerMinute);
};

