class Evaluation {
    constructor() {
        this.elementProperty = new ElementProperty();

        this.elementProperty.addClass(".rating-trip", "active");

        this.rating = 5;
    }

    show(trip, callback) {
        const config = Session.get("configGeneral");
        const picturesLink = config.find(item => {
            return item.key === 'link_storage_pictures';
        });

        const profileImage = trip.customer.profileImage
        const finalLink = `${picturesLink.value}customer/profile/compressed/${profileImage}`;

        if (trip.tripCallTypeId === TRIP_CALL_CORPORATE || trip.tripCallTypeId === TRIP_CALL_RIDE)
            return callback(5);

        this.elementProperty
            .getElement(".modal-evaluation", element => element.classList.add("active"));

        this.elementProperty.addEventInElement(".close-evaluation", "onclick", () => {
            this.hidden();
        });

        this.elementProperty.getElement(".container-img-evaluation", element => {
            if (trip.customer.profileImage === null) {
                element.style.backgroundImage = 'url(webfiles/img/icon/default.png)';
                return;
            }
            // element.style.backgroundImage = `url(${CLIENT_PROFILE + trip.customer.profileImage})`;
            element.style.backgroundImage = `url(${finalLink})`;
        });

        this.elementProperty.getElement(".name-client-trip-evaluation", element => {
            element.innerHTML = trip.customer.nickname;
        });

        openEvaluateLocation(trip);

        this.elementProperty.addEventInElement(".rating-trip", "onclick",
            ({srcElement: element}) => {
                this.rating = parseInt(element.getAttribute("value"));

                this.elementProperty.getElement(".rating-trip", element => {
                    if (parseInt(element.getAttribute("value")) <= this.rating) {
                        element.classList.add("active");
                        return;
                    }
                    element.classList.remove("active");
                });
            });

        this.elementProperty.addEventInElement("#confirmationEvaluation", "onclick", () => {
            callback(this.rating);
        });
    }

    hidden() {
        this.elementProperty
            .getElement(".modal-evaluation", element => element.classList.remove("active"));
        this.elementProperty
            .getElement(".rating-trip", element => element.classList.remove("active"));
    }
    
}
