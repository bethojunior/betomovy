class CentralRepository {
  static get(centralId) {
    return new Promise((resolve, reject) => {
      ConnectionServer.sendRequest(`central/${centralId}`, 'GET', null, resolve, reject)
    })
  }

  static getBalance(id) {
    return new Promise((resolve, reject) => {
      ConnectionServer.sendRequest(`getBalance/${id}`, 'GET', null, resolve, reject)
    })
  }

  static addDriver(centralId, driverId, isFavorite) {
    return new Promise((resolve, reject) => {
      ConnectionServer.sendRequest(
        `central/driver`,
        'POST',
        { centralId, driverId, isFavorite },
        resolve,
        reject
      )
    })
  }

  static addPrice(data) {
    return new Promise((resolve, reject) => {
      ConnectionServer.sendRequest(`central/price`, 'POST', data, resolve, reject)
    })
  }

  static updatePrice(id, data) {
    return new Promise((resolve, reject) => {
      ConnectionServer.sendRequest(`central/price/${id}`, 'PUT', data, resolve, reject)
    })
  }

  static getPrices(centralId) {
    return new Promise((resolve, reject) => {
      ConnectionServer.sendRequest(`central/${centralId}/price`, 'GET', null, resolve, reject)
    })
  }

  static calculate(origin, destination, waypoints, onlyCentral = false, isCentral, centralId) {
    return new Promise((resolve, reject) => {
      ConnectionServer.sendRequestMain(
        `PricePartner/Calculate`,
        'POST',
        { origin, destination, waypoints, onlyCentral, isCentral, centralId },
        resolve,
        reject,
        false
      )
    })
  }

  static getZone(idCentral, data) {
    return new Promise((resolve, reject) => {
      ConnectionServer.sendRequest(`central/${idCentral}/zone`, 'GET', data, resolve, reject)
    })
  }

  static insertZone(idCentral, data) {
    return new Promise((resolve, reject) => {
      ConnectionServer.sendRequest(`central/${idCentral}/zone`, 'POST', data, resolve, reject)
    })
  }

  static insertCustomer(idCentral, data) {
    return new Promise((resolve, reject) => {
      ConnectionServer.sendRequest(`central/${idCentral}/customer`, 'POST', data, resolve, reject)
    })
  }

  static updateCustomer(idCentral, customerId, data) {
    return new Promise((resolve, reject) => {
      ConnectionServer.sendRequest(
        `central/${idCentral}/customer/${customerId}`,
        'PUT',
        data,
        resolve,
        reject
      )
    })
  }

  static updateZoneZone(idCentral, idZone, data) {
    return new Promise((resolve, reject) => {
      ConnectionServer.sendRequest(
        `central/${idCentral}/zone/${idZone}`,
        'PUT',
        data,
        resolve,
        reject
      )
    })
  }

  static getCustomerById(centralId, id) {
    return new Promise((resolve, reject) => {
      ConnectionServer.sendRequest(
        `central/${centralId}/customer/${id}`,
        'GET',
        null,
        resolve,
        reject
      )
    })
  }

  static getCustomer(centralId, config = { page: 1, filter: {} }) {
    return new Promise((resolve, reject) => {
      const search = `?page=${encodeURIComponent(config.page)}`.concat(
        Object.keys(config.filter)
          .map((key) => {
            const value = config.filter[key] ?? ''
            return `&${encodeURIComponent(key)}=${encodeURIComponent(value)}`
          })
          .join('')
      )

      ConnectionServer.sendRequest(
        `central/${centralId}/customer${search}`,
        `GET`,
        null,
        resolve,
        reject
      )
    })
  }

  static getCustomerByUrl(url) {
    return new Promise((resolve, reject) => {
      ConnectionServer.sendRequestByUrl(url, `GET`, null, resolve, reject)
    })
  }

  static blockCustomer(centralId, customerId) {
    return new Promise((resolve, reject) => {
      ConnectionServer.sendRequest(
        `central/${centralId}/customer/${customerId}/block`,
        `PUT`,
        null,
        resolve,
        reject
      )
    })
  }

  static releaseCustomer(centralId, customerId) {
    return new Promise((resolve, reject) => {
      ConnectionServer.sendRequest(
        `central/${centralId}/customer/${customerId}/release`,
        `PUT`,
        null,
        resolve,
        reject
      )
    })
  }

  static deleteCustomer(centralId, customerId) {
    return new Promise((resolve, reject) => {
      ConnectionServer.sendRequest(
        `central/${centralId}/customer/${customerId}`,
        `delete`,
        null,
        resolve,
        reject
      )
    })
  }

  static getTrips(centralId) {
    return new Promise((resolve, reject) => {
      ConnectionServer.sendRequest(`central/${centralId}/trip`, 'GET', null, resolve, reject)
    })
  }

  static getTripsByUrl(url) {
    return new Promise((resolve, reject) => {
      ConnectionServer.sendRequestByUrl(url, 'GET', null, resolve, reject)
    })
  }

  static register(formData) {
    return ConnectionServer.sendRequestWithFilesCentral('central/register', 'POST', formData)
  }

  static calculatePriceNoDistance(origin, centralId = null, neighborhoodId = null) {
    return new Promise((resolve, reject) => {
      if (!neighborhoodId) {
        ConnectionServer.sendRequestMain(
          `Price/CalculateAll`,
          'POST',
          {
            origin,
            destiny: origin,
            waypoints: [],
            noDestination: true,
          },
          resolve,
          reject,
          false
        )
      } else {
        ConnectionServer.sendRequest(
          `central/${centralId}/price/neighborhood/calculate?origin=${origin.latitude},${origin.longitude}&destination=${origin.latitude},${origin.longitude}&neighborhoodId=${neighborhoodId}`,
          `GET`,
          null,
          (result) => {
            resolve({ ...result, data: result.response })
          },
          reject
        )
      }
    })
  }

  static calculateNeighborhoodRides(origin, destiny, centralId, neighborhoodId) {
    return new Promise((resolve, reject) => {
      ConnectionServer.sendRequest(
        `central/${centralId}/price/neighborhoodRides/calculate?origin=${origin.latitude},${origin.longitude}&destination=${destiny.latitude},${destiny.longitude}&neighborhoodId=${neighborhoodId}`,
        `GET`,
        null,
        (result) => {
          resolve({ ...result, data: result.response })
        },
        reject
      )
    })
  }

  static withheldBalance(data) {
    return new Promise((resolve, reject) => {
      ConnectionServer.sendRequest('holdVoucherBalance', 'POST', data, resolve, reject)
    })
  }

  static getIfoodOrders(centralId) {
    return new Promise((resolve, reject) => {
      ConnectionServer.sendRequest('ifood/orders/' + centralId, 'GET', 'data', resolve, reject)
    })
  }

  static getMyGroups(centralId) {
    return new Promise((resolve, reject) => {
      ConnectionServer.sendRequest(
        'whatsapp-group/index?centralId=' + encodeURIComponent(centralId),
        'GET',
        'data',
        resolve,
        reject
      )
    })
  }

  static storeGroups(props) {
    return new Promise((resolve, reject) => {
      ConnectionServer.sendRequest('whatsapp-group/store', 'POST', props, resolve, reject)
    })
  }

  static fetchMyNotifcationConfigs(centralId) {
    return new Promise((resolve, reject) => {
      ConnectionServer.sendRequest(
        'whatsapp-group/notification/index?centralId=' + encodeURIComponent(centralId),
        'GET',
        'data',
        resolve,
        reject
      )
    })
  }

  static storeNotification(props) {
    return new Promise((resolve, reject) => {
      ConnectionServer.sendRequest(
        'whatsapp-group/notification/store',
        'POST',
        props,
        resolve,
        reject
      )
    })
  }

  static fetchDiscountConfigs() {
    let centralId = Session.getValueInSession('centralSelected', 'id')
    return new Promise((resolve, reject) => {
      ConnectionServer.sendRequest(
        'central/discount/' + centralId,
        'GET',
        '',
        resolve,
        reject
      )
    })
  }

  static async fetchUberPrices(props) {
    const response = await fetch('https://au-central.704app.com.br/api/precos-uber', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        placeOrigem: props.placeOrigem,
        latOrigem: props.latOrigem,
        lngOrigem: props.lngOrigem,
        placeDestino: props.placeDestino,
        latDestino: props.latDestino,
        lngDestino: props.lngDestino,
        uberCookie: props.uberCookie
      }),
    })

    if (!response.ok) {
      throw new Error(`Erro ao buscar preços: ${response.status}`)
    }

    return await response.json()
  }

  static register(data) {
    return ConnectionServer.sendRequestWithFilesCentral('central/register', 'POST', data)
  }
}
