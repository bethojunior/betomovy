const STATUS_PRE_ACCEPTED = "pre_accepted";
const STATUS_ACCEPTED = "accepted";
const STATUS_SCHEDULED = "scheduled";
const STATUS_IN_PROGRESS = "in_progress";
const STATUS_BOARDING_TRIP = "boarding";
const STATUS_FINISH_TRIP = "finished";
const STATUS_CANCELED = "canceled";
const STATUS_SEARCHING = "searching";
const STATUS_GET_BID_BY_DRIVERS = "get_bid_by_drivers";
const STATUS_SEARCHING_FAVORITE = "searching_favorite";

const TRIP_CALL_KNOB = "2";
const TRIP_CALL_PARTNER = "3";
const TRIP_CENTRAL = "4";
const TRIP_FREIGHT = "6";
const TRIP_CALL_TAXIMETER = "9";
const TRIP_CALL_RIDE = "7";
const TRIP_CALL_CORPORATE = "10";

class TripUtils {
    static applyDiscount(trip, liquidPrice = "0") {
        if ((trip?.disableOnPromotion == 0 && liquidPrice == 0) || liquidPrice == 0) {
            return trip.price;
        } else {
            if (trip.driverCommissionType === "%") {
                const pricePercentage = trip.price * (trip?.driverCommissionValue / 100);
                return trip.price - pricePercentage;
            } else {
                return trip.price - trip?.driverCommissionValue;
            }
        }
    }
}
