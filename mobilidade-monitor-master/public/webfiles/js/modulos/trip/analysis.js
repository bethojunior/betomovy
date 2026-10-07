preload(true);
const elementProperty = new ElementProperty();
let mapService = new MapService()
let pathImage = environment.hosts.hostImageClient;
let pathDriver = environment.hosts.hostImageDriver;
let pathImageDefault = environment.hosts.hostImageDefault;
const manager = {
    key: "",
};

mapService.getKey().then(({status, data}) => {
    if (!status)
        return;
    manager.key = data;
});

mountListTrips()

function buttonsVisibility(response) {
    if(response?.data?.length > 0) {
        elementProperty.addClass(".buttons-container","active");
    } else {
        elementProperty.removeClass(".buttons-container","active")
    }
    if(response?.current_page == 1) {
        document.getElementById("previous-btn").setAttribute("disabled", true)
    } else {
        document.getElementById("previous-btn").removeAttribute("disabled")
    }
    if (response?.current_page == response?.last_page) {
        document.getElementById("next-btn").setAttribute("disabled", true)
    } else {
        document.getElementById("next-btn").removeAttribute("disabled")
    }
}

function nextAndPreviousPage (id, value) {
    document.getElementById(id).onclick = (() => {
        mountListTrips(value)
    })
}

function mountListTrips(page = 1) {
    preload(true)
    elementProperty.getElement('#listTripsAnalysi', elemet => {
        TripController.getTripInAnalysis(page).then(({response}) => {
            buttonsVisibility(response)
            nextAndPreviousPage("next-btn", response.current_page + 1)
            nextAndPreviousPage("previous-btn", response.current_page - 1)

            elemet.innerHTML = response.data.map(trip => {
                const tripStatusDriver = trip.driverId != null ?
                    `<span>Viagem efetuada pelo motorista ${trip.driverName}</span>` :
                    '<span class="reject">Corrida não atendida</span>';

                return `<li class="detail-trip">
                            <i class="material-icons">add</i>
                            <div class="container-item">
                                <div class="info-data-local-base">
                                    <div>${new Date(trip.date).toLocaleString()}</div>
                                </div>
                                <div class="info-base-trip">
                                    <div class="name-customer">
                                        <p>${trip.customerName != null ? trip.customerName : "-"}</p>
                                    </div>
                                    <div class="info-payment-form">
                                        <p>R$ ${Mask.maskMoney(parseFloat(trip.price))}</p>
                                        <p>${trip.paymentForm}</p>
                                    </div>
                                </div>
                                <div class="more-info">
                                   ${tripStatusDriver}
                                    <ul>
                                        <li>
                                            <div>
                                                <span>${trip.originAddress}</span>
                                            </div>
                                        </li>
                                        <li>
                                            <div>
                                                <span>${trip.destinationAddress}</span>
                                            </div>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                            <footer>
                             ${trip.tripCallTypeId !== 7 ? `
                                <a href="/trip/${trip.tripReference}/details" target="_blank">
                                    Detalhes
                                    <i class="material-icons">arrow_forward</i>
                                </a>` :
                                `<a href="/trip/${trip.tripReference}/rideDetails" target="_blank">
                                    Detalhes
                                    <i class="material-icons">arrow_forward</i>
                                </a>`}
                            </footer>
                        </li>`;
            }).join("");
            preload(false);

            response == 0 ? document.querySelector('.release-trip').style.display = 'none' : document.querySelector('.release-trip').style.display = 'block';

            elementProperty.addEventInElement('.detail-trip','onclick',function(){
                const icon = this.getElementsByClassName("material-icons")[0];

                if(!this.classList.contains("active")){
                    this.classList.add("active");
                    icon.innerHTML = "remove";
                } else{
                    this.classList.remove("active");
                    icon.innerHTML = "add";
                }
            });

            elementProperty.addEventInElement('.release-trip', 'onclick', function () {
                SwalCustom.dialogConfirm('Você deseja liberar todas as corridas em análise?', '', (status) => {
                    if(!status)
                        return;
                    preload(true);
                    TripController.releaseTripInAnalysis().then(status => {
                        preload(false);
                        if(!status)
                            return SwalCustom.messageDialog('Tente novamente', 'Ocorreu um erro ao liberar as corridas!', 'error');

                        SwalCustom.messageDialog('', 'Corridas liberadas com sucesso!', 'success').then(() => {
                            preload(true);
                            mountListTrips()
                        });
                    });
                });
            });

            elementProperty.addEventInElement('.dataList', 'onclick', function () {
                let id = this.getAttribute("id");

                elementProperty.getElement('#moreTrip' + id, more => {
                    if (more.classList.contains('show')) {
                        more.classList.remove('show');
                        return;
                    }
                    more.classList.add('show');
                });

                TripController.aboutTrip(id).then(({data: trip}) => {
                    /*let about = ;
                    console.log(about)
                    /*let trip = {};
                    trip.originLatitude       = about.originLatitude;
                    trip.originLongitude      = about.originLongitude;
                    trip.destinationLatitude  = about.destinationLatitude;
                    trip.destinationLongitude = about.destinationLongitude;
                    trip.tripReference = id;*/

                    trip.tripReference = id;


                    getImgRoute(trip);
                });

            });

            elementProperty.addEventInElement("#releaseTrip", 'onclick', function () {
                SwalCustom.dialogConfirm('Deseja liberar essa corrida?', 'Essa ação é permanente', data => {
                    if (data) {
                        TripController.releaseTripInAnalysi(this.getAttribute("trip")).then(resolve => {
                            if (resolve.status) {
                                swal('Viagem liberada', '', 'success');
                                mountListTrips()
                            }
                            swal(resolve.message, '', 'info');
                        });
                        return;
                    }
                });
            })

        });

    });
}

const listColor = ['black', 'orange', 'yellow', 'pink', 'blue'];

function getImgRoute(trip) {
    const origin = {
        lat: trip.originLatitude,
        lng: trip.originLongitude,
    };

    const destination = {
        lat: trip.destinationLatitude,
        lng: trip.destinationLongitude,
    };

    const markers = trip.events.map((event, index) => {
        return {
            color: listColor[index],
            lat: event.data.driver.location.latitude,
            lng: event.data.driver.location.longitude
        };
    });

    mapService.getImgMapTrip(manager.key, origin, destination, markers).then(result => {
        elementProperty.getElement(`#route-${trip.tripReference}`, element => {
            element.setAttribute("src", result);
        });
        elementProperty.getElement(`#load${trip.tripReference}`, load => {
            load.style.display = 'block';
        });
        elementProperty.getElement(`#preload${trip.tripReference}`, pre => {
            pre.style.display = 'none';
        });
    }).catch(error => {
        console.log(error);
    });

}
