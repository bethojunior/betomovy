function observerRealtime() {
  tripCurrentRepository.close();

  tripCurrentRepository.getTrip(
    Session.get("tripReference"),
    checkStatusTripRealtime
  );
}

function checkStatusTrip(trip) {
  if (
    trip.tripCallTypeId === TYPE_RIDE ||
    trip.tripCallTypeId === TYPE_FREIGHT
  ) {
    initProcessingCallTrip();
    setTimeout(() => hideTab(), 1500);
    return;
  }

  prepareScreenTrip();

  //if (trip.tripCallTypeId === TYPE_RIDE)
  //   updateInfoTripRide();

  if (trip.status === STATUS_GET_BID_BY_DRIVERS)
    return startTripBidOfferScreen(trip);

  if (trip.status === STATUS_SCHEDULED) {
    if (
      document
        .querySelector(".trip-bid-offer-modal")
        .classList.contains("active")
    ) {
      Session.delete("tripReference");
      initProcessingCallTrip(false);
      return showScheduleTrip(trip.tripReference);
    }
  }

  if (trip.status !== STATUS_PRE_ACCEPTED)
    mapService.clearWaypointInfoPreAccepted();

  if (
    trip.status === STATUS_SEARCHING ||
    trip.status === STATUS_SEARCHING_FAVORITE
  ) {
    if (!managerTrip.isSearch) {
      initSearchTrip(trip);
      return;
    }
    return;
  }

  if (trip.status === STATUS_ACCEPTED || trip.status === STATUS_PRE_ACCEPTED) {
    if (trip.tripCallTypeId === TYPE_RIDE) return;
    managerTrip.inTrip = true;
    observerRealtime();
    initRace(trip);
    // mapService.focusInRoute();
    return;
  }

  if (trip.status === STATUS_BOARDING) {
    viewController.elementProperty.getElement("#songAlert", (element) => {
      element.play();
    });
  }

  if (trip.status === STATUS_BOARDING || trip.status === STATUS_IN_PROGRESS) {
    if (trip.tripCallTypeId === TYPE_RIDE) return;
    observerRealtime();
    initRace(trip);
    mapService.map.setMyLocationEnabled(false);
    return;
  }

  if (trip.status === STATUS_FINISHED) {
    initProcessingCallTrip();
    finishTrip(trip);
    managerTrip.inTrip = false;
    Session.delete("tripReference");
    Session.delete("positionDriverTrip");
    return;
  }

  if (
    trip.status === STATUS_CANCELED ||
    trip.status === STATUS_NOT_ANSWERED ||
    trip.status === STATUS_BACK_OFF ||
    trip.status === STATUS_PAYMENT_REFUSED
  ) {
    stopProgressTrip();
    clearDataCar();
    initProcessingCallTrip();

    if (trip.canceledBy === "admin") {
      if (trip.callAgain == true) {
        initNewTripAfterCancel(trip);
        return;
      }
    }

    if (trip.canceledBy === "driver") {
      if (trip.customerCancellationFee != null) {
        SwalCustom.messageDialog(
          trip.customerCancellationFee.description,
          trip.customerCancellationFee.title,
          undefined,
          "warning"
        );
        return;
      }

      initNewTripAfterCancel(trip);
      return;
    }

    clearTimeout(managerTrip.timeOut);
    managerTrip.timeOut = null;
    Session.delete("tripReference");
    Session.delete("positionDriverTrip");

    if (trip.status === STATUS_NOT_ANSWERED) customerOnTripExpired();
  }
}

