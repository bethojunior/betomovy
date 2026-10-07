const freightValue = {
    total: 0,
};

var managerUpdateFreight = {
    socket: null
};

const freightCurrentRepository = new TripRepository();

function initNewTripFreight() {
    const userLogged = Session.get("user");

    try {
        const freight = {
            userId: parseInt(userLogged.idUser),
            tripTypeId: globalFreight.tripTypeSelected.idTripType,
            tripPaymentFormId: document.getElementById("paymentFormFreight").value,
            origin: {
                address: document.getElementById("originFreight").value,
                latitude: positionFreight.originFreight.lat,
                longitude: positionFreight.originFreight.lng,
                neighborhood: '',
            },
            destination: {
                address: document.getElementById("destinationFreight").value,
                latitude: positionFreight.destinationFreight.lat,
                longitude: positionFreight.destinationFreight.lng,
                neighborhood: '',
            },
            distance: globalFreight.infoCalculate != null ? globalFreight.infoCalculate.distance : null,
            estimatedTripTime: globalFreight.infoCalculate.duration,
            schedule: getScheduledFreight(),
            scheduleISO: getScheduledISOFreight(),
            priceId: globalFreight.infoCalculate.price.idPrice,
            price: freightValue.total,
            waypoints: [],
            accessibility: getAccessibilitySelected(),
            items: getItemsSelected(),
            deliveryInfo: {
                obsOrigin: document.getElementById("obsOriginTextArea").value,
                obsDestination: document.getElementById("obsDestinationTextArea").value,
                obs: document.getElementById("obsTextArea").value,
            },
            freightInfo: {
                "collectionFloor": document.querySelector("#numberFloorGetItem").value,
                "deliveryFloor": document.querySelector("#numberFloorDeliveryItem").value,
                "isNearCollection": parseInt(document.querySelector("*[name='approximateLoading']:checked").value),
                "isNearDelivery": parseInt(document.querySelector("*[name='approximateDeliver']:checked").value)
            }
        };

        validateFreight(freight);

        Session.set("managerLastFreight", freight);

        // Session.set("managerFreight", managerTrip);

        verifyPaymentFormFreight(freight);
    } catch (error) {
        SwalCustom.messageDialog("", error);
    }
}

function returnValueDiffArray(value) {
    if (!Array.isArray(value))
        return value;

    return "";
}


function validateFreight(freight) {
    if (freight.tripPaymentFormId === "")
        throw "Informe a forma de pagamento";
}

function verifyPaymentFormFreight(freight) {

    if (parseInt(freight.tripPaymentFormId) === PAYMENT_CARD_CREDIT)
        return showModalCards((card) => managerCardFreight(freight, card));

    createFreight(freight)
}

function managerCardFreight(freight, card) {
    getCardSelectedPayFreight(card).then(tokenCard => {
        freight['mpToken'] = tokenCard.token;
        freight['cardId'] = tokenCard.cardId;

        createFreight(freight);
    });
}


function getCardSelectedPayFreight(card) {

    return new Promise((resolve, reject) => {
        if (Array.isArray(card)) {
            return reject();
        }

        Session.set("cardSelected", card);

        const paymentCard = new PaymentCard();

        preload(true);

        paymentCard.createToken({
            cardNumber: card.number,
            cardholderName: card.cardholderName,
            cardExpirationMonth: card.expirationMonth,
            cardExpirationYear: card.expirationYear,
            securityCode: card.cvv,
            identificationType: 'CPF',
            identificationNumber: card.holderDocument,
        }, function (response) {
            preload(false);

            if (!response) {
                SwalCustom.messageDialog("", "Ocorreu um error", undefined, "warning");
                reject("Ocorreu um na solicitação do pagamento com cartão");
                return;
            }

            Session.set("tokenCard", {
                token: response.id,
                cardId: card.idCard
            });

            resolve(Session.get("tokenCard"));

        });
    });
}

function createFreight(freight) {
    Session.set("lastTrip", freight);

    preload(true);

    FreightController.new(freight).then(({status, data, message, errors}) => {
        if (!status)
            return SwalCustom.messageDialog(errors.message, message, undefined, "warning");

        if (managerItemDelivery.photos.length !== 0) {
            const photos = [...managerItemDelivery.photos];
            savePicturesFreight(photos, data);
        }

        viewController.elementProperty.removeClass(".container-budget", "active");
        viewController.elementProperty.removeClass(".container-detail-freight-trip", "active");

        pages = [pages[0]];

        activeFreightScreen(data)
    }).finally(() => {
        preload(false);
    })
}


function savePicturesFreight(photos, freight) {
    const formData = new FormData();


    Promise.all(photos.map((photo, index) => {
        return new Promise(resolve => {
            FileUpload.getFile(photo).then(fileEntry => {
                FileUpload.prepare(fileEntry).then(file => {
                    formData.append(`photo${index}`, file.data, file.name);
                    resolve()
                });
            });
        });
    })).then(() => {
        formData.append("tripReference", freight.tripReference);
        FreightController.picture(formData);
    });
}
