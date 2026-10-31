function clearFieldAddressById(pathTrip) {
  const element = document.querySelector(`*[place='${pathTrip}']`)

  if (!element) return

  element.value = ''
  element.focus()

  switch (pathTrip) {
    case 'origin': {
      trip.origin = null
      mapService.removePointClient()
      break
    }
    case 'destination': {
      trip.destination = null
      mapService.removePointDestination()
      break
    }
    default: {
      const code = pathTrip.split('-')[1]
      trip.waypoints[code] = null
    }
  }
}

function sortTimePhrase() {
  const pharses = [
    'Localizando o motorista mais próximo de você',
    'Estamos quase encontrando seu motorista',
    'Calculando melhor rota',
  ]

  const pharse = {}

  pharse[Math.floor(Math.random() * 20 + 50)] = pharses[0]
  pharse[Math.floor(Math.random() * 20 + 100)] = pharses[1]
  pharse[Math.floor(Math.random() * 20 + 160)] = pharses[2]

  Session.setLocal('timePhrase', pharse)
}

function getDestination(trip) {
  if (
    trip.status === STATUS_ACCEPTED ||
    trip.status === STATUS_BOARDING ||
    trip.status === STATUS_PRE_ACCEPTED
  )
    return {
      lat: parseFloat(managerTrip.tripCurrent.origin.latitude),
      lng: parseFloat(managerTrip.tripCurrent.origin.longitude),
    }
  if (trip.status === STATUS_IN_PROGRESS)
    return {
      lat: parseFloat(managerTrip.tripCurrent.destination.latitude),
      lng: parseFloat(managerTrip.tripCurrent.destination.longitude),
    }
}

window.setPlaceSelect = (place, path) => {
  viewController.elementProperty.getElement(`#${path}`, (element) => {
    element.value = place.address
  })

  /*mapService.getAddressByLatLng({
        lat: parseFloat(place.latitude),
        lng: parseFloat(place.longitude)
    }).then((address) => {
        getPoint(address, path)
    }).catch((err) => {
    });*/

  getPoint(place, path)
}

function updateLocation() {
  Position.getPosition((position) => {
    Session.setLocal('location', { lat: position.coords.latitude, lng: position.coords.longitude })
  })
}

function setZoomInPosition(position) {
  //mapService.map.setZoom(18);
  //mapService.map.setCenter(position);
}

let locals = []
let optimized = []
let notOptimized = []
let isOptimized = false
function getDistanceFromLatLonInKm(points) {
  if (points.length > 1) {
    while (points.length > 1) {
      let i = 1
      while (i < points.length) {
        if (points[0].km) {
          points[0].km = 0
        }
        let earthRadius = 6371
        let radiusLat = deg2rad(points[i].lat - points[0].lat)
        let radiusLon = deg2rad(points[i].lng - points[0].lng)
        let a =
          Math.sin(radiusLat / 2) * Math.sin(radiusLat / 2) +
          Math.cos(deg2rad(points[0].lat)) *
            Math.cos(deg2rad(points[i].lat)) *
            Math.sin(radiusLon / 2) *
            Math.sin(radiusLon / 2)
        let c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
        let distanceInKm = earthRadius * c
        const destination = {
          lat: points[i].lat,
          lng: points[i].lng,
          address: points[i].address,
          neighborhood: points[i].neighborhood,
          km: distanceInKm,
          pathTrip: points[i].pathTrip,
        }
        locals[i] = destination
        i = i + 1
      }
      locals.sort(function (destination, origem) {
        return destination.km - origem.km
      })
      optimized.push(locals[0])
      locals.splice(0, 1)
    }
    const itIs = optimized.find((item) => item === locals[0])
    if (!itIs) {
      optimized.push(locals[0])
      locals.splice(0, 1)
    }
  }
}

function deg2rad(deg) {
  return deg * (Math.PI / 180)
}

function readjustRoute(routes) {
  let waypoints = !isOptimized
    ? routes.filter((res) => res.km == 0)
    : routes.filter((res) => res.pathTrip !== 'origin' && res.pathTrip !== 'destination')

  let destinationIndex = routes.indexOf(routes.find((res) => res.pathTrip == 'destination'))
  let lastIndex = !isOptimized ? routes.length - 1 : destinationIndex

  trip.origin = {
    lat: routes[0].lat,
    lng: routes[0].lng,
  }

  trip.waypoints = waypoints

  trip.destination = {
    lat: routes[lastIndex].lat,
    lng: routes[lastIndex].lng,
  }
  mapService.addPointDestination(routes[lastIndex])
}

