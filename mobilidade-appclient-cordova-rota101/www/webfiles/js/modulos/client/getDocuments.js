Route.waitView().then(function () {

    Mask.setMaskCpf("#documentCustomer");
    Mask.setMaskPhone("#phoneCustomer");

    Mask.setMaskDate('#dateOfBirthCustomer');

    //verifyDocumentsDataCustomer()
});

function verifyDocumentsDataCustomer(callback) {
    const userLogged = Session.get("user");

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

    viewController.elementProperty.addEventInElement(".container-document-pre-sign-up", "onclick", function () {
        const capturePhoto = new CapturePhoto();

        if (ConfigGeneral().get("enable_driver_open_gallery") == true) {
            navigator.notification.confirm('Selecione um modo de enviar a foto', (status) => {
                let type = null;

                if (status === 1)
                    type = Camera.PictureSourceType.CAMERA;

                if (status === 2)
                    type = Camera.PictureSourceType.SAVEDPHOTOALBUM;

                if (type == null)
                    return;

                capturePhoto.get(type).then((photo) => {
                    this.classList.add("progressing");
                    FileUpload.prepare(photo).then(file => {
                        console.log(file);
                        userLogged[this.getAttribute("var")] = photo.localURL;
                        Session.set("user", userLogged);

                        const formData = new FormData();
                        formData.append(this.getAttribute("var"), file.data, file.name);

                        ConnectionServer.sendFile("User/UpdateCustomerPhotosRG", "POST", formData).then(() => {
                            this.classList.add("success");
                            this.classList.remove("progressing");
                        });
                    });
                });

            }, getTextTranslate("pre-sign-up", "document-photo"), [
                getTextTranslate("pre-sign-up", "type-camera"),
                getTextTranslate("pre-sign-up", "type-gallery")
            ]);
        } else {
            capturePhoto.get().then((photo) => {
                this.classList.add("progressing");
                FileUpload.prepare(photo).then(file => {
                    userLogged[this.getAttribute("var")] = photo.localURL;
                    Session.set("user", userLogged);

                    const formData = new FormData();
                    formData.append(this.getAttribute("var"), file.data, file.name);

                    ConnectionServer.sendFile("User/UpdateCustomerPhotosRG", "POST", formData).then(() => {
                        this.classList.add("success");
                        this.classList.remove("progressing");
                    });
                });
            });
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

    /*
        viewController.elementProperty.addEventInElement("#typeStatus", "onchange", function () {
            if (this.value == 1) {
                viewController.elementProperty.getElement(".container-input-om", element => element.style.display = "flex");
            } else {
                viewController.elementProperty.getElement(".container-input-om", element => element.style = "");
            }
        });
    */


    viewController.elementProperty.getElement("#imgProfileCustomer", element => {
        if (userLogged.profileImage != null && userLogged.profileImage !== "user.png")
            element.style.backgroundImage = `url(${userLogged.profileImage})`
    });

    function verifyCompelFields(isMissingField, fields, listFields) {

        viewController.elementProperty.addClass(".container-document-user", "active");

        fields = fields.filter(item => {
            return !(item.field === "military" && userLogged.isDependent == true);
        });

        isMissingField = fields.length !== 0;


        if (!isMissingField) {
            if (callback)
                callback();
            checkCustomerStatus();
            return viewController.elementProperty.removeClass(".container-document-user", "active");
        }

        fields.map((item) => {
            viewController.elementProperty.getElement(`#${item.field}Customer`, element => {
                if (userLogged[item.field] != null) {
                    element.style.display = "none";


                    const label = document.querySelector(`label[for='${element.getAttribute("id")}']`);

                    if (label)
                        label.style.display = "none";
                }

                element.value = userLogged[item.field] || "";
            });

            if (item.field === "military") {
                if (userLogged.militaryForce == null || userLogged.militaryPatent == null || userLogged.militaryStatus == null) {
                    viewController.elementProperty.addClass(".container-filed-military", "active");
                }
            }

            if (item.field === "rg_front") {
                if (userLogged.rgFrontPicture == null)
                    document.querySelector("#photoRgFront").classList.add("active");
            }

            if (item.field === "rg_back") {
                if (userLogged.rgBackPicture == null)
                    document.querySelector("#photoRgBack").classList.add("active");
            }
        });

        viewController.elementProperty.addEventInElement("#saveDataCustomer", "onclick", function () {

            const userLogged = Session.get("user");

            const data = {idUser: userLogged.idUser};

            listFields.map((item) => {
                if (userLogged[item.field] == null) {
                    const input = document.querySelector(`#${item.field}Customer`);

                    if (item.field === "dateOfBirth") {
                        const date = input.value.split("/");

                        if (date[2] != null)
                            return data[item.field] = `${date[2]}-${date[1]}-${date[0]}`;
                    }

                    if (input)
                        data[item.field] = input.value;
                }
            });

            if (document.querySelector(".container-filed-military").classList.contains("active")) {
                data['militaryForceId'] = document.querySelector("#typeMilitaryForce").value;
                data['militaryGraduationId'] = document.querySelector("#typeGraduations").value;
                data['militaryStatusId'] = document.querySelector("#typeStatus").value;
                data['om'] = document.querySelector("#numberOM").value;

                if (data.militaryForceId.length === 0)
                    return SwalCustom.messageDialog("", "Informe o tipo de força");

                if (data.militaryGraduationId.length === 0)
                    return SwalCustom.messageDialog("", "Informe a graduação");

                if (data.militaryStatusId.length === 0)
                    return SwalCustom.messageDialog("", "Informe o status");

            }

            const requiredProfile = fields.filter(item => {
                return item.field === "profileImage";
            })[0];

            const checkIsDefaultImageProfile = userLogged.profileImage
                ? userLogged.profileImage.split('/').includes('user.png')
                : true;

            if(requiredProfile)
                if (requiredProfile.compelField == true)
                    if ((checkIsDefaultImageProfile))
                        return SwalCustom.messageDialog("Retire uma foto", "A foto do perfil é obrigatória", undefined, "info");

            if (!validateDataUser(data))
                return;

            viewController.elementProperty.addClass(".preload-document-user", "active");
            CustomerController.updateDataCustomer(data).then(({status, data, message}) => {
                viewController.elementProperty.removeClass(".preload-document-user", "active");
                if (!status) {
                    SwalCustom.messageDialog("", message, undefined, "warning");
                    return;
                }
                SwalCustom.messageDialog("", message, undefined, "success");

                delete data.idUser;

                Object.keys(data).map((key) => {
                    userLogged[key] = data[key];
                });

                Session.set("user", userLogged);

                updateDataUserMenu();

                checkCustomerStatus();

                if (callback)
                    callback();

                viewController.elementProperty.removeClass(".container-document-user", "active");
                viewController.elementProperty.removeClass(".preload-document-user", "active");

            });
        });
    }


    return RequiredFieldController.get(userLogged.userTypeId).then(({data}) => {
        let isRg = false;


        const fields = data.filter(item => {
            if (item.field === "rg_front") {
                isRg = true;
                return userLogged.rgFrontPicture == null;
            }

            if (item.field === "rg_back") {
                isRg = true;
                return userLogged.rgBackPicture == null;
            }

            if (item.field === "military")
                return (userLogged.militaryForce == null || userLogged.militaryPatent == null || userLogged.militaryStatus == null);

            if (document.querySelector(`#${item.field}Customer`) == null && document.querySelector(`*[property='${item.field}Customer']`) == null)
                return false;

            if (!item.compelField)
                return false;

            if (item.field === "profileImage")
                return userLogged.profileImage
                    ? userLogged.profileImage.split('/').includes('user.png')
                    : true;

            return userLogged[item.field] == null || userLogged[item.field] === "user.png";
        });


        if (isRg) {
            if (userLogged.rg == null) {
                fields.push({
                    compelField: true,
                    description: "Validação rg",
                    field: "rg",
                    required: true,
                    userTypeId: "5"

                });

                data.push({
                    compelField: true,
                    description: "Validação rg",
                    field: "rg",
                    required: true,
                    userTypeId: "5"
                });
            }
        }

        data.map((item) => {
            viewController.elementProperty.getElement(`#${item.field}Customer`, element => {
                if (userLogged[item.field] != null) {
                    element.style.display = "none";


                    const label = document.querySelector(`label[for='${element.getAttribute("id")}']`);

                    if (label)
                        label.style.display = "none";
                } else {
                    element.style = "";

                    const label = document.querySelector(`label[for='${element.getAttribute("id")}']`);

                    if (label)
                        label.style = "";
                }

                element.value = userLogged[item.field] || "";
            });

        });

        verifyCompelFields(fields.length !== 0, fields, data);

        return fields.length === 0;
    });
}

const isEmpty = {
    email: false,
    cpf: false,
    phone: false
};


viewController.elementProperty.addEventInElement("#addProfileCustomer", "onclick", editImageProfile);

function editImageProfile() {
    if (ConfigGeneral().get("enable_customer_open_gallery") == true) {
        navigator.notification.confirm('Selecione um modo de enviar a foto', (status) => {
            let type = null;

            if (status === 1) {
                type = Camera.PictureSourceType.CAMERA;
                startCamera(type, (file) => {
                    viewController.elementProperty.getElement("#imgProfileCustomer", element => {
                        const userLogged = Session.get("user");
                        element.style.backgroundImage = `url(${file.localToURL})`;
                        userLogged.profileImage = file.localURL;

                        Session.set("user", userLogged);
                    });

                    viewController.elementProperty.addClass("#spinner", "active");
                    viewController.elementProperty.addClass(".preload-document-user", "active");

                    CustomerController.updatePhoto(userLogged.idCustomer, file).then(({status, data, message}) => {
                        viewController.elementProperty.removeClass(".preload-document-user", "active");
                        viewController.elementProperty.removeClass("#spinner", "active");
                        if (!status) {
                            swal("", "Houve um erro ao enviar foto", "info");
                            return;
                        }

                        const config = Session.get("configGeneral");
                        const picturesLink = config.find(item => {
                            return item.key === 'link_storage_pictures';
                        });
                
                        const finalLink = `${picturesLink.value}customer/profile/compressed/`;

                        // userLogged.profileImage = `${PATH_IMAGE_PROFILE + data}`;
                        userLogged.profileImage = `${finalLink + data}`;

                        viewController.elementProperty.getElement("#imgProfileCustomer", element => {
                            element.style.backgroundImage = `url(${userLogged.profileImage})`
                        });

                        Session.set('user', userLogged);

                        updateDataUserMenu();
                    }).catch(() => {
                        viewController.elementProperty.removeClass(".preload-document-user", "active");
                        viewController.elementProperty.removeClass("#spinner", "active");
                    });
                });
            }

            if (status === 2) {
                type = Camera.PictureSourceType.SAVEDPHOTOALBUM;
                startGallery(type, (file) => {
                    viewController.elementProperty.getElement("#imgProfileCustomer", element => {
                        const userLogged = Session.get("user");
                        element.style.backgroundImage = `url(${file.localToURL})`;
                        userLogged.profileImage = file.localURL;

                        Session.set("user", userLogged);
                    });

                    viewController.elementProperty.addClass("#spinner", "active");
                    viewController.elementProperty.addClass(".preload-document-user", "active");

                    CustomerController.updatePhoto(userLogged.idCustomer, file).then(({status, data, message}) => {
                        viewController.elementProperty.removeClass(".preload-document-user", "active");
                        viewController.elementProperty.removeClass("#spinner", "active");
                        if (!status) {
                            swal("", "Houve um erro ao enviar foto", "info");
                            return;
                        }

                        const config = Session.get("configGeneral");
                        const picturesLink = config.find(item => {
                            return item.key === 'link_storage_pictures';
                        });
                
                        const finalLink = `${picturesLink.value}customer/profile/compressed/`;

                        // userLogged.profileImage = `${PATH_IMAGE_PROFILE + data}`;
                        userLogged.profileImage = `${finalLink + data}`;

                        viewController.elementProperty.getElement("#imgProfileCustomer", element => {
                            element.style.backgroundImage = `url(${userLogged.profileImage})`
                        });

                        Session.set('user', userLogged);

                        updateDataUserMenu();
                    }).catch(() => {
                        viewController.elementProperty.removeClass(".preload-document-user", "active");
                        viewController.elementProperty.removeClass("#spinner", "active");
                    });
                });
            }
        }, getTextTranslate("get-document", "edit-profile-picture"), [
            getTextTranslate("get-document", "type-camera"),
            getTextTranslate("get-document", "type-gallery")
        ]);
    } else {
        startCamera(Camera.PictureSourceType.CAMERA, (file) => {
            viewController.elementProperty.getElement("#imgProfileCustomer", element => {
                const userLogged = Session.get("user");
                element.style.backgroundImage = `url(${file.localToURL})`;
                userLogged.profileImage = file.localURL;

                Session.set("user", userLogged);
            });

            viewController.elementProperty.addClass("#spinner", "active");
            viewController.elementProperty.addClass(".preload-document-user", "active");

            CustomerController.updatePhoto(userLogged.idCustomer, file).then(({status, data, message}) => {
                viewController.elementProperty.removeClass(".preload-document-user", "active");
                viewController.elementProperty.removeClass("#spinner", "active");
                if (!status) {
                    swal("", "Houve um erro ao enviar foto", "info");
                    return;
                }

                const config = Session.get("configGeneral");
                const picturesLink = config.find(item => {
                    return item.key === 'link_storage_pictures';
                });
                
                const finalLink = `${picturesLink.value}customer/profile/compressed/`;

                // userLogged.profileImage = `${PATH_IMAGE_PROFILE + data}`;
                userLogged.profileImage = `${finalLink + data}`;

                viewController.elementProperty.getElement("#imgProfileCustomer", element => {
                    element.style.backgroundImage = `url(${userLogged.profileImage})`
                });

                Session.set('user', userLogged);

                updateDataUserMenu();
            }).catch(() => {
                viewController.elementProperty.removeClass(".preload-document-user", "active");
                viewController.elementProperty.removeClass("#spinner", "active");
            });
        });
    }
}

function startCamera(srcType,callback) {
    // cordova.plugins.backgroundMode.enable(); @Deprecated by Android 12

    const permissions = cordova.plugins.permissions;

    new Promise((resolve, reject) => {
        permissions.requestPermission(permissions.CAMERA, resolve, reject);
    }).then(() => {
        navigator.device.capture.captureImage((result) => {
            FileUpload.getFile(result[0].fullPath).then(file => {
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
    // cordova.plugins.backgroundMode.enable(); @Deprecated by Android 12

    const permissions = cordova.plugins.permissions;

        new Promise((resolve, reject) => {
            permissions.requestPermission(permissions.WRITE_EXTERNAL_STORAGE, resolve, reject)
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


function validateDataUser(data) {

    if (data.hasOwnProperty("email")) {
        if (data.email.length === 0 || !ValidateForm.validateEmail(data.email)) {
            swal('Atenção', "Informe o email", 'info');
            return false;
        }
    }

    if (data.hasOwnProperty("phone")) {
        if (!validatePhoneValue(data.phone)) {
            swal('Atenção', "Informe o telefone", 'info');
            return false;
        }
    }

    if (data.hasOwnProperty("document")) {
        if (!checkCPF(data.document)) {
            swal('Atenção', 'CPF inválido', 'info');
            return false;
        }
    }
    if (data.hasOwnProperty("dateOfBirth")) {
        if (data.dateOfBirth.length === 0 && data.dateOfBirth.length !== 10) {
            swal('Atenção', 'Informe a data de nascimento', 'info');
            return false;
        }
    }

    return true;
}
