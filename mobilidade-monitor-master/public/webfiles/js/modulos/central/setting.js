document.addEventListener("DOMContentLoaded", function () {

    Mask.setMoneyField('#minValuePrice');
    Mask.setMoneyField('#maxValuePrice');
    Mask.setMoneyField('#newValuePrice');
Mask.setMoneyField('.input-fee-central');
const elementProperty = new ElementProperty();

    getFee();
    getConfigCentral();
    getVoucherPaymentForms();
    getCentralCallTypes();
    getTripType();
    getAllCentral();

    function getFee() {
        preload(true);
        BeesCentralController.getFee().then(result => {
            let valueReturnFee = 0;
            if (result.response)
                valueReturnFee = result.response?.returnFee;

            result.response?.isByKm == '0'
            ? document.getElementById('tripRateFixed').checked = true
            : document.getElementById('tripRatePerKm').checked = true;

            document.getElementById('paidByCentral').checked = result.response?.paidByCentral;
            document.querySelector('.input-fee-central').value = Mask.maskMoney(valueReturnFee) ;
            preload(false);
        });


    }

    function getTripType() {
        TripTypeController.getAll().then(({status, response: data, message}) => {
            if (!status) {
                SwalCustom.messageDialog("", message, "info");
                return;
            }

            let select = document.getElementById("tripTypeId");
            data.forEach((item) => {
                let option = document.createElement("option");
                option.value = item.idTripType;
                option.text = item.type;
                select.appendChild(option);
            });
        });
    }

    async function getConfigCentral(){
        const {response: valueFinishOnlyCentral} = await getConfigByKey('end_trip_only_by_central');
        document.querySelector(`input[name='valueFinishOnlyCentralRadio'][value='${valueFinishOnlyCentral}']`).checked = true;
    }

    elementProperty.addEventInElement('.btn-update-fee', 'onclick', () => {
        preload(true);
        const feeValue = Mask.removeMaskMoney(document.querySelector('.input-fee-central').value);
        const paidByCentral = document.getElementById('paidByCentral').checked
        const returnFeeObj = {
            returnFee: feeValue,
            isByKm: $("input[name='typeFee']:checked").val(),
            paidByCentral: paidByCentral
        }

        BeesCentralController.updateFeeCentral(returnFeeObj).then(status => {
            preload(false);
            if(!status){
                return SwalCustom.messageDialog('Tente novamente', 'Erro ao atualizar a taxa', 'error');
            }
            SwalCustom.messageDialog('', 'Taxa atualizada com sucesso!', 'success').then(() => {
                getFee();
            });
        });
    });

    elementProperty.addEventInElement(".update-finish-only-central","onclick",function(){
        preload(true);
        MapSettingController.update({end_trip_only_by_central: document.querySelector(`input[name='valueFinishOnlyCentralRadio']:checked`).value}).then(()=>{
            preload(false)
        });
    });

    function getVoucherPaymentForms() {
        CentralVoucherPurchasePaymentController.getVoucherPurchasePaymentForms().then(result => {
            if (result.response) {
                result.response.forEach((item) => {
                    if (item.paymentFormId === 1) {
                        document.querySelector("#voucherPaymentFormCard").checked = item.isActive;
                    } else if (item.paymentFormId === 4) {
                        document.querySelector("#voucherPaymentFormPix").checked = item.isActive;
                    }
                });
            }
        });
    }

    function getCentralCallTypes() {
        CentralController.getCentralCallTypes().then(result => {
            if (result.response) {
                result.response.forEach((item) => {
                    if (item.centralCallTypeId === 1) {
                        document.querySelector("#centralCallTypeSearchCustomer").checked = item.isActive;
                    } else if (item.centralCallTypeId === 2) {
                        document.querySelector("#centralCallTypeToCentral").checked = item.isActive;
                    }
                });
            }
        });
    }

    let tripTypeId;
    elementProperty.addEventInElement("#tripTypeId", "onchange", function () {
        tripTypeId = document.querySelector("#tripTypeId").value;
    });

    elementProperty.addEventInElement(".btn-update-voucher-payment-form","onclick",function(){
        preload(true);
        const voucherPaymentFormCard = document.querySelector("#voucherPaymentFormCard").checked;
        const voucherPaymentFormPix = document.querySelector("#voucherPaymentFormPix").checked;

        if(!voucherPaymentFormCard && !voucherPaymentFormPix){
            preload(false);
            return SwalCustom.messageDialog('Selecione ao menos uma forma de pagamento', 'Erro ao atualizar forma de pagamento', 'error');
        }

        const data = [];

        voucherPaymentFormCard ? data.push({ paymentFormId: 1, isActive: true }) : data.push({ paymentFormId: 1, isActive: false });
        voucherPaymentFormPix ? data.push({ paymentFormId: 4, isActive: true }) : data.push({ paymentFormId: 4, isActive: false });

        CentralVoucherPurchasePaymentController.updateVoucherPurchasePaymentForm(data).then(status => {
            preload(false);
            if(!status){
                return SwalCustom.messageDialog('Tente novamente', 'Erro ao atualizar a forma de pagamento', 'error');
            }
            SwalCustom.messageDialog('', 'Forma de pagamento atualizada com sucesso!', 'success').then(() => {
                getVoucherPaymentForms();
            });
        }
    );

    });

    elementProperty.addEventInElement(".btn-update-central-call-type","onclick",function(){
        preload(true);
        const centralCallTypeSearchCustomer = document.querySelector("#centralCallTypeSearchCustomer").checked;
        const centralCallTypeToCentral = document.querySelector("#centralCallTypeToCentral").checked;

        if(!centralCallTypeSearchCustomer && !centralCallTypeToCentral){
            preload(false);
            return SwalCustom.messageDialog('Selecione ao menos um tipo de Chamado', 'Erro ao atualizar tipo de Chamado', 'error');
        }

        const data = [];

        centralCallTypeSearchCustomer ? data.push({ centralCallTypeId: 1, isActive: true }) : data.push({ centralCallTypeId: 1, isActive: false });
        centralCallTypeToCentral ? data.push({ centralCallTypeId: 2, isActive: true }) : data.push({ centralCallTypeId: 2, isActive: false });

        CentralController.updateCentralCallType(data).then(status => {
            preload(false);
            if(!status){
                return SwalCustom.messageDialog('Tente novamente', 'Erro ao atualizar tipo de Chamado', 'error');
            }
            SwalCustom.messageDialog('', 'Tipo de chamado atualizado com sucesso!', 'success').then(() => {
                getCentralCallTypes();
            });
        }
    );

    });

    elementProperty.addEventInElement('#collapsePriceRangeCentral', 'onclick', function () {
        if(this.open){
            return;
        } else {
            const cityId = Session.getLocal("citySelected").cityId;
            const idTripType = Session.get("idTripType");
            preload(true);
            return initPriceRange(cityId);
        }
    });

    elementProperty.addEventInElement(".btn-save-price-range", 'onclick', function () {
        preload(true);
        let data = {};
        let min_value = document.getElementById('minValuePrice').value;
        let max_value = document.getElementById('maxValuePrice').value;
        let new_value = document.getElementById('newValuePrice').value;
        const cityId = Session.getLocal("citySelected").cityId;
        data.tripTypeId = tripTypeId;
        data.description = document.getElementById('descriptionValue').value;
        data.max_value = Mask.removeMaskMoney(max_value);
        data.new_value = Mask.removeMaskMoney(new_value);
        data.min_value = Mask.removeMaskMoney(min_value);
        data.cityId = Session.getValueInSessionLocal("citySelected", "cityId")

        let selectedCentral = $("#mountCentral").val();
        data.centralId = selectedCentral;

        CentralController.insertPriceRange(data).then(({status, response}) => {
            preload(false);
            if (!status)
                return swal('Erro ao inserir faixa de preço', 'Certifique que não existe uma faixa com os mesmos valores', 'info')

            swal('Atualizado com sucesso', '', 'success');
            initPriceRange(cityId, tripTypeId);
        });
    });

    function getAllCentral() {
        CentralController.getAllCentral().then(({ status, response: data, message }) => {
            if (!status) {
                SwalCustom.messageDialog("", message, "info");
                return;
            }

            let select = $("#mountCentral");

            select.empty();

            select.append($('<option>', {
                value: '',
                text: 'Selecionar Central',
                disabled: true,
                class: 'select-placeholder'
            }));

            data.forEach((item) => {
                select.append($('<option>', {
                    value: item.id,
                    text: item.name
                }));
            });

            select.addClass("custom-width");

            select.select2({
                placeholder: 'Selecionar Central',
                allowClear: true,
                templateSelection: function (data) {
                    if (data.id === '') {
                        return 'Selecionar Central';
                    } else {
                        return data.text;
                    }
                }
            });

            select.next(".select2-container").find(".select2-selection__rendered").addClass("text-center");

            select.next(".select2-container").find(".select2-search__field").addClass("text-center");

            select.on('change', function () {
                let selectedOptions = $(this).val();
                data.centralId = selectedOptions;
            });
        });
    }

    function initPriceRange(cityId) {
        CentralController.getPriceRange(cityId).then(({ status, response }) => {
            elementProperty.getElement('#mount-price-range-central', these => {
                let content = '';
                if (response.length === 0) {
                    content = `
          <tr>
            <td colspan="6" class="text-center">Não há faixas de preços configuradas para essa cidade.</td>
          </tr>`;
                } else {
                    content += response.map(item => {
                        let centrals = item.centrals.map(central => `<div class="card card-body">${central.name}</div>`).join('');
                        return `
            <tr>
              <td colspan="6" class="text-center">
                ${item.description}
              </td>
            </tr> 
            <tr>                          
              <td>
                <button class="btn btn-primary btn-view-centrals" 
                        data-toggle="modal" 
                        data-target="#centralsModal-${item.id}">
                  Ver Centrais
                </button>
              </td>
              <td>R$${Mask.maskMoney(item.min_value)}</td>
              <td>R$${Mask.maskMoney(item.max_value)}</td>
              <td>R$${Mask.maskMoney(item.new_value)}</td>
              <td>${item.trip_type.type}</td>
              <td>
                <span style="color: red; cursor: pointer;" 
                      id="${item.id}" 
                      class="delete-range">X</span>
              </td>
            </tr>
            
            <!-- Modal -->
            <div class="modal fade" id="centralsModal-${item.id}" 
                tabindex="-1" role="dialog" 
                aria-labelledby="centralsModalLabel-${item.id}" 
                aria-hidden="true">
              <div class="modal-dialog" role="document">
                <div class="modal-content">
                  <div class="modal-header bg-secondary">
                    <h5 class="modal-title text-white" id="centralsModalLabel-${item.id}">Centrais cadastradas</h5>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                  <div class="modal-body">
                    <div class="card card-body">
                      ${centrals}
                    </div>
                  </div>
                </div>
              </div>
            </div>`;
                    }).join('');
                }
                preload(false);
                these.innerHTML = content;
                elementProperty.addEventInElement('.delete-range', 'onclick', function () {
                    let id = this.getAttribute('id');
                    SwalCustom.confirm('Deseja deletar essa faixa de preço?', 'Essa ação é irreversível').then(status => {
                        preload(true);
                        if (status) {
                            CentralController.deletePriceRange(id).then(({ status, response }) => {
                                preload(false);
                                if (!status)
                                    return swal('Erro ao deletar essa faixa de preço', 'Contate o suporte', 'info');
                                swal('Preço apagado com sucesso', '', 'success');
                                initPriceRange(cityId);
                            });
                        }
                    });
                });

                elementProperty.addEventInElement('.btn-view-centrals', 'click', function () {
                    let centrals = this.getAttribute('data-centrals');
                    let modalBody = document.querySelector(`#centralsModal-${this.dataset.target.slice(1)} .modal-body .card-body`);
                    modalBody.innerHTML = centrals;
                });
            });
        });
    }

    function getConfigByKey(key){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`config/${key}`,'GET',null, resolve,reject,true);
        })
    }
});