function bestRoute() {
  const optimizedBtn = document.querySelector('#optimized')
  if (optimizedBtn) optimizedBtn.innerHTML = 'Sugestão de melhor rota'
  readjustRoute(notOptimized)
  isOptimized = false
  optimized = []
}

function swapOriginDestination() {
  const originInput = document.querySelector("*[place='origin']")
  const destinationInput = document.querySelector("*[place='destination']")

  if (!originInput || !destinationInput) return

  const oldOrigin = { address: originInput.value, data: trip.origin }
  const oldDestination = { address: destinationInput.value, data: trip.destination }

  if (!oldOrigin.address && !oldDestination.address) return

  originInput.value = oldDestination.address
  destinationInput.value = oldOrigin.address

  applySwappedAddress('origin', oldDestination, 'city-destination', () => mapService.removePointClient())
  applySwappedAddress('destination', oldOrigin, 'city-origin', () => mapService.removePointDestination())
}

function applySwappedAddress(pathTrip, source, cityIdKey, removePoint) {
  if (!source.address) {
    trip[pathTrip] = null
    removePoint()
    return
  }

  if (!source.data) {
    trip[pathTrip] = null
    removePoint()
    const input = document.querySelector(`*[place='${pathTrip}']`)
    if (input) input.value = ''
    return
  }

  const place = {
    address: source.address,
    latitude: source.data.lat,
    longitude: source.data.lng,
    neighborhood: source.data.neighborhood,
    cityId: Session.getLocal(cityIdKey),
  }

  Session.setLocal(`neighborhood-${pathTrip}`, place.neighborhood || '')
  Session.setLocal(`city-${pathTrip}`, place.cityId)
  getPoint(place, pathTrip)
}

function getPoint(place, pathTrip) {
  if (trip[pathTrip] !== undefined) {
    //Session.set(`neighborhood-${pathTrip}`, place.neighborhood);
  }

  let typePath =
    pathTrip !== 'origin' && pathTrip !== 'destination' ? pathTrip.split('-')[1] : pathTrip
  const alredyExist = notOptimized.find((res) => res.pathTrip == typePath)
  const objectIndex = notOptimized.indexOf(alredyExist)
  const newPlace = {
    lat: place.latitude,
    lng: place.longitude,
    address: place.address,
    neighborhood: place.neighborhood,
    pathTrip: typePath,
  }

  !!alredyExist ? notOptimized.splice(objectIndex, 1, newPlace) : notOptimized.push(newPlace)

  const position = {
    lat: parseFloat(place.latitude),
    lng: parseFloat(place.longitude),
    neighborhood: place.neighborhood,
  }

  if (trip[pathTrip] !== undefined) {
    trip[pathTrip] = position
  }

  if (trip[pathTrip] !== undefined) {
    trip[pathTrip] = position
  }

  switch (pathTrip) {
    case 'origin': {
      priceTrip.setPrace(place)
      mapService.addPointClient(position)
      break
    }
    case 'destination': {
      mapService.addPointDestination(position)
      break
    }
    default: {
      const code = pathTrip.split('-')[1]

      trip.waypoints[code] = {
        lat: position.lat,
        lng: position.lng,
        neighborhood: place.neighborhood,
        address: document.querySelector(`*[place=${pathTrip}]`).value,
      }

      /*priceTrip.getCityByPlace(place).then((cityId) => {
                trip.waypoints[code].cityId = cityId
            });*/
    }
  }
  if (isOptimized) {
    bestRoute()
  }

  viewController.elementProperty.removeClass('.container-search-local', 'active')
  updateBtnCallTripVisibility()
  //validateLocales(pathTrip);
}

function clearOptimized() {
  notOptimized = []
  optimized = []
  trip.waypoints = []
  trip.customer = null
  const optimizedBtn = document.querySelector('#optimized')
  if (optimizedBtn) optimizedBtn.innerHTML = 'Sugestão de melhor rota'
  isOptimized = false
}

