document.addEventListener("DOMContentLoaded", function () {
    Mask.setMoneyField("#rateInput");
    Mask.setMoneyField("#deliveryServiceFee");

    list();

    function getTypeDeliveryServiceFee(item){
        return item.deliveryServiceFeeType === "$" ? "Valor" : "Percetagem";
    }

    function list() {
        preload(true);
        DeliveryRateController.list().then(({response}) => {
            document.querySelector("#list").innerHTML = response.map(item => {
                return `<tr>
                        <td>ATÉ ${item.range} KM</td>
                        <td>R$ ${Mask.maskMoney(item.tax)}</td>
                        <td>${item.time} minutos</td>
                        <td>${Mask.maskMoney(item.deliveryServiceFee)}</td>
                        <td>${getTypeDeliveryServiceFee(item)}</td>
                        <td>
                            <button type="button" class="btn btn-danger btn-sm delete-item" item="${item.id}">Excluir</button>
                        </td>
                    </tr>`
            }).join("");
            preload(false);

            elementProperty.addEventInElement(".delete-item", "onclick", function () {
                const id = this.getAttribute("item");
                SwalCustom.dialogConfirm("Atenção", "Deseja remover essa tarifa?", status => {
                    if (status) {
                        preload(true);
                        DeliveryRateController.delete(id).then(() => {
                            list();
                        });
                    }
                });
            });
        });
    }

    elementProperty.addEventInElement("#addRateForm", "onsubmit", function (e) {
        e.preventDefault();

        const rate = {
            "range": document.querySelector("#reachInput").value,
            "tax": Mask.removeMaskMoney(document.querySelector("#rateInput").value),
            "time": document.querySelector("#timeInput").value,
            "cityId": Session.getLocal("citySelected").cityId,
            "deliveryServiceFee": Mask.removeMaskMoney(document.querySelector("#deliveryServiceFee").value),
            "deliveryServiceFeeType": document.querySelector("input[name='deliveryServiceFeeType']:checked").value
        };

        preload(true);

        DeliveryRateController.insert(rate).then(({status}) => {
            preload(false);
            if (status) {
                document.querySelector("#reachInput").value = "";
                document.querySelector("#rateInput").value = "0,00";
                document.querySelector("#timeInput").value = "";
                $('#addRateModal').modal('hide');
                return SwalCustom.messageDialog("Taxa adicionada com sucesso", "Atenção", "success").then(() => {
                    list();
                })
            }

            SwalCustom.messageDialog("Ocorreu um erro ao adicionar taxa", "Atenção", "info");
        });
    });
});