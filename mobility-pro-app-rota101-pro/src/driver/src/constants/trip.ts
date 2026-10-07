import {Platform} from 'react-native';
import {translate} from '../../../client/locales';

export const STATUS_BACK_OFF = 'back_off';
export const STATUS_CANCELED = 'canceled';
export const STATUS_SCHEDULED = 'scheduled';
export const STATUS_SEARCHING = 'searching';
export const STATUS_PRE_ACCEPTED = 'pre_accepted';
export const STATUS_ACCEPTED = 'accepted';
export const STATUS_BOARDING = 'boarding';
export const STATUS_IN_PROGRESS = 'in_progress';
export const STATUS_FINISHED = 'finished';
export const STATUS_BOARDING_TRIP = 'boarding';
export const STATUS_FINISH_TRIP = 'finished';
export const STATUS_GET_BID_BY_DRIVERS = 'get_bid_by_drivers';
export const STATUS_WAITING = 'waiting';

export const STATUS_SITUATION_RELEASED = 1; // 'CORRIDA LIBERADA'
export const STATUS_ANALISYS = 2; // 'CORRIDA EM ANALISE
export const STATUS_SITUATION_BLOCKED = 3; // 'CORRIDA BLOQUEADA';
export const STATUS_RELEASED_AFTER_ANALISYS = 4; // 'CORRIDA LIBERADA APÓS ANÁLISE'
export const STATUS_EXCLUDED_AFTER_ANALISYS = 5; // 'CORRIDA EXCLUIDA APÓS ANÁLISE'
export const STATUS_SITUATION_RELEASED_AUTOMATICALLY = 6; // CORRIDA LIBERADA AUTOMETICAMENTE

export const TRIP_CALL_KNOB = '2';
export const TRIP_CALL_PARTNER = '3';
export const TRIP_CENTRAL = '4';
export const TRIP_FREIGHT = '6';
export const TRIP_CALL_TAXIMETER = '9';
export const TRIP_CALL_RIDE = '7';
export const TRIP_CALL_CORPORATE = '10';

export let tripStatus = {};
setTimeout(() => {
  tripStatus[STATUS_PRE_ACCEPTED] = translate('statusTripClient.pre_accepted');
  tripStatus[STATUS_ACCEPTED] = translate('statusTripClient.accepted');
  tripStatus[STATUS_BOARDING] = translate('statusTripClient.boarding');
  tripStatus[STATUS_IN_PROGRESS] = translate('statusTripClient.progress');
  tripStatus[STATUS_SCHEDULED] = translate('statusTripClient.scheduled');
}, 5000);

tripStatus[STATUS_PRE_ACCEPTED] = translate('statusTripClient.pre_accepted');
tripStatus[STATUS_ACCEPTED] = translate('statusTripClient.accepted');
tripStatus[STATUS_BOARDING] = translate('statusTripClient.boarding');
tripStatus[STATUS_IN_PROGRESS] = translate('statusTripClient.progress');
