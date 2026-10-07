import { Platform } from "react-native";
import { translate } from "../locales";

export const STATUS_BACK_OFF = 'back_off';
export const STATUS_CANCELED = 'canceled';
export const STATUS_SCHEDULED = 'scheduled';
export const STATUS_SEARCHING = 'searching';
export const STATUS_NOT_ANSWERED = 'not_answered';
export const STATUS_PRE_ACCEPTED = 'pre_accepted';
export const STATUS_ACCEPTED = 'accepted';
export const STATUS_BOARDING = 'boarding';
export const STATUS_IN_PROGRESS = 'in_progress';
export const STATUS_FINISHED = 'finished';
export const STATUS_SEARCHING_DRIVER_OFFER = 'get_bid_by_drivers';
export const STATUS_SEARCHING_FAVORITE = "searching_favorite"

export let tripStatus = {};
  setTimeout(() => {
    tripStatus[STATUS_PRE_ACCEPTED] = translate('statusTripClient.pre_accepted');
    tripStatus[STATUS_ACCEPTED] = translate('statusTripClient.accepted');
    tripStatus[STATUS_BOARDING] = translate('statusTripClient.boarding');
    tripStatus[STATUS_IN_PROGRESS] = translate('statusTripClient.progress');
    tripStatus[STATUS_SCHEDULED] = translate('statusTripClient.scheduled');
  },5000)


tripStatus[STATUS_PRE_ACCEPTED] = translate('statusTripClient.pre_accepted');
tripStatus[STATUS_ACCEPTED] = translate('statusTripClient.accepted');
tripStatus[STATUS_BOARDING] = translate('statusTripClient.boarding');
tripStatus[STATUS_IN_PROGRESS] = translate('statusTripClient.progress');
tripStatus[STATUS_SCHEDULED] = translate('statusTripClient.scheduled');