function validateLocales() {
  if (!validateAddressWayPoints()) {
    SwalCustom.messageDialog(
      'Endereço já foi informado em sequências',
      'Ops...',
      () => {
        // clearFieldAddressById(lastInputId);
      },
      'info'
    )
    return
  }
  if (trip.origin == null) return document.getElementById('originSelected').focus()

  let emptyWaypoint = null

  const isWaypointsFill =
    Object.keys(trip.waypoints).filter((item) => {
      if (trip.waypoints[item] === null && emptyWaypoint == null) emptyWaypoint = item
      return trip.waypoints[item] === null
    }).length === 0

  if (emptyWaypoint != null)
    return viewController.elementProperty.getElement(`#waypoint-${emptyWaypoint}`, (element) => {
      element.focus()
    })

  if (trip.destination == null) return document.getElementById('destinationSelected').focus()

  if (trip.destination !== null && trip.origin !== null && isWaypointsFill) {
    calculatePriceCustomer()
  }

  // fillAntiUberFields()
}

function escapeAntiUberAttr(value) {
  if (value === null || value === undefined) {
    return ''
  }
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function escapeAntiUberHtml(value) {
  if (value === null || value === undefined) {
    return ''
  }
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
}

function setAntiUberSpinnerVisible(isVisible) {
  const spinnerEl = document.getElementById('spinner-antiuber')
  if (!spinnerEl) {
    return
  }
  spinnerEl.style.display = isVisible ? 'grid' : 'none'
  spinnerEl.setAttribute('aria-hidden', isVisible ? 'false' : 'true')
}

function setAntiUberPlaceholderVisible(isVisible) {
  const placeholderEl = document.getElementById('anti-uber-placeholder')
  if (!placeholderEl) {
    return
  }
  const wrapEl = document.querySelector('.anti-uber-results-wrap')
  if (isVisible) {
    placeholderEl.classList.remove('hidden')
    if (wrapEl) {
      wrapEl.classList.add('anti-uber-results-wrap--hidden')
    }
    return
  }
  placeholderEl.classList.add('hidden')
  if (wrapEl) {
    wrapEl.classList.remove('anti-uber-results-wrap--hidden')
  }
}

function getAntiUberResultsScrollStep() {
  const track = document.getElementById('anti-uber-results')
  if (!track) {
    return 240
  }
  return Math.min(280, Math.max(180, Math.floor(track.clientWidth * 0.72)))
}

function updateAntiUberResultsScrollButtons() {
  const track = document.getElementById('anti-uber-results')
  const prevBtn = document.getElementById('antiUberScrollPrev')
  const nextBtn = document.getElementById('antiUberScrollNext')
  if (!track || !prevBtn || !nextBtn) {
    return
  }
  const maxScroll = track.scrollWidth - track.clientWidth
  const left = track.scrollLeft
  const epsilon = 3
  prevBtn.disabled = left <= epsilon
  nextBtn.disabled = maxScroll <= epsilon || left >= maxScroll - epsilon
}

function bindAntiUberResultsScrollControls() {
  const track = document.getElementById('anti-uber-results')
  const prevBtn = document.getElementById('antiUberScrollPrev')
  const nextBtn = document.getElementById('antiUberScrollNext')
  if (!track || !prevBtn || !nextBtn) {
    return
  }
  const scrollByStep = (direction) => {
    track.scrollBy({ left: direction * getAntiUberResultsScrollStep(), behavior: 'smooth' })
  }
  prevBtn.addEventListener('click', () => scrollByStep(-1))
  nextBtn.addEventListener('click', () => scrollByStep(1))
  track.addEventListener('scroll', updateAntiUberResultsScrollButtons, { passive: true })
  window.addEventListener('resize', updateAntiUberResultsScrollButtons)
  if (typeof ResizeObserver !== 'undefined') {
    new ResizeObserver(updateAntiUberResultsScrollButtons).observe(track)
  }
  updateAntiUberResultsScrollButtons()
}

function scheduleAntiUberScrollButtonsUpdate() {
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      updateAntiUberResultsScrollButtons()
    })
  })
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bindAntiUberResultsScrollControls)
} else {
  bindAntiUberResultsScrollControls()
}

