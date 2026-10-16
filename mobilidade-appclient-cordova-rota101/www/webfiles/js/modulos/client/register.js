viewController.setObserver("signup", function () {
    const elementProperty = new ElementProperty();
    const customerController = new CustomerController();

    Mask.setMaskDate("#dateOfBirth");

    preload(true);

    const userTypeId = 5;

    const managerSignUp = {
        emailValidate: false,
        codeValidate: "",
        codeDefault: 4444,
        timeOutSMS: null
    };

    const location = {
        latitude: null,
        longitude: null
    };

    const fieldsValidated = {
        user: {},
        photos: []
    };

    const docs = [];

    elementProperty.getElement(".remove-field-ios", element => {
        if (device.platform === "iOS")
            element.remove();
    });

    const fieldsOptions = {
        dateOfBirth: "#fieldDateOfBirth",
        //     gender: "#fieldGender"
    };

    const requireds = {
        typeFields: ["military", "rg_front", "rg_back", "profileImage", "validateEmail", "validateSms"],
        fieldsRequired: []
    };

    RequiredFieldController.get(userTypeId, 1).then(({data}) => {
        getAllCities();
        requireds.fieldsRequired = data.filter(item => {
            const element = document.querySelector(`.container-compel-field[type='${item.field}']`);
            if (element) {
                if (item.compelField) {
                    element.classList.add("active")
                } else {
                    element.classList.remove("active")
                }
            }

            return requireds.typeFields.includes(item.field) && item.compelField;
        }).map(item => item.field);

        enableFieldOptions(data);
    });

    function enableFieldOptions(fields) {
        fields.map(item => {
            const element = document.querySelector(fieldsOptions[item.field]);
            if (element == null)
                return;

            if (item.compelField) {
                element.style.display = "block";
            } else {
                element.style.display = "none";
            }
        });
    }

    elementProperty.addEventInElement("#cpf-user", "onblur", () => {
        elementProperty.getElement("#cpf-user", res => {
            let document = res.value;
            const data = {document};
            CustomerController.checkDocument(data).then(resolve => {
                if (resolve.status) {
                    swal("ops", "Cpf já possui cadastro", "info");
                    res.value = "";
                    return;
                }
            });
        });
    });

    DocUserTypeController.findByUserType(userTypeId).then((response) => {
        document.querySelector(".list-documents-customer").innerHTML = response.data.map(item => {
            docs.push({docId: item.docId});
            return `<li>
                    <fieldset>
                        <legend>${item.label}</legend>
                        ${item.text == true ? `<input type="text" id="docText${item.docId}" placeholder="${getTextTranslate("signup", "placeholder-text-document")}"/>` : ""}
                        ${item.image == true ? `<div class="select-image-doc"  id="docImage${item.docId}" value="${item.docId}"
                            info="${getTextTranslate("signup", "info-file-document-required")}"
                            success="${getTextTranslate("signup", "success-file-document-required")}">
                            <span>documento</span>
                        </div>` : ""}
                    </fieldset>
                </li>`;
        }).join("");

        elementProperty.addEventInElement(".select-image-doc", "onclick", function () {
            const docId = this.getAttribute("value");
            getFileDocument().then((file) => {
                const doc = docs.find((item) => {
                    return item.docId === docId;
                }) || {docId, image: null};

                this.classList.add("attached");

                doc.image = file;
            })
        });
    });

    elementProperty.addEventInElement("#btnDocumentCustomer", "onclick", function () {
        for (doc of docs) {
            const elementText = document.querySelector(`#docText${doc.docId}`);
            const elementImage = document.querySelector(`#docImage${doc.docId}`);
            if (elementText) {
                if (elementText.value.length === 0)
                    return SwalCustom.messageDialog("", getTextTranslate("signup", "alert-text-document-required"));

                doc.text = elementText.value;
            }

            if (elementImage)
                if (doc.image == null)
                    return SwalCustom.messageDialog("", getTextTranslate("signup", "alert-image-document-required"));
        }


        if (nextRequiredFields()) return;

        saveUserByFormData();
    });

    clearForm();

    elementProperty.addEventInElement("#btn-user-info", "onclick", function () {
        const valueGender = document.getElementById("gender") ? document.getElementById("gender").value : "";
        const valueCity = document.getElementById("city").value;

        if (valueCity === "") {
            SwalCustom.messageDialog("", getTextTranslate("register", "message_not_select_city"), undefined, "warning");
            return;
        }

        const user = {
            name: document.getElementById("name-user").value,
            nickname: "",
            document: document.getElementById("cpf-user") ? document.getElementById("cpf-user").value : "",
            phone: document.getElementById("phone-user").value,
            email: document.getElementById("email-user").value,
            password: document.getElementById("password-user").value,
            cityId: parseInt(document.getElementById("city").value),
            registered_in: 'mobilidade',
            gender: valueGender,
            location
        };

        if (!document.getElementById("cpf-user") || !document.getElementById("cpf-user").parentElement.classList.contains("active"))
            delete user.document;

        if (user.gender === "") delete user.gender;

        if (!validateDataUser(user)) return;

        fieldsValidated.user = user;

        if (nextRequiredFields())
            return;

        registerClient(user);
    });

    function confirmationNumberUser(user) {
        getCodeConfirmation(user);

        elementProperty.addEventInElement("#getAnotherCode", "onclick", function () {
            getCodeConfirmation(user);
        });


        if (!document.querySelector(".modal-confirmation-code").classList.contains("active"))
            Route.startClassesInComponent([{component: ".modal-confirmation-code", class: "active"}], () => {
                document.querySelector(".modal-confirmation-code").classList.remove("active");
            });

        elementProperty.addEventInElement("#codeNumber", "onkeyup", function () {
            resetCountHelp();

            if (this.value.length === 4) validateCode(this.value, user);
        });
    }

    function resetCountHelp() {
        clearTimeout(managerSignUp.timeOutSMS);

        viewController.elementProperty.removeClass(
            ".toast-signup-helper",
            "active"
        );

        managerSignUp.timeOutSMS = setTimeout(() => {
            viewController.elementProperty.addClass(".toast-signup-helper", "active");
        }, 15000);
    }

    function getCodeConfirmation(user) {
        clearTimeout(managerSignUp.timeOutSMS);

        preload(true);

        const data = {
            number: user.phone,
            email: user.email,
            name: user.name
        };

        if (!requireds.fieldsRequired.includes("validateEmail"))
            delete data.email;

        if (!requireds.fieldsRequired.includes("validateSms"))
            delete data.number;

        customerController
            .sendConfirmationCode(data)
            .then(({status, data}) => {
                preload(false);
                if (!status) return;

                managerSignUp.timeOutSMS = setTimeout(() => {
                    viewController.elementProperty.addClass(
                        ".toast-signup-helper",
                        "active"
                    );
                }, 15000);

                managerSignUp.codeValidate = data.sms;
            });
    }

    function validateCode(value, user) {
        if (
            managerSignUp.codeValidate === parseInt(value) ||
            managerSignUp.codeDefault === parseInt(value)
        ) {
            saveUserByFormData();
            return;
        }
        SwalCustom.messageDialog("", "Codigo invalido", undefined, "warning");
        elementProperty.getElement("#codeNumber", element => (element.value = ""));
    }

    function registerClient(user) {
        preload(true);

        customerController.register(user).then(({status, data, message}) => {
            if (!status) {
                preload(false);
                SwalCustom.messageDialog(message, "Atenção", undefined, "warning");
                return;
            }

            authenticate(user);
        });
    }

    elementProperty.addEventInElement("#email-user", "oninput", function () {
        managerSignUp.emailValidate = false;
    });

    elementProperty.addEventInElement("#email-user", "onblur", function () {
        preload(true);
        customerController.checkEmailSignup(this.value).then(({status}) => {
            preload(false);
            managerSignUp.emailValidate = !status;
        });
    });

    function authenticate(user) {
        customerController
            .authenticate({
                email: user.email,
                password: user.password,
                deviceToken: Session.get("token")
            })
            .then(result => {
                if (!result.status) {
                    Route.redirect("Main");
                    return;
                }
                SwalCustom.messageDialog(
                    "Cadastro realizado com sucesso",
                    "Atenção",
                    function () {
                        Session.set("user", result.data);
                        Route.redirect("Client", "Splash");
                    },
                    "success"
                );
            });
    }

    function validateDataUser(user) {
        if (user.name.length === 0) {
            swal("Atenção", "Informe o nome do usuario", "warning");
            return false;
        }
        if (user.name.split(" ").length < 2) {
            swal("Atenção", "Informe o nome completo", "warning");
            return false;
        }

        user.nickname = user.name.split(" ")[0];

        if (user.email.length === 0 || !ValidateForm.validateEmail(user.email)) {
            swal("Atenção", "Informe o email", "warning");
            return false;
        }
        if (!managerSignUp.emailValidate) {
            swal("Atenção", "E-mail já esta sendo utilizado", "warning");
            return false;
        }

        if (user.document != null)
            if (user.document.length === 0) {
                swal("Atenção", "Informe o cpf", "warning");
                return false;
            }

        if (user.phone.length === 0) {
            swal("Atenção", "Informe o telefone", "warning");
            return;
        }
        /*if (user.gender.length === 0) {
                swal('Atenção', "Informe o gênero", 'warning');
                return;
            }*/
        if (user.password.length < 5) {
            swal("Atenção", "A senha deve contém pelo menos 5 digitos", "warning");
            return false;
        }

        if (
            document.getElementById("confirm-password-user").value !== user.password
        ) {
            swal(
                "Atenção",
                "Senha de confirmação não corresponde a senha",
                "warning"
            );
            return false;
        }

        if (user.document != null)
            if (!getTextTranslate("register", "remove-mask") && !checkCPF(user.document)) {
                swal("Atenção", "CPF inválido", "warning").then(() =>
                    document.getElementById("document-bank").focus()
                );
                return false;
            }

        return true;
    }

    function validateMilitaryUser(militaryUser) {
        if (militaryUser.militaryForceId.length === 0) {
            swal('Atenção', "Informe o tipo de força militar", 'warning');
            return false;
        }

        if (militaryUser.militaryGraduationId.length === 0) {
            swal('Atenção', "Informe o POSTO/GRADUAÇÃO", 'warning');
            return false;
        }

        if (militaryUser.militaryStatusId.length === 0) {
            swal('Atenção', "Informe seu status atual", 'warning');
            return false;
        }

        if (document.querySelector(".container-input-om").classList.contains("active"))
            if (militaryUser.om.length === 0) {
                swal('Atenção', "Informe o número da Organização Militar", 'warning');
                return false;
            }

        return true;
    }

    elementProperty.addEventInElement(".go-back", "onclick", function () {
        Route.backPage();
    });

    if(!getTextTranslate("register", "remove-mask")) {
        getMaskDataUser();
    }

    function getMaskDataUser() {
        Mask.setMaskPhone("#phone-user");
        $("#cpf-user").mask("000.000.000-00");
    }

    function clearForm() {
        document.getElementById("name-user").value = "";
        document.getElementById("cpf-user").value = "";
        document.getElementById("phone-user").value = "";
        document.getElementById("email-user").value = "";
        document.getElementById("password-user").value = "";
        document.getElementById("codeNumber").value = "";
        document.getElementById("confirm-password-user").value = "";

        elementProperty.removeClass(".modal-confirmation-code", "active");
    }

    Position.getPositionNetwork().then(result => {
        if (!Array.isArray(Session.get("location"))) return;
        if (result.loc === undefined) return;

        const locationNet = result.loc.split(",");

        Session.set("location", {
            lat: parseFloat(locationNet[0]),
            lng: parseFloat(locationNet[1])
        });

        location.latitude = parseFloat(locationNet[0]);
        location.longitude = parseFloat(locationNet[1]);
    });

    Position.getPosition(position => {
        Session.set("location", {
            lat: position.coords.latitude,
            lng: position.coords.longitude
        });
        location.latitude = position.coords.latitude;
        location.longitude = position.coords.longitude;
    });

    elementProperty.addEventInElement(
        ".close-modal-confirmation",
        "onclick",
        function () {
            elementProperty.removeClass(".modal-confirmation-code", "active");

            clearTimeout(managerSignUp.timeOutSMS);

            viewController.elementProperty.removeClass(
                ".toast-signup-helper",
                "active"
            );
        }
    );

    viewController.elementProperty.addEventInElement(
        "#contactSupport",
        "onclick",
        function () {
            const contactSupport = Session.get("configGeneral").find(
                item => item.key === "support_help_phone"
            );

            window.open(
                `https://wa.me/${contactSupport.value}/`,
                "_system",
                "location=yes"
            );

            clearTimeout(managerSignUp.timeOutSMS);

            viewController.elementProperty.removeClass(
                ".toast-signup-helper",
                "active"
            );
        }
    );

    MilitaryForceController.getAll().then(({status, data}) => {
        if (!status) return;

        viewController.elementProperty.getElement("#typeMilitaryForce", element => {
            element.innerHTML = `<option value="" disabled selected>Escolha o tipo de força</option>`;
            element.innerHTML += data
                .map(item => {
                    return `<option value="${item.id}">${item.name}</option>`;
                })
                .join("");
        });
    });

    MilitaryForceController.status().then(({status, data}) => {
        if (!status) return;
        viewController.elementProperty.getElement("#typeStatus", element => {
            element.innerHTML = `<option value="" disabled selected>Tipo de status</option>`;
            element.innerHTML += data.map(item => {
                return `<option value="${item.id}">${item.name}</option>`;
            }).join("");
        });
    });

    viewController.elementProperty.addEventInElement("#typeStatus", "onchange", function () {
        if (this.value == 1) {
            viewController.elementProperty.addClass(".container-input-om", "active");
        } else {
            viewController.elementProperty.removeClass(".container-input-om", "active");
        }

    });

    viewController.elementProperty.addEventInElement(
        "#typeMilitaryForce",
        "onchange",
        function () {
            MilitaryForceController.graduations(this.value).then(
                ({status, data}) => {
                    if (!status) return;
                    viewController.elementProperty.getElement(
                        "#typeGraduations",
                        element => {
                            element.innerHTML = `<option value="" disabled selected>Defina o POSTO/GRADUAÇÃO</option>`;
                            element.innerHTML += data.map(item => {
                                return `<option value="${item.id}">${item.patent}</option>`;
                            }).join("");
                        }
                    );
                }
            );
        }
    );

    viewController.elementProperty.addEventInElement("#btnMilitary", "onclick", function () {
        const militaryUser = {
            militaryForceId: document.querySelector("#typeMilitaryForce").value,
            militaryGraduationId: document.querySelector("#typeGraduations").value,
            militaryStatusId: document.querySelector("#typeStatus").value,
            om: document.querySelector("#numberOM").value
        };

        if (!validateMilitaryUser(militaryUser)) return;

        fieldsValidated.user.militaryUser = militaryUser;

        if (nextRequiredFields()) return;

        saveUserByFormData();
    });

    viewController.elementProperty.addEventInElement(".btn-document-photo", "onclick", function () {
        if (ConfigGeneral().get("enable_customer_open_gallery") == true) {
            navigator.notification.confirm('Selecione um modo de enviar a foto', (status) => {
                let type = null;

                if (status === 1) {
                    type = Camera.PictureSourceType.CAMERA;
                    startCamera(type, (file) => {
                        this.style.backgroundImage = `url(${file.localToURL})`;

                        fieldsValidated.photos.push({type: this.getAttribute("value"), file});
                    });
                }

                if (status === 2) {
                    type = Camera.PictureSourceType.SAVEDPHOTOALBUM;
                    startGallery(type, (file) => {
                        this.style.backgroundImage = `url(${file.localToURL})`;

                        fieldsValidated.photos.push({type: this.getAttribute("value"), file});
                    });
                }
            }, getTextTranslate("register", "edit-profile-picture"), [
                getTextTranslate("register", "type-camera"),
                getTextTranslate("register", "type-gallery")
            ]);
        } else {
            startCamera(Camera.PictureSourceType.CAMERA, (file) => {
                this.style.backgroundImage = `url(${file.localToURL})`;

                fieldsValidated.photos.push({type: this.getAttribute("value"), file});
            });
        }
    });


    viewController.elementProperty.addEventInElement("#btnRGMilitary", "onclick", function () {
        if (fieldsValidated.photos.find(item => item.type === "RG_FRONT") == null)
            return swal('Atenção', "Retire uma foto frontal do RG", 'warning');
        if (fieldsValidated.photos.find(item => item.type === "RG_BACK") == null)
            return swal('Atenção', "Retire uma foto do verso do RG", 'warning');
        if (document.querySelector("#numberRGMilitary").value.length === 0)
            return swal('Atenção', "Digite o número do RG Militar", 'warning');

        fieldsValidated.user.rg = document.querySelector("#numberRGMilitary").value;

        if (nextRequiredFields()) return;

        saveUserByFormData();
    });

    viewController.elementProperty.addEventInElement("#btnPhotoProfile", "onclick", function () {
        if (fieldsValidated.photos.find(item => item.type === "photo") == null)
            return swal('Atenção', "Retire uma foto para seu perfil", 'warning');


        if (document.querySelector("#fieldDateOfBirth"))
            if (document.querySelector("#fieldDateOfBirth").style.display !== "none") {
                if (document.querySelector("#dateOfBirth").value.length > 0) {
                    let regex = /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/;
                    const date = document.querySelector("#dateOfBirth").value;
                    if (!regex.test(date))
                        return swal('Atenção', "Informe a data de nascimento", 'warning');

                    const dateSplit = date.split("/");
                    fieldsValidated.user.dateOfBirth = `${dateSplit[2]}-${dateSplit[1]}-${dateSplit[0]}`;
                }
            }

        if (nextRequiredFields()) return;

        saveUserByFormData();
    });

    function startCamera(srcType,callback) {
        // window.plugin.backgroundMode.enable(); @Deprecated by Android 12

        const permissions = cordova.plugins.permissions;

        new Promise((resolve, reject) => {
            permissions.requestPermission(permissions.CAMERA, resolve, reject);
        }).then(() => {
            navigator.device.capture.captureImage((result) => {
                FileUpload.getFile(result[0].fullPath).then((file) => {
                    callback(file);
                });
            }, function cameraError(error) {
                CapturePhoto.fixStatusBarToIos();
    
                console.debug("Unable to obtain picture: " + error, "app");
            },);
        }).catch(() => {
            CapturePhoto.fixStatusBarToIos();
            console.debug("Permission denied", "app");
        })
    }

    function startGallery(srcType,callback) {
        // window.plugin.backgroundMode.enable(); @Deprecated by Android 12

        const permissions = cordova.plugins.permissions;

        new Promise((resolve, reject) => {
            permissions.requestPermission(permissions.WRITE_EXTERNAL_STORAGE, resolve, reject)
            if (Number(device.version) > 12) {
                permissions.requestPermission(permissions.READ_EXTERNAL_STORAGE, resolve, reject)
            }
        }).then(() => {
            const options = setOptions(srcType);
            options.targetHeight = 500;
            options.targetWidth = 500;

            navigator.camera.getPicture((result) => {
                FileUpload.getFile(result).then(file => {
                    callback(file);
                });
            }, function cameraError(error) {
                CapturePhoto.fixStatusBarToIos();

                console.debug("Unable to obtain picture: " + error, "app");
            }, options);
        }).catch(() => {
            CapturePhoto.fixStatusBarToIos();
            console.debug("Permission denied", "app");
        })
    }

    function setOptions(srcType) {
        return {
            // Some common settings are 20, 50, and 100
            quality: 100,
            destinationType: Camera.DestinationType.FILE_URI,
            sourceType: srcType,
            encodingType: Camera.EncodingType.JPEG,
            mediaType: Camera.MediaType.PICTURE,
            allowEdit: false,
            correctOrientation: true  //Corrects Android orientation quirks
        };
    }


    function saveUserByFormData() {
        preload(true);

        fieldsValidated.user.docs = docs.map(item => {
            return {docId: item.docId, text: item.text};
        });

        CustomerController.registerWithPictures(fieldsValidated.user, fieldsValidated.photos, docs).then(({status, message}) => {
            if (!status) {
                preload(false);
                SwalCustom.messageDialog(message, "Atenção", undefined, "warning");
                return;
            }

            authenticate(fieldsValidated.user);
        }).finally(() => {
            preload(false);
        })
    }

    function nextRequiredFields() {
        if (requireds.fieldsRequired.includes("military") &&
            !document.querySelector("#boxMilitary").classList.contains("active")) {
            Route.startClassesInComponent([{component: "#boxMilitary", class: "active"}], () => {
                document.querySelector("#boxMilitary").classList.remove("active");
            });
            return true;
        }

        if (requireds.fieldsRequired.includes("rg_front") && requireds.fieldsRequired.includes("rg_back") &&
            !document.querySelector("#boxRGMilitary").classList.contains("active")) {
            Route.startClassesInComponent([{component: "#boxRGMilitary", class: "active"}], () => {
                document.querySelector("#boxRGMilitary").classList.remove("active");
            });
            return true;
        }

        if (requireds.fieldsRequired.includes("profileImage") &&
            !document.querySelector("#boxPhotoCustomer").classList.contains("active")) {
            Route.startClassesInComponent([{component: "#boxPhotoCustomer", class: "active"}], () => {
                document.querySelector("#boxPhotoCustomer").classList.remove("active");
            });
            return true;
        }

        if (docs.length > 0 &&
            !document.querySelector("#boxDocument").classList.contains("active")) {
            Route.startClassesInComponent([{component: "#boxDocument", class: "active"}], () => {
                document.querySelector("#boxDocument").classList.remove("active");
            });

            return true;
        }

        if ((requireds.fieldsRequired.includes("validateEmail") ||
            requireds.fieldsRequired.includes("validateSms")) &&
            !document.querySelector(".modal-confirmation-code").classList.contains("active")) {
            if (!Session.get("numberPhoneCustomer").includes(fieldsValidated.user.phone.replace(/[^0-9]/g, ""))) {
                confirmationNumberUser(fieldsValidated.user);
                return true;
            }
        }

        return false;
    }

    function getAllCities() {
        const selectCity = document.querySelector('#city');

        preload(true);
        CityController.getAllCitiesActives().then((response) => {
            const {data} = response;

            const object = {
                id: "",
                nome: "Selecione uma cidade"
            };

            const select = [object,...data];
            selectCity.innerHTML = select.map(city => {
                return `
                    <option value="${city.id}">${city.shortName ?? city.nome}</option>
                `
            }).join('');
            preload(false);
        });
    }

    viewController.elementProperty.addEventInElement(".remove-submit-event", "onsubmit", function (event) {
        event.preventDefault();
    });


    function getFileDocument() {
        return new Promise((resolve, reject) => {
            if (ConfigGeneral().get("enable_customer_open_gallery") == true) {
                navigator.notification.confirm('Selecione um modo de enviar a foto', (status) => {
                    let type = null;

                    if (status === 1) {
                        type = Camera.PictureSourceType.CAMERA;
                        startCamera(type, (file) => {
                            resolve(file);
                        });
                    }

                    if (status === 2) {
                        type = Camera.PictureSourceType.SAVEDPHOTOALBUM;
                        startGallery(type, (file) => {
                            resolve(file);
                        });
                    }
                }, getTextTranslate("register", "document-photo"), [
                    getTextTranslate("register", "type-camera"),
                    getTextTranslate("register", "type-gallery")
                ]);
            } else {
                startCamera(Camera.PictureSourceType.CAMERA, (file) => {
                    resolve(file);
                });
            }
        })
    }
});
