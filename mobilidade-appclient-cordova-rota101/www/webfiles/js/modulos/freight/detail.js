
function showDetailFreight(freight) {
    if (freight.driver != null) {
        viewController.elementProperty.addClass(".btn-accepted-freight", "hidden");
        viewController.elementProperty.removeClass(".btn-cancel-freight", "hidden");
    } else {
        viewController.elementProperty.removeClass(
            ".btn-accepted-freight",
            "hidden"
        );
        viewController.elementProperty.addClass(".btn-cancel-freight", "hidden");
    }

    viewController.elementProperty.getElement("#scheduleFreight", element => {
        if (freight.schedule != null) {
            element.innerHTML = new Date(freight.schedule.schedule).toLocaleString();
        } else {
            element.innerHTML = "Agora";
        }
    });

    viewController.elementProperty.getElement("#valueTripType", element => {
        element.innerHTML = freight.tripType;
    });

    viewController.elementProperty.getElement("#valueTripCallType", element => {
        element.innerHTML = `${freight.tripCallType} - ${freight.tripType}`;
    });

    viewController.elementProperty.getElement("#distanceTripDetail", element => {
        element.innerHTML = `${parseInt(freight.distance)}km`;
    });

    viewController.elementProperty.getElement(".total-freight", element => {
        element.innerHTML = `${CityConfig.getTypeCoin()}${Mask.maskMoney(parseFloat(freight.price))}`;
    });

    viewController.elementProperty.getElement("#observationFreight", element => {
        element.innerHTML = `
            <p><b>Detalhes:</b> <span>${freight.deliveryInfo.obs ||
        ""}</span></p>
            <p><b>Coleta:</b> <span>${freight.deliveryInfo.obsOrigin ||
        ""}</span></p>
            <p><b>Entrega:</b> <span>${freight.deliveryInfo.obsDestination ||
        ""}</span></p>
        `;
    });

    viewController.elementProperty.getElement(
        ".freight-type-payment-form",
        element => {
            element.innerHTML = `Pagamento ${freight.tripPaymentForm}`;
        }
    );

    viewController.elementProperty.getElement(
        "#freightDetailCollect",
        element => {
            element.innerHTML = freight.origin.address;
        }
    );
    viewController.elementProperty.getElement(
        "#freightDetailDelivery",
        element => {
            element.innerHTML = freight.destination.name;
        }
    );

    viewController.elementProperty.getElement(
        ".item-selected-customer",
        element => {
            element.innerHTML = freight.freightItems
                .map(item => {
                    return `<li>
                        <p>
                            <span>${item.quantity}</span> - 
                            <span>${item.description.toUpperCase()}</span>
                        </p>
                        <p></p>
                    </li>`;
                })
                .join("");
        }
    );

    viewController.elementProperty.getElement(".photo-item-selected", element => {
        if (freight.freightPictures == null) return (element.innerHTML = "");

        element.innerHTML = freight.freightPictures
            .map(item => {
                return `<li class="open-photo-freight" path="${item}" style="background-image: url(${item})"></li>`;
            })
            .join("");

        viewController.elementProperty.addEventInElement(
            ".open-photo-freight",
            "onclick",
            function () {
                viewController.elementProperty.getElement(
                    "#photoItemDelivery",
                    element => {
                        element.style.backgroundImage = `url(${this.getAttribute("path")})`;
                    }
                );

                Route.startClassesInComponent(
                    [{component: ".modal-photo-item-delivery", class: "active"}],
                    () => {
                        viewController.elementProperty.removeClass(
                            ".modal-photo-item-delivery",
                            "active"
                        );
                    }
                );

                viewController.elementProperty.addEventInElement(
                    ".close-photo-item",
                    "onclick",
                    () => {
                        Route.backPage();
                    }
                );
            }
        );
    });

    viewController.elementProperty.addEventInElement(
        ".show-detail-price-freight",
        "onclick",
        () => {
            Route.startClassesInComponent(
                [{component: ".container-more-detail-freight", class: "active"}],
                () => {
                    viewController.elementProperty.removeClass(
                        ".container-more-detail-freight",
                        "active"
                    );
                }
            );
        }
    );

    calculateDetailFreight(freight);

    const groupAssistantFreight = [];

    freight.accessibility.assistant.filter(assistant => assistant.actionId == 1).map((assistant) => {
        const assistantSelected = groupAssistantFreight.find(item => {
            return item.helpId == assistant.helpId;
        });

        if (!assistantSelected) {
            groupAssistantFreight.push({...assistant, amount: 1});
        } else {
            assistantSelected.amount += 1;
        }
    });

    viewController.elementProperty.getElement(".assistant-freight", element => {
        element.innerHTML = groupAssistantFreight.map((assistant) => {
            return `<li>${assistant.amount} - ${assistant.description}</li>`
        }).join("");
    });

    document.querySelector("#spanCollectionFloor").innerHTML = freight.freightInfo.collectionFloor;
    document.querySelector("#spanDeliveryFloor").innerHTML = freight.freightInfo.deliveryFloor;
    document.querySelector("#spanIsNearCollection").innerHTML = freight.freightInfo.isNearCollection == true ? "Sim" : "Não";
    document.querySelector("#spanIsNearDelivery").innerHTML = freight.freightInfo.isNearDelivery == true ? "Sim" : "Não";

}
