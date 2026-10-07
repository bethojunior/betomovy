function initEventFilterDriverFormOfPayment() {
    elementProperty.addEventInElement(".btn-filter-payment-form", "onclick", event => {
        event.preventDefault();

        const driverId = event.target.getAttribute("idDriver");
        preload(true);
        getData();

        async function getData() {
            const {response: listTripPaymentForm} = await TripPaymentFormController.getV2();
            const {response: listBlocked} = await TripPaymentFormController.getDriverFormOfPaymentBlocked(driverId);
            const {response: driverFormOfPayment} = await TripPaymentFormController.getDriverFormOfPayment(driverId);
            const {response: listImposition} = await TripPaymentFormController.getDriverFormOfPaymentImposition(driverId);

            elementProperty.getElement("#driverFilter", element => {
                element.innerHTML = listTripPaymentForm.map(formOfPayment => {
                    const checked = driverFormOfPayment.find(item => {
                        return item.tripPaymentFormId == formOfPayment.idTripPaymentForm;
                    }) != null;

                    return `<div class="form-check">
                              <input class="form-check-input check-payment-driver-selected" type="checkbox" value="" id="driverFilter${formOfPayment.idTripPaymentForm}" onclick="this.checked = !this.checked;" ${checked ? "checked" : ""}>
                              <label class="form-check-label" for="driverFilter${formOfPayment.idTripPaymentForm}">
                                  ${formOfPayment.name}
                              </label>
                            </div>`
                }).join("");

                const selectedElements = document.querySelectorAll(".check-payment-driver-selected:checked");
                const elements = document.querySelectorAll(".check-payment-driver-selected");

                if(selectedElements.length === 0){
                    elements.forEach(element=>{
                        element.checked = true;
                    });
                }
            });

            elementProperty.getElement("#listMonitorFilter",element=>{
                element.innerHTML = listTripPaymentForm.map(formOfPayment=>{
                    const checked = listBlocked.find(item => {
                        return item.tripPaymentFormId == formOfPayment.idTripPaymentForm;
                    }) != null;
                    return `<div class="form-check">
                              <input class="form-check-input check-block-payment-driver" type="checkbox" value="${formOfPayment.idTripPaymentForm}" id="driverFilterBlock${formOfPayment.idTripPaymentForm}" ${checked ? "checked" : ""}>
                              <label class="form-check-label" for="driverFilterBlock${formOfPayment.idTripPaymentForm}">
                                  ${formOfPayment.name}
                              </label>
                            </div>`
                }).join("");
            });


            elementProperty.getElement("#listMonitorFilterImposition",element=>{
                element.innerHTML = listTripPaymentForm.map(formOfPayment=>{
                    const checked = listImposition.find(item => {
                        return item.tripPaymentFormId == formOfPayment.idTripPaymentForm;
                    }) != null;
                    return `<div class="form-check">
                              <input class="form-check-input check-imposition-payment-driver" type="checkbox" value="${formOfPayment.idTripPaymentForm}" id="driverFilterImposition${formOfPayment.idTripPaymentForm}" ${checked ? "checked" : ""}>
                              <label class="form-check-label" for="driverFilterImposition${formOfPayment.idTripPaymentForm}">
                                  ${formOfPayment.name}
                              </label>
                            </div>`
                }).join("");
            });

            preload(false);

            $('#filterDriverPaymentFormModal').modal('show')
        }

        elementProperty.addEventInElement("#btnSaveBlockedPayment","onclick",function(){
             const tripPaymentForms = [];

             document.querySelectorAll(".check-block-payment-driver:checked").forEach(element=>{
                 tripPaymentForms.push(element.value);
             });
             preload(true);
             TripPaymentFormController.putDriverFormOfPaymentBlocked(driverId,tripPaymentForms).then(({message,status})=>{
                 SwalCustom.messageDialog("",message,status ? "success":"info" )
             }).finally(()=>{
                 preload(false);
             })
        });

        elementProperty.addEventInElement("#btnSaveImpositionPayment","onclick",function(){
            const tripPaymentForms = [];

            document.querySelectorAll(".check-imposition-payment-driver:checked").forEach(element=>{
                tripPaymentForms.push(element.value);
            });
            preload(true);
            TripPaymentFormController.putDriverFormOfPaymentImposition(driverId,tripPaymentForms).then(({message,status})=>{
                SwalCustom.messageDialog("",message,status ? "success":"info" )
            }).finally(()=>{
                preload(false);
            })
        });
    })
}