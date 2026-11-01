function initTrip(trip) {

    return new Promise((resolve, reject) => {
        if (!validateTrip(trip))
            return;

        new CustomerController().actionNew({...trip}).then(resolve).catch(function (message, error) {
            reject(error, message);
        });
    })
}

/**
 *
 * @param trip
 * @returns {boolean}
 */
function validateTrip(trip) {
    if (!trip) return false;

    if (trip.userId === null || trip.userId === undefined) {
        const user = Session.get("user");
        if (user && user.idUser) {
            trip.userId = parseInt(user.idUser);
        } else {
            SwalCustom.messageDialog("Error ao tentar confirmar corrida: usuário não identificado", "Atenção", undefined, "warning");
            return false;
        }
    }

    if (trip.tripPaymentFormId === null || trip.tripPaymentFormId === undefined) {
        if (typeof managerTrip !== "undefined" && managerTrip?.paymentFormIdSelected) {
            trip.tripPaymentFormId = managerTrip.paymentFormIdSelected;
        } else {
            trip.tripPaymentFormId = 1; // Fallback padrão
        }
    }

    if (trip.tripTypeId === null || trip.tripTypeId === undefined) {
        if (typeof managerTrip !== "undefined" && managerTrip?.typeTaxi?.tripTypeId) {
            trip.tripTypeId = managerTrip.typeTaxi.tripTypeId;
        } else {
            trip.tripTypeId = 1; // Fallback padrão
        }
    }

    const isCard = typeof isPaymentFormCard === "function"
        ? isPaymentFormCard(trip.tripPaymentFormId)
        : (parseInt(trip.tripPaymentFormId, 10) === 3 || parseInt(trip.tripPaymentFormId, 10) === 18);

    if (isCard) {
        const tokenCard = Session.get("tokenCard") || Session.getLocal("tokenCard");
        const cardId = trip.cardId || tokenCard?.cardId || Session.getValueInSession("tokenCard", "cardId");
        const mpToken = trip.mpToken || tokenCard?.token || Session.getValueInSession("tokenCard", "token");

        if (!cardId) {
            SwalCustom.messageDialog("", "Selecione ou adicione um cartão para pagar com Stripe.", undefined, "warning");
            if (typeof choiceCard === "function") choiceCard();
            return false;
        }
        trip.cardId = cardId;
        trip.mpToken = mpToken;
    }

    return true;
}

function authorizedTravelUser() {
    const userLogged = Session.get("user");
    if (userLogged.customerRegisterStatusId === STATUS_BLOCKED) {
        SwalCustom.messageDialog("", "Atenção, você não tem autorização para solicitar viagem", undefined, "warning");
        return false;
    }

    return true;
}

function toggleCallOrCancel(event) {
    event.stopPropagation();
    if (!authorizedTravelUser())
        return;
    initCloseTrip();
    updateBtnCallTripVisibility();
    getDataCustomerByPartner();

}

function closeTripSearchPanel() {
    viewController.elementProperty.removeClass(".container-menu", "active");
    viewController.elementProperty.removeClass("#callRunning", "active");
    if (typeof Route !== "undefined" && typeof COMPONENT_CREATE_TRIP !== "undefined") {
        Route.removeGroupComponent(COMPONENT_CREATE_TRIP);
    }
    // removeGroupComponent só limpa o controle interno de páginas, não as
    // classes "active" no DOM — sem isso, fechar o painel com o agendamento
    // ou o formulário de pagamento aberto deixa o overlay preso, reaparecendo
    // mal posicionado na próxima viagem.
    viewController.elementProperty.removeClass(".footer-schedule-form", "active");
    viewController.elementProperty.removeClass(".footer-payment-form", "active");
    // Garante que o modo "apontar no mapa" seja encerrado corretamente,
    // mesmo se o usuário fechar o painel sem confirmar (mesma limpeza feita
    // no callback de saída em modules/place/address.js > .point-trip-customer).
    if (typeof mapService !== "undefined" && mapService.pointCenter) {
        try {
            mapService.pointCenter.setMap(null);
        } catch (err) {
            console.warn("initTrip: pointCenter.setMap(null) error", err);
        }
    }
    viewController.elementProperty.removeClass(".container-point-local-map", "active");
    viewController.elementProperty.getElement(".container-menu", (element) => {
        element.style.display = "";
    });
    viewController.elementProperty.getElement(".notification-item", (element) => {
        element.style.display = "";
    });
    viewController.elementProperty.getElement(".menu-close", (element) => {
        element.style.display = "";
    });
    viewController.elementProperty.getElement(".pac-container", (element) => {
        element.style.display = "";
    });
    viewController.elementProperty.getElement(".input-custom", (element) => {
        element.disabled = false;
    });
    viewController.elementProperty.removeClass(".menu-close", "black");
    viewController.elementProperty.removeClass(".list-trips-active-partner", "active");
    if (typeof managerTripViewCurrent !== "undefined") {
        managerTripViewCurrent.isVisible = true;
    }
    if (typeof updateBtnCallTripVisibility === "function") {
        updateBtnCallTripVisibility();
    }
    if (typeof verifyListTripActivePartner === "function") {
        verifyListTripActivePartner();
    }
}

function bindCloseTripPanelButton() {
    const btnCloseTripPanel = document.getElementById("btnCloseTripPanel");
    if (!btnCloseTripPanel) {
        return;
    }
    btnCloseTripPanel.addEventListener("click", function (e) {
        e.stopPropagation();
        e.preventDefault();
        closeTripSearchPanel();
    });
}

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", bindCloseTripPanelButton);
} else {
    bindCloseTripPanelButton();
}

function getPlaceCustomer() {

    // Só preenche a origem com o endereço padrão da central se o usuário
    // ainda não tiver escolhido (ou invertido) um endereço de origem —
    // sem esse guard, reabrir o painel sobrescreve a origem já selecionada.
    if (!trip.origin) {
        const centralSelected = Session.get("centralSelected");

        document.querySelector("#originSelected").value = centralSelected.address;

        getPoint({
            latitude: parseFloat(centralSelected.latitude),
            longitude: parseFloat(centralSelected.longitude),
            address: centralSelected.address,
            neighborhood: "",
        }, "origin");
    }

    viewController.elementProperty.removeClass(".menu-close", "black");
    viewController.elementProperty.getElement("#origin", element => {
        viewController.elementProperty.getElement(".menu-close", menu => {
            if (menu.classList.contains("open")) {
                element.focus();
            }
        });
    });


    Route.startClassesInComponent([
        {component: ".container-menu", class: "active"},
        {component: "#callRunning", class: "active"},
    ], () => {
        initProcessingCallTrip();
        verifyListTripActivePartner();
        managerTripViewCurrent.isVisible = true;

        updateBtnCallTripVisibility();

        // Recalcula o mapa após o painel de endereços (bottom sheet / sidebar)
        setTimeout(() => {
            try {
                if (typeof mapService !== "undefined" && mapService?.resizeMap) {
                    mapService.resizeMap();
                }
            } catch (e) {}
        }, 350);

        viewController.elementProperty.getElement(".pac-container", element => {
            element.style.display = "none";
        });

        viewController.elementProperty.getElement(".input-custom", element => {
            element.disabled = true;
        });
    }, COMPONENT_CREATE_TRIP);


    viewController.elementProperty.getElement(".input-custom", element => {
        element.disabled = false;
    });

    viewController.elementProperty.removeClass(".list-trips-active-partner", "active");

}