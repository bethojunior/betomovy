class InfoClientTrip {

    static showArrivalClient(trip) {
        const config = Session.get("configGeneral");
        const picturesLink = config.find(item => {
            return item.key === 'link_storage_pictures';
        });

        const profileImage = trip.customer.profileImage
        const finalLink = `${picturesLink.value}customer/profile/compressed/${profileImage}`;

        const elementProperty = new ElementProperty();
        elementProperty.getElement(".modal-signaling-arrival", element => element.classList.add("active"));

        elementProperty.getElement(".name-client-trip", element => {
            element.innerHTML = trip.customer.nickname;
        });
        elementProperty.getElement(".image-profile-driver", element => {
            if (trip.customer.profileImage === null) {
                element.src = 'webfiles/img/icon/default.jpg';
                return;
            }
            element.src = finalLink;
        });
        elementProperty.addEventInElement(".phone-driver", "onclick", function () {
            location.href = "tel:" + trip.customer.phone;
        });
        elementProperty.addEventInElement(".chat-driver", "onclick", function () {
            Route.redirectDynamic("Driver", "Chat");
            InfoClientTrip.closeArrivalClient();
        });
        elementProperty.addEventInElement(".close-modal-arrival", "onclick", function () {
            InfoClientTrip.closeArrivalClient();
        });
    }

    static closeArrivalClient() {
        const elementProperty = new ElementProperty();
        elementProperty.getElement(".modal-signaling-arrival", element => element.classList.remove("active"));
    }

    static showDataClientTrip(trip) {
        const elementProperty = new ElementProperty();
        
        InfoClientTrip.clearAllWaypoints(".modal-data-client");
        
        elementProperty.getElement(".modal-data-client", element => element.classList.add("active"));

        elementProperty.getElement(".name-client-trip", element => {
            element.innerHTML = trip.customer.nickname;
        });
        elementProperty.getElement(".origin-client", element => {
            element.innerHTML = trip.origin.address;
        });
        
        InfoClientTrip.populateWaypoints(trip, ".modal-data-client");
        
        elementProperty.getElement(".destination-client", element => {
            if (trip.tripCallTypeId === TRIP_CALL_TAXIMETER) {
                element.style.display = "none";
            } else {
                element.style = "";
            }
            element.innerHTML = trip.destination.name;
        });
        elementProperty.getElement(".image-profile-driver", element => {
            const config = Session.get("configGeneral");
            const picturesLink = config.find(item => {
                return item.key === 'link_storage_pictures';
            });

            const profileImage = trip.customer.profileImage
            const finalLink = `${picturesLink.value}customer/profile/compressed/${profileImage}`;

            if (trip.customer.profileImage === null) {
                element.src = 'webfiles/img/icon/default.jpg';
                return;
            }
            
            element.src = finalLink;
        });
        elementProperty.addEventInElement(".image-profile-driver", "onerror", function () {
            this.src = 'webfiles/img/icon/default.jpg';
        });
        elementProperty.getElement(".price-trip", element => {
            const configCity = Session.get("cityConfig");

            const showPriceField = configCity.enabledDriverFields.accept.price;
            if (showPriceField) {
                element.style.display = "block";
            } else {
                element.style.display = "none";
            }

            if (showPriceField) {
                if (trip.tripCallTypeId === TRIP_CALL_TAXIMETER) {
                    element.style.display = "none";
                } else {
                    element.style = "";
                }
            }

            element.innerHTML = `<span>${CityConfig.getTypeCoin()}</span>${Mask.maskMoney(parseFloat(trip.price))}`;
        });

        elementProperty.addEventInElement(".close-data-client", "onclick", function () {
            InfoClientTrip.closeDataClient();
        });
        elementProperty.getElement(".payment-data-client", element => {
            const configCity = Session.get("cityConfig");

            if (configCity.showFormOfPaymentToDriverDuringTrip != null)
                if (configCity.showFormOfPaymentToDriverDuringTrip == true) {
                    element.style.display = "block";
                } else {
                    element.style.display = "none";
                }

            element.innerHTML = `${getTextTranslate("trip","text-payment-in")}${trip.tripPaymentForm}`
        })
    }


    static showDataClientTripWait(trip) {
        const elementProperty = new ElementProperty();
        
        InfoClientTrip.clearAllWaypoints(".modal-data-client-trip-wait");
        
        elementProperty.addClass(".modal-data-client-trip-wait", "active");

        elementProperty.getElement(".name-client-trip", element => {
            element.innerHTML = trip.customer.nickname;
        });
        elementProperty.getElement(".origin-client", element => {
            element.innerHTML = trip.origin.address;
        });
        
        InfoClientTrip.populateWaypoints(trip, ".modal-data-client-trip-wait");
        
        elementProperty.getElement(".destination-client", element => {
            if (trip.tripCallTypeId === TRIP_CALL_TAXIMETER) {
                element.style.display = "none";
            } else {
                element.style = "";
            }
            element.innerHTML = trip.destination.name;
        });
        elementProperty.getElement(".image-profile-driver", element => {
            const config = Session.get("configGeneral");
            const picturesLink = config.find(item => {
                return item.key === 'link_storage_pictures';
            });

            const profileImage = trip.customer.profileImage
            const finalLink = `${picturesLink.value}customer/profile/compressed/${profileImage}`;

            if (trip.customer.profileImage === null) {
                element.src = 'webfiles/img/icon/default.jpg';
                return;
            }
            
            element.src = finalLink;
        });
        elementProperty.addEventInElement(".image-profile-driver", "onerror", function () {
            this.src = 'webfiles/img/icon/default.jpg';
        });
        elementProperty.getElement(".price-trip", element => {
            const configCity = Session.get("cityConfig");

            if (configCity.showPriceWhileTrip != null)
                if (configCity.showPriceWhileTrip == true) {
                    element.style.display = "block";
                } else {
                    element.style.display = "none";
                }

            if (trip.tripCallTypeId === TRIP_CALL_TAXIMETER) {
                element.style.display = "none";
            } else {
                element.style = "";
            }
            element.innerHTML = `<span>${CityConfig.getTypeCoin()}</span>${Mask.maskMoney(parseFloat(trip.price))}`;
        });

        elementProperty.addEventInElement(".close-data-client-wait", "onclick", function () {
            elementProperty.removeClass(".modal-data-client-trip-wait", "active");
        });
        elementProperty.getElement(".payment-data-client", element => {
            const configCity = Session.get("cityConfig");

            if (configCity.showFormOfPaymentToDriverDuringTrip != null)
                if (configCity.showFormOfPaymentToDriverDuringTrip == true) {
                    element.style.display = "block";
                } else {
                    element.style.display = "none";
                }

            element.innerHTML = `${getTextTranslate("trip","text-payment-in")}${trip.tripPaymentForm}`
        })
    }

    static closeDataClient() {
        const elementProperty = new ElementProperty();

        elementProperty.removeClass(".modal-data-client", "active");
    }

    static clearAllWaypoints(modalSelector) {
        const elements = this.getWaypointsElements(modalSelector);
        if (elements.container) {
            this.clearWaypointsState(elements);
        }
    }
    
    static populateWaypoints(trip, modalSelector) {
        const waypoints = trip.tripWayPoints || trip.trip_way_points || [];
        const waypointsCount = waypoints.length;
        
        const elements = this.getWaypointsElements(modalSelector);
        
        if (!elements.container) return;
        
        this.clearWaypointsState(elements);
        
        if (waypointsCount === 0) {
            return;
        }
        
        this.showWaypointsContainer(elements);
        
        if (waypointsCount === 1) {
            this.handleSingleWaypoint(elements, waypoints[0]);
        } else {
            this.handleMultipleWaypoints(elements, waypoints, waypointsCount);
        }
    }
    
    static getWaypointsElements(modalSelector) {
        return {
            container: document.querySelector(`${modalSelector} .waypoints-client-container`),
            firstWaypoint: document.querySelector(`${modalSelector} .first-waypoint-client`),
            list: document.querySelector(`${modalSelector} .waypoints-client-list`),
            toggle: document.querySelector(`${modalSelector} .waypoints-client-toggle`),
            moreBtn: document.querySelector(`${modalSelector} .waypoints-client-more-btn`),
            moreText: document.querySelector(`${modalSelector} .waypoints-client-more-text`)
        };
    }
    
    static clearWaypointsState(elements) {
        this.hideWaypointsContainer(elements);
        this.resetWaypointsContent(elements);
        this.resetMoreButton(elements);
    }
    
    static hideWaypointsContainer(elements) {
        elements.container.classList.remove('show');
        elements.container.style.display = 'none';
    }
    
    static resetWaypointsContent(elements) {
        if (elements.firstWaypoint) elements.firstWaypoint.innerHTML = '';
        if (elements.list) {
            elements.list.classList.remove('expanded');
            elements.list.innerHTML = '';
        }
        if (elements.toggle) elements.toggle.classList.remove('expanded');
        if (elements.moreText) elements.moreText.innerHTML = '';
    }
    
    static resetMoreButton(elements) {
        if (elements.moreBtn) elements.moreBtn.style.display = 'flex';
    }
    
    static showWaypointsContainer(elements) {
        elements.container.classList.add('show');
        elements.container.style.display = 'block';
    }
    
    static handleSingleWaypoint(elements, waypoint) {
        if (elements.firstWaypoint) {
            elements.firstWaypoint.innerHTML = waypoint.address;
        }
        if (elements.moreBtn) {
            elements.moreBtn.style.display = 'none';
        }
    }
    
    static handleMultipleWaypoints(elements, waypoints, waypointsCount) {
        if (elements.moreText) {
            elements.moreText.innerHTML = `+ ${waypointsCount} paradas`;
        }
        
        this.populateWaypointsList(elements, waypoints);
        this.setupWaypointsToggle(elements);
    }
    
    static populateWaypointsList(elements, waypoints) {
        if (!elements.list) return;
        
        const listHtml = waypoints
            .map(waypoint => `<li>${waypoint.address}</li>`)
            .join('');
        
        elements.list.innerHTML = listHtml;
    }
    
    static setupWaypointsToggle(elements) {
        if (!elements.moreBtn) return;
        
        elements.moreBtn.onclick = () => {
            if (elements.toggle) elements.toggle.classList.toggle('expanded');
            if (elements.list) elements.list.classList.toggle('expanded');
        };
    }
}
