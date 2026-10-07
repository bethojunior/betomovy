document.addEventListener("DOMContentLoaded", function () {
    const elementProperty = new ElementProperty();
    const city = Session.getLocal("citySelected");

    document.getElementById('inprogress-calculate').src = environment.hosts.hostImageDefault;

    Mask.setMoneyField("#additional_value_after_km");
    Mask.setMoneyField("#priceMin");
    Mask.setMoneyField("#priceBase");
    Mask.setMoneyField("#priceKm");
    Mask.setMoneyField("#priceMinute");
    Mask.setMoneyField("#priceTax1");
    Mask.setMoneyField("#priceTax2");
    Mask.setMoneyField("#priceWaypoint");
    Mask.setMoneyField("#long_distance_per_km");
    Mask.setMoneyField("#promotional_price_temp");
    Mask.setMoneyField("#reward_driver_min_price");
    Mask.setMoneyField("#disableAfterKm");
    Mask.setMoneyField("#serviceCharge");
    Mask.setMoneyField("#taxRate");
    Mask.setMoneyField("#surcharge");
    Mask.setMoneyField("#taxMoney");
    Mask.setMoneyField("#taxCardCredit");
    Mask.setMoneyField("#taxVoucher");
    Mask.setMoneyField("#km_to_additional_value");

    TripTypeController.getAllV2().then(({status, response: data, message}) => {
        if (!status) {
            SwalCustom.messageDialog("", message, "info");
            return;
        }

        elementProperty.getElement("#typeTrip", element => {
            element.innerHTML += data.map(tripType => {
                return `<option value="${tripType.idTripType}">${tripType.type}</option>`
            }).join("");
        });
    });

    function listFees() {
        let typeTripSelected = Session.get("tripTypeIdSelected");
        preload(true);
        PriceController.getFees(city.cityId, typeTripSelected).then(({response}) => {
            preload(false);
            document.querySelector('#mount-list-tax').innerHTML = response.map(item => {
                return `
                <div class="w-100 pr-2 pl-2 pt-2">
                    <div class="d-flex justify-content-between">
                        <div>
                            <label for="nameFee${item.id}">Nome da taxa</label>
                            <input id="nameFee${item.id}" class="form-control" value="${item.name}" required/>
                        </div>
                        <div>
                            <label for="amountCharged${item.id}">Valor a ser cobrado</label>
                            <input id="amountCharged${item.id}" class="form-control value-input" value="${Mask.maskMoney(item.value)}" required/>
                        </div>
                    </div>
    
                    <div class="mt-3">
                        <label for="descriptionFee${item.id}">Descrição</label>
                        <textarea id="descriptionFee${item.id}" class="form-control" required>${item.description}</textarea>
                    </div>
    
                    <div class="d-flex justify-content-between mt-3">
                        <div>
                            <label for="selectChargeUser${item.id}">Quem será cobrado</label>
                            <select class="form-control" id="selectChargeUser${item.id}">
                                    <option value="driver" ${item.chargeBy === "driver" ? "selected" : ""}>Motorista</option>
                                    <option value="customer" ${item.chargeBy === "customer" ? "selected" : ""}>Cliente</option>       
                            </select>
                        </div>
    
                        <div>
                            <label>Tipo de cobrança</label>
                            <div class="d-flex">
                                <div class="custom-control custom-radio mr-3">
                                    <input type="radio" id="radioMoney${item.id}" name="typeValueRadio${item.id}" class="custom-control-input input-type-fee" value="$" ${item.valueType === '$' ? "checked" : ""}>
                                    <label class="custom-control-label" for="radioMoney${item.id}">$</label>
                                </div>
                                <div class="custom-control custom-radio">
                                    <input type="radio" id="radioPercentage${item.id}" name="typeValueRadio${item.id}" class="custom-control-input input-type-fee" value="%" ${item.valueType === '%' ? "checked" : ""}>
                                    <label class="custom-control-label" for="radioPercentage${item.id}">%</label>
                                </div>
                            </div>
                        </div>
    
                        <div>
                            <label>Status</label>
                            <div class="custom-control custom-switch">
                                <input type="checkbox" class="custom-control-input change-status-fee"  id="${item.id}" ${item.active ? "checked" : ""}>
                                <label class="custom-control-label" for="${item.id}">${item.active ? "Ativada" : "Desativada"}</label>
                            </div>
                        </div>
                    </div>
                    <div class="d-flex justify-content-end mt-3">
                        <button id="${item.id}" class="btn btn-primary update-fee" >Atualizar</button>
                        <button id="${item.id}" class="btn btn-danger delete-fee">Excluir</button>
                    </div>
                </div>`
            }).join("");
            Mask.setMoneyField(".value-input");

            elementProperty.addEventInElement('.change-status-fee', 'onchange', function () {
                preload(true);
                const active = this.checked;
                document.querySelector(`label.custom-control-label[for='${this.id}']`).innerHTML = active ? "Ativada" : "Desativada";
                PriceController.changeStatusFee(this.id, {active}).then(({status}) => {
                    preload(false);
                    if(!status) {
                        return SwalCustom.messageDialog('Tente novamente', 'Ocorreu um erro ao alterar o status de uma taxa', 'error');
                    }

                    SwalCustom.messageDialog('', 'Status alterado com sucesso!', 'success');
                });
            });

            elementProperty.addEventInElement('.update-fee', 'onclick', function () {

                const name = document.querySelector(`#nameFee${this.id}`).value;
                const value = Mask.removeMaskMoney(document.querySelector(`#amountCharged${this.id}`).value);
                const description = document.querySelector(`#descriptionFee${this.id}`).value;

                if(name === '' || description === ''){
                    return SwalCustom.messageDialog('', 'Todos os campos devem estar preenchidos!');
                }

                if (!value || value == '0,00') {
                    return SwalCustom.messageDialog('', 'O valor a ser cobrado não pode ser menor ou igual a zero', 'info');
                }

                SwalCustom.dialogConfirm('Você confirma a atualização desta taxa?', '', (status) => {
                    if(status) {
                        preload(true);

                        const data = {
                            name,
                            value,
                            description,
                            valueType: document.querySelector(`input[name="typeValueRadio${this.id}"]:checked`).value,
                            cityId: city.cityId,
                            tripTypeId: Session.get("tripTypeIdSelected"),
                            chargeBy: document.querySelector(`#selectChargeUser${this.id}`).value,
                            active: document.querySelector('.change-status-fee').checked
                        }

                        PriceController.updateFee(this.id, data).then(({status}) => {
                            preload(false);
                            if(!status) {
                                return SwalCustom.messageDialog('Tente novamente', 'Ocorreu um erro ao atualizar sua taxa', 'error');
                            }

                            SwalCustom.messageDialog('', 'Taxa atualizada com sucesso!', 'success');
                        });
                    }
                });
            });

            elementProperty.addEventInElement('.delete-fee', 'onclick', function () {
                SwalCustom.dialogConfirm('Você confirma a exclusão dessa tarifa?', '', (status) => {
                    if(!status) {
                        return;
                    }

                    preload(true);
                    if(status) {
                        PriceController.deleteFee(this.id).then(() => {
                            preload(false);
                            if(!status) {
                                return SwalCustom.messageDialog('Tente novamente', 'Ops.. ocorreu um erro ao excluir sua tarifa', 'error');
                            }

                            SwalCustom.messageDialog('', 'Tarifa excluída com sucesso!', 'success').then(() => {
                                preload(true);
                                listFees();
                            })
                        });
                    }
                })
            });
            preload(false);
        });
    }

    elementProperty.addEventInElement('#fees-option', 'onclick', function () {
        if(this.open){
            return;
        } else {
            return listFees();
        }
    });

    elementProperty.addEventInElement('#addForToNewFee', 'onclick', function () {
        document.querySelector('#addForToNewFee').style.display = "none";
        document.querySelector('#newForm').style.display = 'block';
        document.querySelector('#newForm').innerHTML =
            `<div class="w-100 p-2">
                    <div class="d-flex justify-content-between">
                        <div>
                            <label for="createNameFee">Nome da taxa</label>
                            <input id="createNameFee" class="form-control" />
                        </div>
                        <div>
                            <label for="createAmountCharged">Valor a ser cobrado</label>
                            <input id="createAmountCharged" class="form-control" />
                        </div>
                    </div>
    
                    <div class="mt-3">
                        <label for="createDescriptionFee">Descrição</label>
                        <textarea id="createDescriptionFee" class="form-control"></textarea>
                    </div>
    
                    <div class="d-flex justify-content-between mt-3">
                        <div>
                            <label for="selectCreateChargeUser">Quem será cobrado</label>
                            <select class="form-control" id="selectCreateChargeUser">
                                <option value="driver">Motorista</option>
                                <option value="customer">Cliente</option>
                            </select>
                        </div>
    
                        <div>
                            <label>Tipo de cobrança</label>
                            <div class="d-flex">
                                <div class="custom-control custom-radio mr-3">
                                    <input type="radio" id="createTypeValueMoney" name="createTypeValue" class="custom-control-input" value="$" checked>
                                    <label class="custom-control-label" for="createTypeValueMoney">$</label>
                                </div>
                                <div class="custom-control custom-radio">
                                    <input type="radio" id="createTypeValuePercentage" name="createTypeValue" class="custom-control-input" value="%">
                                    <label class="custom-control-label" for="createTypeValuePercentage">%</label>
                                </div>
                            </div>
                        </div>
    
                        <div>
                            <label>Status</label>
                            <div class="custom-control custom-switch">
                                <input type="checkbox" class="custom-control-input"  id="createStatus">
                                <label class="custom-control-label"  id="labelStatus" for="createStatus">Desativado</label>
                            </div>
                        </div>
                    </div>
                    <div class="d-flex justify-content-end">
                        <button class="btn btn-primary mt-2" id="addNewFee">Criar</button>
                    </div>
                </div>
            </div>`;

        elementProperty.addEventInElement("#createStatus","onchange", function(){
           document.querySelector('#labelStatus').innerHTML = this.checked ? 'Ativado' : 'Desativado';
        });

        Mask.setMoneyField("#createAmountCharged");
        elementProperty.addEventInElement('#addNewFee', 'onclick', function () {
            const name = document.getElementById('createNameFee').value;
            const value = Mask.removeMaskMoney(document.getElementById('createAmountCharged').value);
            const description = document.getElementById('createDescriptionFee').value;

            if(name === '' || description === '') {
                return SwalCustom.messageDialog('', 'Todos os campos devem estar preenchidos!', 'info');
            }

            if (!value || value == '0,00') {
                return SwalCustom.messageDialog('', 'O valor a ser cobrado não pode ser menor ou igual a zero', 'info');
            }

            preload(true);

            const data = {
                name,
                value,
                description,
                valueType: document.querySelector(`input[name="createTypeValue"]:checked`).value,
                cityId: city.cityId,
                tripTypeId: Session.get("tripTypeIdSelected"),
                chargeBy: document.querySelector('#selectCreateChargeUser').value,
                active: document.querySelector('#createStatus').checked
            }

            PriceController.createFee(data).then(({status}) => {
                preload(false);
                if(!status) {
                    return SwalCustom.messageDialog('Tente novamente', 'Ocorreu um erro ao adicionar uma nova taxa', 'error');
                }

                SwalCustom.messageDialog('', 'Taxa adicionada com sucesso!', 'success').then(() => {
                    preload(true);
                    document.querySelector('#newForm').style.display = 'none';
                    document.querySelector('#addForToNewFee').style.display = "block";
                    listFees();
                });
            });
        });
    });

    elementProperty.addEventInElement("#updateRatePrice", "onclick", function () {

        SwalCustom.confirm("Atenção", "Deseja modificar o valores do preço ?").then(() => {

            const disable_after_km = Mask.removeMaskMoney(document.getElementById("disableAfterKm").value);

            const data = {
                "min_price": Mask.removeMaskMoney(document.getElementById("priceMin").value),
                "base_price": Mask.removeMaskMoney(document.getElementById("priceBase").value),
                "km_price": Mask.removeMaskMoney(document.getElementById("priceKm").value),
                "minute_price": Mask.removeMaskMoney(document.getElementById("priceMinute").value),
                "cityId": city.cityId,
                "tripTypeId": `${Session.get("tripTypeIdSelected")}`,
                "tax_price": Mask.removeMaskMoney(document.getElementById("taxRate").value),
                "another_fee": Mask.removeMaskMoney(document.getElementById("surcharge").value),
                "waypoint_price": Mask.removeMaskMoney(document.getElementById("priceWaypoint").value),
                "tag": document.getElementById("description").value,
                "color": document.getElementById("color").value,
                "long_distance_per_km": Mask.removeMaskMoney(document.getElementById("long_distance_per_km").value),
                "long_distance_value_to_final_price" : document.getElementById('long_distance_value_to_final_price').checked,
                "long_distance_radius" : parseInt(document.getElementById('long_distance_radius').value),
                "promotional_price_temp": Mask.removeMaskMoney(document.getElementById("promotional_price_temp").value),
                "reward_driver_min_price": Mask.removeMaskMoney(document.getElementById("reward_driver_min_price").value),
                "idealListCommonPrice": Mask.removeMaskMoney(document.getElementById("idealListCommonPrice").value),
                "disable_after_km":  disable_after_km > 0 ? disable_after_km : null,
                "km_to_additional_value":  Mask.removeMaskMoney(document.getElementById("km_to_additional_value").value),
                "additional_value_after_km":  Mask.removeMaskMoney(document.getElementById("additional_value_after_km").value),
                "type_additional_value_after_km" : document.querySelector(`input[name='type_additional_value_after_km']:checked`).value,
                "another_fee_description" : document.getElementById("surchargeTextarea").value,
                "tax_price_description" : document.getElementById("taxRateTextarea").value,
                "tax_price_type" : document.querySelector('input[name=typeTaxRate]:checked').value,
                "another_fee_type":document.querySelector('input[name=typeSurcharge]:checked').value,
            };

            if(document.querySelector("#long_distance_delivery_price"))
                data.long_distance_delivery_price =  Mask.removeMaskMoney(document.getElementById("long_distance_delivery_price").value);

            if (!validateForm(data))
                return;

            Promise.all([
                updateTax(city.cityId,Session.get("tripTypeIdSelected")),
                PriceController.save(data)
            ]).then((values) => {
                const {status, message}  = values[1];

                if (!status) {
                    SwalCustom.messageDialog("", message, "info");
                    return;
                }
                SwalCustom.messageDialog("", "Preço atualizado com sucesso !", "success")
                    .then(() => {
                        PriceController.getByCity(Session.get("idCitySelected"))
                            .then(({status, message, response}) => {
                                showTypeTrip(response);
                                getRateCity(Session.getLocal("citySelected"));
                                Session.set("rates", response);
                            });
                    })
            })
        });
    });

    elementProperty.addEventInElement('#disable-trip-type','onclick',()=>{
        SwalCustom.confirm('Deseja desabilitar esse tipo de chamada?','Essa ação pode ser revertida').then(status => {
            if(status){
                preload(true);
                PriceController.disableTripType(Session.getLocal("typeSelected")).then(callback => {
                    preload(false);
                    if(callback.status){
                        getRateCity(Session.getLocal("citySelected"));
                        return swal('Tipo de viagem desabilitado com sucesso','Você pode reativar a qualquer momento','success');
                    }
                    swal('Erro ao atualizar os dados','Favor contate o suporte','error');
                })
            }
        });
    });

    function updateTax(idCity,tripTypeId){
        const object = {
            value : Mask.removeMaskMoney(document.getElementById("serviceCharge").value),
            valueType: document.querySelector(`input[name='typeServiceCharge']:checked`).value,
            tripTypeId,
            commissionAnotherFee:{
                tax_value: Mask.removeMaskMoney(document.getElementById("taxRate").value),
                taxValueType:  document.querySelector(`input[name='typeTaxRate']:checked`).value,
                valueType: document.querySelector(`input[name='typeSurcharge']:checked`).value,
                another_value: Mask.removeMaskMoney( document.getElementById("surcharge").value)
            },
            disableOnPromotion: document.getElementById("disableOnPromotional").checked,
            commissionsPaymentForm: []
        };

        elementProperty.getElement(".payment-input",element=>{
                object.commissionsPaymentForm.push({
                    "value": Mask.removeMaskMoney(element.value),
                    "valueType": document.querySelector(`input[name="typePayment${element.getAttribute("typePayment")}"]:checked`).value,
                    "tripPaymentFormId": element.getAttribute("typePayment")
                });
        });

        return DriverCommissionController.insert(idCity,object);
    }

    function validateForm(data) {
        if(data.tag <= 0){
            SwalCustom.messageDialog("", "Informe a etiqueta", "info");
            return false;
        }

        if(data.min_price <= 0){
            SwalCustom.messageDialog("", "Informe o valor minimo da viagem", "info");
            return false;
        }

        if(data.base_price <= 0){
            SwalCustom.messageDialog("", "Informe o valor base da viagem", "info");
            return false;
        }

        // if(data.km_price <= 0){
        //     SwalCustom.messageDialog("", "Informe o valor por km da viagem", "info");
        //     return false;
        // }

        // if(data.minute_price <= 0){
        //     SwalCustom.messageDialog("", "Informe o valor por minuto da viagem", "info");
        //     return false;
        // }


        if (data.tripTypeId.trim().length <= 0) {
            SwalCustom.messageDialog("", "Informe o tipo de corrida", "info");
            return false;
        }

        if (data.tag.trim().length <= 0) {
            SwalCustom.messageDialog("", "Informe a descrição da tarifa", "info");
            return false;
        }

        return true;
    }
});
