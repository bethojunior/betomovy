const STATUS_CALL_PARTNER = "3";

function finishTrip(trip) {
    showTab();

    Session.delete("lastDriverInTrip");
    Session.delete("tripReference");
    Session.delete("positionDriverTrip");

    const elementProperty = new ElementProperty();
    elementProperty.addClass(".container-finish-trip", "active");

    elementProperty.addEventInElement("#closeFinishTrip", "onclick", function () {
        elementProperty.removeClass(".container-finish-trip", "active");

        if (trip.tripCallTypeId != STATUS_CALL_PARTNER)
            showEvaluation(trip);
    });

    if (trip.recalculatedPrice != null) {
        document.querySelector(".container-message-recalculate").classList.add("active");
        document.querySelector("#obsRecalculatePrice").innerHTML = trip.recalculatedPrice.message || "";
    } else {
        document.querySelector(".container-message-recalculate").classList.remove("active");
    }

    if (!trip.priceRange) {
        elementProperty.getElement(".type-price-normal", element => element.style.display = "block");
        elementProperty.getElement(".type-price-rage", element => element.style.display = "none");
    } else {
        elementProperty.getElement(".type-price-normal", element => element.style.display = "none");
        elementProperty.getElement(".type-price-rage", element => element.style.display = "block");

        document.querySelector("#descriptionPriceRange").innerHTML = trip.priceRange.description;
    }

    elementProperty.getElement("#originAddressFinishTrip", element => {
        element.innerHTML = trip.origin.address;
    });
    elementProperty.getElement("#destinationAddressFinishTrip", element => {
        element.innerHTML = trip.destination.name;
    });
    elementProperty.getElement("#priceTrip", element => {
        element.innerHTML = `${CityConfig.getTypeCoin()}${Mask.maskMoney(parseFloat(trip.price))}`;
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
    if (trip.ecoInfo != null) {
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

function getRating(rating, trip, comment) {
    viewController.elementProperty.removeClass(".modal-evaluation", "active");

    viewController.elementProperty.addClass(".rating-trip", "active");

    TripRatingController.rating(rating, trip.tripReference, comment);
}

function showEvaluation(trip) {
    const config = Session.get("cityConfig");

    if (config.showUserRating == false)
        return;

    viewController.elementProperty.getElement(".name-driver-trip", element => {
        element.innerHTML = trip.driver.nickname;
    });

    viewController.elementProperty.getElement(".image-profile-driver", element => {
        const config = Session.get("configGeneral");
        const picturesLink = config.find(item => {
            return item.key === 'link_storage_pictures';
        });
            
        const finalLink = `${picturesLink.value}driver/profile/compressed/`;

        //element.src = PATH_PROFILE_DRIVER + trip.driver.profileImage;
        // element.style.backgroundImage = `url('${PATH_PROFILE_DRIVER + trip.driver.profileImage}')`;
        element.style.backgroundImage = `url('${finalLink + trip.driver.profileImage}')`;
    });

    const evaluation = new Evaluation(trip);

    evaluation.show(getRating);
    
}
