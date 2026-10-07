function verifyStatusPendencyDriver() {
    const user = Session.get("user");
    const config = Session.get("configGeneral");
    const picturesLink = config.find(item => {
        return item.key === 'link_storage_pictures';
    });

    const profileImage = user.profileImage;
    const finalLink = `${picturesLink.value}driver/profile/compressed/${profileImage}`;
    const finalLinkTemp = `${picturesLink.value}driver/profile/temp/${profileImage}`;

    let listDocuments = [];

    const tripDriver = Session.get("tripDriver")

    if (parseInt(user.driverRegisterStatusId) === 1 ||  tripDriver && Object.keys(tripDriver)?.length > 0) {
        viewController.elementProperty.removeClass(".container-status-customer", "active");
        viewController.elementProperty.removeClass(".modal-status-customer", "active");
        viewController.elementProperty.removeClass(".modal-open-photo-document", "active");
        Route.removeGroupComponent(COMPONENT_STATUS_PENDENCY);
        return;
    }

    viewController.elementProperty.addClass(".container-status-customer", "active");

    if (user.profileImageTemp != null) {
        // document.querySelector("#profileStatusUser").style.backgroundImage = `url('${PATH_IMAGE_TEMP}${user.profileImageTemp}')`;
        document.querySelector("#profileStatusUser").style.backgroundImage = `url('${finalLinkTemp}')`;
    } else {
        // document.querySelector("#profileStatusUser").style.backgroundImage = `url('${PATH_IMAGE}${user.profileImage}')`;
        document.querySelector("#profileStatusUser").style.backgroundImage = `url('${finalLink}')`;
    }

    document.querySelector("#nameStatusCustomer").innerHTML = user.name;
    document.querySelector("#documentStatusCustomer").innerHTML = user.document;
    document.querySelector("#phoneStatusCustomer").innerHTML = user.phone;
    document.querySelector("#emailStatusCustomer").innerHTML = user.email;
    document.querySelector("#statusCustomerRegisterStatusId").innerHTML = user.driverRegisterStatus;


    viewController.elementProperty.addEventInElement("#editProfileDriverStatus", "onclick", function () {
        const capturePhoto = new CapturePhoto();

        capturePhoto.get().then(path => {
            document.querySelector("#profileStatusUser").style.backgroundImage = path.localToURL;
                viewController.elementProperty.addClass(".container-status-customer", "preload-active");
                DriverController.updatePhoto(user.idDriver, path).then(() => {
                    updateTripDriver().finally(() => {
                        viewController.elementProperty.removeClass(".container-status-customer", "preload-active");
                    });
            });
        });
    });

    if (user.profileImageStatus != null) {
        document.querySelector("#profileImageStatus").style.display = "block";
        document.querySelector("#profileImageStatus").innerHTML = `Status da imagem de perfil: ${user.profileImageStatus}`;
    } else {
        document.querySelector("#profileImageStatus").style.display = "none";
    }


    if (user.profileImageStatus !== "APROVADO") {
        document.querySelector("#profileImageStatus").style.color = "red";
    } else {
        document.querySelector("#profileImageStatus").style = "";
    }

    viewController.elementProperty.addEventInElement("#showDocumentStatus", "onclick", function () {
        showListDocuments();

        Route.startClassesInComponent([{component: ".modal-status-customer", class: "active"}], () => {
            viewController.elementProperty.removeClass(".modal-status-customer", "active");
        }, COMPONENT_STATUS_PENDENCY);
    });

    if (user.docsUser.filter(item => {
        return item.docStatus !== 'APROVADO';
    }).length > 0) {
        document.querySelector("#showDocumentStatus").classList.add("pendency-status");
        document.querySelector(".text-pendency-status").classList.add("active");
    } else {
        document.querySelector("#showDocumentStatus").classList.remove("pendency-status");
        document.querySelector(".text-pendency-status").classList.remove("active");
    }

    DocUserTypeController.getDocuments().then(({data}) => {
        listDocuments = data;
    });

    function showListDocuments() {

        viewController.elementProperty.getElement(
            "#listDocumentPendency",
            element => {
                const filterDoc = user.docsUser.filter(val => val.deleted_at === null);
                element.innerHTML = filterDoc
                    .map(item => {
                        return `<li class="open-document-customer" 
                      value='${JSON.stringify(item)}'>
                      <span>${item.label}</span>
                      <i class="material-icons">keyboard_arrow_right</i>
                      <div>
                        <i class="material-icons">schedule</i>
                        <span style="color: ${item.docStatus !== "APROVADO" ? "red" : "black"}">${item.docStatus}</span>
                      </div>
                    </li>`;
                    })
                    .join("");

                viewController.elementProperty.addEventInElement(
                    ".open-document-customer",
                    "onclick",
                    function () {
                        const document = JSON.parse(this.getAttribute("value"));

                        openDocument(document);
                    }
                );

            });
    }

    viewController.elementProperty.addEventInElement(".go-back-document", "onclick", function () {
        Route.backPage();
    });

    function openDocument(doc) {

        const managerDocument = {
            image: null,
            text: null,
            pdf: null,
            docId: doc.docId
        };

        const documentSelected = listDocuments.find(itemDocument => {
            return itemDocument.id === doc.docId;
        });

        document.querySelector("#descriptionDocumentModal").innerHTML = doc.label;
        document.querySelector("#descriptionDocumentText").innerHTML = doc.label;
        document.querySelector("#btnUpdateDocument").classList.remove("active");

        const btnUpdateDocument = document.querySelector("#btnUpdateDocument");


        if (documentSelected.text == true) {
            document.querySelector("#valueDocumentText").value = doc.text;
            document.querySelector("#valueDocumentText").style.display = "block";

            viewController.elementProperty.addEventInElement("#valueDocumentText", "oninput", (event) => {
                managerDocument.text = event.target.value;

                if (!btnUpdateDocument.classList.contains("active"))
                    btnUpdateDocument.classList.add("active");
            })
        } else {
            document.querySelector("#valueDocumentText").style.display = "none";
        }

        if (documentSelected.image == true) {
            document.querySelector("#boxPhotoDocument").style.backgroundImage = `url(${doc.image})`;
            document.querySelector("#boxPhotoDocument").style.display = "block";
        } else {
            document.querySelector("#boxPhotoDocument").style.display = "none";
        }

        Route.startClassesInComponent(
            [{component: ".modal-open-photo-document", class: "active"}],
            () => {
                viewController.elementProperty.removeClass(
                    ".modal-open-photo-document",
                    "active"
                );
            },
            COMPONENT_STATUS_PENDENCY
        );

        viewController.elementProperty.addEventInElement(".resend-file-pdf", "onchange", function () {
            const file = this.files[0];
            if (file) {
                managerDocument.pdf = file;
                sendDocData();
            }
        });

        viewController.elementProperty.addEventInElement("#btnCaptureDocument", "onclick", function () {

            navigator.notification.confirm('Selecione um modo de enviar a foto', (status) => {
                if (status === 1)
                    getImageByType(Camera.PictureSourceType.CAMERA);

                if (status === 2)
                    getImageByType(Camera.PictureSourceType.SAVEDPHOTOALBUM);


            }, 'Obter foto do documento', ['CAMERA', 'GALERIA'])
        });

        function getImageByType(type) {
            const capturePhoto = new CapturePhoto();

            capturePhoto.get(type).then(path => {
                managerDocument.image = path;
                document.querySelector(
                    "#boxPhotoDocument"
                ).style.backgroundImage = `url(${path.localToURL})`;

                if (!btnUpdateDocument.classList.contains("active"))
                    btnUpdateDocument.classList.add("active");
            });
        }

        viewController.elementProperty.addEventInElement(
            "#btnUpdateDocument",
            "onclick",
            function () {
                this.disabled = true;
                sendDocData().then(() => {
                    this.disabled = false;
                });
            });

        function sendDocData() {
            return new Promise((resolve, reject) => {
                DocUserController.send(managerDocument).then(({status, message}) => {
                    SwalCustom.messageDialog("", message, undefined, status ? "success" : "info");

                    if (status) {
                        user.docsUser = user.docsUser
                            .map(item => {
                                if (item.docId === managerDocument.docId) {
                                    if (managerDocument.text != null)
                                        item.text = managerDocument.text;
                                    if (managerDocument.image != null)
                                        item.image = managerDocument.image;

                                    return item;
                                }

                                return item;
                            });

                        Session.get("user", user);

                        DocUserController.find().then(({status, data}) => {
                            if (!status)
                                return;

                            user.docsUser = data;
                            Session.get("user", user);
                            showListDocuments();

                        });

                        btnUpdateDocument.classList.remove("active");

                        showListDocuments();
                        resolve();
                    }
                }).catch(reject);

            });
        }
    }
}