viewController.elementProperty.addEventInElement('#generate-value-au', 'onclick', function () {
  const resultsEl = document.getElementById('anti-uber-results')
  if (resultsEl) {
    resultsEl.innerHTML = ''
  }
  setAntiUberPlaceholderVisible(false)
  setAntiUberSpinnerVisible(true)
  document.getElementById('div-get-cookies').classList.add('hidden')
  scheduleAntiUberScrollButtonsUpdate()
  fillAntiUberFields()
})

const inputUberCookie = document.getElementById('cookie-anti-uber')

if (inputUberCookie) {
  const saved = localStorage.getItem('uberCookieParsed')

  if (saved) {
    inputUberCookie.value = saved
  }

  inputUberCookie.addEventListener('input', () => {
    localStorage.setItem('uberCookieParsed', inputUberCookie.value.trim())
  })
}

function fillAntiUberFields() {
  const cookieInput = document.getElementById('cookie-anti-uber')
  const resultsEl = document.getElementById('anti-uber-results')
  const uberCookieLocal = cookieInput ? cookieInput.value.trim() : ''
  let uberCookieParsedLocal = null
  try {
    uberCookieParsedLocal = JSON.parse(uberCookieLocal)
  } catch (parseErr) {
    console.error('Cookie anti-Uber inválido:', parseErr)
    document.getElementById('div-get-cookies').classList.remove('hidden')
    if (resultsEl) {
      resultsEl.innerHTML =
        '<p class="anti-uber-message anti-uber-message--error" role="alert">JSON inválido. Cole um cookie válido e tente de novo.</p>'
    }
    setAntiUberSpinnerVisible(false)
    scheduleAntiUberScrollButtonsUpdate()
    return
  }
  uberCookieParsed = uberCookieParsedLocal
  localStorage.setItem('uberCookieParsed', uberCookieLocal)
  if (!resultsEl) {
    setAntiUberSpinnerVisible(false)
    return
  }
  viewController.elementProperty.getElement('#anti-uber-results', async (element) => {
    const props = {
      placeOrigem: trip.origin.neighborhood,
      latOrigem: trip.origin.lat,
      lngOrigem: trip.origin.lng,
      placeDestino: trip.destination.neighborhood,
      latDestino: trip.destination.lat,
      lngDestino: trip.destination.lng,
      uberCookie: uberCookieParsedLocal,
    }
    try {
      const response = await CentralRepository.fetchUberPrices(props)
      const list = Object.values(response)
      const text = list
        .filter((item) => item.preco && item.preco !== 'Reservar')
        .map((item) => {
          const tipoSafe = escapeAntiUberHtml(item.tipo)
          const tempoSafe = escapeAntiUberHtml(item.tempo)
          const precoRaw = item.preco
          const precoLabel =
            typeof CurrencyFormat !== 'undefined'
              ? CurrencyFormat.formatBRL(precoRaw)
              : String(precoRaw)
          const tipoAttr = escapeAntiUberAttr(item.tipo)
          const tempoAttr = escapeAntiUberAttr(item.tempo)
          const precoAttr = escapeAntiUberAttr(precoRaw)
          return `
    <button type="button" class="anti-uber-item"
         data-tipo="${tipoAttr}"
         data-preco="${precoAttr}"
         data-tempo="${tempoAttr}">
      <span class="anti-uber-item__tipo">${tipoSafe}</span>
      <span class="anti-uber-item__preco">${escapeAntiUberHtml(precoLabel)}</span>
      <span class="anti-uber-item__tempo">${tempoSafe}</span>
    </button>
  `
        })
        .join('')
      if (!text) {
        element.innerHTML =
          '<p class="anti-uber-message">Nenhum preço disponível para exibir nesta consulta.</p>'
        return
      }
      element.innerHTML = text
    } catch (err) {
      console.error('Erro ao buscar preços:', err)
      document.getElementById('div-get-cookies').classList.remove('hidden')
      element.innerHTML =
        '<p class="anti-uber-message anti-uber-message--error" role="alert">Erro ao carregar valores. Tente novamente.</p>'
    } finally {
      setAntiUberSpinnerVisible(false)
      scheduleAntiUberScrollButtonsUpdate()
    }
  })
}

