class TripController {
  static actionNew(object, callback) {
    ConnectionServer.sendRequest('Trip/New', 'POST', object, callback)
  }

  static actionGet(tripReference, zoneId, callback) {
    ConnectionServer.sendRequest('Trip/Get', 'POST', { tripReference, zoneId }, callback)
  }

  static actionCancel(tripReference, userId, dateEnd, callback) {
    ConnectionServer.sendRequest(
      'Trip/Cancel',
      'POST',
      { tripReference, userId, dateEnd },
      callback
    )
  }

  static increaseArea(tripReference, zoneId, callback) {
    ConnectionServer.sendRequest('Trip/IncreaseArea', 'POST', { tripReference, zoneId }, callback)
  }

  static getByTripReference(tripReference) {
    return new Promise((resolve, reject) => {
      ConnectionServer.sendRequestMain('Trip/Get', 'POST', { tripReference }, resolve, reject)
    })
  }

  static get(tripReference) {
    return new Promise((resolve, reject) => {
      managerTripViewCurrent.request = ConnectionServer.sendRequest(
        'Trip/Get',
        'POST',
        { tripReference },
        resolve,
        reject
      )
    })
  }

  static getById(idTrip) {
    return new Promise((resolve) => {
      ConnectionServer.sendRequest('Trip/GetById', 'POST', { idTrip }, resolve)
    })
  }

  static ratingDriver(rating, tripReference, userId) {
    return new Promise((resolve, reject) => {
      ConnectionServer.sendRequest(
        'trip/rating/driver',
        'POST',
        { rating, tripReference, userId },
        resolve,
        reject,
        false
      )
    })
  }

  static getItems() {
    return new Promise((resolve, reject) => {
      ConnectionServer.sendRequestMain('TripItemType/all', 'GET', null, resolve, reject, false)
    })
  }

  static getDriverPosition(tripReference) {
    return new Promise((resolve, reject) => {
      ConnectionServer.sendRequest(
        `trip/${tripReference}/driverPositions`,
        'GET',
        null,
        resolve,
        reject
      )
    })
  }

  static share(tripReference) {
    return new Promise((resolve, reject) => {
      ConnectionServer.sendRequestMain(
        `Trip/GetShareLink?tripReference=${tripReference}`,
        'GET',
        null,
        resolve,
        reject,
        false
      )
    })
  }

  static finishTrip(tripReference) {
    return new Promise((resolve, reject) => {
      ConnectionServer.sendRequestMain(
        `Driver/FinishTrip`,
        'POST',
        { tripReference },
        resolve,
        reject
      )
    })
  }

  static getFee() {
    return new Promise((resolve, reject) => {
      ConnectionServer.sendRequest('trip/fee', 'GET', null, resolve, reject, false)
    })
  }

  static getActives(idCentral, filters = {}) {
    return new Promise((resolve, reject) => {
      const query = Object.entries(filters)
        .filter(([, value]) => value !== undefined && value !== null && value !== '')
        .map(([key, value]) => `${encodeURIComponent(key)}=${encodeURIComponent(value)}`)
        .join('&')

      const resource = query.length
        ? `central/${idCentral}/trip/activesRealtime?${query}`
        : `central/${idCentral}/trip/activesRealtime`

      ConnectionServer.sendRequest(resource, 'GET', null, resolve, reject, false)
    })
  }
}
