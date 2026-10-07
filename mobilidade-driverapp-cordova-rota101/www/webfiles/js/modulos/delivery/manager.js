const order_waiting_confirmation = 1;
const order_confirmed = 2;
const order_in_preparation = 3;
const order_searching_delivery_man = 4;
const order_accepted_delivery_man = 5;
const order_withdrawing = 6;
const order_out_for_delivery = 7;
const order_arrived = 8;
const order_delivered = 9;
const order_returning = 10;
const order_canceled = 11;
const order_finished = 12;

const MONEY_IN_LOCAL = 1;

const PAYMENT_PIX = 9;

function showAllOrdersByDriver() {
    const cityId = Session.get("cityConfig").cityId;
    DeliveryOrderController.active(`?cityId=${cityId}`).then(({response}) => {
        Session.set("orders", JSON.stringify(response))
        if (response.length > 0) {
            viewController.elementProperty.addClass(".list-orders-actives", "active");
        } else {
            viewController.elementProperty.removeClass(".list-orders-actives", "active");
        }

        viewController.elementProperty.getElement("#listOrdersActives", element => {
            element.innerHTML = response.reverse().map((item, index) => {
                return `<li class="item-order-active ${index === 0 ? "active" : ""}" value="${btoa(JSON.stringify(item))}">
                            <div>
                                <p>Pedido #${item.id}</p>
                                <span>Estabelecimento</span>
                                <p>${item.company.fantasyName}</p>
                            </div>
                            <span class="material-icons">chevron_right</span>
                    </li>`;
            }).join("");

            viewController.elementProperty.addEventInElement(".item-order-active", "onclick", function () {
                const item = JSON.parse(atob(this.getAttribute("value")));
                showDataOrderDelivery(item);
            });
        });
    })
}

function showChangeValueDelivery(order) {
    if (order.delivery_payment_form.paymentFormTypeId !== MONEY_IN_LOCAL)
        return "";

    if (order.changeValue === null) return `<p>Sem troco</p>`;

    return `<p>Troco para ${CityConfig.getTypeCoin()} ${Mask.maskMoney(order.changeValue)}</p>`;
}

