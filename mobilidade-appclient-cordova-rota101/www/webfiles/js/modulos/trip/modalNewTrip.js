function openModalNewTrip(trip) {
    viewController.elementProperty.addClass(".modal-new-trip", "active");

    viewController.elementProperty.addEventInElement("#btnNewTripClient", "onclick", function () {
        if (parseInt(trip.tripPaymentFormId) === PAYMENT_CARD_CREDIT) {
            getCardSelectedPayTrip(Session.get("cardSelected")).then(() => {
                anotherTrip(trip);
            }).catch((message) => {
                SwalCustom.messageDialog("", message, undefined, "warning");
            });
            return;
        }

        anotherTrip(trip);
    });

    viewController.elementProperty.addEventInElement("#closeModalNewTrip", "onclick", function () {
        viewController.elementProperty.removeClass(".modal-new-trip", "active");
    });
}

function anotherTrip(trip) {
    initNewTrip({
        userId: parseInt(trip.userId),
        tripTypeId: trip.tripTypeId,
        tripPaymentFormId: trip.tripPaymentFormId,
        origin: {
            address: trip.origin.address,
            latitude: parseFloat(trip.origin.latitude),
            longitude: parseFloat(trip.origin.longitude)
        },
        destination: {
            address: trip.destination.name,
            latitude: parseFloat(trip.destination.latitude),
            longitude: parseFloat(trip.destination.longitude)
        },
        distance: parseFloat(trip.distance),
        estimatedTripTime: parseFloat(trip.estimatedTripTime),
        waypoints: trip.tripWayPoints.map(item => {
            return {
                lat: parseFloat(item.latitude),
                lng: parseFloat(item.longitude),
                neighborhood: item.neighborhood,
                address: item.address,
                latitude: parseFloat(item.latitude),
                longitude: parseFloat(item.longitude)
            }
        }),
        priceId: trip.priceId,
        price: trip.price,
        cityId: Session.get("cityIdTrip"),
        tripDiscountCoupon: {
            oldPrice: trip.tripDiscountCoupon?.oldPrice ,
            userDiscountCouponId: trip.tripDiscountCoupon?.userDiscountCouponId
        }
    });

    viewController.elementProperty.removeClass(".modal-new-trip", "active");
}

function initNewTripAfterCancel(trip) {
    if(trip.tripReference === Session.get("initTripCancel"))
        return;

    Session.set("initTripCancel",trip.tripReference);

    const newTrip = {
        userId: parseInt(trip.userId),
        tripTypeId: trip.tripTypeId,
        tripPaymentFormId: trip.tripPaymentFormId,
        origin: {
            address: trip.origin.address,
            latitude: parseFloat(trip.origin.latitude),
            longitude: parseFloat(trip.origin.longitude)
        },
        destination: {
            address: trip.destination.name,
            latitude: parseFloat(trip.destination.latitude),
            longitude: parseFloat(trip.destination.longitude)
        },
        priceId: trip.priceId,
        distance: parseFloat(trip.distance),
        estimatedTripTime: parseFloat(trip.estimatedTripTime),
        schedule: null,
        waypoints: trip.tripWayPoints.map(item => {
            return {
                lat: parseFloat(item.latitude),
                lng: parseFloat(item.longitude),
                neighborhood: item.neighborhood,
                address: item.address,
                latitude: parseFloat(item.latitude),
                longitude: parseFloat(item.longitude),
                obs: item.obs
            }
        }),
        price: trip.price,
        tripDiscountCoupon: {
            oldPrice: trip.tripDiscountCoupon?.oldPrice,
            userDiscountCouponId: trip.tripDiscountCoupon?.userDiscountCouponId
        },
        isOffer: trip?.isOffer === "1" ? true : 0
    };


    if(trip?.multiplierDynamic) {
        newTrip.multiplierDynamic = trip.multiplierDynamic 
    }

    if (trip.deliveryInfo != null) {
        if (!Array.isArray(trip.deliveryInfo)) {
            newTrip.deliveryInfo = {
                obsOrigin: trip.deliveryInfo.obsOrigin,
                obsDestination: trip.deliveryInfo.obsDestination,
                obs: trip.deliveryInfo.obs,
            };

            newTrip.tripItems = [{tripItemTypeId: trip.tripItems.tripItemTypeId}];
        }
    }

    initNewTrip(newTrip, false);


    viewController.elementProperty.removeClass(".modal-new-trip", "active");
}