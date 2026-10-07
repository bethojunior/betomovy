const STATUS_SEARCHING = "searching";
const STATUS_SCHEDULED =  "scheduled";
const STATUS_PRE_ACCEPTED = "pre_accepted";
const STATUS_ACCEPTED = "accepted";
const STATUS_BOARDING = "boarding";
const STATUS_IN_PROGRESS = "in_progress";
const STATUS_FINISHED = "finished";
const STATUS_CANCELED = "canceled";
const STATUS_NOT_ANSWERED = "not_answered";
const STATUS_BACK_OFF = "back_off";
const STATUS_PAYMENT_REFUSED = "payment_refused";
const STATUS_SEARCHING_FAVORITE = "searching_favorite";
const STATUS_GET_BID_BY_DRIVERS    = "get_bid_by_drivers";
const TYPE_RETURN_ID = "1";
const TYPE_FREIGHT = "6";
const TYPE_RIDE = "7";
const TYPE_TAXIMETER = "9";
const STATUS_TRIP_DELIVERY = 'DELIVERY';
const STATUS_TRIP_FREIGHT = 'FREIGHT';

const PAYMENT_CARD_CREDIT = 3;
const PAYMENT_CARD_DEBIT = 8;

function showStatusTrip(status) {
    viewController.elementProperty.getElement(".description-title", element => {
        switch (status) {
            case STATUS_PRE_ACCEPTED : {
                element.innerHTML = getTextTranslate("home","text-status-pre-accepted");
                break;
            }
            case STATUS_ACCEPTED : {
                element.innerHTML = getTextTranslate("home","text-status-accepted");
                break;
            }
            case STATUS_BOARDING : {
                element.innerHTML = getTextTranslate("home","text-status-boarding");
                break;
            }
            case STATUS_IN_PROGRESS : {
                element.innerHTML =  getTextTranslate("home","text-status-in-progress");
                break;
            }
        }
    })
}
