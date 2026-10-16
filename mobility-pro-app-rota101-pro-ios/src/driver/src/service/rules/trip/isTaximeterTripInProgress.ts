import {STATUS_IN_PROGRESS} from '~/driver/src/constants/trip';
import {Trip} from '~/interfaces/trip';

/**
 * Verifica se uma viagem do tipo taxímetro está em andamento, observando os campos 'tripCallType' e 'status'.
 * @param trip - Objeto da viagem a ser validado.
 * @returns `true` se for uma chamada taxímetro em andamento, caso contrário `false`.
 */
export function isTaximeterTripInProgress(trip: Trip): boolean {
  return (
    trip?.tripCallType === 'CHAMADA TAXÍMETRO' &&
    trip?.status === STATUS_IN_PROGRESS
  );
}