function whatIsTheTypeOfCustomer() {
  viewController.elementProperty.removeClass('.container-logo', 'active')
  viewController.elementProperty.removeClass('.history-trips', 'active')
}

function getDataCustomerByPartner() {
  viewController.elementProperty.removeClass('.footer-container-trip', 'active')
  updateBtnCallTripVisibility()
  viewController.elementProperty.removeClass('.container-logo', 'active')
  viewController.elementProperty.removeClass('.history-trips', 'active')
  viewController.elementProperty.addClass('.menu-close', 'black')

  Mask.setMaskPhone('#phoneAnotherCustomer')

  viewController.elementProperty.addEventInElement(
    '#openModalFindCustomer',
    'onclick',
    function () {
      viewController.elementProperty.addClass('.modal-find-customer', 'active')
      document.querySelector('#findCustomerBy').focus()
    }
  )
}

function calculatePriceAnotherCustomer() {
  const nameAnotherCustomer = document.getElementById('nameAnotherCustomer')
  const phoneAnotherCustomer = document.getElementById('phoneAnotherCustomer')

  if (nameAnotherCustomer.value.trim().length === 0) {
    SwalCustom.messageDialog(
      '',
      'Informe o nome do cliente',
      () => {
        nameAnotherCustomer.focus()
      },
      'info'
    )
    return
  }

  if (phoneAnotherCustomer.value.trim().length === 0) {
    SwalCustom.messageDialog(
      '',
      'Informe o telefone do cliente',
      () => {
        phoneAnotherCustomer.focus()
      },
      'info'
    )
    return
  }

  if (!validatePhoneAnotherCustomerTrip(phoneAnotherCustomer.value)) {
    SwalCustom.messageDialog(
      '',
      'Numero informado está inválido!',
      () => {
        phoneAnotherCustomer.focus()
      },
      'info'
    )
    return
  }

  viewController.elementProperty.removeClass('.menu-close', 'black')
  //calculatePriceCustomer("forAnother");
  initNewTrip()
}

function validatePhoneAnotherCustomerTrip(phone) {
  const regex =
    /^(?:(?:\+|00)?(55)\s?)?(?:\(?([1-9][0-9])\)?\s?)?(?:((?:9\d|[2-9])\d{3})\-?(\d{4}))$/
  return regex.test(phone)
}

function calculatePriceNoDestination(neighborhoodId = null) {
  viewController.elementProperty.removeClass('.container-menu', 'active')
  viewController.elementProperty.removeClass('.container-logo', 'active')

  const central = Session.get('centralSelected')

  const origin = {
    address: central.address,
    lat: parseFloat(central.latitude),
    lng: parseFloat(central.longitude),
  }

  trip.origin = {
    lat: parseFloat(central.latitude),
    lng: parseFloat(central.longitude),
  }

  trip.destination = {
    lat: parseFloat(central.latitude),
    lng: parseFloat(central.longitude),
  }

  const { customer } = Session.get('customerData')

  trip.customer = {
    id: customer.idCustomer,
    name: central.name,
    phone: customer.phone,
  }

  document.querySelector("*[place='origin']").value = central.address
  document.querySelector("*[place='destination']").value = central.address

  if (!neighborhoodId) {
    Route.startClassesInComponent(
      [{ component: '.footer-container-trip', class: 'no-destination' }],
      () => {
        viewController.elementProperty.removeClass('.footer-container-trip', 'no-destination')
      },
      COMPONENT_CREATE_TRIP
    )
  } else {
    viewController.elementProperty.removeClass('.footer-container-trip', 'no-destination')
    Route.startClassesInComponent(
      [],
      () => {
        viewController.elementProperty.removeClass('.footer-container-trip', 'no-destination')
      },
      COMPONENT_CREATE_TRIP
    )
  }

  priceTrip.showPriceTrip(origin, origin, [], [], false, true, neighborhoodId).then((data) => {
    checkOptionDefaultActive(data)

    managerTrip.prices = data.prices

    viewController.elementProperty.addEventInElement('.trip-type', 'onclick', getTaxiType)

    if (data.prices[0])
      if (data.prices[0].areaNeighborhood) mapService.showPolygon(data.prices[0].areaNeighborhood)

    //        showRoute([waypoints], data);
  })
}

