viewController.setObserver("edit-profile-driver", () => {
    const elementProperty = new ElementProperty();

    Mask.setMaskPhone("#phoneDriverEdit");

    updateDataDriver();

    function updateDataDriver() {
        const user = Session.get("user");
        const config = Session.get("configGeneral");
        const picturesLink = config.find(item => {
            return item.key === 'link_storage_pictures';
        });

        const profileImage = user.profileImage;
        const finalLink = `${picturesLink.value}driver/profile/compressed/${profileImage}`;

        elementProperty.getElement(".edit-profile-driver", element => {
            // element.style.backgroundImage = `url(${PATH_IMAGE}${user.profileImage})`;
            element.style.backgroundImage = `url(${finalLink})`;
        });

        elementProperty.getElement("#nameDriverEdit", element => {
            element.value = user.name;
        });

        elementProperty.getElement("#nicknameDriverEdit", element => {
            element.value = user.nickname;
        });

        elementProperty.getElement("#emailDriverEdit", element => {
            element.value = user.email;
        });

        elementProperty.getElement("#phoneDriverEdit", element => {
            element.value = user.phone;
        });

        updateDataMenu();
    }

    elementProperty.addEventInElement(".edit-profile-driver", "onclick", () => {
        function updateImage(idDriver, file) {
            SwalCustom.messageDialog(
                getTextTranslate("edit-profile", "message-update-photo"),
                getTextTranslate("edit-profile", "title-update-photo"), null,
                "success");

            DriverController.updatePhoto(idDriver, file).then(resolve => {
                if (!resolve.status) {
                    updateDataDriver();
                    Materialize.toast(getTextTranslate("edit-profile", "error-update-profile"), 6000);
                    return;
                }
                updateDataDriver();
                Materialize.toast(getTextTranslate("edit-profile", "success-update-profile"), 6000);
            });
        }

        if (ConfigGeneral().get("enable_driver_open_gallery") == true) {
            navigator.notification.confirm(getTextTranslate("edit-profile", "dialog-mode-capture"), (status) => {
                    let type = null;

                    if (status === 1)
                        type = Camera.PictureSourceType.CAMERA;

                    if (status === 2)
                        type = Camera.PictureSourceType.SAVEDPHOTOALBUM;

                    if (type == null)
                        return;

                    const {
                        idDriver
                    } = Session.get("user");

                    startCamera(type, (path) => {
                        FileUpload.getFile(path).then(file => {
                            updateImage(idDriver, file);
                        });
                    }, (file) => {
                        updateImage(idDriver, file);
                    });
                }, getTextTranslate("edit-profile", "dialog-mode-capture-title"),
                [
                    getTextTranslate("edit-profile", "type-camera"),
                    getTextTranslate("edit-profile", "type-gallery")
                ]);
        } else {

            const {
                idDriver
            } = Session.get("user");

            startCamera(Camera.PictureSourceType.CAMERA, (path) => {
                FileUpload.getFile(path).then(file => {
                    updateImage(idDriver, file);
                });
            }, (file) => {
                updateImage(idDriver, file);
            });
        }
    });

    elementProperty.addEventInElement("#btnEditDataUser", "onclick", () => {
        const user = {
            name: document.getElementById("nameDriverEdit").value,
            nickname: document.getElementById("nicknameDriverEdit").value,
            email: document.getElementById("emailDriverEdit").value,
            phone: document.getElementById("phoneDriverEdit").value,
            driverId: Session.getValueInSession("user", "idDriver"),
            idUser: Session.getValueInSession("user", "idUser")
        };

        new DriverController().checkEmail(user.email).then(({
            status,
            data
        }) => {
            if (status && data.email !== Session.getValueInSession("user", "email")) {
                SwalCustom.messageDialog("E-mail já esta sendo utilizado!")
                return;
            }

            if (!validateUser(user))
                return;


            DriverController.updateDataDriver(user).then(resolve => {
                if (!resolve.status) {
                    Materialize.toast("Desculpe, tente novamente mais tarde", 1000);
                    return;
                }

                const userLogged = Session.get("user");

                userLogged.name = user.name;
                userLogged.nickname = user.nickname;
                userLogged.email = user.email;
                userLogged.phone = user.phone;

                Session.set("user", userLogged);

                updateDataDriver();

                Materialize.toast("Dados alterados com sucesso", 1000);
            });
        });
    });

    elementProperty.addEventInElement("#btnChangePassword", "onclick", () => {
        const currentPassword = document.getElementById("currentPassword").value;
        const newPassword = document.getElementById("newPassword").value;
        const confirmationPassword = document.getElementById("confirmationPassword").value;

        if (newPassword.trim().length <= 4) {
            Materialize.toast(getTextTranslate("edit-profile", "error-password-length"), 5000);
            return;
        }

        DriverController.checkPassword(currentPassword).then(({
            status,
            message
        }) => {
            if (!status) {
                Materialize.toast(message, 1000);
                return;
            }

            if (newPassword === confirmationPassword) {
                DriverController.updateDataDriver({
                    password: newPassword,
                    driverId: Session.getValueInSession("user", "idDriver"),
                    idUser: Session.getValueInSession("user", "idUser")

                }).then(({
                    status
                }) => {
                    if (!status) {
                        Materialize.toast(getTextTranslate("edit-profile", "error-update-password"), 5000);
                        return;
                    }

                    Materialize.toast(getTextTranslate("edit-profile", "success-new-password"), 5000);
                    document.getElementById("currentPassword").value = "";
                    document.getElementById("newPassword").value = "";
                    document.getElementById("confirmationPassword").value = "";

                });
                return;
            }
            Materialize.toast(getTextTranslate("edit-profile", "error-confirm-password"), 1000);
        });
    });

    function validateUser(user) {
        if (user.name.trim().length === 0 || user.name.trim().split(" ").length <= 1) {
            SwalCustom.messageDialog("Digite seu nome completo", "Atenção");
            return false;
        }

        if (user.nickname.trim().length === 0) {
            SwalCustom.messageDialog("Digite seu apelido", "Atenção");
            return false;
        }

        if (user.email.trim().length === 0 || !ValidateForm.validateEmail(user.email)) {
            SwalCustom.messageDialog("E-mail invalído", "Atenção");
            return false;
        }

        if (user.phone.trim().length === 0 || !ValidateForm.validatePhone(user.phone)) {
            SwalCustom.messageDialog("Telefone invalído", "Atenção");
            return false;
        }

        return true;
    }

    function startCamera(sourceType, callback, callbackCamera) {
        if (device.version >= 11) {
            const permissions = cordova.plugins.permissions;

            new Promise((resolve, reject) => {
                permissions.requestPermission(permissions.CAMERA, resolve, reject);
            }).then(() => {
                if (sourceType !== Camera.PictureSourceType.CAMERA) {
                    const options = {
                        quality: 100,
                        destinationType: Camera.DestinationType.FILE_URI,
                        sourceType,
                        encodingType: Camera.EncodingType.JPEG,
                        mediaType: Camera.MediaType.PICTURE,
                        allowEdit: false,
                        correctOrientation: true,
                        targetHeight: 500,
                        targetWidth: 500
                    };

                    navigator.camera.getPicture(callback, function cameraError(error) {
                        console.debug("Unable to obtain picture: " + error, "app");
                    }, options);
                    return;
                }

                navigator.device.capture.captureImage((result) => {
                    FileUpload.getFile(result[0].fullPath).then(file => {
                        callbackCamera(file)
                    });
                }, function cameraError(error) {
                    console.debug("Unable to obtain picture: " + error, "app");
                }, );
            }).catch(() => {
                console.debug("Permission denied", "app");
            })

        } else {
            window.plugin.backgroundMode.enable();
            if (sourceType !== Camera.PictureSourceType.CAMERA) {
                const options = {
                    quality: 100,
                    destinationType: Camera.DestinationType.FILE_URI,
                    sourceType,
                    encodingType: Camera.EncodingType.JPEG,
                    mediaType: Camera.MediaType.PICTURE,
                    allowEdit: false,
                    correctOrientation: true,
                    targetHeight: 500,
                    targetWidth: 500
                };

                navigator.camera.getPicture(callback, function cameraError(error) {
                    console.debug("Unable to obtain picture: " + error, "app");
                }, options);
                return;
            }

            navigator.device.capture.captureImage((result) => {
                FileUpload.getFile(result[0].fullPath).then(file => {
                    callbackCamera(file)
                });
            }, function cameraError(error) {
                console.debug("Unable to obtain picture: " + error, "app");
            }, );
        }
    }
});