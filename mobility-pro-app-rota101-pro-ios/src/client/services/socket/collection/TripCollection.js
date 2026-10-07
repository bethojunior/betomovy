import {
  STATUS_ACCEPTED,
  STATUS_SCHEDULED,
} from '../../../constants/trip';
import AppSocket from '../../socket';

class TripCollection {
  onConnectWithQueryParams(query = {}) {
    return new AppSocket(null, {query});
  }

  checkTripAccepted(userId, status = STATUS_ACCEPTED, callback) {
    const socketConnected = this.onConnectWithQueryParams({
      collection: "trip",
      type: 'get_by_status_and_user',
      userId,
      status
    });

    socketConnected.onEvent(`trip_user_${userId}_${status}`, ({ data, type }) => callback(data, type));
  }

  getTrip(tripReference, callback) {
    const socketConnected = this.onConnectWithQueryParams({
      collection: "trip",
      type: 'get_by_trip_reference',
      tripReference
    });

    socketConnected.onEvent(`trip_${tripReference}`, ({ data, type }) => {
      callback(data, type)});
  }

  checkTripAcceptedScheduled(userId, status = STATUS_SCHEDULED, callback) {
    const socketConnected = this.onConnectWithQueryParams({
      collection: "trip",
      type: 'get_by_status_and_user',
      userId,
      status
    });

    socketConnected.onEvent(`trip_user_${userId}_${status}`, ({ data, type }) => callback(data, type));
  }
}

export default TripCollection;
