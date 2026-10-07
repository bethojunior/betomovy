const STATUS_CALL_PARTNER = "3";

function finishTrip(trip) {
    Session.deleteLocal("tripReference");

    const elementProperty = new ElementProperty();
    elementProperty.addClass(".container-finish-trip", "active");

    elementProperty.addEventInElement("#closeFinishTrip", "onclick", function () {
        elementProperty.removeClass(".container-finish-trip", "active");

        if (trip.tripCallTypeId != STATUS_CALL_PARTNER)
            showEvaluation(trip);
    });

    elementProperty.getElement("#originAddressFinishTrip", element => {
        element.innerHTML = trip.origin.address;
    });
    elementProperty.getElement("#destinationAddressFinishTrip", element => {
        element.innerHTML = trip.destination.name;
    });
    elementProperty.getElement("#priceTrip", element => {
        element.innerHTML = Mask.maskMoney(parseFloat(trip.price));
    });
    elementProperty.getElement("#tripPaymentForm", element => {
        element.innerHTML = trip.tripPaymentForm;
    });
    elementProperty.getElement("#nameClientTrip", element => {
        element.innerHTML = trip.customerName;
    });
    elementProperty.getElement(".trip-normal-finish", element => {
        element.style.display = "none";
    });
    if (trip.ecoInfo !== null) {
        elementProperty.getElement(".eco-trip", element => {
            element.style.display = "flex";
        });
        elementProperty.getElement(".footer-finish-trip", element => {
            element.style.display = "";
        });

        elementProperty.getElement("#economizedC02", element => {
            element.innerHTML = Mask.maskMoney(parseFloat(trip.ecoInfo.co2ShouldSpent) -
                parseFloat(trip.ecoInfo.co2Economized));
        });
        elementProperty.getElement("#co2ShouldSpent", element => {
            element.innerHTML = `${Mask.maskMoney(parseFloat(trip.ecoInfo.co2ShouldSpent))}<span>CO²</span>`;
        });
        elementProperty.getElement("#co2Economized", element => {
            element.innerHTML = `${Mask.maskMoney(parseFloat(trip.ecoInfo.co2Economized))}<span>CO²</span>`;
        });
        return;
    }
    elementProperty.getElement(".eco-trip", element => {
        element.style.display = "none";
    });
    elementProperty.getElement(".trip-normal-finish", element => {
        element.style.display = "";
    });
}

function getRating(rating, trip) {
    viewController.elementProperty.removeClass(".modal-evaluation", "active");

    viewController.elementProperty.removeClass(".rating-trip", "active");

    TripRatingController.rating(rating, trip.tripReference);
}

function showEvaluation(trip) {
    viewController.elementProperty.getElement(".name-driver-trip", element => {
        element.innerHTML = trip.driver.nickname;
    });

    viewController.elementProperty.getElement(".image-profile-driver", element => {
        //element.src = PATH_PROFILE_DRIVER + trip.driver.profileImage;
        element.style.backgroundImage = `url('${environment.hosts.hostImageDriver + trip.driver.profileImage}')`;
    });

    const evaluation = new Evaluation(trip);

    evaluation.show(getRating);
}