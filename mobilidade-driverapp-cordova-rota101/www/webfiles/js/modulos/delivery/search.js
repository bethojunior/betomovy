Route.waitView().then(() => {
    const user = Session.get("user");
    if (user.isDeliveryMan == false)
        return;

    updateStatisticsDriver();

    showAllOrdersByDriver();
    const socket = io(HOST_API_SOCKET_V2, {query: `driverId=${user.idDriver}`});

    socket.on(`searchDriverOrder_${user.idDriver}`, (order) => {
        openAppForeground();
        const modal = document.querySelector(".modal-delivery-search");

        if (modal.classList.contains("active"))
            return;

        viewController.elementProperty.removeClass(".btn-event-search-delivery", "disabled");

        viewController.elementProperty.getElement("#deliveryFeeSearch", element => {
            element.innerHTML = `${CityConfig.getTypeCoin()} ${Mask.maskMoney(order.deliveryFee)}`
        })

        viewController.elementProperty.getElement("#deliverySearchPlaces", element => {
            element.innerHTML = `<li><p>Coletas</p></li>
            <li><label>${order.company.fantasyName} - ${order.company_address.address}</label></li>
            <li><p>Entregas</p></li>
            <li><label>${order.delivery_order_place.place.address} - Nº: ${order?.delivery_order_place?.place?.number || "Não informado"}</label></li>`
        });

        modal.classList.add("active");

        viewController.elementProperty.getElement(`#songCallCar`, element => {
            element.play();
        });

        viewController.elementProperty.addEventInElement("#btnRefuseDelivery", "onclick", function () {
            viewController.elementProperty.getElement(`#songCallCar`, element => {
                element.pause();
            });
            viewController.elementProperty.addClass(".btn-event-search-delivery", "disabled");
            PreloadRequest.clear();
            PreloadRequest.progress("Recusando entrega");
            DeliveryOrderController.refuse(order.id).then(({status}) => {
                if (!status) {
                    PreloadRequest.info("A busca de entregas foi cancelada");
                    return;
                }
                PreloadRequest.clear();

                modal.classList.remove("active");

                showAllOrdersByDriver();
            }).catch(() => {
                PreloadRequest.clear();
                modal.classList.remove("active");
                SwalCustom.messageDialog("Estabelecimento cancelou o chamado do pedido", "Chamado cancelado");
            }
        );

        });

        viewController.elementProperty.addEventInElement("#btnAcceptDelivery", "onclick", function () {
            viewController.elementProperty.getElement(`#songCallCar`, element => {
                element.pause();
            });
            viewController.elementProperty.addClass(".btn-event-search-delivery", "disabled");
            PreloadRequest.clear();
            PreloadRequest.progress("Aceitando entrega");
            DeliveryOrderController.accept(order.id).then(({status}) => {
                if (!status) {
                    PreloadRequest.info("Ocorreu um erro ao aceitar viagem");
                    return;
                }
                PreloadRequest.clear();

                modal.classList.remove("active");

                showAllOrdersByDriver();
            }).catch(() => {
                PreloadRequest.clear();
                modal.classList.remove("active");
                SwalCustom.messageDialog("Estabelecimento cancelou o chamado do pedido", "Chamado cancelado");
            }
        );
        });
    });

    socket.on(`driver_${user.idDriver}`, (order) => {
        if (order.delivery_order_status.id === order_canceled) {
            viewController.elementProperty.removeClass(".modal-info-delivery-order", "active");
            SwalCustom.messageDialog("Estabelecimento cancelou a entrega do pedido", "Entrega cancelada");
        }
        openAppForeground();
        showAllOrdersByDriver();
    });
});
