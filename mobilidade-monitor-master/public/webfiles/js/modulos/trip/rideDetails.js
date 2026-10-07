document.addEventListener("DOMContentLoaded", function () {

    const elementProperty = new ElementProperty();

    const TRIP_ANALYZE = 2;
    const TRIP_BLOCKED = 3;

    const STATUS_FINISHED = "finished";
    const STATUS_CANCELED = "canceled";
    const STATUS_PAYMENT_REFUSED = "payment_refused";
    const STATUS_NOT_ANSWERED = "not_answered";
    const STATUS_BACK_OFF = "back_off";

    const mapService = new MapService();

    const tripReference = location.pathname.split("/")[2];

    let polyline = null;

    showDetailsTrip();

    function showDetailsTrip() {
        preload(true);
        TripController.getRideTrip(tripReference).then(data => {
            showTrip(data.response);
            document.getElementById('gps-fake').innerHTML = data.response.usedFakeGps === 1 ? `Nessa corrida foi utilizada GPS fake` : "";
        });

        getChatTrip();
    }

    function getChatTrip() {
        TripController.getChat(tripReference).then(({response}) => {
            elementProperty.getElement("#containerMessages", element => {
                element.innerHTML = response.map(chat => {
                    const type = chat.isDriver ? "driver" : "customer";

                    if (chat.isAudio) {
                        return `<li class="${type}">
                                    <div>
                                        <audio class='message' controls><source src='${environment.hosts.hostAudio}${tripReference}/${chat.message}'></audio>
                                    </div>
                                </li>`
                    }

                    return `<li class="${type}">
                                 <div>${chat.message}</div>    
                            </li>`;
                }).join("");
            });
        });
    }


    function showTrip(response) {

        elementProperty.getElement(".client-request", element => {
            const {customerPhoto, holderName, ride} = response;

            if (!holderName && !customerPhoto)
                return;

            ride.riders.map(async (rider) => {
                await mountRiders(element, rider);

                elementProperty.getElement(`#customer-photo${rider.id}`, customerPhoto => {
                    customerPhoto.addEventListener('click', () => {
                        $('#customerRideTrip').modal('show');
                        const customerRideTrip = document.getElementById('customerRideTripDetails');
                        customerRideTrip.innerHTML = `
                                <div>
                                    <div>
                                        <img src="${environment.hosts.hostImageClient + rider.profileImage}" 
                                            alt="Foto do Passageiro" style="width: 100px; height: 100px; border-radius: 5%">
                                        <div class="mt-4">
                                            <p><b>Nome:</b> ${rider.name}</p>
                                            <p><b>Telefone:</b> ${rider.phone}</p>
                                        </div>
                                    </div>
                                    <div>
                                        <p><b>Valor da Passagem:</b> R$ ${Mask.maskMoney(rider.valuePerSeat)}</p>
                                        <p><b>Forma de Pagamento:</b> ${rider.tripPaymentForm}</p>
                                    </div>
                                </div>
                        `;
                    });
                });

            });

        });

        function mountRiders(element, rider) {
            const profileImageURL = environment.hosts.hostImageClient + rider.profileImage;
            element.innerHTML +=  `<div class="customer-photo" 
                                    id="customer-photo${rider.id}"
                                    title="Ver Detalhes do Passageiro"
                                    style="background-image: url('${profileImageURL}');cursor: pointer"></div>
                                `;
        }

        elementProperty.getElement("#dateTimeTrip", element => {
            element.innerHTML = Mask.setDateCrazy(response.date);
        });

        elementProperty.getElement("#originTrip", element => {
            element.innerHTML = `<span>${response.originAddress}</span><span>${Mask.setDateCrazy(response.date)}</span>`;
        });

        elementProperty.getElement("#destinationTrip", element => {
            if (response.endDate !== null)
                element.innerHTML = `<span>${response.destinationAddress}</span><span>${Mask.setDateCrazy(response.endDate)}</span>`;
        });

        elementProperty.getElement("#tripType", element => {
            element.innerHTML = response.tripType;
        });

        elementProperty.getElement("#durationTrip", element => {
            element.innerHTML = convertToMinutes(response.estimatedTripTime).toFixed(2) + ' min';
        });

        elementProperty.getElement("#km", element => {
            element.innerHTML = convertToKilometers(response.distance) + ' km';
        });

        elementProperty.getElement(".price-trip-total", element => {
            let total = 0;
            response.ride.riders.map(rider => {
                total += rider.valuePerSeat;
            });

            element.innerHTML = `R$ ${Mask.maskMoney(total)}`;
        });

        elementProperty.getElement("#multiplierDynamic", element => {
            element.innerHTML = response.multiplierDynamic;
        });

        if (response.recalculated_trip) {
            document.querySelector("#contentRecalculated").style.display = "flex";
            if (response.recalculated_trip.newDistance)
                elementProperty.getElement("#kmRecalculated", element => {
                    element.innerHTML = `${response.recalculated_trip.newDistance.toFixed(3)} km`;
                });
            if (response.recalculated_trip.newTripTime)
                elementProperty.getElement("#durationTripRecalculated", element => {
                    element.innerHTML = `${parseInt(response.recalculated_trip.newTripTime)} min`;
                });

            elementProperty.getElement("#priceRecalculated", element => {
                element.innerHTML = `R$ ${Mask.maskMoney(response.recalculated_trip.newPrice)}`;
            });
        }

        elementProperty.getElement("#situationTrip", element => {
            element.innerHTML = response.situation;
        });
        elementProperty.getElement("#tripCallType", element => {
            element.innerHTML = response.tripCallType;
        });

        elementProperty.getElement(".photo-driver", element => {
            element.style.backgroundImage = `url(${environment.hosts.hostImageDriver}${response.driverPhoto})`;
        });

        elementProperty.getElement(".name-driver", element => {
            element.innerHTML = response.driverName || "";
        });

        if (response.trip_history.length !== 0) {
            if (response.status !== 'back_off' && response.status !== 'not_answered' && response.status !== 'payment_refused') {
                elementProperty.getElement(".balance-in-start-call-driver", element => {
                    const driverBalance = response.trip_history[0].driverBalanceInStartCall;
                    const balanceText = driverBalance !== null ? `R$ ${driverBalance}` : 'Não disponível';
                    element.innerHTML = `<b>Saldo no Momento do Chamado:</b> ${balanceText}`;
                });
            } else {
                elementProperty.getElement(".balance-in-start-call-driver", element => {
                    element.style.display = 'none';
                });
            }
        } else {
            elementProperty.getElement(".balance-in-start-call-driver", element => {
                element.style.display = 'none';
            });
        }

        elementProperty.getElement("#currentStatusTrip", element => {
            element.innerHTML = getStatus(response.status);
            response.status == "canceled" ? document.querySelector('#tripCanceledContainer').classList.add("d-flex") : document.querySelector('#tripCanceledContainer').classList.remove("d-flex");
        });

        elementProperty.getElement(".observation-container", () => {
            document.querySelector('#observationTrip').innerHTML = response.description;
            response.description == null
            ? document.querySelector('.observation-container').classList.remove('d-flex')
            : document.querySelector('.observation-container').classList.add('d-flex');
        });

        elementProperty.getElement("#tripCanceledBy", element => {
            response.canceledBy == 'driver' ? element.innerHTML = 'Motorista' : element.innerHTML = 'Cliente';
        });

        elementProperty.getElement(".type-driver", element => {
            element.innerHTML = response.driverType || "";
        });

        elementProperty.getElement("#btnReleaseTrip", element => {
            element.hidden = !(response.tripAuditId === TRIP_ANALYZE || response.tripAuditId === TRIP_BLOCKED);
        });

        preload(false);
        elementProperty.getElement("#cancelTrip", element => {
            element.hidden = (
                response.status === STATUS_FINISHED ||
                response.status === STATUS_CANCELED ||
                response.status === STATUS_BACK_OFF ||
                response.status === STATUS_NOT_ANSWERED ||
                response.status === STATUS_PAYMENT_REFUSED
            );
        });

        elementProperty.addEventInElement("#cancelTrip", "onclick", function () {

            SwalCustom.dialogConfirm("", "Deseja cancelar essa viagem ?", function (status) {
                if (status)
                    TripController.canceledTrip(tripReference).then(res => {
                        if (res.status) {
                            SwalCustom.messageDialog('', res.message, 'success');
                            showDetailsTrip();
                            return;
                        }
                        SwalCustom.messageDialog('ops..', res.message, 'error');
                    });
            });
        });

        elementProperty.addEventInElement('#btnDocumentClient', 'onclick', function () {
            document.querySelector('.documents-user').innerHTML = "";
            preload(true);
            const userId = response.userId;
            $('#documentModal').modal('show');
            ClientController.getDocumentsCustomer(userId).then(({response}) => {
                preload(false);
                document.querySelector('.documents-user').innerHTML = response.map(item => {
                    return `
                            <div ${ item.isImage === 1 ? `data-src="${item.image}"` : ""} class="col-4 ${item.isImage === 1 ? "gallery-photo" : ""} ">
                                <div class="card item-gallery card-document">
                                    ${ item.isImage === 1
                        ? `<img src="${item.image}" class="card-img-top img-document" alt="...">`
                        : `<div class="material-icons align-self-center icon-document">description</div>`
                    }
                                    <div class="card-body d-flex flex-column card-document-details">
                                        <h6 class="card-title align-self-center font-weight-bold">${item.label}</h6>
                                        <p class="card-text align-self-center">${item.text}</p>
                                        ${ item.image === null 
                                            ? '' 
                                            : `<a href="#" class="material-icons align-self-end mt-1">visibility</a>`
                                        }
                                    </div>
                                </div>
                            </div>
                        `
                }).join('');
                const content = $("#contentGallery");

                content.lightGallery();
                content.data('lightGallery').destroy(true);

                $("#contentGallery").lightGallery({selector: ".gallery-photo"});
            });
        });

        elementProperty.addEventInElement("#btnReleaseTrip", "onclick", function () {
            SwalCustom.dialogConfirm('Deseja liberar essa corrida?', 'Essa ação é permanente', data => {
                if (data) {
                    TripController.releaseTripInAnalysi(tripReference).then(resolve => {
                        if (resolve.status) {
                            SwalCustom.messageDialog('', 'Viagem liberada', 'success');
                            showDetailsTrip();
                        }
                        SwalCustom.messageDialog('', resolve.message, 'info');
                    });
                }
            });
        });


        mapService.importScriptWithPlaces(true).then(() => {
            mapService.getImageStaticRoute(tripReference, Session.get("googleApiKey"),
                {lat: response.originLatitude, lng: response.originLongitude},
                {lat: response.destinationLatitude, lng: response.destinationLongitude}, [], [],
                response.ride.routeLayout ? response.ride.routeLayout : null ).then((image) => {
                elementProperty.getElement("#imageTrip", element => {
                    element.setAttribute("src", image);
                })
            });

            elementProperty.getElement(".container-map", element => {
                mapService.initMap({lat: 0, lng: 0}, 12.81, element);
            });

            elementProperty.addEventInElement("#viewMessageRideTrip", "onclick", function () {
                elementProperty.addClass(".modal-chat-trip", "active");
            });

            elementProperty.addEventInElement("#closeModalChat", "onclick", function () {
                elementProperty.removeClass(".modal-chat-trip", "active");
            });

            elementProperty.addEventInElement("#openModalMap", "onclick", function () {
                elementProperty.addClass(".container-modal-detail-map", "active");
                showInMap(response);
            });
        });
    }

    function showInMap(response) {
        elementProperty.addEventInElement("#closeModalMap", "onclick", function () {
            elementProperty.removeClass(".container-modal-detail-map", "active");
            mapService.clearEvent();
        });

        const origin = {
            lat: parseFloat(response.originLatitude),
            lng: parseFloat(response.originLongitude)
        };

        const destination = {
            lat: parseFloat(response.destinationLatitude),
            lng: parseFloat(response.destinationLongitude)
        };

        mapService.showPointEventMap(origin, destination, response.events);

        const events = response.events.map((event, index) => {
            return {
                lat: parseFloat(event.data.driver.location.latitude),
                lng: parseFloat(event.data.driver.location.longitude)
            };
        });
        function showRouteInMap(points){
            if (polyline != null)
                polyline.setMap(null);

            const path = MapService.decodePolyline(points);

            let bounds = [origin, ...events, ...path, destination];

            polyline = new google.maps.Polyline({
                path,
                geodesic: true,
                strokeColor: '#000000',
                strokeOpacity: 1.0,
                strokeWeight: 2.5,
            });

            polyline.setMap(mapService.map);

            mapService.setBoundsArray(bounds)
        }

        if (response.ride.routeLayout) {
            showRouteInMap(response.ride.routeLayout);
        } else {
            MapService.getRouteByTrip(tripReference).then(({response}) => {
                showRouteInMap(response.points)
            });
        }

        elementProperty.getElement("#listStatusDetailTrip", element => {
            const listStatus = response.events.map((event, index) => {
                return `<li value="${index}" class="show-point-in-map">
                            <img src="/webfiles/img/icon/point-${index}.png">
                            <div>
                                <span>${event.message}</span> 
                                <span>${new Date(event.date).toLocaleString()}</span>
                            </div>
                        </li>`
            }).join("");

            element.innerHTML = `    
                            <li style="display: flex;flex-direction: column;margin: 5px;">
                                <img src="/webfiles/img/icon/origin.png">ORIGEM
                                <span>${response.originAddress}</span>
                            </li>
                                
                             ${listStatus}
                            <li style="display: flex;flex-direction: column;margin: 5px;">
                                <img src="/webfiles/img/icon/destination.png">DESTINO
                                <span>${response.destinationAddress}</span>
                            </li> 
                            `;

            elementProperty.addEventInElement(".show-point-in-map", "onclick", function () {
                mapService.markersPoints.map((marker) => {
                    marker.setZIndex(1);
                });
                mapService.map.setCenter(mapService.markersPoints[this.getAttribute("value")].getPosition());
                mapService.map.setZoom(18);
                mapService.markersPoints[this.getAttribute("value")].setZIndex(100);
            });
        })
    }

    function getStatus(status) {
        const allStatus = {
            "searching": "Buscando motorista",
            "searching_favorite": "Buscando motorista favorito",
            "pre_accepted": "Aceita por motorista em viagem",
            "accepted": "Aceita",
            "boarding": "Embarcando",
            "in_progress": "Em viagem",
            "finished": "Finalizada",
            "canceled": "Cancelada",
            "payment_refused": "Pagamento recusado",
            "not_answered": "Não atendida",
            "back_off": "Desitiu",
        };

        if (!allStatus[status])
            return 'Status não definido';

        return allStatus[status];
    }

    function convertToKilometers(meters) {
        return meters / 1000;
    }

    function convertToMinutes(seconds) {
        return seconds / 60;
    }

});
