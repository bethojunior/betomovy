document.addEventListener("DOMContentLoaded", function () {
    preload(true);

    Mask.setMaskPhone("#deliverySupportPhone");

    ConfigController.getDelivery().then(({response}) => {
        document.querySelector("#deliveryPlatformName").value = response.delivery_platform_name;
        document.querySelector("#deliverySupportEmail").value = response.delivery_support_email;
        document.querySelector("#deliverySupportPhone").value = response.delivery_support_phone;
    }).finally(() => {
        preload(false);
    });

    elementProperty.addEventInElement("#formProfileDelivery", "onsubmit", function (event) {
        event.preventDefault();

        const data = {
            delivery_platform_name: document.querySelector("#deliveryPlatformName").value,
            delivery_support_email: document.querySelector("#deliverySupportEmail").value,
            delivery_support_phone: document.querySelector("#deliverySupportPhone").value
        };

        preload(true);

        MapSettingController.update(data).then(resolve => {
            preload(false)
            if (resolve.status)
                return swal('Modificado com sucesso', '', 'success');
            swal('ops', 'Erro ao modificar atributo', 'error')
        });
    });

});