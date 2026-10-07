const unsubscribeIds = new Map()

let pendingNotAnsweredTrip = null

function checkStatusTrip(trip, type) {
  prepareScreenTrip()

  if (type === tripRealtime.typeRemoved) {
    if (unsubscribeIds.has(trip.tripReference)) {
      const unsubscribeId = unsubscribeIds.get(trip.tripReference)

      unsubscribeIds.delete(trip.tripReference)

      tripRealtime.unsubscribe(unsubscribeId)
    }

    const currentRef = Session.getLocal('tripReference')
    if (currentRef && trip.tripReference !== currentRef) {
      return
    }

    stopProgressTrip()
    clearDataCar()

    viewController.elementProperty.removeClass('.trip-client', 'active')
    viewController.elementProperty.removeClass('#mapWrapper', 'in-trip')

    initProcessingCallTrip(true, true)
    managerTrip.inTrip = false
    Session.deleteLocal('tripReference')

    TripController.getByTripReference(trip.tripReference).then(({ data }) => {
      if (data?.status === STATUS_NOT_ANSWERED) {
        notAnswered(data)
      }

      showToastByStatusTrip(data)
    })

    return
  }
  showToastByStatusTrip(trip)

  if (trip.status === STATUS_SEARCHING || trip.status === STATUS_SEARCHING_FAVORITE) {
    if (!managerTrip.isSearch) {
      initSearchTrip(trip)
      return
    }
    return
  }

  if (trip.status === STATUS_ACCEPTED || trip.status === STATUS_PRE_ACCEPTED) {
    initRace(trip)
    return
  }

  if (trip.status === STATUS_BOARDING || trip.status === STATUS_IN_PROGRESS) {
    initRace(trip)
    return
  }
  if (trip.status === STATUS_FINISHED) {
    stopProgressTrip()
    clearDataCar()
    initProcessingCallTrip(true, true)
    managerTrip.inTrip = false
    Session.deleteLocal('tripReference')
    return
  }
  if (
    trip.status === STATUS_CANCELED ||
    trip.status === STATUS_NOT_ANSWERED ||
    trip.status === STATUS_BACK_OFF ||
    trip.status === STATUS_PAYMENT_REFUSED
  ) {
    const currentRef = Session.getLocal('tripReference')
    if (currentRef && trip.tripReference !== currentRef) {
      if (unsubscribeIds.has(trip.tripReference)) {
        tripRealtime.unsubscribe(unsubscribeIds.get(trip.tripReference))
        unsubscribeIds.delete(trip.tripReference)
      }
      return
    }

    if (unsubscribeIds.has(trip.tripReference)) {
      tripRealtime.unsubscribe(unsubscribeIds.get(trip.tripReference))
      unsubscribeIds.delete(trip.tripReference)
    }

    stopProgressTrip()
    clearDataCar()
    initProcessingCallTrip(true, true)

    if (trip.status === STATUS_NOT_ANSWERED) {
      TripController.getByTripReference(trip.tripReference).then(({ data }) => {
        notAnswered(data)
      })
    }

    if (trip.canceledBy === 'driver') {
      if (trip.customerCancellationFee != null) {
        SwalCustom.messageDialog(
          trip.customerCancellationFee.description,
          trip.customerCancellationFee.title,
          undefined,
          'warning'
        )
        return
      }
      return
    }

    clearTimeout(managerTrip.timeOut)
    managerTrip.timeOut = null
    Session.deleteLocal('tripReference')
  }
}

