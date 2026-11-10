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
        element.style.backgroundColor = '#e2e8f0';
        element.style.backgroundPosition = 'center';
        element.style.backgroundSize = 'cover';
        element.style.backgroundRepeat = 'no-repeat';

        const fallbackAvatar = '/webfiles/img/icon/avatar.png';
        const driver = trip?.driver || {};
        const rawPhoto = (
            driver.profileImage ||
            driver.profileImageUrl ||
            driver.driverImage ||
            driver.profilePhoto ||
            driver.photo ||
            driver.avatar ||
            trip?.driverPhoto ||
            ""
        ).toString().trim();

        if (!rawPhoto || rawPhoto === 'null' || rawPhoto === 'undefined' || rawPhoto === 'user.png' || rawPhoto.endsWith('/user.png')) {
            element.style.backgroundImage = `url('${fallbackAvatar}')`;
            return;
        }

        const candidates = [];
        const pushCandidate = (url) => {
            if (url && !candidates.includes(url)) candidates.push(url);
        };

        if (rawPhoto.startsWith('http://') || rawPhoto.startsWith('https://')) {
            pushCandidate(rawPhoto);
        } else {
            const clean = rawPhoto.replace(/^\/+/, '').replace(/^driver\/profile\//, '').replace(/^compressed\//, '');
            pushCandidate(`https://api.movymob.com/driver/profile/compressed/${clean}`);
            pushCandidate(`https://api.movymob.com/driver/profile/${clean}`);
            if (typeof environment !== 'undefined' && environment.hosts && environment.hosts.hostImageDriver) {
                pushCandidate(`${environment.hosts.hostImageDriver.replace(/\/+$/, '')}/${clean}`);
            }
            pushCandidate(`https://api.movymob.com/driver/profile/compressed/${clean}`);
        }

        let idx = 0;
        function tryNext() {
            if (idx >= candidates.length) {
                element.style.backgroundImage = `url('${fallbackAvatar}')`;
                return;
            }
            const imgUrl = candidates[idx++];
            const img = new Image();
            img.onload = () => { element.style.backgroundImage = `url('${imgUrl}')`; };
            img.onerror = () => { tryNext(); };
            img.src = imgUrl;
        }
        tryNext();
    });

    const evaluation = new Evaluation(trip);

    evaluation.show(getRating);
}