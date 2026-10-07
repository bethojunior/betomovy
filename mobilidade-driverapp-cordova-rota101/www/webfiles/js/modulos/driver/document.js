function showDocumentPending(data) {
    viewController.elementProperty.getElement("#descriptionBlocked", element => {
        element.innerHTML = data.driverRegisterStatus.description
    });

    const requestDocument = {
        stdObject: {driverId: Session.getValueInSession("user", "idDriver")},
        document: {}
    };

    viewController.elementProperty.getElement("#reasonsBlocked", element => {
        element.innerHTML = "";

        if (!data.reasons)
            return;

        element.innerHTML = data.reasons
            .filter(reason => {
                return ["CNH", "CRLV", "ALVARA"].includes(reason.type);
            }).map(reason => {

                if(requestDocument.document[reason.type] === null)
                    return '';

                requestDocument.document[reason.type] = null;

                return `<li class="item-document-pending" value='${JSON.stringify(reason)}'>
                            <div>${reason.type}</div>
                            <div></div>
                        </li>`;
            }).join("");

        viewController.elementProperty.addEventInElement(".item-document-pending", "onclick", function () {
            const reason = JSON.parse(this.getAttribute("value"));

            navigator.notification.confirm('Selecione um modo de captura',
                (status) => {
                    if (status === 0)
                        return;

                    let type = null;

                    if (status === 1)
                        type = Camera.PictureSourceType.CAMERA;

                    if (status === 2)
                        type = Camera.PictureSourceType.SAVEDPHOTOALBUM;

                    openCameraDocument(type, (path) => {
                        FileUpload.getFile(path).then(file => {
                            requestDocument.document[reason.type] = file;

                            this.classList.add("active");
                        });
                    })
                }, `Precisamos de uma foto do seu documento(${reason.type})`, ['CÂMERA', 'GALERIA'])

        })
    });

    viewController.elementProperty.addEventInElement("#closeModalBlocked", "onclick", () => {
        if(Object.keys(requestDocument.document).length === 0)
            return  viewController.elementProperty.removeClass(".container-modal-blocked", "active");

        updateDocuments(requestDocument)
    });

    viewController.elementProperty.removeClass(".container-modal-blocked", "active", "enabled");

    viewController.elementProperty.addClass(".container-modal-blocked", "active");
}

function updateDocuments(requestDocument){
    const isRequest = Object.keys(requestDocument).filter(attribute => {
        return requestDocument[attribute] == null;
    }).length > 0;

    if (isRequest)
        return SwalCustom.messageDialog("", "Atenção,Envie todos os documentos");

    document.querySelector("#closeModalBlocked").disabled = true;

    const formData = new FormData();

    Object.keys(requestDocument.document).map(attribute => {
        FileUpload.prepare(requestDocument.document[attribute]).then(file => {
            formData.append(attribute, file.data, file.name);
        });
    });

    formData.append("stdObject", JSON.stringify(requestDocument.stdObject));

    setTimeout(() => {

        DriverController
            .editDocuments(formData)
            .then((response) => {
                console.log(response);
                SwalCustom.messageDialog("Aguarde a analise dos documentos para poder receber corridas!",response.message,undefined,"success");
                viewController.elementProperty.removeClass(".container-modal-blocked", "active");
            })
            .finally(() => {

                document.querySelector("#closeModalBlocked").disabled = false;
            });

    }, 500);
}

function openCameraDocument(type, callback) {
    const options = {
        quality: 100,
        destinationType: Camera.DestinationType.FILE_URI,
        sourceType: type,
        encodingType: Camera.EncodingType.JPEG,
        mediaType: Camera.MediaType.PICTURE,
        allowEdit: false,
        correctOrientation: true  //Corrects Android orientation quirks
    };

    options.targetHeight = 1200;
    options.targetWidth = 1600;

    navigator.camera.getPicture(callback, function cameraError(error) {
        console.debug("Unable to obtain picture: " + error, "app");
    }, options);
}