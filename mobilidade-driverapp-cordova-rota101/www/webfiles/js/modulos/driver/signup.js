$(document).ready(function () {
    const push = new Push();
    const FILE_CONTEXT = "www/webfiles/js/modulos/driver/signup";
    let logger = null;
    
    getPulseLogger().then(l => logger = l).catch(() => {});

    $('select').material_select();

    let isFormFinish = false,
        isValidateEmail = false;

    if (!getTextTranslate("sign-up", "remove-mask")) {
        Mask.setMaskPhone("#phone");

        $("#licensePlate").inputmask({
            mask: ['AAA-9999', 'AAA9A99']
        });
        // $("#cpf").inputmask({
        //     mask: ['999.999.999-99', '99.999.999/9999-99']
        // });
    }

    const elementProperty = new ElementProperty();
    const driverController = new DriverController();
    const stationTypeController = new StationTypeController();
    const supportController = new SupportController();

    elementProperty.addEventInElement('#cpf', 'onblur', () => {
        if(!documentRequired) return;
        elementProperty.getElement('#cpf', res => {
            let document = res.value;
            const documentName = res.placeholder

            DriverController.checkCpf({
                document
            }).then(resolve => {
                if (resolve.status) {
                    swal('ops', `${documentName} ${getTextTranslate("sign-up",  "message-cpf-already-exists")}`, 'info');
                    res.value = "";
                }
            }).catch(error => {
                if (logger) logger.error(`Erro ao validar CPF: ${error.message || error}`);
            })
        });
    });

    const formGroup = new FormGroup(".group-signup");

    const validateForm = {
        verifyCode: "",
        confirmationCode: ""
    };

    const dataDriver = {
        driver: {
            userTypeId: "",
            name: "",
            nickname: "",
            phone: "",
            password: "",
            document: "",
            gender: "",
            email: "",
            stationId: "",
            cityId: null,
            estateId: "",
            cooperativeId: "",
            militaryUser: null,
            cnh: "",
            created_at: "",
            hasCardReader: false,
            numberCNH: null,
            numberCRLV: null,
            numberAlvara: null,
            numberCriminalRecord: null,
            docs: [],
            rentalCar: false,
            rentalCompanyDocument: "",
            driverAttachmentTypeId: null
        },
        image: {
            CNH: null,
            CRLV: null,
            ALVARA: null,
            PROFILE: null,
            CRIMINAL_RECORD: null,
            PROOF_OF_RESIDENCE: null,
            RG_FRONT: null,
            RG_BACK: null,
            DOCUMENTS: []
        },
        car: null,
        registered_in: "mobilidade"
    };

    supportController.getHelpCode().then(({
        status,
        data
    }) => {
        if (!status)
            return;
        Session.set("codeSupport", data);
    });

    elementProperty.addEventInElement("#isRentalOfVehicles", "onclick", function () {
        if (this.checked) {
            document.querySelector("#cnpjCompany").style.display = "block";
        } else {
            document.querySelector("#cnpjCompany").style.display = "none";
        }
    });

    let documentRequired = false

    RequiredFieldController.get(5, 1).then((item) => {
        if(!item.status) return;
        const driverDocument = 4
        let documentVal = item.data.find((val) => val.id == driverDocument)

        const element = document.querySelector(`.input-custom-signup[name='cpf']`)
        if (element) {
            if (documentVal.compelField) {
                documentVal.alias
                ? element.placeholder = documentVal.alias
                : null;
                documentVal.required
                ? documentRequired = true
                : null;
                element.classList.add("active")
            } else {
                documentRequired = false
                element.classList.remove("active")
            }
        }
    })

    function initEventSelectTypeDriver() {
        elementProperty.addEventInElement(".type-driver-signup", "onclick", function () {
            dataDriver.driver.userTypeId = this.getAttribute("value");

            elementProperty.getElement("#preloadLogin", element => {
                element.style.marginTop = "0";
                element.style.top = "0";
                element.style.backgroundColor = "rgba(0,0,0,0.5)";
                element.style.display = "block";
            });

            FormStepController.getByUserType(dataDriver.driver.userTypeId).then(({
                status,
                data
            }) => {
                if (!status)
                    return;

                formGroup.validate = {};

                formGroup.screens = [];

                data.map(item => {

                    if (document.querySelector(`.group-signup[value='${item.step}']`) == null)
                        return;

                    formGroup.validate[item.step] = {
                        wasValidated: false,
                        required: true,
                    };

                    formGroup.screens.push({
                        selectors: `.group-signup[value='${item.step}']`,
                        validated: false
                    });
                });

                document.querySelector(".group-signup[value='TYPE_DRIVER']").classList.remove("active");

                getDocumentsDriver();

                formGroup.initGroup()
            }).finally(() => {
                elementProperty.getElement("#preloadLogin", element => {
                    element.style.display = "none";
                });
            });
        });
    }

    function createDocPDF(doc) {
        if (doc.pdf == false)
            return '';

        return `<div class="file-document-pdf" typeDocument="${doc.docId}">
            <div>
                <span>${getTextTranslate("sign-up", "span-add-file-pdf")}</span>
                <span id="namePDF${doc.docId}"></span>
            </div>
            <a>
                <i class="material-icons">keyboard_arrow_right</i>
            </a>
            <input type="file" accept="application/pdf" class="file-pdf" docId="${doc.docId}" />
        </div>`
    }

    function getDocumentsDriver() {
        DocUserTypeController.findByUserType(dataDriver.driver.userTypeId).then(({
            data
        }) => {

            elementProperty.getElement(".container-document-list", element => {
                element.innerHTML = data.map(item => {

                    dataDriver.driver.docs.push({
                        docId: item.docId
                    });

                    formGroup.screens.push({
                        selectors: `.document-driver-content[type='${item.docId}']`,
                        validated: false
                    });

                    return `<div class="document-driver-content" type="${item.docId}">
                                <h4>${item.label}</h4>
                                <div ${item.text == true ? "" : "hidden"}>
                                    <label>${item.description || ""}</label>
                                    <label class="show-page-request" 
                                        link="${item.link}"
                                        style="display: block;text-align: center;color: #2a6fcc;">${item.link != null ? getTextTranslate("sign-up", "label-page-request") : ""}</label>
                                    <input type="text" placeholder="${getTextTranslate('sign-up', 'placeholder-document-text')}" typeDocument="${item.docId}"/>
                                </div>
                                <div ${item.image == true ? "" : "hidden"}>
                                    <div class="file-document" typeDocument="${item.docId}">
                                        <span>${getTextTranslate("sign-up", "span-add-document-photo")}</span>
                                        <a>
                                            <i class="material-icons">keyboard_arrow_right</i>
                                        </a>
                                    </div>
                                </div>
                                ${createDocPDF(item)} 
                                <div class="content-image-document" typeDocument="${item.docId}"></div>
                                    <button class="btn-next-signup btn-document-driver" 
                                    typeDocument='${JSON.stringify(item)}' type="button">${getTextTranslate("sign-up", "btn-next")}</button>
                            </div>`;
                }).join("");

                viewController.elementProperty.addEventInElement(".file-pdf", "onchange", function () {
                    const file = this.files[0];

                    const id = this.getAttribute("docId");

                    const sizeInKb = 425;

                    if (file) {
                        if (file.size > sizeInKb * 1024) {
                            SwalCustom.messageDialog("", `Arquivo grande, tamanho máximo de ${sizeInKb}KB`);
                            this.value = null;
                            this.files = null;
                            return;
                        }

                        document.querySelector(`#namePDF${id}`).innerHTML = file.name;
                    }
                });

                viewController.elementProperty.addEventInElement(".show-page-request", "onclick", showPage);

                viewController.elementProperty.addEventInElement(".file-document", "onclick", function () {
                    const docId = this.getAttribute("typeDocument");

                    const doc = dataDriver.image.DOCUMENTS.find((item) => {
                        return item.docId === docId;
                    }) || {
                        docId,
                        image: null,
                        inArray: false
                    };

                    if (!doc.inArray) {
                        doc.inArray = true;

                        dataDriver.image.DOCUMENTS.push(doc);
                    }

                    if (ConfigGeneral().get("enable_driver_open_gallery") == true) {
                        navigator.notification.confirm(getTextTranslate("sign-up", "message-option-get-photo"), (status) => {
                            if (status === 1)
                                startCamera((file) => {
                                    document.querySelector(`.content-image-document[typeDocument='${docId}']`).style.backgroundImage =
                                        `url(${file.localToURL})`;
                                    doc.image = file;
                                });

                            if (status === 2)
                                startGallery((file) => {
                                    document.querySelector(`.content-image-document[typeDocument='${docId}']`).style.backgroundImage =
                                        `url(${file.localToURL})`;
                                    doc.image = file;
                                });

                        }, getTextTranslate("sign-up", "title-option-get-photo"), [getTextTranslate("sign-up", "camera-type"), getTextTranslate("sign-up", "gallery-type")]);
                    } else {
                        startCamera((file) => {
                            document.querySelector(`.content-image-document[typeDocument='${docId}']`).style.backgroundImage =
                                `url(${file.localToURL})`;
                            doc.image = file;
                        });
                    }
                });

                viewController.elementProperty.addEventInElement(".btn-document-driver", "onclick", function () {
                    const data = JSON.parse(this.getAttribute("typeDocument"));

                    const doc = dataDriver.driver.docs.find(item => {
                        return item.docId === data.docId;
                    });


                    if (data.text == true) {
                        doc.text = document.querySelector(`input[typeDocument='${data.docId}']`).value;

                        if (doc.text.length === 0)
                            return SwalCustom.messageDialog("", `${getTextTranslate("sign-up","document-required")} ${data.label}`);
                    }

                    if (data.image == true) {
                        if (dataDriver.image.DOCUMENTS.filter(item => {
                                return data.docId === item.docId && item.image != null;
                            }).length === 0)
                            return SwalCustom.messageDialog("", `${getTextTranslate("sign-up","document-file-required")} ${data.label}`);
                    }

                    if (data.pdf == true)
                        if (!document.querySelector(`.file-pdf[docId='${doc.docId}']`).files[0])
                            return SwalCustom.messageDialog("", `${getTextTranslate("sign-up","file-required")} ${data.label}`);

                    formPass();
                })
            });
        });
    }

    elementProperty.addEventInElement("#btnPersonalData", "onclick", function () {
        if (!isCompletePersonalData())
            return;

        if (!isValidateEmail) {
            SwalCustom.messageDialog(getTextTranslate("sign-up", "email-already-used"), "Atenção", () => {}, "warning");
            return false;
        }

        dataDriver.driver.name = document.getElementById("name").value.trim();
        dataDriver.driver.nickname = dataDriver.driver.name.split(" ")[0];
        dataDriver.driver.phone = document.getElementById("phone").value;
        dataDriver.driver.email = document.getElementById("email").value;
        dataDriver.driver.gender = document.getElementById("gender").value;
        dataDriver.driver.document = document.getElementById("cpf").value;

        if (!validateFormPersonalData(dataDriver))
            return;

        if (formGroup.validate.VALIDATE_NUMBER)
            if (formGroup.validate.VALIDATE_NUMBER.required) {
                getVerifyCode(dataDriver);
                clearCode();
            }

        formPass();
    });

    elementProperty.addEventInElement("#btnValidateNumber", "onclick", function () {
        validateForm.verifyCode = document.getElementById("verifyCode").value;

        if (!verifyCode(validateForm)) return;

        formPass();
    });

    elementProperty.addEventInElement("#btnSafety", "onclick", function () {
        elementProperty.getElement("#password", element => {
            dataDriver.driver.password = element.value;
        });

        if (!verifyPassword(dataDriver))
            return;

        formPass();
    });

    elementProperty.addEventInElement('#togglePasswordSignup', 'onclick', (event) => {
        event.preventDefault();
        event.stopPropagation();
        const passwordEl = document.getElementById('password');
        const toggleIcon = document.getElementById('togglePasswordSignup');
        if (passwordEl.type === 'password') {
            passwordEl.type = 'text';
            toggleIcon.textContent = 'visibility';
        } else {
            passwordEl.type = 'password';
            toggleIcon.textContent = 'visibility_off';
        }
    });

    elementProperty.addEventInElement('#toggleRepassword', 'onclick', (event) => {
        event.preventDefault();
        event.stopPropagation();
        const repasswordEl = document.getElementById('repassowrd');
        const toggleIcon = document.getElementById('toggleRepassword');
        if (repasswordEl.type === 'password') {
            repasswordEl.type = 'text';
            toggleIcon.textContent = 'visibility';
        } else {
            repasswordEl.type = 'password';
            toggleIcon.textContent = 'visibility_off';
        }
    });

    elementProperty.addEventInElement("#btnMilitaryFields", "onclick", function () {
        dataDriver.driver.militaryUser = {
            militaryForceId: document.querySelector("#typeMilitaryForce").value,
            militaryGraduationId: document.querySelector("#typeGraduations").value,
            militaryStatusId: document.querySelector("#typeStatus").value,
            om: document.querySelector("#numberOM").value
        };

        if (!validateMilitaryUser(dataDriver))
            return;

        formPass();
    });

    elementProperty.addEventInElement("#btnCompany", "onclick", function () {
        if (!verifyCompany(dataDriver))
            return;

        formPass();
    });

    elementProperty.addEventInElement("#btCRLV", "onclick", function () {
        dataDriver.car = {
            licensePlate: document.getElementById("licensePlate").value.toUpperCase(),
            renavam: document.getElementById("renavam").value,
            markCar: document.getElementById("markCar").value,
            modelCar: document.getElementById("modelCar").value,
            colorCar: document.getElementById("colorCar").value,
            numberSeatingCar: document.getElementById("numberSeatingCar").value,
            year: document.getElementById("yearCar").value
        };

        dataDriver.driver.rentalCar = document.getElementById("isRentalOfVehicles").checked;

        if (dataDriver.driver.rentalCar) {
            dataDriver.driver.rentalCompanyDocument = document.getElementById("cnpjCompany").value;
        } else {
            dataDriver.driver.rentalCompanyDocument = "";
        }

        if (!verifyDocumentCRLV(dataDriver))
            return;

        formPass();
    });


    elementProperty.addEventInElement("#btnProfile", "onclick", function () {

        if (!verifyDocumentProfile(dataDriver))
            return;

        formPass();
    });

    elementProperty.addEventInElement("#btnDriverAttachment", "onclick", function () {
        if (dataDriver.driver.driverAttachmentTypeId == null)
            return SwalCustom.messageDialog("Selecione o tipo de equipamento", "Atenção", null, "warning");

        formPass();
    });

    elementProperty.addEventInElement("#btnTerm", "onclick", function () {
        elementProperty.getElement("#useTerm", element => {
            if (!element.checked) {
                SwalCustom.messageDialog("Aceite os termos de condições do aplicativo para poder continuar ", "Atenção", () => {}, "warning");
            } else {
                formPass();
            }
        });
    });


    elementProperty.addEventInElement("#email", "onblur", function () {
        elementProperty.getElement("#preloadLogin", element => {
            element.style.display = "block";
            element.style.marginTop = "0";
            element.style.top = "0";
            element.style.backgroundColor = "rgba(0,0,0,0.5)";

            driverController.checkEmail(this.value).then(result => {
                isValidateEmail = !result.status;
                element.style.display = "none";
            }).catch(error => {
                if (logger) logger.error(`Erro ao validar email: ${error.message || error}`);
                element.style.display = "none";
            })
        });
    });

    elementProperty.addEventInElement(".back-to", "onclick", goBackStep);

    function formPass() {
        if (!formGroup.nextGroup()) {
            elementProperty.getElement(".preload-return", element => {
                element.style.display = "flex";
            });

            formGroup.validate.isRegistered = true;
            elementProperty.getElement(".back-to", element => {
                element.style.display = 'none';
            });

            const executeRegistration = (logger = null) => {
                driverController.register(dataDriver).then(result => {
                    elementProperty.getElement(".preload-return", element => {
                        element.style.display = "none";
                    });

                    if (!result.status) {
                        if (logger) logger.error(`Erro no registro: ${result.message}`);
                        elementProperty.getElement(".back-to", element => {
                            element.style.display = 'block';
                        });
                        formGroup.validate.isRegistered = false;
                        isFormFinish = false;
                        SwalCustom.messageDialog(result.message, "Atenção", () => {}, "warning");
                        formGroup.beforeGroup();
                        return;
                    }

                    isFormFinish = true;

                    elementProperty.getElement(".group-signup-finish", element => {
                        element.classList.add("active");
                    });

                    elementProperty.addEventInElement(".finish-form", "onclick", function () {
                        this.disabled = true;

                        const user = {
                            email: dataDriver.driver.email,
                            password: dataDriver.driver.password,
                            deviceToken: push.token,
                            connection: true
                        };

                        elementProperty.getElement("#preloadLogin", element => {
                            element.style.display = "block";
                        });
                        
                        driverController.authenticate(user).then((result) => {
                            Session.set('user', result.data);
                            Route.redirect("Driver");
                        }).catch(error => {
                            if (logger) logger.error(`Erro na autenticação: ${error.message || error}`);
                        });
                    });
                }).catch((error) => {
                    if (logger) logger.critical(`Erro crítico no registro: ${error.message || error}`);
                    elementProperty.getElement(".preload-return", element => {
                        element.style.display = "none";
                    });

                    elementProperty.getElement(".back-to", element => {
                        element.style.display = 'block';
                    });
                    formGroup.validate.isRegistered = false;
                    isFormFinish = false;
                    SwalCustom.messageDialog("Ocorreu um problema no seu cadastro", "Atenção", () => {}, "warning");
                    formGroup.beforeGroup();
                });
            };

            getPulseLogger()
                .catch(() => null)
                .then(logger => executeRegistration(logger));
        }
    }

    function isCompletePersonalData() {
        const inputs = [
            document.getElementById("name"),
            documentRequired ? document.getElementById("cpf") : null,
            document.getElementById("email"),
            document.getElementById("phone")
        ];

        for (let i in inputs) {
            const input = inputs[i];

            if (input && input.value.length === 0) {
                input.focus();
                return false;
            }
        }

        return true;
    }

    elementProperty.addEventInElement(".open-modal-document", "onclick", function () {
        elementProperty.getElement("#modalPreview" + this.getAttribute("value"), element => {
            element.classList.add("active");
        })
    });

    document.addEventListener("backbutton", function () {
        if (elementProperty.getElements(".container-modal-document").filter(element => {
                if (element.classList.contains("active")) {
                    element.classList.remove("active");
                    return true;
                }
                return false;
            }).length > 0) {
            return;
        }

        goBackStep();
    });

    function goBackStep() {
        if (formGroup.validate.isRegistered)
            return;

        if (!formGroup.beforeGroup() || isFormFinish)
            Route.redirect("Main");
    }

    const inputCodes = document.getElementsByClassName("code-phone");

    elementProperty.addEventInElement(".code-phone", "oninput", function () {
        if (this.value.length === 0)
            return;

        const indexNextInput = parseInt(this.getAttribute("title")) + 1;

        validateForm.confirmationCode = `${inputCodes.item(0).value}${inputCodes.item(1).value}${inputCodes.item(2).value}${inputCodes.item(3).value}`;

        if (indexNextInput > inputCodes.length - 1) {
            validateForm.verifyCode = document.getElementById("verifyCode").value;

            if (!verifyCode(validateForm))
                return;

            formPass();
            return;
        }

        inputCodes[indexNextInput].focus();
    });

    CityController.getActives().then(result => {
        elementProperty.getElement("#cityWork", element => {
            element.innerHTML = `<option value='' selected disabled >${getTextTranslate("sign-up","default-city-option")}</option>` +
                result.data.map(city => {
                    return `<option value="${city.id}">${city.shortName ?? city.nome}</option>`;
                }).join("");
        });

        elementProperty.addEventInElement("#cityWork", "onchange", function () {
            dataDriver.driver.cityId = this.value;
        });


        $('select').material_select();
    });

    stationTypeController.getAll().then(result => {
        elementProperty.getElement("#typeStation", element => {
            element.innerHTML += `<option value="" disabled selected>Tipo de local</option>`;
            result.data.map(type => {
                element.innerHTML += `<option value="${type.idStationType}">${type.name}</option>`;
            });
            $('select').material_select();
        });
    });

    elementProperty.addEventInElement("#typeStation", "onchange", function () {
        dataDriver.station.stationTypeId = this.value;
    });

    elementProperty.getElement("#localReturn", element => {
        new MapService().importScriptWithPlaces().then(() => {
            const searchBox = new google.maps.places.SearchBox(element);

            searchBox.addListener('places_changed', function () {
                const places = searchBox.getPlaces();
                const place = places[0];

                dataDriver.station.address = element.value;
                dataDriver.station.longitude = place.geometry.location.lng();
                dataDriver.station.latitude = place.geometry.location.lat();
            });
        })
    });

    elementProperty.addEventInElement("#localReturn", "onfocus", function () {
        elementProperty.getElement("#groupReturnDriver", element => {
            setTimeout(function () {
                element.scrollTo(0, element.scrollHeight);
            }, 300)
        });
    });

    elementProperty.addEventInElement("#email", "onfocus", function () {
        elementProperty.getElement(".group-signup", element => {
            setTimeout(function () {
                element.scrollTo(0, element.scrollHeight);
            }, 300)
        });
    });

    elementProperty.addEventInElement(".toggle-collapsible", "onclick", function () {
        const _that = this;

        elementProperty.getElement(this.getAttribute("href"), element => {
            if (element.classList.contains("active")) {
                disableAllCollapsible();
                return;
            }
            disableAllCollapsible();
            _that.innerHTML = "expand_less";
            element.classList.add("active");
        });
    });

    function disableAllCollapsible() {
        elementProperty.getElement(".body-collapsible", element => {
            element.classList.remove("active");
        });
        elementProperty.getElement(".toggle-collapsible", element => {
            element.innerHTML = "expand_more";
        });
    }

    elementProperty.addEventInElement("#btnCaptureProfile", "onclick", function () {
        const _that = this;
        if (ConfigGeneral().get("enable_driver_open_gallery") == true) {
            navigator.notification.confirm(getTextTranslate("sign-up", "message-option-get-photo"), (status) => {
                if (status === 1)
                    startCamera(function (file) {
                        dataDriver.image[_that.getAttribute("value")] = file;

                        elementProperty.getElement(".profile-driver-preview", element => {
                            element.style.backgroundImage = `url('${file.localToURL}')`;
                        });
                    });

                if (status === 2)
                    startGallery((file) => {
                        dataDriver.image[_that.getAttribute("value")] = file;

                        elementProperty.getElement(".profile-driver-preview", element => {
                            element.style.backgroundImage = `url('${file.localToURL}')`;
                        });
                    });

            }, getTextTranslate("sign-up", "title-get-profile-picture"), [
                getTextTranslate("sign-up", "type-camera"),
                getTextTranslate("sign-up", "type-gallery")
            ])
        } else {
            startCamera(function (file) {
                dataDriver.image[_that.getAttribute("value")] = file;

                elementProperty.getElement(".profile-driver-preview", element => {
                    element.style.backgroundImage = `url('${file.localToURL}')`;
                })
            });
        }
    });

    elementProperty.addEventInElement(".btn-open-camera", "onclick", function () {
        startCamera((file) => {
            getPhoto(file, this.getAttribute("value"));
        });
    });
    elementProperty.addEventInElement(".btn-open-gallery", "onclick", function () {
        startGallery((file) => {
            getPhoto(file, this.getAttribute("value"));
        });
    });

    function getPhoto(file, value) {
        dataDriver.image[value] = file;

        elementProperty.getElement("#confirmationDocument" + value, element => {
            element.classList.add("active");
        });

        elementProperty.addEventInElement("#confirmationDocument" + value,
            "onclick",
            function () {
                elementProperty.getElement(".container-modal-document", element => {
                    element.classList.remove("active");
                })
            });

        elementProperty.getElement(".open-modal-document", element => {
            if (value === element.getAttribute("value"))
                element.classList.add("active");
        });

        elementProperty.getElement("#driverPreview" + value, element => {
            element.style.backgroundImage = `url('${file.localToURL}')`;
        })
    }

    function startCamera(callback) {
        if (device.version >= 11) {
            openCamera(callback);
        } else {
            window.plugin.backgroundMode.enable();
            openCamera(callback);
        }

    }

    function startGallery(callback) {
        if (device.version >= 11) {
            const permissions = cordova.plugins.permissions;

            new Promise((resolve, reject) => {
                permissions.requestPermission(permissions.WRITE_EXTERNAL_STORAGE, resolve, reject)
            }).then(() => {
                const srcType = Camera.PictureSourceType.SAVEDPHOTOALBUM;
                const options = setOptions(srcType);
                options.targetHeight = 1200;
                options.targetWidth = 1600;

                navigator.camera.getPicture((result) => {
                    FileUpload.getFile(result).then(file => {
                        callback(file)
                    });
                }, function cameraError(error) {
                    console.debug("Unable to obtain picture: " + error, "app");
                }, options);
            }).catch(() => {
                console.debug("Permission denied", "app");
            });
        } else {
            window.plugin.backgroundMode.enable();
            const srcType = Camera.PictureSourceType.SAVEDPHOTOALBUM;
            const options = setOptions(srcType);
            options.targetHeight = 1200;
            options.targetWidth = 1600;

            navigator.camera.getPicture((result) => {
                FileUpload.getFile(result).then(file => {
                    callback(file)
                });
            }, function cameraError(error) {
                console.debug("Unable to obtain picture: " + error, "app");
            }, options);
        }
    }

    function setOptions(srcType) {
        return {
            // Some common settings are 20, 50, and 100
            quality: 100,
            destinationType: Camera.DestinationType.FILE_URI,
            // In this app, dynamically set the picture source, Camera or photo gallery
            sourceType: srcType,
            encodingType: Camera.EncodingType.JPEG,
            mediaType: Camera.MediaType.PICTURE,
            allowEdit: false,
            correctOrientation: true //Corrects Android orientation quirks
        };
    }

    function openCamera(callback) {
        if (device.version >= 11) {
            const permissions = cordova.plugins.permissions;
            new Promise((resolve, reject) => {
                permissions.requestPermission(permissions.CAMERA, resolve, reject);
            }).then(() => {
                navigator.device.capture.captureImage((result) => {
                    FileUpload.getFile(result[0].fullPath).then(file => {
                        callback(file)
                    });
                }, function cameraError(error) {
                    console.debug("Unable to obtain picture: " + error, "app");
                }, );
            }).catch(() => {
                console.debug("Permission denied", "app");
            });
        } else {
            navigator.device.capture.captureImage((result) => {
                FileUpload.getFile(result[0].fullPath).then(file => {
                    callback(file)
                });
            }, function cameraError(error) {
                console.debug("Unable to obtain picture: " + error, "app");
            }, );

        }
    }

    elementProperty.addEventInElement("#openLinkAtestado", "onclick", function () {
        const ref = window.open('http://sistemas.sspds.ce.gov.br/AtestadoAntecedentes/', '_system', 'location=yes');
        ref.addEventListener('loadstart', function (event) {});
    });

    UtilController.getMark().then((result) => {
        const autocompleteMark = new Autocomplete();
        autocompleteMark.initAutocomplete("#markCar", result, "name", ["name"]);
        autocompleteMark.getItemSelected(getVehicles)
    });

    function getVehicles({
        id
    }) {
        UtilController.getVehiclesMark(id).then((result) => {
            const autocompleteVehicles = new Autocomplete();
            autocompleteVehicles.initAutocomplete("#modelCar", result, "name", ["name"]);
        });
    }

    function getUserTypesDriver() {
        UserTypeController.getDrivers().then(({
            status,
            data
        }) => {
            if (!status)
                return setTimeout(getUserTypesDriver, 3000);

            viewController.elementProperty.getElement("#listUserType", element => {
                element.innerHTML = data.map(item => {
                    return `<li class="type-driver-signup" value="${item.idUserType}">
                                <img src="${item.picture}">
                                <div>
                                    <p>${item.name}</p>
                                    <label>${item.description || ""}</label>
                                </div>
                                <i class="material-icons">keyboard_arrow_right</i>
                            </li>`;
                }).join("")

                initEventSelectTypeDriver();
            });
        }).catch(() => {
            setTimeout(getUserTypesDriver, 3000);
        });
    }


    viewController.elementProperty.getElement("#termsOfUse", element => {
        const config = Session.get("configGeneral");

        if (config.length === 0)
            return;

        const term = config.find(item => {
            return item.key === 'driver_terms_of_use';
        });

        element.src = (!term.value.includes(".pdf")) ?
            term.value :
            encodeURI(`https://docs.google.com/gview?url=${term.value}&embedded=true`);
    });

    MilitaryForceController.getAll().then(({
        status,
        data
    }) => {
        if (!status) return;

        viewController.elementProperty.getElement("#typeMilitaryForce", element => {
            element.innerHTML = `<option value="" disabled selected>Escolha o tipo de força</option>`;
            element.innerHTML += data
                .map(item => {
                    return `<option value="${item.id}">${item.name}</option>`;
                })
                .join("");
            $('select').material_select();
        });
    });

    MilitaryForceController.status().then(({
        status,
        data
    }) => {
        if (!status) return;
        viewController.elementProperty.getElement("#typeStatus", element => {
            element.innerHTML = `<option value="" disabled selected>Tipo de status</option>`;
            element.innerHTML += data.map(item => {
                return `<option value="${item.id}">${item.name}</option>`;
            }).join("");

            $('select').material_select();
        });
    });

    viewController.elementProperty.addEventInElement(
        "#typeMilitaryForce",
        "onchange",
        function () {
            MilitaryForceController.graduations(this.value).then(
                ({
                    status,
                    data
                }) => {
                    if (!status) return;
                    viewController.elementProperty.getElement(
                        "#typeGraduations",
                        element => {
                            element.innerHTML = `<option value="" disabled selected>Escolha o tipo de patente</option>`;
                            element.innerHTML += data.map(item => {
                                return `<option value="${item.id}">${item.patent}</option>`;
                            }).join("");
                            $('#typeGraduations').material_select();
                        }
                    );
                }
            );
        }
    );

    function showPage() {
        cordova.InAppBrowser.open(this.getAttribute("link"), '_system', 'location=yes');
    }

    getUserTypesDriver();

    DriverAttachmentTypeController.getAll().then(({
        response
    }) => {
        document.querySelector(".list-driver-attachment-type").innerHTML = response.map(item => {
            return `<li class="item-driver-attachment-type" value='${JSON.stringify(item)}'>
                    <div>
                        <img src="${item.picture}"/>
                        <p>${item.name}</p>
                    </div>
                </li>`
        }).join("");

        elementProperty.addEventInElement(".item-driver-attachment-type", "onclick", function () {
            const item = JSON.parse(this.getAttribute("value"));
            elementProperty.removeClass(".item-driver-attachment-type", "active");
            this.classList.add("active");
            document.querySelector("#descriptionBag").innerHTML = item.description;

            dataDriver.driver.driverAttachmentTypeId = item.id;
        });
    })
});