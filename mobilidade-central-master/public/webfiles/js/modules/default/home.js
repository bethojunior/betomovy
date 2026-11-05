const idCentral = Session.getValueInSession('centralSelected', 'id')
let dynamicFieldsResponse = null

function getTripStatusBadgeClass(status) {
  if (status === 'Finalizada') return 'trip-status-badge trip-status-badge--success'
  if (status === 'Cancelada') return 'trip-status-badge trip-status-badge--danger'
  if (status === 'Em viagem') return 'trip-status-badge trip-status-badge--info'
  if (status === 'Embarcando') return 'trip-status-badge trip-status-badge--warning'
  return 'trip-status-badge trip-status-badge--muted'
}

document.addEventListener('DOMContentLoaded', function () {
  window.userLogged = Session.get('user')
  window.mapService = new MapService()
  window.searchTripProgress = new Progress()
  window.priceTrip = new PriceTrip()

  const elementProperty = new ElementProperty()
  const driverRepository = new DriverRepository()

  window.managerTrip = {
    zones: null,
    paymentFormIdSelected: null,
    typeTaxi: {
      tripTypeId: null,
      price: null,
      oldPrice: null,
    },
    tripCurrent: null,
    timeOut: null,
    inTrip: false,
    isSearch: false,
    prices: [],
  }

  window.trip = {
    origin: null,
    destination: null,
    waypoints: [],
    amountWaypoints: 0,
    typeCustomerInTrip: 'forMe',
    customer: null,
  }

  //getCustomerPlace();

  getDataCustomer()

  loadingScriptMap()

  getUpdateTrip()

  updateLocation()

  getConfigCentral(Session.get('centralSelected'))

  initEvents()

  getItemsTripDelivery()

  // Carregar e configurar botões de tipos de chamada
  loadCentralCallTypes()

  updateCards();

  setCetralSessionNotifierInLocalStorage()
  setAppNameInLocalStorage()

  function setAppNameInLocalStorage() {
    const appName = WhatsappSession.resolveAppNameFromHostname(window.location.hostname)
    if (!appName) {
      return
    }
    localStorage.setItem('appName', appName)
  }

  function loadingScriptMap() {
    mapService
      .importScriptWithPlaces()
      .then(() => {
        elementProperty.removeClass('.container-connection-internet', 'active')
        initLoadMap()
        initPositionDrivers()
      })
      .catch((error) => {
        setTimeout(loadingScriptMap, 1500)
      })
  }

  function updateLocation() {
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        function (pos) {
          if (pos && pos.coords) {
            const lat = pos.coords.latitude
            const lng = pos.coords.longitude
            Session.setLocal('location', { lat, lng })
          }
        },
        function (err) {
          console.warn('Geolocation browser error or permission denied:', err)
          if (typeof Position !== 'undefined' && Position.getPositionNetwork) {
            Position.getPositionNetwork()
              .then(function (res) {
                if (res && res.loc) {
                  const parts = res.loc.split(',')
                  const lat = parseFloat(parts[0])
                  const lng = parseFloat(parts[1])
                  if (!isNaN(lat) && !isNaN(lng)) {
                    Session.setLocal('location', { lat, lng })
                  }
                }
              })
              .catch(function (e) {
                console.warn('IP location fallback failed:', e)
              })
          }
        },
        { maximumAge: 10000, timeout: 8000, enableHighAccuracy: true }
      )
    }
  }

  function isBadMapCoord(lat, lng) {
    if (isNaN(lat) || isNaN(lng) || (lat === 0 && lng === 0)) return true
    // Apenas coordenadas inválidas ou resquício legado de Fortaleza
    if (Math.abs(lat - -3.7319) < 0.0002 && Math.abs(lng - -38.5267) < 0.0002) return true
    return false
  }

  function initLoadMap() {
    let centralSelected = Session.get('centralSelected')

    if (!centralSelected) {
      const centrals = Session.get('centrals')
      if (Array.isArray(centrals) && centrals.length > 0) {
        centralSelected = centrals[0].central || centrals[0]
        Session.set('centralSelected', centralSelected)
      }
    }

    if (!centralSelected) return setTimeout(initLoadMap, 1500)

    const browserLoc = Session.getLocal('location')
    const centralLat = parseFloat(centralSelected.latitude)
    const centralLng = parseFloat(centralSelected.longitude)

    const openAt = (lat, lng) => initMap({ lat, lng })

    if (browserLoc && !isBadMapCoord(parseFloat(browserLoc.lat), parseFloat(browserLoc.lng))) {
      openAt(parseFloat(browserLoc.lat), parseFloat(browserLoc.lng))
      return
    }

    if (!isBadMapCoord(centralLat, centralLng)) {
      openAt(centralLat, centralLng)
    }

    // Pede localização GPS do navegador em alta precisão e recentraliza
    if (typeof navigator !== 'undefined' && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        function (pos) {
          const lat = pos.coords.latitude
          const lng = pos.coords.longitude
          Session.setLocal('location', { lat, lng })
          if (mapService && mapService.map) {
            mapService.map.setCenter([lng, lat])
            if (mapService.pointCenter) mapService.pointCenter.setLngLat([lng, lat])
          } else {
            openAt(lat, lng)
          }
        },
        function () {
          if (isBadMapCoord(centralLat, centralLng) && !(mapService && mapService.map)) {
            // Fallback padrão MOVY USA (Saugus / Boston, MA)
            openAt(42.4334, -71.0119)
          }
        },
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 5000 }
      )
      return
    }

    if (!(mapService && mapService.map)) {
      openAt(isBadMapCoord(centralLat, centralLng) ? 42.4334 : centralLat, isBadMapCoord(centralLat, centralLng) ? -71.0119 : centralLng)
    }
  }

  function initMap(position) {
    mapService.initMap('mapClient', position, function () {
      document.getElementById('mapClient')?.classList.remove('map-loading')

      // Botões de zoom customizados
      document.getElementById('mapZoomIn')?.addEventListener('click', () => mapService.zoomIn())
      document.getElementById('mapZoomOut')?.addEventListener('click', () => mapService.zoomOut())

      elementProperty.getElement('#preload-return', (element) => {
        element.style.display = 'none'
      })

      // Configurar listeners do WhatsApp após inicialização do mapa
      setupWhatsAppListeners()
    })
  }

  function loadCentralCallTypes() {
    const bindCallButtons = (items) => {
      const btnFindCustomer = document.querySelector('#openModalFindCustomer')
      const btnCallToCentral = document.querySelector('#callToCentral')
      const btnFindDriver = document.querySelector('#openModalFindDriver')
      if (!btnFindCustomer || !btnCallToCentral || !btnFindDriver) return

      let list = Array.isArray(items) ? items : (items?.data || [])
      let hasActive = list.some((it) => it.isActive == true || it.isActive == 1)
      if (!hasActive || list.length === 0) {
        list = [
          { centralCallTypeId: 1, isActive: true },
          { centralCallTypeId: 2, isActive: true },
          { centralCallTypeId: 3, isActive: true },
        ]
      }

      btnFindCustomer.style.display = 'none'
      btnCallToCentral.style.display = 'none'
      btnFindDriver.style.display = 'none'

      list.forEach((item) => {
        if (item.centralCallTypeId === 1 && (item.isActive == true || item.isActive == 1)) {
          btnFindCustomer.style.display = 'inline-flex'
          btnFindCustomer.innerHTML = 'PROCURAR CLIENTE'
          btnFindCustomer.onclick = function () {
            clearOptimized()
            document.querySelector('.modal-find-customer')?.classList.add('active')
          }
        }
        if (item.centralCallTypeId === 2 && (item.isActive == true || item.isActive == 1)) {
          btnCallToCentral.style.display = 'inline-flex'
          btnCallToCentral.innerHTML = 'CHAMAR PARA CENTRAL'
          btnCallToCentral.onclick = function () {
            DynamicFieldsController.get(idCentral).then((response) => {
              dynamicFieldsResponse = response
            })
            trip.customer = null
            initProcessingCallTrip(false)
            updateBtnCallTripVisibility()
            viewController.elementProperty.removeClass('.trip-item ', 'active')
            viewController.elementProperty.removeClass('.list-trips-active-partner', 'active')
            $('#modalChoiceTax').modal('show')
          }
        }
        if (item.centralCallTypeId === 3 && (item.isActive == true || item.isActive == 1)) {
          btnFindDriver.style.display = 'inline-flex'
          btnFindDriver.innerHTML = 'PROCURAR MOTORISTA'
          btnFindDriver.onclick = function () {
            clearOptimized()
            getPlaceCustomer()
          }
        }
      })
      updateBtnCallTripVisibility()
    }

    CentralController.getAllCentralCallTypes()
      .then((res) => {
        const payload = res?.response ?? res?.data ?? res
        bindCallButtons(payload)
      })
      .catch((err) => {
        console.warn('getAllCentralCallTypes error, fallback to default:', err)
        bindCallButtons([
          { centralCallTypeId: 1, isActive: true },
          { centralCallTypeId: 2, isActive: true },
          { centralCallTypeId: 3, isActive: true },
        ])
      })
      .finally(() => {
        preload(false)
      })
  }

  function initEvents() {
    initEventSearchPlace()

    elementProperty.addEventInElement('#choicePaymentTrip', 'onclick', openPaymentForm)
    elementProperty.addEventInElement('.close-payment-form', 'onclick', closePaymentForm)
    elementProperty.addEventInElement('.option-trip', 'onclick', toggleOptionMenu)

    elementProperty.addEventInElement('#close-modal-central', 'onclick', function () {
      updateBtnCallTripVisibility()
    })
    elementProperty.addEventInElement('#close-modal-neighborhood', 'onclick', function () {
      updateBtnCallTripVisibility()
    })
    elementProperty.addEventInElement('#btnNeighborhoodCancel', 'onclick', function () {
      updateBtnCallTripVisibility()
    })

    // Inicializar formas de pagamento e eventos relacionados
    getPaymentForm(function () {
      elementProperty.addEventInElement('.payment-form-trip', 'onclick', function () {
        managerTrip.paymentFormIdSelected = getPaymentFormSelect(this)
      })
    })

    // Configurar eventos dos botões do modal
    elementProperty.addEventInElement('#btnRouteOption', 'onclick', function () {
      document.querySelector('.add-place-stop').removeAttribute('hidden')
      Session.set('neighborhoodRides', '0')
      $('#modalChoiceTax').modal('hide')
      calculatePriceNoDestination()
    })

    elementProperty.addEventInElement('#btnNeighborhoodOption', 'onclick', function () {
      $('#modalChoiceTax').modal('hide')
      const key = localStorage.getItem('neighborhoodRidesStatus')

      if (key == '1') {
        Session.set('neighborhoodRides', '1')
        document.querySelector('.add-place-stop').setAttribute('hidden', 'true')
        return getPlaceCustomer()
      }
      Session.set('neighborhoodRides', '0')
      preload(true)
      let central = Session.get('centralSelected')
      NeighborhoodController.listNeighborhood(central.latitude, central.longitude).then(
        ({ response }) => {
          preload(false)
          document.querySelector('#neighborhoodSelect').innerHTML = response
            .map((item) => {
              return `<option value="${item.id}">${item.name.toUpperCase()}</option>`
            })
            .join('')
          $('#modalNeighborhood').modal('show')
        }
      )

      elementProperty.addEventInElement('#btnNeighborhoodSelected', 'onclick', function () {
        $('#modalNeighborhood').modal('hide')
        calculatePriceNoDestination(document.querySelector('#neighborhoodSelect').value)
      })
    })

    elementProperty.addEventInElement('.btn-search-trip', 'onclick', function () {
      const paymentForm = Session.getLocal('paymentForm')
      document.querySelector('#haveReturnTrip').checked = false

      Session.set('customTripList', JSON.stringify([]))

      if (Array.isArray(paymentForm)) {
        SwalCustom.messageDialog('', 'Informe a forma de pagamento', undefined, 'info')
        return
      }
      const distanceTrip = Session.getLocal('distanceTrip')

      preload(true)
      getFee()

      if (
        paymentForm.paymentFormTypeId === PAYMENT_VOUCHER_CENTRAL &&
        parseFloat(this.getAttribute('balanceTrip')) < parseFloat(managerTrip.typeTaxi.price)
      ) {
        return SwalCustom.messageDialog(
          'Compre mais créditos para fazer viagens nesse modo de pagamento',
          'Você não tem saldo em voucher suficiente',
          undefined,
          'info'
        )
      }
    })

    elementProperty.addEventInElement('#call-custom-trip', 'onclick', function () {
      const paymentForm = Session.getLocal('paymentForm')
      document.querySelector('#haveReturnTrip').checked = false

      if (Array.isArray(paymentForm)) {
        SwalCustom.messageDialog('', 'Informe a forma de pagamento', undefined, 'info')
        return
      }

      if (
        paymentForm.paymentFormTypeId === PAYMENT_VOUCHER_CENTRAL &&
        parseFloat(this.getAttribute('balanceTrip')) < parseFloat(managerTrip.typeTaxi.price)
      ) {
        return SwalCustom.messageDialog(
          'Compre mais créditos para fazer viagens nesse modo de pagamento',
          'Você não tem saldo em voucher suficiente',
          undefined,
          'info'
        )
      }
      getFee()
    })

    elementProperty.addEventInElement('#cancelTrip', 'onclick', function (e) {
      if (e && e.stopPropagation) e.stopPropagation();
      const response = Session.get('timeArrivalDriver') || { text: 'alguns minutos' }

      const doCancel = (msg) => {
        elementProperty.getElement('#messageCancelTrip', (element) => {
          element.innerHTML = msg || 'Deseja realmente cancelar esta corrida com o motorista?'
        })
        cancelSearchTrip()
      }

      const tripRef = managerTrip?.tripCurrent?.tripReference || Session.getLocal('tripReference')
      if (tripRef && typeof CustomerController !== 'undefined' && CustomerController.checkCancellationFee) {
        CustomerController.checkCancellationFee(tripRef)
          .then(({ status, data }) => {
            if (data == null) {
              doCancel(`O motorista está a ${response.text || 'alguns minutos'} de você !`)
            } else {
              doCancel(data?.type?.description || 'Deseja realmente cancelar esta corrida?')
            }
          })
          .catch((err) => {
            console.warn('[cancelTrip] checkCancellationFee failed, opening cancel confirmation:', err)
            doCancel()
          })
      } else {
        doCancel()
      }
    })

    elementProperty.addEventInElement('#zoomInRoute', 'onclick', function () {
      mapService.focusInRoute()
    })
  }

  window.initNewTrip = function (travelAgain = false, customer, renewTrip = false) {
    const fee = Session.getLocal('paidByCentral')
    const haveReturn = document.querySelector('#haveReturnTrip').checked

    const feeSpan = document.getElementById('feeSpan')
    const finalPrice = document.getElementById('finalPriceSpan')

    const waypoints = Object.keys(trip.waypoints).map((item) => {
      const waypoint = trip.waypoints[item]

      waypoint.latitude = waypoint.lat
      waypoint.longitude = waypoint.lng

      return waypoint
    })

    feeSpan.style.display = 'none'
    finalPrice.style.display = 'none'

    elementProperty.addEventInElement('#haveReturnTrip', 'onclick', function () {
      const checkReturn = document.querySelector('#haveReturnTrip').checked

      if (checkReturn && fee.paidByCentral) {
        feeSpan.style.display = ''
        finalPrice.style.display = ''
        return (newTrip.price = fee.newPrice)
      }

      feeSpan.style.display = 'none'
      finalPrice.style.display = 'none'
      return (newTrip.price = managerTrip.typeTaxi.price)
    })

    const cityConfig = Session.getLocal('cityConfig')

    if (customer == null) {
      customer = { name: userLogged.name, phone: userLogged.phone }
    } else {
      Session.setLocal('clientName', customer.name)
    }

    let schedules = null

    if (SchedulePicker.isActive()) {
      schedules = SchedulePicker.getSchedules()

      if (!schedules) {
        SwalCustom.messageDialog(
          'Selecione ao menos uma data e informe o horário para agendar a viagem',
          'Atenção',
          undefined,
          'warning'
        )
        return
      }
    }

    const newTrip = !travelAgain
      ? {
          userId: parseInt(userLogged.idUser),
          tripTypeId: managerTrip.typeTaxi.tripTypeId,
          tripPaymentFormId: managerTrip.paymentFormIdSelected,
          centralId: Session.getValueInSession('centralSelected', 'id'),
          origin: {
            address: document.querySelector("*[place='origin']").value,
            latitude: trip.origin.lat,
            longitude: trip.origin.lng,
            neighborhood: trip.origin.neighborhood,
            cityId: cityConfig.cityId,
          },
          destination: {
            address:
              managerTrip.typeTaxi.nameNeighborhood ??
              document.querySelector("*[place='destination']").value,
            latitude: trip.destination.lat,
            longitude: trip.destination.lng,
            neighborhood: trip.origin.neighborhood,
            cityId: cityConfig.cityId,
          },
          priceId: managerTrip.typeTaxi.priceId,
          price: managerTrip.typeTaxi.price,
          cityId: cityConfig.cityId,
          waypoints,
          distance: (function(val) {
            if (!val) return 0;
            const num = parseFloat(String(val).replace(',', '.'));
            return isNaN(num) ? 0 : num;
          })(Session.getLocal('distanceTrip')),
          estimatedTripTime: (function(val) {
            if (!val) return 0;
            const num = parseFloat(String(val).replace(',', '.'));
            return isNaN(num) ? 0 : num;
          })(Session.getLocal('estimatedTripTime')),
          multiplierDynamic: managerTrip.typeTaxi.priceDynamicValue,
          isOpenPriceTrip:
            (document.querySelector('.footer-container-trip').classList.contains('no-destination') ||
            managerTrip.typeTaxi.centralNeighborhoodId != null) ? 1 : 0,
          haveReturn: haveReturn ? 1 : 0,
          paidByCentral: fee.paidByCentral,
          schedules: schedules,
        }
      : travelAgain

    Session.setLocal('managerTrip', managerTrip)

    if (fee) {
      let typeMoney = '$'
      try {
        const config = JSON.parse(localStorage.getItem('cityConfig')) || Session.getLocal('cityConfig')
        if (config && config.typeMoney) typeMoney = config.typeMoney
      } catch (e) {
        const config = Session.getLocal('cityConfig')
        if (config && config.typeMoney) typeMoney = config.typeMoney
      }
      document.getElementById('returnFee').innerHTML =
        `${typeMoney} ${Mask.maskMoney(fee.feePrice)} ${fee.isByKm ? 'x Km' : 'Fixo'}`
      document.getElementById('finalPrice').innerHTML =
        `${typeMoney} ${Mask.maskMoney(fee.newPrice)}`
    }

    if (haveReturn) {
      feeSpan.style.display = ''
      finalPrice.style.display = ''
    } else {
      feeSpan.style.display = 'none'
      finalPrice.style.display = 'none'
    }

    if (managerTrip.typeTaxi.centralNeighborhoodId) {
      newTrip['centralNeighborhoodId'] = managerTrip.typeTaxi.centralNeighborhoodId
    }

    if (typeof isPaymentFormCard === 'function' ? isPaymentFormCard(newTrip.tripPaymentFormId) : (parseInt(newTrip.tripPaymentFormId) === PAYMENT_CARD_CREDIT || parseInt(newTrip.tripPaymentFormId) === 18)) {
      const tokenCard = Session.get('tokenCard') || Session.getLocal('tokenCard')
      const mpToken = tokenCard?.token || Session.getValueInSession('tokenCard', 'token')
      const cardId = tokenCard?.cardId || Session.getValueInSession('tokenCard', 'cardId')
      if (!cardId) {
        SwalCustom.messageDialog('', 'Selecione ou adicione um cartão para pagar com Stripe.', undefined, 'warning')
        if (typeof choiceCard === 'function') choiceCard()
        return
      }
      newTrip['mpToken'] = mpToken
      newTrip['cardId'] = cardId
    }

    Session.setLocal('lastTrip', newTrip)
    const favoriteDriversRaw = Session.get('customTripList')
    const favoriteDrivers = Array.isArray(favoriteDriversRaw)
      ? favoriteDriversRaw
      : (typeof favoriteDriversRaw === 'string' && favoriteDriversRaw
          ? (() => { try { const p = JSON.parse(favoriteDriversRaw); return Array.isArray(p) ? p : []; } catch (e) { return []; } })()
          : [])

    newTrip.favoriteDrivers = SchedulePicker.isActive() && ScheduleDriverPool.isActive()
      ? ScheduleDriverPool.getSelectedDriverIds()
      : (favoriteDrivers.length > 0 ? favoriteDrivers : [])

    const drivers = getDriverSelectFavorites()

    newTrip.favorites = drivers.length === 0 ? null : drivers

    if (renewTrip) {
      checkTypeCustomerByTrip(newTrip)
      return
    }

    if (managerTrip.typeTaxi.tripType !== undefined) {
      if (dynamicFieldsResponse?.response?.length > 0) {
        return showInfoCentral(newTrip, customer)
      }
    }

    if (newTrip.deliveryInfo == null)
      if (managerTrip.typeTaxi != null)
        if (managerTrip.typeTaxi.tripType != null)
          if (managerTrip.typeTaxi.tripType.deliveryOption == true)
            return showInfoDelivery(newTrip, customer)

    getTravelCustomer(newTrip, customer)

    if (haveReturn) {
      newTrip.price = fee.newPrice
    }
  }

  function getDriverSelectFavorites() {
    const drivers = []
    const driversNotSelected = []

    viewController.elementProperty.getElement('.select-driver-favorite', (element) => {
      const driver = JSON.parse(element.getAttribute('value'))

      if (element.classList.contains('active')) {
        drivers.push(driver.idDriver)
      } else {
        driversNotSelected.push(driver.idDriver)
      }
    })

    Session.setLocal('driversNotSelected', driversNotSelected)

    return drivers
  }

  window.checkTypeCustomerByTrip = (newTrip) => {
    Route.removeGroupComponent(COMPONENT_CREATE_TRIP)
    viewController.elementProperty.removeClass('.footer-schedule-form', 'active')
    newAnotherTripCustomer(newTrip)
    $('#drivers-active-modal').modal('hide')
  }

  window.newTripCustomer = function (newTrip) {
    initTrip(newTrip)
      .then(({ status, data, message, response }) => {
        elementProperty.removeClass('.container-connection-internet', 'active')
        Session.setLocal('dateInitTrip', DateCustom.getNow())
        sortTimePhrase()

        if (!status) {
          viewController.elementProperty.removeClass('.search-driver-in-trip', 'active')
          updateBtnCallTripVisibility()
          const messages = Object.values(response || {}).flat()
          const messagesFormated = messages.join('\n')

          SwalCustom.messageDialog(messagesFormated, message, undefined, 'warning')
          return
        }
        Session.setLocal('tripReference', data.tripReference)

        //managerTrip.isSearch = true;
        initSearchTrip(data)

        SchedulePicker.reset()
        ScheduleDriverPool.reset()
      })
      .catch((error) => {
        elementProperty.addClass('.container-connection-internet', 'active')
        setTimeout(function () {
          initNewTrip(newTrip)
        }, 5000)
      })
  }

  window.newAnotherTripCustomer = function (newTrip) {
    viewController.elementProperty.getElement('#nextCalculatePriceAnotherCustomer', (element) => {
      element.disabled = true
    })

    if (!validateTrip(newTrip)) return

    viewController.elementProperty.addClass('.container-preload-main', 'active')

    const isBatchSchedule = Array.isArray(newTrip.schedules) && newTrip.schedules.length > 0

    const request = isBatchSchedule
      ? TripRepository.newTripScheduledBatch(newTrip)
      : TripRepository.newTrip(newTrip)

    request
      .then(({ status, response, message }) => {
        elementProperty.removeClass('.container-connection-internet', 'active')
        Session.setLocal('dateInitTrip', DateCustom.getNow())
        sortTimePhrase()

        if (!status) {
          viewController.elementProperty.removeClass('.search-driver-in-trip', 'active')
          updateBtnCallTripVisibility()
          const messages = Object.values(response || {}).flat()
          const messagesFormated = messages.join('\n')

          SwalCustom.messageDialog(messagesFormated, message, undefined, 'warning')
          return
        }

        if (isBatchSchedule) {
          SchedulePicker.showResult(response)
          SchedulePicker.reset()
          ScheduleDriverPool.reset()
          closeTripSearchPanel()
          return
        }

        Session.setLocal('tripReference', response.tripReference)

        if (newTrip && newTrip.tripCustomer && newTrip.tripCustomer.phone) {
          try {
            dispatchMessageWhatsApp(newTrip.tripCustomer.phone, response.tripReference)
          } catch (wppErr) {
            console.warn('Erro ao disparar WhatsApp:', wppErr)
          }
        }

        try {
          initSearchTrip(response)
        } catch (searchErr) {
          console.error('Erro ao inicializar busca de viagem:', searchErr)
        }

        try {
          verifyListTripActivePartner()
        } catch (activeErr) {
          console.error('Erro ao atualizar viagens ativas:', activeErr)
        }

        try {
          trip.customer = null
          SchedulePicker.reset()
          ScheduleDriverPool.reset()
        } catch (resetErr) {
          console.warn('Erro ao resetar formulário de agendamento:', resetErr)
        }
      })
      .catch((error) => {
        viewController.elementProperty.removeClass('.search-driver-in-trip', 'active')
        updateBtnCallTripVisibility()
        console.error('Erro na criação da viagem:', error)
        let errMsg = 'Não foi possível confirmar a criação da(s) viagem(ns). Verifique sua conexão e confira em Viagens Ativas antes de tentar novamente.';
        if (error) {
          if (typeof error === 'string') {
            errMsg = error;
          } else if (error.message) {
            errMsg = error.message;
          } else if (error.response && error.response.message) {
            errMsg = error.response.message;
          } else if (error.data && error.data.message) {
            errMsg = error.data.message;
          }
        }
        SwalCustom.messageDialog(
          errMsg,
          'Atenção',
          undefined,
          'warning'
        )
      })
      .finally(() => {
        viewController.elementProperty.removeClass('.container-preload-main', 'active')
        viewController.elementProperty.getElement(
          '#nextCalculatePriceAnotherCustomer',
          (element) => {
            element.disabled = false
          }
        )
      })
  }

  window.customerOnTripExpired = function () {
    selectAnotherTypeDriver(userLogged).then(() => {
      //initProcessingCallTrip();
      // callAgainTrip();
    })
    searchTripProgress.stopProgress()
  }

  function toggleOptionMenu() {
    if (this.classList.contains('active')) {
      this.classList.remove('active')
      return
    }
    this.classList.add('active')
  }

  elementProperty.addEventInElement('#shareTripApp', 'onclick', shareTripCustomer)
  elementProperty.addEventInElement('.share-trip-customer', 'onclick', shareTripCustomer)

  function shareTripCustomer() {
    /*window.plugins.socialsharing.shareWithOptions({
            message: "Estou indo de Return, placa " +
                managerTrip.tripCurrent.driver.car.plate + " com motorista " +
                managerTrip.tripCurrent.driver.nickname + ", Clique e acompanhe a minha corrida.\n",
            subject: 'Return',
            url: `${environment.hosts.hostSite}trip/${managerTrip.tripCurrent.tripReference}`,
        }, (result) => {
        }, (error) => {
        });*/
  }

  function updateCards() {
    new CustomerCardController().get().then(({ status, data }) => {
      if (!status) return

      Session.setLocal('cards', data)
    })
  }

  function getDataCustomer() {
    new CustomerController().find(userLogged.idUser).then((response) => {
      if (response.status) {
        Session.set('customerData', response.response)
      }
    })
  }

  function getFee() {
    const distanceTrip = Session.getLocal('distanceTrip')
    TripController.getFee().then((res) => {
      preload(false)
      if (res && res.status && res.response) {
        const returnFee = Number(res.response?.returnFee || 0)
        const fee = res.response?.isByKm
          ? (distanceTrip / 1000) * returnFee * 1000
          : returnFee
        const currentPrice = Number(managerTrip.typeTaxi?.price || 0)
        const newPrice = Number(currentPrice + fee).toFixed(2)
        paidByCentral = {
          paidByCentral: res.response?.paidByCentral,
          newPrice: Number(newPrice),
          feePrice: returnFee,
          isByKm: res.response?.isByKm,
        }
        Session.setLocal('paidByCentral', paidByCentral)
      } else {
        paidByCentral = {
          paidByCentral: false,
          newPrice: Number(managerTrip.typeTaxi?.price || 0),
          feePrice: 0,
          isByKm: false,
        }
        Session.setLocal('paidByCentral', paidByCentral)
      }

      if (document.querySelector('#haveReturnTrip')) {
        document.querySelector('#haveReturnTrip').checked = false
      }
      initNewTrip(false, trip.customer)
    }).catch(() => {
      preload(false)
      paidByCentral = {
        paidByCentral: false,
        newPrice: Number(managerTrip.typeTaxi?.price || 0),
        feePrice: 0,
        isByKm: false,
      }
      Session.setLocal('paidByCentral', paidByCentral)
      if (document.querySelector('#haveReturnTrip')) {
        document.querySelector('#haveReturnTrip').checked = false
      }
      initNewTrip(false, trip.customer)
    })
  }

  const NET_REVENUE_PERCENTAGE = 0.7

  let monitoringData = {
    trips: {
      finished: [],
      canceled: [],
      in_progress: [],
      not_answered: [],
      scheduled: [],
      boarding: [],
      total: 0,
    },
    drivers: {
      available: 0,
      occupied: 0,
      total: 0,
    },
  }
  let lastUpdateTime = new Date()

  function formatCurrency(value) {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value)
  }

  function calculateStatistics(data) {
    const trips = data.trips || {}

    const totalTrips = trips.total || 0
    const finishedCount = trips.finished?.length || 0
    const canceledCount = trips.canceled?.length || 0
    const inProgressCount = trips.in_progress?.length || 0
    const boardingCount = trips.boarding?.length || 0
    const acceptedTrips = inProgressCount + boardingCount

    let canceledByDriver = 0
    let canceledByCustomer = 0

    if (trips.canceled && Array.isArray(trips.canceled)) {
      trips.canceled.forEach((trip) => {
        if (trip.canceledBy === 'driver' || trip.cancelledBy === 'driver') {
          canceledByDriver++
        } else if (trip.canceledBy === 'customer' || trip.cancelledBy === 'customer') {
          canceledByCustomer++
        } else {
          canceledByDriver++
        }
      })
    }

    if (canceledByDriver === 0 && canceledByCustomer === 0 && canceledCount > 0) {
      canceledByDriver = canceledCount
    }

    const notAnsweredCount = trips.not_answered?.length || 0

    let totalRevenue = 0
    if (trips.finished && Array.isArray(trips.finished)) {
      trips.finished.forEach((trip) => {
        totalRevenue += parseFloat(trip.price || 0)
      })
    }

    const netRevenue = totalRevenue * NET_REVENUE_PERCENTAGE

    let cashTrips = 0
    let voucherTrips = 0
    let cardTrips = 0

    if (trips.finished && Array.isArray(trips.finished)) {
      trips.finished.forEach((trip) => {
        if (trip.paymentType === 'cash' || trip.tripPaymentFormId === 1) {
          cashTrips++
        } else if (trip.paymentType === 'voucher' || trip.tripPaymentFormId === 3) {
          voucherTrips++
        } else if (trip.paymentType === 'card' || trip.tripPaymentFormId === 2) {
          cardTrips++
        } else {
          cashTrips++
        }
      })
    }

    return {
      totalTrips,
      acceptedTrips,
      finishedCount,
      canceledCount,
      canceledByDriver,
      canceledByCustomer,
      notAnsweredCount,
      totalRevenue,
      netRevenue,
      cashTrips,
      voucherTrips,
      cardTrips,
      inProgressCount,
      boardingCount,
    }
  }

  function updateMonitoringUI(data) {
    if (!data || (!data.trips && !data.drivers)) {
      return
    }

    const stats = calculateStatistics(data)

    const content = document.getElementById('monitoringContent')
    const toggleBtn = document.getElementById('toggleMonitoringBtn')

    const cards = [
      'tripsCard',
      'showCancelledTrips',
      'ridesCard',
      'showUnattendedTrips',
      'revenueCard',
    ]
    cards.forEach((cardId) => {
      const card = document.getElementById(cardId)
      if (card) {
        card.classList.remove('skeleton')
      }
    })

    const header = document.getElementById('monitoringHeader')
    if (header) {
      header.classList.remove('skeleton')
      header.classList.remove('hidden')
    }

    if (content) content.classList.remove('hidden')

    if (typeof FooterMonitorManager !== 'undefined' && FooterMonitorManager.isExpanded()) {
      FooterMonitorManager.setButtonState(true)
    }

    const driversData = data.drivers || { available: 0, occupied: 0 }
    const setElemText = (id, val) => {
      const el = document.getElementById(id)
      if (el) el.textContent = val
    }

    setElemText('infoAvailable', driversData.available || 0)
    setElemText('infoOccupied', driversData.occupied || 0)

    setElemText('totalTrips', stats.totalTrips)
    setElemText('acceptedTrips', stats.acceptedTrips)
    setElemText('finishedTrips', stats.finishedCount)
    setElemText('cancelledTrips', stats.canceledCount)
    setElemText('cancelledByDriver', stats.canceledByDriver)
    setElemText('cancelledByCustomer', stats.canceledByCustomer)

    setElemText('cashTrips', stats.cashTrips)
    setElemText('voucherTrips', stats.voucherTrips)
    setElemText('cardTrips', stats.cardTrips)

    setElemText('unattendedTrips', stats.notAnsweredCount)

    setElemText('totalRevenue', formatCurrency(stats.totalRevenue))
    setElemText('netRevenue', formatCurrency(stats.netRevenue))

    lastUpdateTime = new Date()
  }

  function fetchMonitoringData() {
    const centralId = Session.getValueInSession('centralSelected', 'id')

    if (!centralId) {
      const content = document.getElementById('monitoringContent')
      if (content) {
        content.classList.remove('hidden')
        content.style.animation = 'fadeIn 0.5s ease-in-out'
      }
      return Promise.resolve()
    }

    if (typeof MonitoringRepository === 'undefined') {
      return Promise.resolve()
    }

    return MonitoringRepository.getMonitoringData(centralId)
      .then((result) => {
        let trips = null
        let drivers = null

        let dataContainer = null
        if (result) {
          if (result.data) {
            dataContainer = result.data
          } else if (result.response && result.response.data) {
            dataContainer = result.response.data
          } else if (result.trips) {
            dataContainer = result
          } else if (result.response) {
            dataContainer = result.response
          }
        }

        if (dataContainer) {
          trips = dataContainer.trips
          drivers = dataContainer.drivers
        }

        if (trips) {
          monitoringData.trips = trips

          if (drivers && drivers.available !== undefined) {
            monitoringData.drivers = drivers
            updateMonitoringUI(monitoringData)
            initializeDropdowns()
          } else {
            MonitoringRepository.getDriversStatus(centralId)
              .then(
                (driversResult) => {
                  if (driversResult.status && driversResult.data) {
                    monitoringData.drivers = driversResult.data
                  }
                },
                (error) => {
                  console.error('Erro ao buscar status dos motoristas:', error)
                }
              )
              .then(() => {
                updateMonitoringUI(monitoringData)
                initializeDropdowns()
              })
          }
        } else {
          monitoringData.trips = { canceled: [], not_answered: [] }
          updateMonitoringUI(monitoringData)
          initializeDropdowns()
        }
      })
      .catch((error) => {
        const cards = [
          'tripsCard',
          'showCancelledTrips',
          'ridesCard',
          'showUnattendedTrips',
          'revenueCard',
        ]
        cards.forEach((cardId) => {
          const card = document.getElementById(cardId)
          if (card) {
            card.classList.remove('skeleton')
          }
        })

        const header = document.getElementById('monitoringHeader')
        if (header) {
          header.classList.remove('skeleton')
          header.classList.remove('hidden')
        }
        updateMonitoringUI(monitoringData)
        initializeDropdowns()
      })
  }

  // Exclusão mútua sidebar ↔ footer — cada objeto tem responsabilidade única
  const SidebarManager = {
    close(selector) {
      const el = document.querySelector(selector)
      if (el) el.classList.remove('active')
    },
    closeAll() {
      SidebarManager.close('.list-trips-active-partner')
      SidebarManager.close('.container-menu')
      SidebarManager.close('#callRunning')
      SidebarManager.close('.search-driver-in-trip')
    },
  }

  const FooterMonitorManager = {
    _btn: null,
    _content: null,
    _footer: null,
    _btnCallTrip: null,
    _containerPointLocal: null,
    init(footer, toggleBtn, btnCallTrip) {
      this._footer = footer
      this._btn = toggleBtn
      this._btnCallTrip = btnCallTrip
      this._content = document.getElementById('monitoringContent')
      this._containerPointLocal = document.querySelector('.container-point-local-map')
    },
    setButtonState(isExpanded) {
      if (!this._btn) return
      let lbl = this._btn.querySelector('.footer-toggle-label')
      let icon = this._btn.querySelector('.footer-toggle-icon')
      if (!lbl || !icon) {
        this._btn.innerHTML = `<span class="footer-toggle-label">${isExpanded ? 'Ocultar detalhes' : 'Exibir detalhes'}</span><i class="material-icons footer-toggle-icon">expand_less</i>`
        return
      }
      lbl.textContent = isExpanded ? 'Ocultar detalhes' : 'Exibir detalhes'
    },
    isExpanded() {
      return !!(this._footer && this._footer.classList.contains('expanded'))
    },
    expand() {
      if (!this._footer) return
      SidebarManager.closeAll()

      this.setButtonState(true)

      const header = document.getElementById('monitoringHeader')
      if (header) header.classList.remove('hidden')
      if (this._content) this._content.classList.remove('hidden')

      this._footer.classList.add('active', 'expanded')

      if (this._btnCallTrip) {
        this._btnCallTrip.classList.add('monitoring-active', 'monitoring-expanded')
      }
      document.querySelector('.map-zoom-controls')?.classList.add('monitoring-active', 'monitoring-expanded')
      if (this._containerPointLocal?.classList.contains('active')) {
        this._containerPointLocal.classList.add('monitoring-expanded')
      }

      requestAnimationFrame(() => {
        const height = this._footer.offsetHeight || this._footer.getBoundingClientRect().height || 220
        document.documentElement.style.setProperty('--footer-height', `${height}px`)
        scheduleMapResize()
      })

      initializeDropdowns()

      const CARD_IDS = ['tripsCard', 'showCancelledTrips', 'ridesCard', 'showUnattendedTrips', 'revenueCard']
      CARD_IDS.forEach((id) => document.getElementById(id)?.classList.add('skeleton'))
      document.getElementById('monitoringHeader')?.classList.add('skeleton')

      fetchMonitoringData().catch(() => {})
    },
    collapse() {
      if (!this._footer || !this.isExpanded()) return
      this._onBeforeCollapse?.()

      this.setButtonState(false)

      if (this._content) this._content.classList.add('hidden')
      const header = document.getElementById('monitoringHeader')
      if (header) header.classList.add('hidden')

      this._footer.classList.remove('expanded')

      if (this._btnCallTrip) {
        this._btnCallTrip.classList.remove('monitoring-expanded')
      }
      if (this._containerPointLocal?.classList.contains('active')) {
        this._containerPointLocal.classList.remove('monitoring-expanded')
      }
      document.querySelector('.map-zoom-controls')?.classList.remove('monitoring-expanded')

      document.documentElement.style.removeProperty('--footer-height')
      scheduleMapResize()
    },
    toggle() {
      if (this.isExpanded()) {
        this.collapse()
      } else {
        this.expand()
      }
    },
  }
  window.FooterMonitorManager = FooterMonitorManager
  // ──────────────────────────────────────────────────────────────────────

  const footerMonitoring = document.querySelector('.footer-monitoring-trip')
  const toggleMonitoringBtn = document.getElementById('toggleMonitoringBtn')
  const reloadBtn = document.getElementById('reloadBtn')
  const btnCallTrip = document.querySelector('.btn-call-trip')

  if (footerMonitoring) {
    FooterMonitorManager.init(footerMonitoring, toggleMonitoringBtn, btnCallTrip)
    footerMonitoring.classList.add('active')
    if (toggleMonitoringBtn) {
      toggleMonitoringBtn.classList.remove('hidden')
      FooterMonitorManager.setButtonState(false)
    }
    if (btnCallTrip) btnCallTrip.classList.add('monitoring-active')
    document.querySelector('.map-zoom-controls')?.classList.add('monitoring-active')
  }

  if (toggleMonitoringBtn) {
    toggleMonitoringBtn.addEventListener('click', function (event) {
      event.preventDefault()
      event.stopPropagation()
      FooterMonitorManager.toggle()
    })
  }

  // Clique nos botões de viagens ativas colapsa o footer para não sobrepor o conteúdo
  const sidebarTriggers = ['#showMessageTripActive', '#showWhatsappTripActive']
  sidebarTriggers.forEach((selector) => {
    const el = document.querySelector(selector)
    if (el) el.addEventListener('click', () => FooterMonitorManager.collapse())
  })

  // Observer no .container-menu para não precisar alterar initTrip.js
  const containerMenuEl = document.querySelector('.container-menu')
  if (containerMenuEl) {
    new MutationObserver((mutations) => {
      mutations.forEach(({ attributeName, target }) => {
        if (attributeName === 'class' && target.classList.contains('active')) {
          FooterMonitorManager.collapse()
        }
      })
    }).observe(containerMenuEl, { attributes: true })
  }

  // Observer no sidebar de viagens ativas/whatsapp — sincroniza visibilidade dos botões
  const tripsPartnerSidebarEl = document.querySelector('.list-trips-active-partner')
  if (tripsPartnerSidebarEl) {
    new MutationObserver((mutations) => {
      mutations.forEach(({ attributeName }) => {
        if (attributeName === 'class') {
          updateBtnCallTripVisibility()
        }
      })
    }).observe(tripsPartnerSidebarEl, { attributes: true })
  }

  if (reloadBtn) {
    reloadBtn.addEventListener('click', function () {
      reloadBtn.classList.add('rotating')

      fetchMonitoringData().finally(() => {
        reloadBtn.classList.remove('rotating')
      })
    })
  }

  setInterval(() => {
    const now = new Date()
    const secondsAgo = Math.floor((now - lastUpdateTime) / 1000)
    const updateElement = document.getElementById('infoUpdatedAt')

    if (updateElement && lastUpdateTime) {
      if (secondsAgo < 60) {
        updateElement.textContent = secondsAgo + 's atrás'
      } else if (secondsAgo < 3600) {
        const minutesAgo = Math.floor(secondsAgo / 60)
        updateElement.textContent = minutesAgo + 'min atrás'
      } else {
        const hoursAgo = Math.floor(secondsAgo / 3600)
        updateElement.textContent = hoursAgo + 'h atrás'
      }
    }
  }, 1000)

  // Comentado: Atualização automática a cada 15 segundos
  // setInterval(() => {
  //     if (footerMonitoring && footerMonitoring.classList.contains('active')) {
  //         const content = document.getElementById('monitoringContent');
  //         if (content && !content.classList.contains('hidden')) {
  //             fetchMonitoringData();
  //         }
  //     }
  // }, 15000);

  // Motivo: Reduzir carga no servidor - dados serão atualizados apenas:
  // 1. Quando expandir os detalhes (no botão "Exibir detalhes")
  // 2. Quando clicar no botão de atualizar (reloadBtn)

  const tripDetailsModal = document.getElementById('tripDetailsModal')
  const closeTripDetails = document.getElementById('closeTripDetails')
  const tripDetailsTitle = document.getElementById('tripDetailsTitle')
  const tripDetailsBody = document.getElementById('tripDetailsBody')

  if (closeTripDetails) {
    closeTripDetails.addEventListener('click', function () {
      tripDetailsModal.classList.remove('active')
    })
  }

  if (tripDetailsModal) {
    tripDetailsModal.addEventListener('click', function (e) {
      if (e.target === tripDetailsModal) {
        tripDetailsModal.classList.remove('active')
      }
    })
  }

  function formatDate(dateString) {
    if (typeof DateCustom !== 'undefined' && DateCustom.getDateLocal) {
      return DateCustom.getDateLocal(dateString)
    }
    return new Date(dateString).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  function getTripAddressInfo(tripData) {
    let originAddress = ''
    let destinationAddress = ''

    if (tripData.origin) {
      if (typeof tripData.origin === 'string') {
        originAddress = tripData.origin
      } else if (tripData.origin.address) {
        originAddress = tripData.origin.address
      } else {
        originAddress = 'Endereço de origem não informado'
      }
    }

    if (tripData.destination) {
      if (typeof tripData.destination === 'string') {
        destinationAddress = tripData.destination
      } else if (tripData.destination.address) {
        destinationAddress = tripData.destination.address
      } else {
        destinationAddress = 'Endereço de destino não informado'
      }
    }

    if (originAddress && destinationAddress) {
      return `, em relação à viagem de ${originAddress} para ${destinationAddress}`
    } else if (originAddress) {
      return `, em relação à viagem saindo de ${originAddress}`
    } else if (destinationAddress) {
      return `, em relação à viagem para ${destinationAddress}`
    }

    if (tripData.from || tripData.to) {
      const from =
        typeof tripData.from === 'string' ? tripData.from : 'Endereço de origem não informado'
      const to = typeof tripData.to === 'string' ? tripData.to : 'Endereço de destino não informado'
      return `, em relação à viagem de ${from} para ${to}`
    } else if (tripData.address) {
      return `, em relação à viagem no endereço ${tripData.address}`
    } else {
      const tripType = tripData.trip_type?.type || tripData.tripTypeName || 'AppMotorista Central'
      return `, em relação à viagem ${tripType}`
    }
  }

  function openWhatsApp(phone, tripReference, customerName, tripData = null) {
    let message = `Olá ${customerName}`

    if (tripData) {
      const date = formatDate(tripData.date)
      const price = formatCurrency(tripData.price)
      const status = tripData.status || ''
      const cancellationReason =
        tripData.cancellationReason?.name || tripData.cancellation_reason?.name || ''
      const canceledBy = tripData.canceledBy || tripData.canceled_by || ''

      let addressInfo = ''
      if (tripData.origin && tripData.destination) {
        const originStr =
          typeof tripData.origin === 'string' ? tripData.origin : tripData.origin.address || ''
        const destStr =
          typeof tripData.destination === 'string'
            ? tripData.destination
            : tripData.destination.address || ''

        const getShortAddress = (address) => {
          if (!address) return ''
          const parts = address.split(',')
          return parts.slice(0, 2).join(',').trim()
        }

        const shortOrigin = getShortAddress(originStr)
        const shortDest = getShortAddress(destStr)

        if (shortOrigin && shortDest) {
          addressInfo = `, sobre a viagem de ${shortOrigin} para ${shortDest}`
        } else if (shortOrigin) {
          addressInfo = `, sobre a viagem de ${shortOrigin}`
        } else if (shortDest) {
          addressInfo = `, sobre a viagem para ${shortDest}`
        }
      }

      // Mensagem diferente para canceladas
      if (status === 'Cancelada' || status === 'canceled') {
        let cancelInfo = ''

        // Só mostrar motivo se não for "Outros" ou genérico
        if (
          cancellationReason &&
          cancellationReason !== 'Não informado' &&
          cancellationReason !== 'Outros'
        ) {
          cancelInfo = `\n\nMotivo: ${cancellationReason}`
        }

        if (canceledBy) {
          const byText = canceledBy === 'driver' ? 'pelo motorista' : 'pelo cliente'
          cancelInfo += `\nCancelada ${byText}.`
        }

        message += `${addressInfo} do dia ${date} que foi cancelada${cancelInfo}\n\nGostaria de reagendar ou tem alguma dúvida?`
      } else {
        message += `${addressInfo} do dia ${date}${price ? ` (${price})` : ''}.\n\nComo podemos ajudar?`
      }
    } else {
      message += ', em relação à viagem. Como podemos ajudar?'
    }

    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/${phone.replace(/\D/g, '')}?text=${encodedMessage}`
    window.open(whatsappUrl, '_blank')
  }

  function setupTripDropdown(cardId, dropdownId, emptyMessage) {
    const cardElement = document.getElementById(cardId)
    const dropdownElement = document.getElementById(dropdownId)

    if (!cardElement || !dropdownElement) {
      return
    }

    if (cardElement._dropdownHandler) {
      cardElement.removeEventListener('click', cardElement._dropdownHandler)
    }

    const clickHandler = function (event) {
      event.stopPropagation()
      const isOpen = dropdownElement.classList.contains('active')

      let trips = []
      if (cardId === 'tripsCard') {
        const finishedTrips = (monitoringData.trips?.finished || []).map((t) => ({
          ...t,
          status: 'Finalizada',
        }))
        const inProgressTrips = (monitoringData.trips?.in_progress || []).map((t) => ({
          ...t,
          status: 'Em viagem',
        }))
        const boardingTrips = (monitoringData.trips?.boarding || []).map((t) => ({
          ...t,
          status: 'Embarcando',
        }))
        trips = [...finishedTrips, ...inProgressTrips, ...boardingTrips]
      } else if (cardId === 'showCancelledTrips') {
        trips = (monitoringData.trips?.canceled || []).map((t) => ({ ...t, status: 'Cancelada' }))
      } else if (cardId === 'showUnattendedTrips') {
        trips = (monitoringData.trips?.not_answered || []).map((t) => ({
          ...t,
          status: 'Não atendida',
        }))
      }

      document.querySelectorAll('.stat-card-dropdown').forEach((dropdown) => {
        dropdown.classList.remove('active')
        dropdown.style.display = 'none'
        dropdown.style.opacity = '0'
        dropdown.style.visibility = 'hidden'
      })

      if (isOpen) {
        return
      }

      let html = ''
      if (trips.length === 0) {
        html = `<div class="trip-item trip-item--empty">${emptyMessage}</div>`
      } else {
        trips.forEach((trip) => {
          const customerName = trip.central_customer?.name || trip.user?.name || 'Cliente'
          const customerPhone = trip.central_customer?.phone || trip.user?.phone || ''
          const driverName =
            trip.driver?.user?.name || trip.driver?.user?.nickname || 'Motorista não informado'
          const tripType = trip.trip_type?.type || trip.tripTypeName || 'Viagem'
          const price = trip.price ? formatCurrency(trip.price) : 'R$ 0,00'
          const date = trip.date ? formatDate(trip.date) : 'Data não informada'
          const status = trip.status || 'Viagem'

          // Extrair endereços de origem e destino
          let originAddress = ''
          let destinationAddress = ''

          if (trip.origin) {
            if (typeof trip.origin === 'string') {
              originAddress = trip.origin
            } else if (trip.origin.address) {
              // Pegar apenas as primeiras 2 partes do endereço
              const parts = trip.origin.address.split(',')
              originAddress = parts.slice(0, 2).join(',').trim()
            }
          }

          if (trip.destination) {
            if (typeof trip.destination === 'string') {
              destinationAddress = trip.destination
            } else if (trip.destination.address) {
              // Pegar apenas as primeiras 2 partes do endereço
              const parts = trip.destination.address.split(',')
              destinationAddress = parts.slice(0, 2).join(',').trim()
            }
          }

          // Extrair motivo do cancelamento se existir
          let cancellationReason = ''
          let canceledBy = ''
          if (status === 'Cancelada') {
            cancellationReason =
              trip.cancellationReason?.name || trip.cancellation_reason?.name || 'Não informado'
            canceledBy = trip.canceledBy || trip.canceled_by || ''
          }

          let statusClass = getTripStatusBadgeClass(status)

          const tripDataAttr = JSON.stringify(trip).replace(/"/g, '&quot;')

          let bucketName = 'appmotorista'
          if (typeof environment !== 'undefined' && environment.hosts?.hostImageDriver) {
            const urlParts = environment.hosts.hostImageDriver.split('/')
            if (urlParts.length > 3 && urlParts[3]) {
              bucketName = urlParts[3]
            }
          }
          const dashboardUrl = `https://movymonitor.com/trip/list/details/${trip.tripReference || ''}`

          if (cardId === 'showCancelledTrips') {
            html += `
                        <div class="trip-item">
                                <div class="trip-info">
                                <div class="trip-time">${date}</div>
                                    <div class="trip-person trip-person--driver"><strong>Motorista:</strong> ${driverName}</div>
                                    ${cancellationReason ? `<div class="trip-person trip-person--danger"><strong>Motivo:</strong> ${cancellationReason}</div>` : ''}
                                </div>
                                <div class="trip-item__actions">
                                    ${
                                      customerPhone
                                        ? `<div class="trip-whatsapp" data-phone="${customerPhone}" data-trip-ref="${trip.tripReference || ''}" data-customer-name="${customerName}" data-trip-data="${tripDataAttr}">
                                        <i class="material-icons">chat</i>
                                    </div>`
                                        : ''
                                    }
                                    <div class="trip-detail-links">
                                        <span class="link-view-details" data-trip-ref="${trip.tripReference || ''}" data-trip-data="${tripDataAttr}">
                                            Ver detalhes
                                        </span>
                                        <a href="${dashboardUrl}" target="_blank" class="home-trip-link">
                                            Detalhes (Painel)
                                        </a>
                                    </div>
                                </div>
                            </div>
                        `
          } else {
            html += `
                            <div class="trip-item">
                                <div class="trip-info">
                                    <div class="trip-time">${date}</div>
                                    <div class="trip-person"><strong>Motorista:</strong> ${driverName}</div>
                                    ${originAddress ? `<div class="trip-person trip-person--muted"><strong>Origem:</strong> ${originAddress}</div>` : ''}
                                    ${destinationAddress ? `<div class="trip-person trip-person--muted-inline"><strong>Destino:</strong> ${destinationAddress}</div>` : ''}
                                <div class="trip-type">${tripType}</div>
                                <div class="trip-price">${price}</div>
                                    <div class="${statusClass}">${status}</div>
                            </div>
                                <div class="trip-item__actions">
                                    ${
                                      customerPhone
                                        ? `<div class="trip-whatsapp" data-phone="${customerPhone}" data-trip-ref="${trip.tripReference || ''}" data-customer-name="${customerName}" data-trip-data="${tripDataAttr}">
                                <i class="material-icons">chat</i>
                            </div>`
                                        : ''
                                    }
                                    <div class="trip-detail-links">
                                        <span class="link-view-details" data-trip-ref="${trip.tripReference || ''}" data-trip-data="${tripDataAttr}">
                                            Ver detalhes
                                        </span>
                                        <a href="${dashboardUrl}" target="_blank" class="home-trip-link">
                                            Detalhes (Painel)
                                        </a>
                                    </div>
                                </div>
                        </div>
                    `
          }
        })
      }

      const cardRect = cardElement.getBoundingClientRect()

      // Populate primeiro para calcular a altura
      dropdownElement.innerHTML = html
      dropdownElement.classList.add('active')

      // Calcular posicionamento acima do card
      const spacing = 15 // Espaçamento entre dropdown e card

      dropdownElement.style.position = 'fixed'
      dropdownElement.style.left = `${cardRect.left}px`
      dropdownElement.style.bottom = `${window.innerHeight - cardRect.top + spacing}px`
      dropdownElement.style.width = '350px'
      dropdownElement.style.maxHeight = '300px'
      dropdownElement.style.backgroundColor = 'white'
      dropdownElement.style.border = '1px solid #dee2e6'
      dropdownElement.style.borderRadius = '8px'
      dropdownElement.style.boxShadow = '0 8px 25px rgba(0, 0, 0, 0.15)'
      dropdownElement.style.zIndex = '10002'
      dropdownElement.style.overflowY = 'auto'
    }

    cardElement.addEventListener('click', clickHandler)

    cardElement._dropdownHandler = clickHandler
  }

  function initializeDropdowns() {
    setupTripDropdown('showCancelledTrips', 'cancelledDropdown', 'Nenhuma viagem cancelada')
    setupTripDropdown('showUnattendedTrips', 'unattendedDropdown', 'Nenhuma viagem não atendida')
    setupTripDropdown('tripsCard', 'tripsDropdown', 'Nenhuma viagem')
  }

  function showDropdownAboveCard(card, content, title) {
    const modal = document.getElementById('tripDetailsModal')
    const modalTitle = document.getElementById('tripDetailsTitle')
    const modalBody = document.getElementById('tripDetailsBody')

    if (!modal || !modalTitle || !modalBody) return

    const cardRect = card.getBoundingClientRect()
    const modalWidth = 400
    const windowHeight = window.innerHeight
    const left = cardRect.left + cardRect.width / 2 - modalWidth / 2
    const bottom = windowHeight - cardRect.top + 10

    modalTitle.textContent = title
    modalBody.innerHTML = content

    modal.className = 'trip-details-modal-above'
    modal.style.left = `${Math.max(10, left)}px`
    modal.style.bottom = `${bottom}px`

    setTimeout(() => {
      modal.classList.add('active')
    }, 10)
  }

  function hideModal() {
    const modal = document.getElementById('tripDetailsModal')
    if (modal) {
      modal.classList.remove('active')
      modal.style.display = 'none'
      modal.className = 'trip-details-modal'
      modal.style.left = ''
      modal.style.bottom = ''
    }
  }

  document.addEventListener('click', function (e) {
    if (e.target.closest('.close-modal')) {
      e.preventDefault()
      e.stopPropagation()
      hideModal()
    }
  })

  document.addEventListener('click', function (e) {
    const modal = document.getElementById('tripDetailsModal')
    if (modal && e.target === modal) {
      hideModal()
    }
  })

  document.addEventListener('click', function (e) {
    if (!e.target.closest('.stat-card.monitoring-clickable')) {
      document.querySelectorAll('.stat-card-dropdown').forEach((dropdown) => {
        dropdown.classList.remove('active')
      })
    }
  })

  function setupWhatsAppListeners() {
    document.removeEventListener('click', handleWhatsAppClick)
    document.addEventListener('click', handleWhatsAppClick)

    document.removeEventListener('click', handleViewDetailsClick)
    document.addEventListener('click', handleViewDetailsClick)
  }

  function handleWhatsAppClick(event) {
    if (event.target.closest('.trip-whatsapp')) {
      event.preventDefault()
      event.stopPropagation()
      const element = event.target.closest('.trip-whatsapp')
      const phone = element.dataset.phone
      const tripRef = element.dataset.tripRef
      const customerName = element.dataset.customerName
      const tripData = element.dataset.tripData

      if (phone && tripRef && customerName) {
        openWhatsApp(phone, tripRef, customerName, tripData ? JSON.parse(tripData) : null)
      }
    }
  }

  function handleViewDetailsClick(event) {
    if (event.target.closest('.link-view-details')) {
      event.preventDefault()
      event.stopPropagation()
      const link = event.target.closest('.link-view-details')
      const tripRef = link.dataset.tripRef
      const tripDataAttr = link.dataset.tripData

      if (tripRef && tripDataAttr) {
        const tripData = JSON.parse(tripDataAttr)
        showTripDetailsModalDirectly(tripData)
      } else if (tripRef) {
        fetchTripDetails(tripRef)
      }
    }
  }

  function showTripDetailsModalDirectly(trip) {
    const modal = document.getElementById('tripDetailsModal')
    const modalTitle = document.getElementById('tripDetailsTitle')
    const modalBody = document.getElementById('tripDetailsBody')

    if (!modal || !modalTitle || !modalBody) return

    document.querySelectorAll('.stat-card-dropdown').forEach((dropdown) => {
      dropdown.classList.remove('active')
      dropdown.style.display = 'none'
      dropdown.style.opacity = '0'
      dropdown.style.visibility = 'hidden'
    })

    modalTitle.textContent = 'Detalhes da Viagem'
    const formattedContent = formatTripDetails(trip)
    modalBody.innerHTML = formattedContent

    modal.className = 'trip-details-modal'
    modal.style.left = ''
    modal.style.bottom = ''
    modal.style.display = 'flex'
    modal.classList.add('active')
  }

  function fetchTripDetails(tripReference) {
    const modal = document.getElementById('tripDetailsModal')
    const modalTitle = document.getElementById('tripDetailsTitle')
    const modalBody = document.getElementById('tripDetailsBody')

    if (!modal || !modalTitle || !modalBody) return

    modalTitle.textContent = 'Carregando detalhes...'
    modalBody.innerHTML = getSkeletonTemplate()
    modal.className = 'trip-details-modal'
    modal.style.left = ''
    modal.style.bottom = ''
    modal.style.display = 'flex'
    modal.classList.add('active')

    document.querySelectorAll('.stat-card-dropdown').forEach((dropdown) => {
      dropdown.classList.remove('active')
      dropdown.style.display = 'none'
      dropdown.style.opacity = '0'
      dropdown.style.visibility = 'hidden'
    })

    TripRepository.get(tripReference)
      .then((response) => {
        if (response && response.status) {
          const trip = response.response

          const driverId = trip.driverId || trip.driver?.idDriver

          if (driverId) {
            DriverController.find(driverId)
              .then((response) => {
                if (response && response.status) {
                  trip.driver = {
                    ...trip.driver,
                    ...response.response,
                  }
                }
                showTripDetailsModal(trip)
              })
              .catch((driverError) => {
                showTripDetailsModal(trip)
              })
          } else {
            showTripDetailsModal(trip)
          }
        } else {
          modalTitle.textContent = 'Erro'
          modalBody.innerHTML =
            '<div style="text-align: center; padding: 60px;"><div style="font-size: 48px; color: #dc3545;">❌</div><p style="margin-top: 15px; color: #dc3545;">Erro ao carregar detalhes da viagem.</p></div>'
        }
      })
      .catch((error) => {
        modalTitle.textContent = 'Erro'
        modalBody.innerHTML =
          '<div style="text-align: center; padding: 60px;"><div style="font-size: 48px; color: #dc3545;">❌</div><p style="margin-top: 15px; color: #dc3545;">Erro ao carregar detalhes da viagem.</p></div>'
      })
  }

  function showTripDetailsModal(trip) {
    const modal = document.getElementById('tripDetailsModal')
    const modalTitle = document.getElementById('tripDetailsTitle')
    const modalBody = document.getElementById('tripDetailsBody')

    if (!modal || !modalTitle || !modalBody) return

    modalTitle.textContent = 'Detalhes da Viagem'

    const formattedContent = formatTripDetails(trip)
    modalBody.innerHTML = formattedContent
    modal.className = 'trip-details-modal'
    modal.style.left = ''
    modal.style.bottom = ''
    modal.style.display = 'flex'
    modal.classList.add('active')
  }

  function getSkeletonTemplate() {
    return `
            <div style="padding: 25px; max-height: 80vh; overflow-y: auto;">
                <div style="background: #f8f9fa; border-radius: 12px; padding: 30px; margin-bottom: 25px; text-align: center;">
                    <div style="width: 120px; height: 48px; background: linear-gradient(90deg, #e9ecef 25%, #f8f9fa 50%, #e9ecef 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: 8px; margin: 0 auto 12px;"></div>
                    <div style="width: 180px; height: 20px; background: linear-gradient(90deg, #e9ecef 25%, #f8f9fa 50%, #e9ecef 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: 8px; margin: 0 auto;"></div>
                </div>

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 15px; margin-bottom: 20px;">
                    <div style="background: #fff; border-radius: 12px; padding: 20px; border: 1px solid #e9ecef;">
                        <div style="width: 60px; height: 14px; background: linear-gradient(90deg, #e9ecef 25%, #f8f9fa 50%, #e9ecef 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: 4px; margin-bottom: 10px;"></div>
                        <div style="width: 100%; height: 20px; background: linear-gradient(90deg, #e9ecef 25%, #f8f9fa 50%, #e9ecef 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: 4px; margin-bottom: 8px;"></div>
                        <div style="width: 80px; height: 16px; background: linear-gradient(90deg, #e9ecef 25%, #f8f9fa 50%, #e9ecef 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: 4px;"></div>
                    </div>
                    <div style="background: #fff; border-radius: 12px; padding: 20px; border: 1px solid #e9ecef;">
                        <div style="width: 40px; height: 14px; background: linear-gradient(90deg, #e9ecef 25%, #f8f9fa 50%, #e9ecef 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: 4px; margin-bottom: 10px;"></div>
                        <div style="width: 100%; height: 20px; background: linear-gradient(90deg, #e9ecef 25%, #f8f9fa 50%, #e9ecef 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: 4px; margin-bottom: 8px;"></div>
                        <div style="width: 60px; height: 16px; background: linear-gradient(90deg, #e9ecef 25%, #f8f9fa 50%, #e9ecef 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: 4px;"></div>
                    </div>
                </div>

                <div style="background: #f8f9fa; border-radius: 12px; padding: 25px; margin-bottom: 20px;">
                    <div style="width: 100px; height: 18px; background: linear-gradient(90deg, #e9ecef 25%, #f8f9fa 50%, #e9ecef 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: 4px; margin-bottom: 15px;"></div>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 12px;">
                        ${Array.from({ length: 4 })
                          .map(
                            () => `
                            <div>
                                <div style="width: 50px; height: 12px; background: linear-gradient(90deg, #e9ecef 25%, #f8f9fa 50%, #e9ecef 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: 4px; margin-bottom: 6px;"></div>
                                <div style="width: 100%; height: 16px; background: linear-gradient(90deg, #e9ecef 25%, #f8f9fa 50%, #e9ecef 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: 4px;"></div>
                            </div>
                        `
                          )
                          .join('')}
                    </div>
                </div>

                <div style="background: #fff; border-radius: 12px; padding: 25px; border: 1px solid #e9ecef;">
                    <div style="width: 100px; height: 16px; background: linear-gradient(90deg, #e9ecef 25%, #f8f9fa 50%, #e9ecef 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: 4px; margin-bottom: 15px;"></div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px;">
                        <div style="padding: 12px; background: #f8f9fa; border-radius: 6px;">
                            <div style="width: 50px; height: 12px; background: linear-gradient(90deg, #e9ecef 25%, #f8f9fa 50%, #e9ecef 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: 4px; margin-bottom: 8px;"></div>
                            <div style="width: 100%; height: 14px; background: linear-gradient(90deg, #e9ecef 25%, #f8f9fa 50%, #e9ecef 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: 4px; margin-bottom: 4px;"></div>
                            <div style="width: 80%; height: 14px; background: linear-gradient(90deg, #e9ecef 25%, #f8f9fa 50%, #e9ecef 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: 4px;"></div>
                        </div>
                        <div style="padding: 12px; background: #f8f9fa; border-radius: 6px;">
                            <div style="width: 50px; height: 12px; background: linear-gradient(90deg, #e9ecef 25%, #f8f9fa 50%, #e9ecef 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: 4px; margin-bottom: 8px;"></div>
                            <div style="width: 100%; height: 14px; background: linear-gradient(90deg, #e9ecef 25%, #f8f9fa 50%, #e9ecef 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: 4px; margin-bottom: 4px;"></div>
                            <div style="width: 80%; height: 14px; background: linear-gradient(90deg, #e9ecef 25%, #f8f9fa 50%, #e9ecef 75%); background-size: 200% 100%; animation: shimmer 1.5s infinite; border-radius: 4px;"></div>
                        </div>
                    </div>
                </div>

                <style>
                    @keyframes shimmer {
                        0% { background-position: 200% 0; }
                        100% { background-position: -200% 0; }
                    }
                </style>
            </div>
        `
  }

  function formatTripDetails(trip) {
    const formatValue = (value, fallback = '-') => value || fallback

    // Detectar se é cancelada
    const isCanceled = trip.status === 'Cancelada' || trip.status === 'canceled'
    const cancellationReason = trip.cancellationReason?.name || trip.cancellation_reason?.name || ''
    const canceledBy = trip.canceledBy || trip.canceled_by || ''

    return `
            <div style="padding: 12px;">
                <div style="text-align: center; margin-bottom: 10px; padding-bottom: 8px; border-bottom: 2px solid #e9ecef;">
                    ${
                      isCanceled
                        ? `
                        <div style="font-size: 18px; font-weight: 600; color: #dc3545; margin-bottom: 4px; text-transform: uppercase; letter-spacing: 0.5px;">Cancelada</div>
                    `
                        : `
                        <div style="font-size: 36px; font-weight: 700; color: #28a745; margin-bottom: 4px;">${formatValue(trip.price ? formatCurrency(trip.price) : 'R$ 0,00')}</div>
                    `
                    }
                    <div style="font-size: 13px; color: #6c757d;">${formatValue(trip.date ? formatDate(trip.date) : trip.date)}</div>
                </div>

                ${
                  isCanceled
                    ? `
                <div style="margin-bottom: 10px;">
                    <div style="color: #6c757d; margin-bottom: 6px; font-size: 12px; font-weight: 500; letter-spacing: 0.3px; text-transform: uppercase;">Informações de Cancelamento</div>
                    ${
                      cancellationReason && cancellationReason !== 'Outros'
                        ? `
                        <div style="margin-bottom: 6px;">
                            <div style="color: #6c757d; margin-bottom: 2px; font-size: 11px; letter-spacing: 0.2px;">Motivo</div>
                            <div style="font-size: 15px; font-weight: 600; color: #212529;">${cancellationReason}</div>
                        </div>
                    `
                        : ''
                    }
                    ${
                      canceledBy
                        ? `
                        <div>
                            <div style="color: #6c757d; margin-bottom: 2px; font-size: 11px; letter-spacing: 0.2px;">Cancelada por</div>
                            <div style="font-size: 15px; font-weight: 600; color: #212529;">${canceledBy === 'driver' ? 'Motorista' : canceledBy === 'customer' ? 'Cliente' : 'Não informado'}</div>
                        </div>
                    `
                        : ''
                    }
                </div>
                `
                    : ''
                }

                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin-bottom: 10px;">
                    <div>
                        <div style="color: #6c757d; margin-bottom: 4px; font-size: 11px; font-weight: 500; letter-spacing: 0.3px;">CLIENTE</div>
                        <div style="font-size: 15px; font-weight: 600; color: #212529; margin-bottom: 2px;">${formatValue(trip.user?.name || trip.central_customer?.name)}</div>
                        <div style="font-size: 13px; color: #6c757d;">${formatValue(trip.user?.phone || trip.central_customer?.phone)}</div>
                    </div>
                    <div>
                        <div style="color: #6c757d; margin-bottom: 4px; font-size: 11px; font-weight: 500; letter-spacing: 0.3px;">TIPO DE VIAGEM</div>
                        <div style="font-size: 15px; font-weight: 600; color: #212529;">${formatValue(trip.tripTypeName || trip.trip_type?.type || trip.trip_type_minimal?.type)}</div>
                    </div>
                </div>

                ${
                  trip.driver && (trip.driver.user || trip.driver.car)
                    ? `
                <div style="margin-bottom: 10px; padding-top: 8px; border-top: 2px solid #e9ecef;">
                    <div style="color: #6c757d; margin-bottom: 6px; font-size: 11px; font-weight: 500; letter-spacing: 0.3px;">MOTORISTA</div>
                    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px;">
                        ${
                          trip.driver.user?.nickname || trip.driver.user?.name
                            ? `
                        <div>
                            <div style="color: #6c757d; margin-bottom: 4px; font-size: 11px; letter-spacing: 0.2px;">Nome</div>
                            <div style="font-size: 16px; font-weight: 600; color: #212529;">${formatValue(trip.driver.user.nickname || trip.driver.user.name)}</div>
                        </div>
                        `
                            : ''
                        }
                        ${
                          trip.driver.user?.phone
                            ? `
                        <div>
                            <div style="color: #6c757d; margin-bottom: 4px; font-size: 11px; letter-spacing: 0.2px;">Telefone</div>
                            <div style="font-size: 16px; font-weight: 600; color: #212529;">${formatValue(trip.driver.user.phone)}</div>
                        </div>
                        `
                            : ''
                        }
                        ${
                          trip.driver.car?.plate
                            ? `
                        <div>
                            <div style="color: #6c757d; margin-bottom: 4px; font-size: 11px; letter-spacing: 0.2px;">Placa</div>
                            <div style="font-size: 16px; font-weight: 600; color: #212529;">${formatValue(trip.driver.car.plate)}</div>
                        </div>
                        `
                            : ''
                        }
                        ${
                          trip.driver.car?.brand
                            ? `
                        <div>
                            <div style="color: #6c757d; margin-bottom: 4px; font-size: 11px; letter-spacing: 0.2px;">Marca</div>
                            <div style="font-size: 16px; font-weight: 600; color: #212529;">${formatValue(trip.driver.car.brand)}</div>
                        </div>
                        `
                            : ''
                        }
                        ${
                          trip.driver.car?.model
                            ? `
                        <div>
                            <div style="color: #6c757d; margin-bottom: 4px; font-size: 11px; letter-spacing: 0.2px;">Modelo</div>
                            <div style="font-size: 16px; font-weight: 600; color: #212529;">${formatValue(trip.driver.car.model)}</div>
                        </div>
                        `
                            : ''
                        }
                        ${
                          trip.driver.car?.color
                            ? `
                        <div>
                            <div style="color: #6c757d; margin-bottom: 4px; font-size: 11px; letter-spacing: 0.2px;">Cor</div>
                            <div style="font-size: 16px; font-weight: 600; color: #212529;">${formatValue(trip.driver.car.color)}</div>
                        </div>
                        `
                            : ''
                        }
                        ${
                          trip.driver.car?.year
                            ? `
                        <div>
                            <div style="color: #6c757d; margin-bottom: 4px; font-size: 11px; letter-spacing: 0.2px;">Ano</div>
                            <div style="font-size: 16px; font-weight: 600; color: #212529;">${formatValue(trip.driver.car.year)}</div>
                        </div>
                        `
                            : ''
                        }
                    </div>
                </div>
                `
                    : ''
                }

                ${
                  (trip.origin && trip.origin.address) ||
                  (trip.destination && trip.destination.address)
                    ? `
                <div style="margin-bottom: 10px; padding-top: 8px; border-top: 2px solid #e9ecef;">
                    <div style="color: #6c757d; margin-bottom: 6px; font-size: 11px; font-weight: 500; letter-spacing: 0.3px;">ENDEREÇOS</div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
                        ${
                          trip.origin && trip.origin.address
                            ? `
                        <div>
                            <div style="color: #6c757d; margin-bottom: 4px; font-size: 11px; letter-spacing: 0.2px;">Origem</div>
                            <div style="font-size: 14px; color: #212529; line-height: 1.5;">${formatValue(trip.origin.address)}</div>
                        </div>
                        `
                            : ''
                        }
                        ${
                          trip.destination && trip.destination.address
                            ? `
                        <div>
                            <div style="color: #6c757d; margin-bottom: 4px; font-size: 11px; letter-spacing: 0.2px;">Destino</div>
                            <div style="font-size: 14px; color: #212529; line-height: 1.5;">${formatValue(trip.destination.address)}</div>
                        </div>
                        `
                            : ''
                        }
                    </div>
                </div>
                `
                    : ''
                }

                ${
                  trip.schedule
                    ? `
                <div style="padding-top: 8px; border-top: 2px solid #e9ecef;">
                    <div style="color: #6c757d; margin-bottom: 4px; font-size: 11px; font-weight: 500; letter-spacing: 0.3px;">AGENDAMENTO</div>
                    <div style="font-size: 14px; font-weight: 600; color: #212529;">${formatValue(trip.schedule ? formatDate(trip.schedule) : trip.schedule)}</div>
                </div>
                `
                    : ''
                }

            </div>
        `
  }

  function loadRealtimeSocketKeyConfig() {
    const key = 'enable_realtime_socket'

    ConfigRepository.getConfigBykey(key).then((res) => {
      const enableRealtimeSocket = res?.status && res?.response === '1' ? true : false
      Session.set('enable_realtime_socket', enableRealtimeSocket)
    })
  }

  loadRealtimeSocketKeyConfig()

  function setCetralSessionNotifierInLocalStorage() {
    WhatsappSession.persistSessionName()
  }

  function updateActiveTripPrice(newValue, discountType, discountValue) {
    const activeTrip = document.querySelector('.trip-type.active')
    if (!activeTrip) return

    const priceLabel = activeTrip.querySelector('.label-prices-trip')
    if (!priceLabel) return

    const moeda = JSON?.parse(localStorage?.getItem('cityConfig'))?.typeMoney || '$'

    if (!priceLabel.getAttribute('valueDefault')) {
      priceLabel.setAttribute('valueDefault', priceLabel.innerHTML)
    }

    let currentValue = parseFloat(priceLabel.getAttribute('valueDefault'))
    console.log(currentValue)

    if (discountType === '%') {
      newValue = currentValue - currentValue * (discountValue / 100)
    }

    if (discountType == '$') {
      newValue = currentValue - discountValue
    }
    const formatted = Mask.maskMoney(newValue)
    priceLabel.innerHTML = `<span>${moeda}</span> ${formatted}`
    return newValue
  }

  function restoreActiveTripPrice() {
    const activeTrip = document.querySelector('.trip-type.active')
    if (!activeTrip) return

    const priceLabel = activeTrip.querySelector('.label-prices-trip')
    if (!priceLabel) return

    const original = priceLabel.getAttribute('valueDefault')
    if (original) {
      priceLabel.innerHTML = original
    }
  }

  document.addEventListener('click', function (e) {
    const item = e.target.closest('.anti-uber-item')
    if (!item) return

    let discountType
    let discountValue

    CentralRepository.fetchDiscountConfigs().then((response) => {
      discountValue = response.response.discount_value
      discountType = response.response.discount_type
    })

    if (item.classList.contains('selected')) {
      item.classList.remove('selected')
      managerTrip.typeTaxi.price = null
      managerTrip.typeTaxi.oldPrice = null

      return restoreActiveTripPrice()
    }

    let preco = item.getAttribute('data-preco')
    let precoFloat =
      typeof CurrencyFormat !== 'undefined'
        ? CurrencyFormat.parsePriceToNumber(preco)
        : parseFloat(String(preco || '').replace(/[^\d,]/g, '').replace(',', '.'))
    if (Number.isNaN(precoFloat)) {
      return
    }
    let tripUberValue = precoFloat

    SwalCustom.dialogConfirm(
      'Deseja sobrepor o valor?'
    ).then(() => {
      document
        .querySelectorAll('.anti-uber-item.selected')
        .forEach((el) => el.classList.remove('selected'))

      item.classList.add('selected')

      let newValue = updateActiveTripPrice(tripUberValue, discountType, discountValue)
      managerTrip.typeTaxi.oldPrice = managerTrip.typeTaxi.price
      managerTrip.typeTaxi.price = newValue
    })
  })
})