function checkStatusTripRealtime(trip, type) {
  if (
    trip.tripCallTypeId === TYPE_RIDE ||
    trip.tripCallTypeId === TYPE_FREIGHT
  ) {
    initProcessingCallTrip();
    setTimeout(() => hideTab(), 1500);
    return;
  }

  prepareScreenTrip();

  //if (trip.tripCallTypeId === TYPE_RIDE)
  //    updateInfoTripRide();

  if (trip.status !== STATUS_PRE_ACCEPTED)
    mapService.clearWaypointInfoPreAccepted();

  if (type === tripCurrentRepository.typeRemoved) {
    TripController.get(trip.tripReference)
      .then(({ status, data: response }) => {
        if (response.status === STATUS_FINISHED) {
          initProcessingCallTrip();
          finishTrip(response);
          managerTrip.inTrip = false;
          Session.delete("tripReference");
          Session.delete("positionDriverTrip");
          return;
        }

        if (
          response.status === STATUS_CANCELED ||
          response.status === STATUS_NOT_ANSWERED ||
          response.status === STATUS_BACK_OFF ||
          response.status === STATUS_PAYMENT_REFUSED
        ) {
          stopProgressTrip();
          clearDataCar();
          initProcessingCallTrip();

          if (response.canceledBy === "admin") {
            if (response.callAgain == true) {
              initNewTripAfterCancel(trip);
              return;
            }
          }

          if (response.status === STATUS_PAYMENT_REFUSED) {
            SwalCustom.messageDialog("", "Pagamento foi recusado!")
          }

          if (response.canceledBy === "driver") {
            if (response.customerCancellationFee != null) {
              SwalCustom.messageDialog(
                response.customerCancellationFee.description,
                response.customerCancellationFee.title,
                undefined,
                "warning"
              );
            } else {
              initNewTripAfterCancel(response);
              return;
            }
          }

          clearTimeout(managerTrip.timeOut);
          managerTrip.timeOut = null;
          Session.delete("tripReference");
          Session.delete("positionDriverTrip");

          if (response.status === STATUS_NOT_ANSWERED) customerOnTripExpired();
        }

        initProcessingCallTrip();
      })
      .catch((e) => console.log(e));
    return;
  }

  if (trip.status === STATUS_GET_BID_BY_DRIVERS)
    return startTripBidOfferScreen(trip, type);

  if (trip.status === STATUS_SCHEDULED) {
    if (
      document
        .querySelector(".trip-bid-offer-modal")
        .classList.contains("active")
    ) {
      Session.delete("tripReference");
      initProcessingCallTrip(false);
      return showScheduleTrip(trip.tripReference);
    }
  }

  if (
    trip.status === STATUS_SEARCHING ||
    trip.status === STATUS_SEARCHING_FAVORITE
  ) {
    if (!managerTrip.isSearch) initSearchTrip(trip);
    return;
  }

  if (trip.status === STATUS_ACCEPTED || trip.status === STATUS_PRE_ACCEPTED) {
    if (trip.tripCallTypeId === TYPE_RIDE) return;
    initRace(trip);
    return;
  }

  if (trip.status === STATUS_BOARDING) {
    viewController.elementProperty.getElement("#songAlert", (element) => {
      element.play();
    });
  }

  if (trip.status === STATUS_BOARDING || trip.status === STATUS_IN_PROGRESS) {
    if (trip.tripCallTypeId === TYPE_RIDE) return;
    initRace(trip);
  }
}

function prepareScreenTrip() {
  viewController.elementProperty.addClass(".btn-call-trip", "active");
  viewController.elementProperty.addClass("#callRunning", "remove");
}

