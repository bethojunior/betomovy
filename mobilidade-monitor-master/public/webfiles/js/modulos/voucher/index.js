document.addEventListener("DOMContentLoaded", function () {
    let thisPage = 1;
    Mask.setMoneyField('.maskMoney');
    preload(true);
    list(thisPage);
    loadCities();

    elementProperty.addEventInElement('#valueVoucher', 'onkeyup',
        () => setValuePaymentByUser('#payValueVoucher', '#valueVoucher', '#percentageValueDiscount'));

    elementProperty.addEventInElement('#percentageValueDiscount', 'onkeyup',
        () => setValuePaymentByUser('#payValueVoucher', '#valueVoucher', '#percentageValueDiscount'));

    elementProperty.addEventInElement('#editValueVoucher', 'onkeyup',
        () => setValuePaymentByUser('#editPayValueVoucher', '#editValueVoucher', '#editPercentageValueDiscount'));

    elementProperty.addEventInElement('#editPercentageValueDiscount', 'onkeyup',
        () => setValuePaymentByUser('#editPayValueVoucher', '#editValueVoucher', '#editPercentageValueDiscount'));

    elementProperty.addEventInElement('#addVoucher', 'onclick', addVoucher);

    elementProperty.addEventInElement('#editVoucher', 'onclick', editValuesVoucher);

    function list(page) {
        preload(true);
        const listVoucher = document.querySelector('.list-vouchers');
        VoucherController.getAllPromotionalVouchers(page).then(({response}) => {
            const {data} = response;
            listVoucher.innerHTML = data.map(item => {
                return `
                    <tr>
                      <td>${Mask.maskMoney(item.amount)}</td>
                      <td>${Mask.maskMoney(item.percentage || 0)}</td>
                      <td>${Mask.maskMoney(item.value)}</td>
                      <td>${item.cityName}</td>
                      <td>${item.user === 'central' ? "Central" : 'Cliente'}</td>
                      <td>
                            <button 
                                type="button" idVoucher="${item.id}"  
                                class="btn btn-info btn-sm btn-edit-voucher" 
                                data-toggle="modal" 
                                data-target="#editPromotionVoucher"
                            >
                                <span class="material-icons size-icon">
                                    mode_edit
                                </span>
                            </button>
                        </td>
                        <td>
                            <button type="button" idVoucher="${item.id}" class="btn btn-danger btn-sm btn-remove-voucher">
                                <span class="material-icons size-icon">
                                    delete
                                </span>
                            </button>
                        </td>
                    </tr>
                `
            }).join('');
            preload(false);
            
            if (response.prev_page_url === null) {
                elementProperty.addClass('.backPage', 'disabled');
                document.querySelector('.backPage').onclick = ()=>{};
            } else {
                elementProperty.removeClass('.backPage', 'disabled');
                elementProperty.addEventInElement('.backPage', 'onclick', () => {
                    thisPage -= 1;
                    list(thisPage);
                });
            }

            if (response.next_page_url === null) {
                elementProperty.addClass('.nextPage', 'disabled');
                document.querySelector('.nextPage').onclick = ()=>{};
            } else {
                elementProperty.removeClass('.nextPage', 'disabled');
                elementProperty.addEventInElement('.nextPage', 'onclick', () => {
                    thisPage += 1;
                    list(thisPage);
                });
            }

            elementProperty.addEventInElement('.btn-edit-voucher', 'onclick', setEditsValuesVoucher);

            elementProperty.addEventInElement('.btn-remove-voucher', 'onclick', deleteVoucher);
        });
    }

    function addVoucher() {
        preload(true);
        const data = {};
        const valueVoucher = Mask.removeMaskMoney(document.querySelector('#valueVoucher').value);
        const valuePercentageDiscount = Mask.removeMaskMoney(document.querySelector('#percentageValueDiscount').value);
        const valuePaymentByUser = valueVoucher - (valuePercentageDiscount / 100 * valueVoucher);
        const cityId = document.querySelector('#cityId').value;
        const user = document.querySelector('#userSelect').value;

        if (valueVoucher === 0) {
            SwalCustom.messageDialog("", "Digite o valor do voucher!", "info")
            return;
        }

        if (cityId === "") {
            SwalCustom.messageDialog("", "Selecione a cidade de funcionalidade do voucher!", "info")
            return;
        }

        data.amount = valueVoucher;
        data.value = valuePaymentByUser;
        data.percentage = valuePercentageDiscount;
        data.cityId = cityId;
        data.user = user;

        $('#addPromotionVoucher').modal('hide');

        VoucherController.insertPromotionVoucher(data).then((response) => {
            preload(false);
            if (response.status) {
                SwalCustom.messageDialog("", "Voucher adicionado com sucesso!", "success").then(() => list(1));
                return;
            }
            swal('Erro ao inserir', response.message, 'info');
        });
    }

    function loadCities() {
        const optionDefault = `<option value="" disabled selected>Selecione uma cidade</option>`;

        preload(true);
        CityController.getActives()
            .then((data) => data.data)
            .then((cities) => {
                document.querySelector("#cityId").innerHTML =
                    optionDefault +
                    cities
                        .map((city) => {
                            return `<option value='${city.cityId}' >${city.nome}</option>`;
                        })
                        .join("");
                document.querySelector("#editCityId").innerHTML =
                    optionDefault +
                    cities
                        .map((city) => {
                            return `<option value='${city.cityId}' >${city.nome}</option>`;
                        })
                        .join("");
                preload(false);
            });
    }

    function setValuePaymentByUser(elementPayValueVoucherId, elementValueVoucherId, elementPercentageValueDiscount) {
        const inputValuePaymentByUser = document.querySelector(elementPayValueVoucherId);
        const valueVoucher = Mask.removeMaskMoney(document.querySelector(elementValueVoucherId).value);
        const valuePercentageDiscount = Mask.removeMaskMoney(document.querySelector(elementPercentageValueDiscount).value);
        const valuePaymentByUser = valueVoucher - ((valuePercentageDiscount / 100) * valueVoucher);

        inputValuePaymentByUser.value = Mask.maskMoney(valuePaymentByUser);
    }

    function setEditsValuesVoucher() {
        const id = this.getAttribute('idVoucher');
        const elementValueVoucher = document.querySelector('#editValueVoucher');
        const elementValuePercentageDiscount = document.querySelector('#editPercentageValueDiscount');
        const elementValuePaymentByUser = document.querySelector('#editPayValueVoucher');
        const elementValueCityId = document.querySelector('#editCityId');
        const elementUserSelect = document.querySelector('#editUserSelect');

        preload(true);
        VoucherController.getPromotionVoucherById(id).then(({ response }) => {
            elementValueVoucher.value = Mask.maskMoney(response.amount);
            elementValuePercentageDiscount.value = Mask.maskMoney(response.percentage);
            elementValuePaymentByUser.value = Mask.maskMoney(response.value);
            elementValueCityId.value = response.cityId;
            elementUserSelect.value = response.user;
            preload(false);
        });
    }

    function editValuesVoucher() {
        const data = {}
        const id = document.querySelector('.btn-edit-voucher').getAttribute('idVoucher');
        const valueVoucher = Mask.removeMaskMoney(document.querySelector('#editValueVoucher').value);
        const valuePercentageDiscount = Mask.removeMaskMoney(document.querySelector('#editPercentageValueDiscount').value);
        const valuePaymentByUser = Mask.removeMaskMoney(document.querySelector('#editPayValueVoucher').value);
        const valueCityId = document.querySelector('#editCityId').value;
        const user = document.querySelector('#editUserSelect').value;

        if (valueVoucher === 0) {
            SwalCustom.messageDialog("", "Digite o valor do voucher!", "info")
            return;
        }

        if (valueCityId === "") {
            SwalCustom.messageDialog("", "Selecione a cidade de funcionalidade do voucher!", "info")
            return;
        }

        data.amount = valueVoucher;
        data.value = valuePaymentByUser;
        data.percentage = valuePercentageDiscount;
        data.cityId = valueCityId;
        data.user = user;

        preload(true);
        VoucherController.editPromotionVoucher(id, data).then(() => {
            preload(false);
            SwalCustom.messageDialog("", "Voucher editado com sucesso!", "success").then(() => list());
        }).finally(() => {
            $('#editPromotionVoucher').modal('hide');
        });
    }

    function deleteVoucher() {
        const id = this.getAttribute('idVoucher');

        preload(true);
        VoucherController.deletePromotionVoucher(id).then(() => {
            preload(false);
            SwalCustom.messageDialog("", "Voucher deletado com sucesso!", "success").then(() => list());
        });
    }
});