function showDataOrderDelivery(order) {
    updateData(order);

    const user = Session.get("user");

    const socket = io(HOST_API_SOCKET_V2, {query: `driverId=${user.idDriver}`});

    socket.on(`trackOrder_${order.id}`, (result) => {
        document.querySelector("#btnEventChangeStatusOrder").disabled = true;
        PreloadRequest.progress("Atualizando...");
        DeliveryOrderController.find(result.id).then(({response}) => {
            document.querySelector("#btnEventChangeStatusOrder").disabled = false;
            PreloadRequest.clear();
            updateData(response)
        })
    });

    Route.startClassesInComponent([{component: ".modal-info-delivery-order", class: "active"}], () => {
        viewController.elementProperty.removeClass(".modal-info-delivery-order", "active");
        socket.close();
    });


    function updateData(order) {
        const orders = JSON.parse(Session.get('orders'));
        const currentOrder = orders.find((res) => {
            return res.id = order.id
        })

        document.querySelector("#btnEventChangeStatusOrder").disabled = false;
        document.querySelector("#fantasyNameOrder").innerHTML = order.company.fantasyName;
        document.querySelector("#addressCompanyOrder").innerHTML = order.company_address.address;
        document.querySelector("#addressCustomerOrder").innerHTML = order.delivery_order_place.place.address;
        document.querySelector("#complementCustomerOrder").innerHTML = order.delivery_order_place.place.complement || "-";
        document.querySelector("#referencePointCustomerOrder").innerHTML = order.delivery_order_place.place.referencePoint || "-";
        document.querySelector("#nameCustomerOrder").innerHTML = order.customer.name;
        document.querySelector("#numberLocalCustomerDelivery").innerHTML = order.delivery_order_place.place.number || "-";
        viewController.elementProperty.getElement(".change-value-delivery", element => {
            element.innerHTML = showChangeValueDelivery(order);
        });

        const haveReteturnElement = document.querySelector('#haveReturnMachine')
        !currentOrder?.payMachineReturnId ? haveReteturnElement.innerHTML = '' : '';
        if(currentOrder?.payMachineReturnId && !currentOrder?.payMachineReturn?.paidByPlatform){
            if(currentOrder?.payMachineReturn?.payMachineReturnTypeId == '1'){
                const valueReturn = (currentOrder.payMachineReturn.value);
                haveReteturnElement.innerHTML = `Receber R$${valueReturn} do estabelecimento`;
                haveReteturnElement.style.color = "red";
            } else {
                const returnValue = (currentOrder.value);
                const percentageValue = (currentOrder.payMachineReturn?.value);
                const totalReturnValue = returnValue * (percentageValue / 100);
                haveReteturnElement.innerHTML = `Receber R$${totalReturnValue} do estabelecimento`;
                haveReteturnElement.style.color = "red";
            }
        }
        
        if(order.delivery_order_status.id === order_accepted_delivery_man){
            document.querySelector("#btnCancelDeliveryOrder").style = "";
        }else{
            document.querySelector("#btnCancelDeliveryOrder").style.display = "none";
        }

        checkStatusOrderDelivery(order);

        eventDirectionNavigation(order);
        viewController.elementProperty.addEventInElement("#btnCancelDeliveryOrder", "onclick", function () {
            SwalCustom.dialogConfirm("Deseja cancelar a entrega?", "", status => {
                if (status) {
                    PreloadRequest.progress("Cancelando entrega");
                    DeliveryOrderController.cancelByDriver(order.id).then(()=>{
                        PreloadRequest.clear();
                        viewController.elementProperty.removeClass(".modal-info-delivery-order", "active");
                        PreloadRequest.progress("Atualizando status");
                        updateTripDriver();
                        showAllOrdersByDriver();
                        updateStatisticsDriver();
                    });
                }
            })
        });

        viewController.elementProperty.getElement(".number-order-label", element => element.innerHTML = `#${order.id}`);
    }

    viewController.elementProperty.addEventInElement("#directionDeliveryOrder", "onclick", function () {
        Route.startClassesInComponent([{component: ".container-option-navigator", class: "active"}], () => {
            viewController.elementProperty.removeClass(".container-option-navigator", "active");
        });
    });

    viewController.elementProperty.addEventInElement(".go-back", "onclick", function () {
        Route.backPage();
    });

    if (order.delivery_payment_form.paymentFormTypeId === PAYMENT_PIX)
        getConfigPix({value: order.value, companyId: order.companyId, orderId: order.id}).then(({response}) => {
            if (!response)
                return;
            cordova.plugins.qrcodejs.encode('TEXT_TYPE',
                atob(response.code),
                (base64EncodedQRImage) => {
                    document.querySelector("#contentQrCodePix").style.backgroundImage = `url(${base64EncodedQRImage})`;
                });

            document.querySelector("#codePixKey").innerHTML = response.pixKey;
        })
}

function eventDirectionNavigation(order) {
    viewController.elementProperty.addEventInElement(".close-modal-navigator", "onclick", function (e) {
        e.stopPropagation();
        e.preventDefault();

        Route.backPage();

        const {latitude: lat, longitude: lng} = order.delivery_order_status.id < order_out_for_delivery ? order.company_address : order.delivery_order_place.place;

        showNavigationDirection(this.getAttribute("id"), lat, lng);
    });
}


function checkStatusOrderDelivery(order) {
    switch (order.delivery_order_status.id) {
        case order_accepted_delivery_man: {
            actionInformArrival(order);
            break;
        }
        case order_withdrawing: {
            actionWithdrawing(order);
            break;
        }
        case order_out_for_delivery: {
            actionOutForDelivery(order);
            break;
        }
        case order_arrived: {
            actionArrived(order);
            break;
        }
        case order_delivered: {
            finishedDeliveryOrder(order);
            break;
        }
        default: {
            console.log("status do pedido não mapeado");
            break;
        }
    }
}