function calculatePriceCustomer(typeCalculatePrice = 'forMe') {
  trip.typeCustomerInTrip = typeCalculatePrice

  const waypoints = Object.keys(trip.waypoints).map((item) => {
    return trip.waypoints[item]
  })

  getDriversFavorites()
  removePanelHistoryTrip()

  //document.getElementById("origin").disabled = true;
  //document.getElementById("destination").disabled = true;

  viewController.elementProperty.removeClass('.container-menu', 'active')
  viewController.elementProperty.removeClass('.container-logo', 'active')

  managerTrip.paymentFormIdSelected = showPaymentForm()

  priceTrip
    .showPriceTrip(trip.origin, trip.destination, waypoints, optimized, isOptimized)
    .then((data) => {
      checkOptionDefaultActive(data)
      managerTrip.prices = data.prices
      viewController.elementProperty.addEventInElement('.trip-type', 'onclick', getTaxiType)
      showRoute(waypoints, data)
    })
}

function getDriversFavorites() {
  getListFavorites().then((favorites) => {
    viewController.elementProperty.getElement('#listDriversFavorites', (element) => {
      element.innerHTML = favorites
        .map((driver) => {
          const isActive = Session.getLocal('driversNotSelected').includes(driver.idDriver)
            ? ''
            : 'active'

          return ` <li class="select-driver-favorite ${isActive}" value='${JSON.stringify(driver)}'>
                <div style="background-image: url('${environment.hosts.hostImageDriver}${driver.driverImage}')"></div>
                <span>
                    <span>${driver.driverName}</span>
                    <span>${driver.plate}</span>
                </span>
            </li>`
        })
        .join('')

      viewController.elementProperty.addEventInElement(
        '.select-driver-favorite',
        'onclick',
        function () {
          if (this.classList.contains('active')) {
            this.classList.remove('active')
            return
          }
          this.classList.add('active')
        }
      )
    })
  })
}

function checkOptionDefaultActive(data) {
  data.prices.map((object, index) => {
    if (index === 0) {
      if (document.querySelector('.trip-type') != null)
        document.querySelector('.trip-type').classList.add('active')

      managerTrip.typeTaxi.priceId = object.idPrice
      managerTrip.typeTaxi.price = parseFloat(object.price)
      managerTrip.typeTaxi.tripTypeId = object.tripTypeId
      managerTrip.typeTaxi.priceName = object.priceName
      managerTrip.typeTaxi.tripType = object.tripType
      managerTrip.typeTaxi.priceDynamicValue = object.priceDynamicValue
      if (object.centralNeighborhoodId) {
        managerTrip.typeTaxi.centralNeighborhoodId = object.centralNeighborhoodId
        managerTrip.typeTaxi.nameNeighborhood = object.nameNeighborhood
      } else {
        managerTrip.typeTaxi.centralNeighborhoodId = null
        managerTrip.typeTaxi.nameNeighborhood = null
      }
    }
  })
}

function showRoute(waypoints, { overview_polyline, duration }) {
  initCloseTrip()

  viewController.elementProperty.removeClass('.container-menu', 'active')

  viewController.elementProperty.getElement('.container-logo', (element) => {
    element.classList.add('remove')
  })
  viewController.elementProperty.getElement('#mapWrapper', (element) => {
    element.classList.add('active')
  })
  viewController.elementProperty.getElement('.btn-cancel-processing-trip', (element) => {
    element.classList.add('active')
  })
  viewController.elementProperty.getElement('.footer-container-trip', (element) => {
    element.classList.add('active')
    updateBtnCallTripVisibility()
  })

  // Garante que os marcadores existam (caso tenham sido limpos ao voltar da tela de preço)
  mapService.addPointClient(trip.origin)
  mapService.addPointDestination(trip.destination)
  mapService.showRoute(trip.origin, trip.destination, waypoints, overview_polyline.points)
  scheduleMapResize()

  mapService.addLegends(duration).then(() => {
    viewController.elementProperty.addEventInElement(
      '.container-destination',
      'onclick',
      function () {
        viewController.elementProperty.addClass('.container-menu', 'active')
        mapService.removePointDestination()
        trip.destination = null
        changeDestination()
        initCloseTrip()
        mapService.removeOnlyRoute()
      }
    )

    viewController.elementProperty.addEventInElement('.container-origin', 'onclick', function () {
      viewController.elementProperty.addClass('.container-menu', 'active')
      mapService.removePointClient()
      trip.origin = null
      changeOrigin()
      initCloseTrip()
      mapService.removeOnlyRoute()
    })
  })
}