function initNewTripAfterCancel(trip) {
  const tripNormalized = TripAdapter.normalize(trip)
  const fee = Session.getLocal('paidByCentral')

  const newTrip = {
    ...tripNormalized,
    schedule: null,
    waypoints: tripNormalized.tripWayPoints,
    tripDiscountCoupon: {
      oldPrice: null,
      userDiscountCouponId: null,
    },
    tripCustomer: {
      id: trip.customer?.id || trip.customer?.customerId || tripNormalized.centralCustomer?.id,
      name: trip.customer?.name ?? tripNormalized.centralCustomer?.name ?? '',
      phone: trip.customer?.phone ?? tripNormalized.centralCustomer?.phone ?? '',
    },
    paidByCentral: fee.paidByCentral,
    multiplierDynamic: tripNormalized.multiplierDynamic,
  }

  if (tripNormalized.deliveryInfo != null) {
    if (!Array.isArray(tripNormalized.deliveryInfo)) {
      newTrip.deliveryInfo = tripNormalized.deliveryInfo
      const tripItem = Array.isArray(trip.tripItems) ? trip.tripItems[0] : trip.tripItems
      newTrip.tripItems = [{
        tripItemTypeId: tripItem.tripItemTypeId,
        title: tripItem.title || getTripItemTypeTitle(tripItem.tripItemTypeId),
      }]
    }
  } else {
    delete newTrip.deliveryInfo
    delete newTrip.tripItems
  }

  initNewTrip(newTrip, trip.customer, true)
}

function notAnswered(trip) {
  pendingNotAnsweredTrip = trip

  const selectGroupList = document.getElementById('select-group-list')
  if (selectGroupList) {
    selectGroupList.innerHTML = '<option selected disabled>Escolha um grupo</option>'
  }

  document.getElementById('driverNotFoundDetailsModal').classList.add('show')

  const whatsappGroupContainer = document.getElementById('container-whatsapp-group')
  if (whatsappGroupContainer && whatsappGroupContainer.style.display !== 'none') {
    fetchMyGroups()
  }
}

function showToastByStatusTrip(trip) {
  if (!trip.status) return

  const element = document.querySelector(`#toast${trip.tripReference}`)

  if (element) element.remove()

  if (trip.customer == null && trip.centralCustomer == null) return

  $('#toastAlert')
    .append(`<div class="toast" id="toast${trip.tripReference}" role="alert" aria-live="assertive" aria-atomic="true">
            <div class="toast-header">
                <strong class="mr-auto">Cliente: ${trip.customer != null ? trip.customer.name : trip.centralCustomer.name}</strong>
                <button type="button" class="ml-2 mb-1 close" data-dismiss="toast" aria-label="Close">
                    <span aria-hidden="true">&times;</span>
                </button>
            </div>
            <div class="toast-body">${showStatusByTrip(trip)}</div>
        </div>`)

  const elementToast = $(`#toast${trip.tripReference}`)

  elementToast.toast({
    delay: 5000,
  })

  elementToast.toast('show')
}

function prepareScreenTrip() {
  // Usa utilitário que verifica o estado do menu antes de alterar o botão
  updateBtnCallTripVisibility()
  viewController.elementProperty.addClass('#callRunning', 'remove')
}