function actionInformArrival(order) {
    document.querySelector("#chatDeliveryOrder").style.display = "none";
    document.querySelector("#callDeliveryOrder").style.display = "none";
    document.querySelector(".info-number-order-label").classList.remove("active");
    document.querySelector("#statusDriverCompanyOrder").classList.remove("active", "success");
    document.querySelector("#statusDriverCustomerOrder").classList.remove("active", "success");
    document.querySelector("#btnEventChangeStatusOrder").innerHTML = "Cheguei na coleta";
    viewController.elementProperty.addEventInElement("#btnEventChangeStatusOrder", "onclick", function () {
        SwalCustom.dialogConfirm("Deseja informar chegada?", "", status => {
            if (status) {
                this.disabled = true;
                PreloadRequest.progress("Informando chegada");
                DeliveryOrderController.changeStatusOrder(order.id, "informArrival").then(({status}) => {
                    PreloadRequest.clear();
                    this.disabled = false;
                    if (!status) {
                        PreloadRequest.info("Ocorreu um erro ao informa chegada");
                    } else {
                        showAllOrdersByDriver();
                    }
                });
            }
        })
    });
}


function actionWithdrawing(order) {
    document.querySelector("#statusDriverCompanyOrder").classList.remove("active");
    document.querySelector("#statusDriverCompanyOrder").classList.add("success");
    document.querySelector("#statusDriverCustomerOrder").classList.remove("active", "success");
    document.querySelector("#chatDeliveryOrder").style.display = "none";
    document.querySelector("#callDeliveryOrder").style.display = "none";
    viewController.elementProperty.addClass(".info-number-order-label", "active");
    document.querySelector("#btnEventChangeStatusOrder").innerHTML = "Saí da coleta";
    viewController.elementProperty.addEventInElement("#btnEventChangeStatusOrder", "onclick", function () {
        SwalCustom.dialogConfirm("Deseja sai da coleta?", "", status => {
            if (status) {
                this.disabled = true;
                const cityId = Session.get("cityConfig").cityId;
                PreloadRequest.progress("Saindo da coleta");
                DeliveryOrderController.changeStatusOrder(order.id, "goOutForDelivery", `?cityId=${cityId}`).then(({status}) => {
                    PreloadRequest.clear();
                    this.disabled = false;
                    if (!status) {
                        PreloadRequest.info("Ocorreu um erro ao sair da coleta");
                    } else {
                        showAllOrdersByDriver();
                    }
                });
            }
        })
    });
}


function actionOutForDelivery(order) {
    document.querySelector("#chatDeliveryOrder").style = "";
    document.querySelector("#callDeliveryOrder").style = "";
    document.querySelector("#statusDriverCompanyOrder").classList.add("active", "success");
    viewController.elementProperty.addClass(".info-number-order-label", "active");
    document.querySelector("#btnEventChangeStatusOrder").innerHTML = "Cheguei na entrega";
    viewController.elementProperty.addEventInElement("#chatDeliveryOrder", "onclick", function () {
        Session.set("orderDeliverySelected", order);
        Route.redirectDynamic("Driver", "ChatDelivery");
    });
    viewController.elementProperty.addEventInElement("#btnDeliveryOccurrence", "onclick", function () {
        Session.set("orderDeliverySelected", order);
        Route.redirectDynamic("Driver", "DeliveryOccurrence");
    });
    viewController.elementProperty.addEventInElement("#callDeliveryOrder", "onclick", function () {
        window.plugins.CallNumber.callNumber((result) => {
        }, (result) => {
            SwalCustom.messageDialog("", "Ops... não foi possível fazer a ligação", undefined, "warning");
        }, "0" + order.customer.phone.replace(/[^0-9\.]+/g, ''), true);
    });
    viewController.elementProperty.addEventInElement("#btnEventChangeStatusOrder", "onclick", function () {
        SwalCustom.dialogConfirm("Deseja sinalizar chegada?", "", status => {
            if (status) {
                this.disabled = true;
                PreloadRequest.progress("Sinalizando chegada");
                DeliveryOrderController.changeStatusOrder(order.id, "arriveOnDelivery").then(({status}) => {
                    PreloadRequest.clear();
                    this.disabled = false;
                    if (!status)
                        return PreloadRequest.info("Ocorreu um erro ao sinalizar chegada");

                    showAllOrdersByDriver();
                });
            }
        })
    });
}