function localSelected(place, input) {
  const existNumber = place.address_components.filter((data) => {
    return data.types.includes('street_number')
  })

  if (existNumber.length > 0) {
    getPoint(place, input.getAttribute('id'))
    return
  }

  SwalCustom.dialogConfirm(
    'Ops...',
    'Endereço informado não possui o número do local, deseja informa-lo para' +
      ' facilitar a localização do motorista ?',
    'info',
    {
      yes: {
        text: 'INCLUIR NÚMERO!',
        value: true,
      },
      no: {
        text: 'CONTINUAR',
        value: false,
      },
    }
  )
    .then(function () {
      switch (input.getAttribute('id')) {
        case 'origin': {
          trip.origin = null
          changeOrigin()
          break
        }
        case 'destination': {
          trip.destination = null
          changeDestination()
          break
        }
      }
    })
    .catch(function () {
      getPoint(place, input.getAttribute('id'))
    })
}

function localCurrent() {
  let userLoc = Session.getLocal('location')
  if (!userLoc) {
    const central = Session.get('centralSelected')
    if (central && !isNaN(parseFloat(central.latitude)) && !isNaN(parseFloat(central.longitude))) {
      userLoc = { lat: parseFloat(central.latitude), lng: parseFloat(central.longitude) }
    }
  }

  const applyLocation = (loc) => {
    trip.origin = loc
    mapService.addPointClient(trip.origin)
    mapService.getAddressByLatLng(trip.origin).then(getAddressCurrent)
  }

  if (userLoc) {
    applyLocation(userLoc)
  } else if (typeof navigator !== 'undefined' && navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude }
        Session.setLocal('location', loc)
        applyLocation(loc)
      },
      () => {
        if (typeof Position !== 'undefined' && Position.getPositionNetwork) {
          Position.getPositionNetwork().then((res) => {
            if (res && res.loc) {
              const parts = res.loc.split(',')
              const loc = { lat: parseFloat(parts[0]), lng: parseFloat(parts[1]) }
              Session.setLocal('location', loc)
              applyLocation(loc)
            }
          })
        }
      },
      { enableHighAccuracy: true, timeout: 8000 }
    )
  }

  viewController.elementProperty.addEventInElement('#origin', 'onblur', function () {
    setTimeout(function () {
      if (trip.origin === null) return

      mapService.getAddressByLatLng(trip.origin).then(getAddressCurrent)
    }, 1500)
  })
}

const managerPlaceStop = {
  amount: 0,
}

viewController.elementProperty.addEventInElement('.add-place-stop', 'onclick', function () {
  //if (managerPlaceStop.amount === trip.amountWaypoints)
  //    return;

  const code = new Date().getTime()

  trip.waypoints[code] = null

  trip.amountWaypoints++

  // if (managerPlaceStop.amount === trip.amountWaypoints)
  //     this.style.display = "none";

  $('#containerInputDestination').before(`<div id="place${code}" class="container-waypoint-search">
                    <input type="text"
                           class="col s12 input-custom select-type-place"
                           readonly
                           place="waypoint-${code}"
                           autocomplete="off"
                           placeholder="Para onde ?">
                    <i class="material-icons remove-waypoint" value="${code}" for="waypoint-${code}">close</i>
                </div>`)

  initEventSearchPlace()
})

function searchByPlace(placeType) {
  viewController.elementProperty.getElement('.search-address-location', (element) => {
    mapService.addSearchInInput(
      element,
      ({ status, data: response }) => {
        if (!response) return updateInfoPlaces()

        if (response == null)
          return viewController.elementProperty.addClass('#containerCustomerPlaces', 'empty')

        showCustomerBySearching(response, placeType)
      },
      () => {
        // trip[Session.getLocal("currentInputAddress")] = null;
        viewController.elementProperty.removeClass('#containerCustomerPlaces', 'empty')
        document.getElementById('containerCustomerPlaces').innerHTML = ''
      }
    )
  })
}

