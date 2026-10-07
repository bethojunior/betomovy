elementProperty.addEventInElement(".close-modal-option-trip","onclick",function () {
    elementProperty.removeClass(".modal-option-trip-active","active");
});

function showOptionTripActive(trip){
    elementProperty.addClass(".modal-option-trip-active","active");

    if (STATUS_SEARCH === trip.status || trip.status === STATUS_SEARCH_FAVORITE){
        document.querySelector("#notifyCustomer").style.display = "none";
        document.querySelector("#notifyDriver").style.display = "none";
    }else{
        document.querySelector("#notifyCustomer").style = "";
        document.querySelector("#notifyDriver").style = "";
    }

    elementProperty.addEventInElement("#notifyCustomer","onclick",function(){
        let image = trip.customerPhoto != null ? `${environment.hosts.hostImageClient + trip.customerPhoto}` : '';

        showNotificationOneUser(trip.userId,trip.customerName,image);
        elementProperty.removeClass(".modal-option-trip-active","active");
    });
    elementProperty.addEventInElement("#notifyDriver","onclick",function(){
        showNotificationOneUser(trip.driverUserId,trip.driverName, environment.hosts.hostImageDriver + trip.driverPhoto)
        elementProperty.removeClass(".modal-option-trip-active","active");
    });

    elementProperty.addEventInElement("#cancelTripMonitor", "onclick", function () {
        SwalCustom.dialogConfirm('Tem certeza que deseja cancelar?', 'Atenção', status => {
            if (status) {
                elementProperty.removeClass(".modal-option-trip-active","active");
                TripController.canceledTrip(trip.tripReference).then(res => {
                    if (res.status) {
                        swal('', res.message, 'success');
                        return;
                    }
                    swal('ops..', res.message, 'error');
                });
            }
        });
    });

    elementProperty.addEventInElement("#cancelAndCallAgainTripMonitor", "onclick", function () {
        SwalCustom.dialogConfirm('Tem certeza que deseja cancelar e chamar outro motorista?', 'Atenção', status => {
            if (status) {
                elementProperty.removeClass(".modal-option-trip-active","active");
                TripController.canceledTrip(trip.tripReference, true).then(res => {
                    if (res.status) {
                        swal('', res.message, 'success');
                        return;
                    }
                    swal('ops..', res.message, 'error');
                });
            }
        });
    });

    elementProperty.addEventInElement('#finishTripMonitor', 'onclick', function () {
            SwalCustom.dialogConfirm('Tem certeza que deseja finalizar a viagem?', 'Atenção', status => {
                if (status) {
                    elementProperty.removeClass(".modal-option-trip-active","active");
                    TripController.finishTrip(trip.tripReference).then((status) => {
                        if (status) {
                            swal('', 'Viagem finalizada com sucesso!', 'success');
                            return;
                        }
                        swal('ops..', 'Ocorreu um erro ao finalizar sua viagem', 'error');
                    });
                }
            });
        });
}