function initProcessingCallTrip(showButtonCall = true) {
  Route.removeGroupComponent(COMPONENT_CREATE_TRIP);

  clearTimeout(timeOutUpdatePrice);

  preload(false);

  hiddenNotificationInBackground();

  animationPlacesMap(false);

  managerUpdateTrip.searchingCars.map((item) => {
    mapService.removeMakerMap(item);
  });

  viewController.elementProperty.removeClass(".trip-bid-offer-modal", "active");
  viewController.elementProperty.removeClass(
    ".container-trip-data-v2",
    "active"
  );
  viewController.elementProperty.removeClass(
    ".btn-travel-track-shared",
    "active"
  );
  viewController.elementProperty.removeClass(".switch-type-trip", "hide");
  viewController.elementProperty.removeClass(
    ".container-info-details-price",
    "active"
  );
  viewController.elementProperty.removeClass(".edit-price", "active");
  viewController.elementProperty.removeClass(".modal-type-customer", "active");
  viewController.elementProperty.removeClass(
    ".modal-type-customer",
    "form-customer"
  );
  viewController.elementProperty.removeClass(".history-trips", "active");
  viewController.elementProperty.removeClass(".container-logo", "active");
  viewController.elementProperty.removeClass(".footer-payment-form", "active");
  viewController.elementProperty.removeClass(
    ".footer-container-trip",
    "active"
  );
  viewController.elementProperty.removeClass(
    ".map-client",
    "active",
    "in-trip"
  );
  viewController.elementProperty.removeClass(
    ".container-local-confirmation-option",
    "active"
  );
  viewController.elementProperty.removeClass(
    ".btn-cancel-processing-trip",
    "active"
  );
  viewController.elementProperty.removeClass(".container-logo", "active");
  viewController.elementProperty.removeClass(".trip-client", "active");
  viewController.elementProperty.removeClass(
    ".search-driver-in-trip",
    "active"
  );
  viewController.elementProperty.removeClass(
    ".container-cancel-request-trip",
    "active"
  );
  viewController.elementProperty.getElement(
    ".container-waypoint-search",
    (element) => {
      element.remove();
    }
  );

  tripCurrentRepository.close();

  viewController.elementProperty.getElement(".add-place-stop", (element) => {
    element.style = "";
  });

  viewController.elementProperty.getElement(
    "#obsOrigin",
    (element) => (element.innerHTML = "")
  );
  viewController.elementProperty.getElement(
    "#obsDestination",
    (element) => (element.innerHTML = "")
  );
  viewController.elementProperty.getElement(
    "#obs",
    (element) => (element.innerHTML = "")
  );
  viewController.elementProperty.removeClass(".item-delivery-trip", "active");

  trip.amountWaypoints = 0;
  trip.waypoints = [];

  mapService.removeRoute();
  markerLocalConfirmationOption = mapService.removeMakerMap(
    markerLocalConfirmationOption
  );
  markerPointOrigin = mapService.removeMakerMap(markerPointOrigin);

  clearDataKnob();
  clearCouponApply();
  setTimeout(showVehicles, 3000);

  if (mapService.map != null)
    mapService.map.setOptions({ styles: mapService.getStyleMapDefault() });

  if (mapService.infoSearch !== null) mapService.infoSearch.remove();

  document.getElementById("origin").disabled = false;
  document.getElementById("destination").disabled = false;

  if (priceTrip) priceTrip.typeDriverSelected = null;

  mapService.removeDetailMap();

  mapService.clearTimeArrival();
  mapService.clearWaypointInfoPreAccepted();
  managerUpdateTrip.searchingCars.map((point) => {
    point.setVisible(true);
  });

  Session.delete("dateInitTrip");
  Session.delete("dateScheduleTrip");

  viewController.elementProperty.getElement(
    ".search-address-location",
    (element) => {
      element.value = "";
      trip[element.getAttribute("id")] = null;
    }
  );

  managerTrip.recalculatedTrip = null;
  managerTrip.typeTaxi.priceId = null;
  managerTrip.typeTaxi.price = null;
  managerTrip.typeTaxi.tripTypeId = null;
  managerTrip.typeTaxi.tripType = null;
  managerTrip.inTrip = false;
  managerTrip.isSearch = false;

  viewController.elementProperty.getElement(".container-km-trip", (element) => {
    element.innerHTML = "";
  });

  managerUpdateTrip.chatRepository.close();

  activeMenu();
  if (showButtonCall) {
    showAdvertising();

    showTab();

    mapService.map.setMyLocationEnabled(true);

    verifyExistPublicity();
    viewController.elementProperty.removeClass(
      ".floating-icon-coupon",
      "active"
    );
    viewController.elementProperty.removeClass(".btn-call-trip", "active");

    if (!Array.isArray(Session.get("location")))
      setZoomInPosition(Session.get("location"));

    createListAddressShortcut();
  } else {
    viewController.elementProperty.addClass(".btn-call-trip", "active");
  }
}