function initEventSearchPlace() {
  viewController.elementProperty.addEventInElement('.select-type-place', 'onclick', function () {
    viewController.elementProperty.addClass('.container-search-local', 'active')
    updateBtnCallTripVisibility()
    Session.setLocal('getPositionPlaceSelected', this.getAttribute('place'))
    searchByPlace(this.getAttribute('place'))
    viewController.elementProperty.getElement('.search-address-location', (element) => {
      setTimeout(() => element.focus(), 300)
    })
  })

  viewController.elementProperty.addEventInElement(
    '#btnCalculatePriceByPlaces',
    'onclick',
    function () {
      validateLocales()
    }
  )

  viewController.elementProperty.addEventInElement('.remove-waypoint', 'onclick', function () {
    const code = this.getAttribute('value')
    const toRemove = notOptimized.find((res) => res.pathTrip === code)
    if (toRemove) {
      const objetIndex = notOptimized.indexOf(toRemove)
      notOptimized.splice(objetIndex, 1)
      bestRoute()
    }

    viewController.elementProperty.getElement(`#place${code}`, (element) => {
      element.remove()
      delete trip.waypoints[code]
      trip.amountWaypoints--
      viewController.elementProperty.getElement('.add-place-stop', (element) => {
        element.style = ''
      })
    })
  })

  viewController.elementProperty.addEventInElement('.clear-input', 'onclick', ({ srcElement }) => {
    clearFieldAddressById(srcElement.getAttribute('for'))
  })

  viewController.elementProperty.addEventInElement('#swapAddressBtn', 'onclick', function (event) {
    event.stopPropagation()
    swapOriginDestination()
  })
  //viewController.elementProperty.addEventInElement(".search-address-location", "oninput", verifyFieldAddress);
  viewController.elementProperty.addEventInElement(
    '.search-address-location',
    'onfocus',
    showPanelHistoryTrip
  )
}

function validateAddressWayPoints() {
  let address = document.querySelector("*[place='origin']").value

  for (let index in trip.waypoints) {
    const waypoint = trip.waypoints[index]

    if (waypoint === null) {
      address = false
      continue
    }

    if (address === waypoint.address && address) return false

    address = waypoint.address
  }
  const lastIndex = optimized.length - 1
  const destination = isOptimized
    ? optimized[lastIndex].address
    : document.querySelector("*[place='destination']").value

  return !(destination === address && address)
}

function showCustomerBySearching(data, placeType) {
  viewController.elementProperty.getElement('#containerCustomerPlaces', (element) => {
    element.innerHTML = data
      .map((place) => {
        return `<li class="local-trip-customer customer-place"
                        place='${JSON.stringify(place)}'>
                            <i class="material-icons">place</i>
                            <div>
                                <span>${place.address}</span>
                                <label>${place.neighborhood || ''}</label>
                            </div>
                        </li>`
      })
      .join('')

    viewController.elementProperty.addEventInElement('.customer-place', 'onclick', function () {
      showPanelHistoryTrip()

      const placeSelected = JSON.parse(this.getAttribute('place'))

      //  document.getElementById(Session.get("lastInputSearch")).value = placeSelected.address;

      document.querySelector(`*[place=${placeType}]`).value = placeSelected.address

      if (placeSelected.latitude && placeSelected.longitude) {
        Session.setLocal(`neighborhood-${placeType}`, placeSelected.neighborhood || '')
        Session.setLocal(`city-${placeType}`, placeSelected.cityId)
        return getPoint(placeSelected, placeType)
      }

      mapService
        .getDetailPlace(placeSelected.address)
        .then(({ data: placeDetail, status, message }) => {
          if (!status)
            return SwalCustom.messageDialog(
              '',
              message,
              () => {
                let input = document.querySelector(`#${Session.get('lastInputSearch')}`)
                input.select()
                input.focus()
              },
              'info'
            )

          Session.set(
            `neighborhood-${Session.get('lastInputSearch')}`,
            placeDetail.neighborhood || ''
          )

          placeSelected.neighborhood = placeDetail.neighborhood

          placeSelected.latitude = placeDetail.latitude
          placeSelected.longitude = placeDetail.longitude

          getPoint(placeSelected, placeType)
        })
    })
  })
}