function initProcessingCallTrip(showButtonCall = true, forceReset = false) {
  if (window.isCreatingTrip || forceReset) {
    Route.removeGroupComponent(COMPONENT_CREATE_TRIP)
    var footerTripEl = document.querySelector('.footer-container-trip')
    if (footerTripEl) {
      footerTripEl.classList.remove('no-destination')
    }
    var paymentTripEl = document.querySelector('.payment-trip')
    if (paymentTripEl) paymentTripEl.classList.remove('payment-trip-selected')
    viewController.elementProperty.removeClass('.select-customer', 'active')
    viewController.elementProperty.removeClass('.type-cars', 'trip-type-selected')
    viewController.elementProperty.removeClass('.menu-close', 'black')
    viewController.elementProperty.removeClass('.history-trips', 'active')
    viewController.elementProperty.removeClass('.footer-payment-form', 'active')
    viewController.elementProperty.removeClass('.footer-schedule-form', 'active')
    viewController.elementProperty.removeClass('.footer-container-trip', 'active')
    viewController.elementProperty.removeClass('#info-delivery', 'active')
    viewController.elementProperty.removeClass('.container-logo', 'remove')
    updateBtnCallTripVisibility()
    viewController.elementProperty.removeClass('#mapWrapper', 'active', 'in-trip')
    scheduleMapResize()
    viewController.elementProperty.removeClass('.btn-cancel-processing-trip', 'active')
    viewController.elementProperty.removeClass('.trip-client', 'active')
    viewController.elementProperty.removeClass('.search-driver-in-trip', 'active')
    viewController.elementProperty.removeClass('.container-cancel-request-trip', 'active')
    viewController.elementProperty.getElement('.container-waypoint-search', (element) => {
      element.remove()
    })

    viewController.elementProperty.getElement('.add-place-stop', (element) => {
      element.style = ''
    })

    trip.amountWaypoints = 0
    trip.waypoints = []
    trip.customer = null

    mapService.removeRoute()
    mapService.removeRoute()

    if (mapService.polygonArea) mapService.polygonArea.setMap(null)

    clearDataKnob()

    if (mapService.pointCustomer != null) mapService.pointCustomer.setMap(mapService.map)

    mapService.map.setOptions({ styles: mapService.getStyleMapDefault() })

    if (mapService.infoSearch !== null) mapService.infoSearch.setMap(null)

    mapService.removeDetalheMap()

    Session.delete('dateInitTrip')

    viewController.elementProperty.getElement('.search-address-location', (element) => {
      element.value = ''
      trip[element.getAttribute('id')] = null
    })

    managerTrip.typeTaxi.priceId = null
    managerTrip.typeTaxi.price = null
    managerTrip.typeTaxi.tripTypeId = null
    managerTrip.inTrip = false
    managerTrip.isSearch = false

    activeMenu()

    if (forceReset) {
      viewController.elementProperty.addClass('.container-menu', 'active')
      viewController.elementProperty.addClass('.container-logo', 'active')
    }

    // Substitui qualquer adição direta do botão por chamada utilitária
    updateBtnCallTripVisibility()
  }
}

function getUpdateTrip() {
  const central = Session.get('centralSelected')

  CentralRepository.get(central.id)
    .then(({ message, status, response }) => {
      if (!status) {
        SwalCustom.messageDialog(message, 'Atenção', getUpdateTrip, 'warning')
        return
      }

      verifyListTripActivePartner()

      // Usa utilitário que verifica o estado do menu antes de alterar o botão
      updateBtnCallTripVisibility()

      if (response.centralCallDriver !== 'only_app') {
        document.querySelector('#menuItemDriver').innerHTML = `
                    <div><a href="/driver/list"><i class="material-icons nav-icon">person</i>Motoristas</a></div>
                `
      }
    })
    .catch((err) => {
      setTimeout(getUpdateTrip, 1500)
    })
}

function activeMenu() {
  viewController.elementProperty.getElement('.menu-close', (element) => {
    element.classList.remove('open')

    element.onclick = function (e) {
      e.stopPropagation()
      if (this.classList.contains('open')) {
        Route.backPage()
        return
      }

      showMenu()

      Route.startClassesInComponent([{ component: '.menu-close', class: 'open' }], () => {
        this.classList.remove('open')
        showMenu(false)
      })
    }

    function showMenu(result = true) {
      viewController.elementProperty.getElement('.container-menu-options', (element) => {
        if (result) {
          element.classList.add('active')
          return
        }
        element.classList.remove('active')
      })
    }
  })
}

function getCurrentPositionDriver(trip) {
  if (!managerTrip.inTrip) return

  const position = getPositionDriverById(trip.driver.idDriver)

  updateMapTripDriver(trip, position.lat, position.lng)

  setTimeout(() => getCurrentPositionDriver(trip), 5000)
}

function fetchMyGroups() {
  const sessionWhatsApp = WhatsappSession.getSessionName()
  if (!sessionWhatsApp) {
    return
  }
  WhatsAppRepository.fetchMyGroups(sessionWhatsApp)
    .then((data) => {
      let groups = data.success
      groups.forEach((group) => {
        viewController.elementProperty.getElement('#select-group-list', (element) => {
          element.innerHTML += `<option value="${group.id}">${group.name}</option>`
        })
      })
    })
    .catch((error) => {
      console.error('Erro ao buscar grupos do WhatsApp:', error)
    })
}