function actionArrived(order) {
    // document.querySelector("#chatDeliveryOrder").style = "";
    document.querySelector("#callDeliveryOrder").style = "";
    document.querySelector("#statusDriverCompanyOrder").classList.add("active", "success");
    document.querySelector("#statusDriverCustomerOrder").classList.add("success");
    viewController.elementProperty.addClass(".info-number-order-label", "active");
    document.querySelector("#btnEventChangeStatusOrder").innerHTML = "Confirmar entrega";

    viewController.elementProperty.addEventInElement("#callDeliveryOrder", "onclick", function () {
        window.plugins.CallNumber.callNumber(() => {

        }, () => {
            SwalCustom.messageDialog("", "Ops... não foi possível fazer a ligação", undefined, "warning");
        }, "0" +  order.customer.phone.replace(/[^0-9\.]+/g, ''), true);
    });

    viewController.elementProperty.addEventInElement("#btnEventChangeStatusOrder", "onclick", function () {
        const callback = () => {
            this.disabled = true;
            PreloadRequest.progress("Confirmando entrega");
            DeliveryOrderController.changeStatusOrder(order.id, "deliver").then(({status}) => {
                PreloadRequest.clear();
                this.disabled = false;
                if (!status) {
                    PreloadRequest.info("Ocorreu um erro ao confirmar entrega");
                } else {
                    finishedDeliveryOrder(order);
                }
            });
        };

        const callbackConfirmationDelivery = () => {
            if (order.delivery_payment_form.paymentFormTypeId === PAYMENT_PIX) {
                Route.startClassesInComponent([{
                    component: ".modal-payment-pix-delivery",
                    class: "active"
                }], () => {
                    document.querySelector(".modal-payment-pix-delivery").classList.remove("active");
                });

                viewController.elementProperty.addEventInElement("#btnConfirmPaymentByPix", "onclick", function () {
                    SwalCustom.dialogConfirm("Confirme que o cliente fez o pagamento via pix, antes de finalizar o pedido", "", status => {
                        if (status) {
                            Route.backPage();
                            callback();
                        }
                    })
                });

                return;
            }
            callback();
        }

        SwalCustom.dialogConfirm("Deseja confimar entrega?", "", status => {
            if (status) {
                if (ConfigGeneral().get("enable_delivery_confirmation_code") == false) {
                    callbackConfirmationDelivery();
                    return;
                }

                Route.startClassesInComponent([{
                    component: ".modal-delivery-confirmation-code",
                    class: "active"
                }], () => {
                    document.querySelector(".modal-delivery-confirmation-code").classList.remove("active");
                });

                viewController.elementProperty.addEventInElement("#btnDeliveryConfirmationCode", "onclick", function () {
                    if (order.verificationCode !== document.querySelector("#inputDeliveryConfirmationCode").value)
                        return SwalCustom.messageDialog("Código invalido", "Atenção");

                    document.querySelector("#inputDeliveryConfirmationCode").value = "";

                    Route.backPage();

                    callbackConfirmationDelivery();
                });
            }
        })
    });
}


function finishedDeliveryOrder(order) {
    document.querySelector("#btnEventChangeStatusOrder").disabled = true;
    PreloadRequest.progress("Finalizando entrega");
    DeliveryOrderController.changeStatusOrder(order.id, "finish").then(({status}) => {
        document.querySelector("#btnEventChangeStatusOrder").disabled = false;
        PreloadRequest.clear();
        if (!status) {
            PreloadRequest.info("Ocorreu um erro ao finalizar entrega");
        } else {
            viewController.elementProperty.removeClass(".modal-info-delivery-order", "active");
            PreloadRequest.progress("Atualizando status");
            updateTripDriver();
            showAllOrdersByDriver();
            updateStatisticsDriver();
        }
    })
}


function showNavigationDirection(navigationBy, lat, lng) {
    switch (navigationBy) {
        case "navigatorByGoogle": {
            const position = Session.get("lastPosition");
            window.open(`https://www.google.com/maps/dir/?api=1&origin=${position.lat},${position.lng}&destination=${lat},${lng}&travelmode=driving`, "_system");
            break;
        }
        case "navigatorByWaze": {
            window.open(`https://www.waze.com/ul?ll=${lat},${lng}&navigate=yes&zoom=17`, "_system");
            break;
        }
    }
}

function getConfigPix({companyId, value, orderId}) {
    return new Promise((resolve, reject) => {
        ConnectionServer.sendRequest(`delivery/company/pix`, "POST", {
            companyId,
            value,
            orderId
        }, resolve, reject, undefined, false, true);
    });
}
