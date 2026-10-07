import {
  STATUS_ACCEPTED,
  STATUS_GET_BID_BY_DRIVERS,
  STATUS_SCHEDULED,
} from '../../../constants/trip';
import AppSocket from '../../../../../client/services/socket';

class TripCollection {
  private onConnectWithQueryParams(query = {}) {
    return new AppSocket(null, {query});
  }

  getTripScheduledAccepted(driverId: string, callback) {
    const socketConnected = this.onConnectWithQueryParams({
      collection: "trip",
      type: "get_by_status_and_driver",
      driverId: driverId,
      status: STATUS_SCHEDULED
    });

    socketConnected.onEvent(`trip_driver_${driverId}_${STATUS_SCHEDULED}`, ({ data, type }) => callback(data, type));
  }

  getTripOffer(cityId, tripTypeId, callback) {
    const socketConnected = this.onConnectWithQueryParams({
      collection: "trip",
      type: "get_by_status_and_call_type",
      tripCallTypeId: tripTypeId,
      status: STATUS_GET_BID_BY_DRIVERS,
      cityId
    });

    socketConnected.onEvent(`trip_${STATUS_GET_BID_BY_DRIVERS}_${tripTypeId}_${cityId}`, ({ data, type }) => callback(data, type));
  }

  getTripScheduled(
    cityId: string,
    tripTypeId: string = null,
    callback = null,
  ) {
    const socketConnected = this.onConnectWithQueryParams({
      collection: "trip",
      type: "get_by_status_and_call_type",
      tripCallTypeId: tripTypeId,
      status: STATUS_SCHEDULED,
      cityId
    });

    socketConnected.onEvent(`trip_${STATUS_SCHEDULED}_${tripTypeId}_${cityId}`, ({ data, type }) => callback(data, type));
  }

  searchTripByStatus(
    driverId: string,
    status = STATUS_ACCEPTED,
    callback,
  ) {
    const socketConnected = this.onConnectWithQueryParams({
      collection: "trip",
      type: "get_by_status_and_driver",
      driverId,
      status
    });

    socketConnected.onEvent(`trip_driver_${driverId}_${status}`, ({ data, type }) => callback(data, type));
  }

  searchTripByStatusAll(driverId: string, callback) {

  }

  searchTripByStatusScheduled(
    driverId: string,
    status = STATUS_ACCEPTED,
    callback,
  ) {
    const socketConnected = this.onConnectWithQueryParams({
      collection: "trip",
      type: "get_by_status_and_driver",
      driverId,
      status
    });

    socketConnected.onEvent(`trip_driver_${driverId}_${status}`, ({ data, type }) => callback(data, type));
  }

  searchTrip(driverId: string, callback: any = null) {
    const socketConnected = this.onConnectWithQueryParams({
      collection: "trip",
      type: "search",
      driverId: driverId
    });

    socketConnected.onEvent(`trip_search_${driverId}`, ({ data, type }) => callback(data, type));
  }

  checkTripAccepted(driverId, callback) {
    const socketConnected = this.onConnectWithQueryParams({
      collection: "trip",
      type: "get_by_status_and_driver",
      driverId,
      status: STATUS_ACCEPTED
    });

    socketConnected.onEvent(`trip_driver_${driverId}_${STATUS_ACCEPTED}`, ({ data, type }) => callback(data, type));
  }

  getTrip(tripReference, callback) {
    const socketConnected = this.onConnectWithQueryParams({
      collection: "trip",
      type: 'get_by_trip_reference',
      tripReference
    });

    socketConnected.onEvent(`trip_${tripReference}`, ({ data, type }) => callback(data, type));
  }
}

export default TripCollection;
