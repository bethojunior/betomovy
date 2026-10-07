let dataFieldsCentral;
let fieldRequired = 0;
function showInfoCentral(trip, customer) {
    getItemsTripCentral();
    document.querySelector("#obsOriginDelivery").value = "";
    viewController.elementProperty.addClass("#info-dynamic", "active");
    viewController.elementProperty.addEventInElement(".go-back-delivery-info", "onclick", function () {
        viewController.elementProperty.removeClass("#info-dynamic", "active");
    });

    viewController.elementProperty.addEventInElement("#btnAddObsInTripCentral", "onclick", function () {
        trip.questions = [];
        fieldRequired = 0;
        dataFieldsCentral.map((item) => {
            const responseQuestionDynamic = document.getElementById(`form-dynamic-response-${item.id}`).value.trim();
            if(item.required && responseQuestionDynamic == "") {
                fieldRequired = 1;
            }
            if(responseQuestionDynamic != "")
                return trip.questions.push({
                    questionId: item.id,
                    response: responseQuestionDynamic
                });
        });
        if(fieldRequired == 1){
            return  swal("", "Campo obrigatório vazio", "info");
        }

        trip.waypoints = trip.waypoints.map((waypoint, index) => {
            waypoint.latitude = waypoint.lat;
            waypoint.longitude = waypoint.lng;
            if(document.querySelector(`#obsPlace${index}`)) {
                waypoint.obs = document.querySelector(`#obsPlace${index}`).innerHTML;
            }
            return waypoint;
        });
        getTravelCustomer(trip, customer);
    });
}

function getItemsTripCentral() {
    const idCentral = Session.getValueInSession("centralSelected", "id");
    preload(true);
    document.querySelector(".dynamic-fields").innerHTML = "";
    DynamicFieldsController.get(idCentral).then((response) => {
        dataFieldsCentral = response.response;
        dataFieldsCentral.map((item) => {
            return document.querySelector(".dynamic-fields").innerHTML += `                        
                <div class="form-group">
                <label>${item.title} <small>${item.required ? '(obrigatório)' : ''} </small></label>
                <input class="form-control" type="text" id="form-dynamic-response-${item.id}"/>
                </div>
            `
        });
        preload(false);
    })

}