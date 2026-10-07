document.addEventListener("DOMContentLoaded", async function () {
    Mask.setMoneyField("#value");
    const city = Session.getLocal('citySelected');
    const cityId = city.cityId;
    await listType();
    listRate(cityId);

    async function listType() {
        return await DeliveryRateController.typeRate().then(({response}) => {
            document.querySelector('#type').innerHTML += response.map(resp => {
                return `
            <option value="${resp.id}">${resp.name}</option>
            `;
            }).join('');

            return null;
        });
    }

    function listRate(cityId) {
        preload(true);
        DeliveryRateController.getRate(cityId).then(({response}) => {
            preload(false);
            if (response == null) {
                document.getElementById('value').value = "0,00";
                document.getElementById('type').value = 0;
            }
            document.getElementById('value').value = Mask.maskMoney(response.value);
            document.getElementById('type').value = response.payMachineReturnTypeId;
            document.getElementById('paidByPlatform').value = response.paidByPlatform;
        });
        elementProperty.addEventInElement('#btnUpdateRate', 'onclick', function () {
            const data = {};
            const value = Mask.removeMaskMoney(document.getElementById('value').value);
            const type = document.getElementById('type').value;
            const paidByPlatform = document.getElementById('paidByPlatform').value

            if (paidByPlatform === "") {
                return SwalCustom.messageDialog("", "Informe a Forma de Pagamento da taxa ao entregador");
            }
            if (type == 0) {
                return SwalCustom.messageDialog("", "Selecione o tipo de taxa");
            }

            data.value = value;
            data.cityId = cityId;
            data.payMachineReturnTypeId = type;
            data.paidByPlatform = paidByPlatform;
            SwalCustom.confirm('Você realmente deseja atualizar sua taxa?', '').then((status) => {
                preload(true);
                if (status)
                    DeliveryRateController.updateRate(data).then(({status}) => {
                        preload(false);
                        if (!status)
                            SwalCustom.messageDialog('Tente Novamente', 'Ocorreu um erro ao alterar a taxa de devolução da maquineta', 'error');

                        SwalCustom.messageDialog('', 'Atualizado com sucesso!', 'success').then(() => {
                            preload(true);
                            listRate(cityId);
                        });
                    });
            });
        });
    }
});