function getUpdateTrip() {
  const customerController = new CustomerController();

  customerController
    .find(userLogged.idUser)
    .then(({ message, status, data }) => {
      if (!status) {
        SwalCustom.messageDialog(message, "Atenção", getUpdateTrip, "warning");
        return;
      }

      verifyListTripActivePartner();

      const config = Session.get("configGeneral");
      const picturesLink = config.find(item => {
          return item.key === 'link_storage_pictures';
      });
      const finalLink = `${picturesLink.value}customer/profile/compressed/`;             

      userLogged.customerRegisterStatusId = data.customerRegisterStatusId;
      userLogged.idPartner = data.idPartner;
      userLogged.partnerRegisterStatusId = data.partnerRegisterStatusId;
      userLogged.partnerRegisterStatus = data.partnerRegisterStatus;
      userLogged.profileImage = data.profileImage
        ? `${finalLink}${data.profileImage}`
        : null;
      //   ? `${PATH_IMAGE_PROFILE + data.profileImage}`
      //   : null;
      userLogged.document = data.document;
      userLogged.phone = data.phone;
      userLogged.name = data.name;
      userLogged.nickname = data.nickname;
      userLogged.nameEstablishment = data.nameEstablishment;
      userLogged.function = data.function;
      userLogged.userTypeId = data.userTypeId;
      userLogged.dateOfBirth = data.dateOfBirth;
      userLogged.referralMonetization = data.referralMonetization;
      userLogged.rg = data.rg;
      userLogged.rgFrontPicture = data.rgFrontPicture;
      userLogged.rgBackPicture = data.rgBackPicture;
      userLogged.isDependent = data.isDependent;
      userLogged.militaryForce = data.militaryForce;
      userLogged.militaryPatent = data.militaryPatent;
      userLogged.militaryStatus = data.militaryStatus;
      userLogged.om = data.om;
      userLogged.rating = data.rating;
      userLogged.gender = data?.gender;

      Session.set("currentBalanceClient", data.tripBalance);

      Session.set("user", userLogged);

      if (updateDataUserMenu) updateDataUserMenu();

      checkV2Active();

      checkOptionMenu();

      // viewController.elementProperty.getElement("#accountCustomer", element => {
      //     element.style.display = userLogged.idPartner !== null ? "block" : "none";
      // });

      updateMenuReferralMonetization(userLogged.referralMonetization);

      function checkDataTripCustomer(data) {
        if (data.trip) {
          Session.set("tripReference", data.trip.tripReference);
          viewController.elementProperty.addClass(".btn-call-trip", "active");
          mapService.map.setMyLocationEnabled(false);
        } else {
          if (
            !document
              .querySelector(".container-logo")
              .classList.contains("active") &&
            !document
              .querySelector(".modal-type-customer")
              .classList.contains("active") &&
            !document
              .querySelector(".footer-container-trip")
              .classList.contains("active")
          ) {
            showVehicles();
            showAdvertising();
            viewController.elementProperty.removeClass(
              ".btn-call-trip",
              "active"
            );
            createListAddressShortcut();
          }
        }

        verifyTrip();
      }

      verifyDocumentsDataCustomer(() => {
        checkDataTripCustomer(data);
      }).then((status) => {
        if (status) checkDataTripCustomer(data);
      });

      viewController.elementProperty.getElement("#balanceClient", (element) => {
        element.innerHTML = `(${CityConfig.getTypeCoin()} ${Mask.maskMoney(
          parseFloat(data.tripBalance)
        )})`;
      });
    })
    .catch((error) => {
      console.log(error);
      setTimeout(getUpdateTrip, 1500);
    });
}

function checkOptionMenu() {
  const user = Session.get("user");

  if (
    Session.get("configGeneral").filter((item) => {
      return item.key === "enable_dependent" && item.value == true;
    }).length > 0 &&
    user.isDependent == false
  ) {
    document.querySelector("#itemMenuDependent").style = "";
  }
}

function checkV2Active() {
  if (ConfigGeneral().get("enable_client_v2") == true)
    document.body.classList.add("v2");
}

function activeMenu() {
  viewController.elementProperty.getElement(".menu-close", (element) => {
    element.classList.remove("open");

    element.onclick = function (e) {
      e.stopPropagation();
      if (this.classList.contains("open")) {
        Route.backPage();
        return;
      }

      showMenu();

      Route.startClassesInComponent(
        [{ component: ".menu-close", class: "open" }],
        () => {
          this.classList.remove("open");
          showMenu(false);
        }
      );
    };

    function showMenu(result = true) {
      viewController.elementProperty.getElement(
        ".container-menu-options",
        (element) => {
          if (result) {
            element.classList.add("active");
            return;
          }
          element.classList.remove("active");
        }
      );
    }
  });
}

function updateMenuReferralMonetization(referralMonetization) {
  const monetizationEnabled = Session.get("configGeneral").find(
    (item) => item.key === "monetization_enabled"
  );

  if (!monetizationEnabled) return;

  if (monetizationEnabled.value == false) return;

  document.querySelector(".container-menu-indication").style = "";
  document.querySelector("#itemMenuIndication").style = "";
  document.querySelector("#labelIndicationType").innerHTML =
    referralMonetization.label;
  document.querySelector("#labelUserIndications").innerHTML =
    referralMonetization.userIndications;
}
