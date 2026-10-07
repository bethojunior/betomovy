viewController.setObserver("viewProfile", function () {

    const userData = Session.get("user");
    const elementProperty = new ElementProperty();
    let dataEdited = {};

    if(!getTextTranslate("profile", "remove-mask")) {
        Mask.setMaskPhone("#phoneProfileUser");
        Mask.setMaskCpf("#documentProfileUser");
        Mask.setMaskDate('#birthDateProfileUser');
    }

    elementProperty.addEventInElement("#imageUserProfile", "onclick", editImageProfile);

    window.addEventListener('keyboardDidShow', function () {
        elementProperty.getElement("#btnSave", element => {
            element.style.display = "none";
        });
        elementProperty.getElement("#btnFooter", element => {
            element.style.display = "block";
        });
    });

    window.addEventListener('keyboardDidHide', function () {
        elementProperty.getElement("#btnSave", element => {
            element.style.display = "block";
        });
        elementProperty.getElement("#btnFooter", element => {
            element.style.display = "none";
        });
    });

    updateDataUser();

    function editProfile() {
        elementProperty.getElement('#nameProfileUser', valueName => {
            dataEdited.name = valueName.value;
        });

        elementProperty.getElement('#documentProfileUser', valueName => {
            dataEdited.document = valueName.value;
        });

        elementProperty.getElement('#emailProfileUser', valueEmail => {
            dataEdited.email = valueEmail.value;
        });

        elementProperty.getElement('#phoneProfileUser', valuePhone => {
            dataEdited.phone = valuePhone.value;
        });

        elementProperty.getElement('#birthDateProfileUser', valueBirthDate => {
            const date = valueBirthDate.value.split("/");

            dataEdited.dateOfBirth = date[2] != null ? dataEdited.dateOfBirth = `${date[2]}-${date[1]}-${date[0]}` : date[0];
        });

        dataEdited.idUser = userData.idUser;

        if (!validateFields(dataEdited))
            return;

        preload(true);

        CustomerController.updateDataCustomer(dataEdited).then(({status, data, message}) => {
            preload(false);
            if (!status) {
                SwalCustom.messageDialog("", message, undefined, "warning");
                return;
            }
            SwalCustom.messageDialog("", message, undefined, "success");

            userData.name = data.name;
            userData.document = data.document;
            userData.nameUser = data.name;
            userData.nickname = data.nickname;
            userData.email = data.email;
            userData.phone = data.phone;
            userData.dateOfBirth = data.dateOfBirth;
            userData.gender = data?.gender;

            Session.set("user", userData);

            updateDataUserMenu();
            updateDataUser();
        }).catch(() => {
            preload(false);
        });

    }

    function validateFields() {
        if (dataEdited.name.length === 0) {
            swal('Atenção', "Informe o nome do usuario", 'warning');
            return false;
        }

        if (!getTextTranslate("profile", "remove-mask") && !ValidateForm.validateCpf(dataEdited.document.replace(/\D/g, ''))) {
            swal('Atenção', "Informe o cpf do usuario", 'warning');
            return false;
        }

        if (dataEdited.name.split(" ").length < 2) {
            swal('Atenção', "Informe o nome completo", 'warning');
            return false;
        }

        dataEdited.nickname = dataEdited.name.split(" ")[0];

        if (dataEdited.email.length === 0 || !ValidateForm.validateEmail(dataEdited.email)) {
            swal('Atenção', "Informe o email", 'warning');
            return false;
        }

        if (dataEdited.phone.length === 0 || !getTextTranslate("profile", "remove-mask") && !ValidateForm.validatePhone(dataEdited.phone)) {
            swal('Atenção', "Informe o telefone", 'warning');
            return false;
        }

        if (dataEdited.dateOfBirth.length === 0 && dataEdited.dateOfBirth.length !== 10) {
            swal('Atenção', 'Informe a data de nascimento', 'info');
            return false;
        }

        return true;

    }

    function editImageProfile() {
        if (ConfigGeneral().get("enable_customer_open_gallery") == true) {
            navigator.notification.confirm(getTextTranslate("profile", "select-way-send-the-photo"), (status) => {
                let type = null;

                if (status === 1) {
                    type = Camera.PictureSourceType.CAMERA;
                    startCamera(type, file => {
                        elementProperty.addClass("#spinner", "active");

                        CustomerController.updatePhoto(userData.idCustomer, file).then(({status, data, message}) => {
                            elementProperty.removeClass("#spinner", "active");
                            if (!status) {
                                swal("", "Houve um erro ao enviar foto", "info");
                                return;
                            }
                            
                            const config = Session.get("configGeneral");
                            const picturesLink = config.find(item => {
                                return item.key === 'link_storage_pictures';
                            });
                
                            const finalLink = `${picturesLink.value}customer/profile/compressed/`;

                            // userData.profileImage = `${PATH_IMAGE_PROFILE}${data}`;
                            userData.profileImage = `${finalLink}${data}`;

                            Session.set('user', userData);

                            updateDataUser();

                            updateDataUserMenu();
                        }).catch(() => {
                            elementProperty.removeClass("#spinner", "active");
                        });
                    });
                }

                if (status === 2) {
                    type = Camera.PictureSourceType.SAVEDPHOTOALBUM;
                    startGallery(type, file => {
                        elementProperty.addClass("#spinner", "active");

                        CustomerController.updatePhoto(userData.idCustomer, file).then(({status, data, message}) => {
                            elementProperty.removeClass("#spinner", "active");
                            if (!status) {
                                swal("", "Houve um erro ao enviar foto", "info");
                                return;
                            }

                            const config = Session.get("configGeneral");
                            const picturesLink = config.find(item => {
                                return item.key === 'link_storage_pictures';
                            });
                    
                            const finalLink = `${picturesLink.value}customer/profile/compressed/`;

                            // userData.profileImage = `${PATH_IMAGE_PROFILE}${data}`;
                            userData.profileImage = `${finalLink}${data}`;

                            Session.set('user', userData);

                            updateDataUser();

                            updateDataUserMenu();
                        }).catch(() => {
                            elementProperty.removeClass("#spinner", "active");
                        });
                    });
                }
            }, getTextTranslate("profile", "edit-profile-picture"), [
                getTextTranslate("profile", "type-camera"),
                getTextTranslate("profile", "type-gallery")
            ]);
        } else {
            startCamera(Camera.PictureSourceType.CAMERA,file => {
                elementProperty.addClass("#spinner", "active");

                CustomerController.updatePhoto(userData.idCustomer, file).then(({status, data, message}) => {
                    elementProperty.removeClass("#spinner", "active");
                    if (!status) {
                        swal("", "Houve um erro ao enviar foto", "info");
                        return;
                    }

                    const config = Session.get("configGeneral");
                    const picturesLink = config.find(item => {
                        return item.key === 'link_storage_pictures';
                    });
            
                    const finalLink = `${picturesLink.value}customer/profile/compressed/`;

                    // userData.profileImage = `${PATH_IMAGE_PROFILE}${data}`;
                    userData.profileImage = `${finalLink}${data}`;

                    Session.set('user', userData);

                    updateDataUser();

                    updateDataUserMenu();
                }).catch(() => {
                    elementProperty.removeClass("#spinner", "active");
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

    function updateDataUser() {
        cancelFormEdit();

        if (userData.profileImage !== null) {
            elementProperty.getElement(".container-profile-user", element => {
                element.style.backgroundImage = `url(${userData.profileImage})`
            });
        }

        elementProperty.getElement('#nameProfileUser', element => {
            element.value = userData.nameUser;
        });

        elementProperty.getElement('#documentProfileUser', element => {
            element.value = userData.document;
        });
        
        elementProperty.getElement('#genderProfileUser', element => {
            element.value = userData.gender;
        });

        elementProperty.getElement('.name-user', element => {
            element.innerHTML = userData.nickname;
        });

        elementProperty.getElement('#emailProfileUser', element => {
            element.value = userData.email;
        });

        elementProperty.getElement('#phoneProfileUser', element => {
            element.value = userData.phone;
        });

        elementProperty.getElement('#birthDateProfileUser', element => {
            if (userData.dateOfBirth != null) {
                element.value = userData.dateOfBirth.split('-').reverse().join('-').replaceAll('-', '/');
            }
        });
    }

    elementProperty.addEventInElement(".edit-btn", "onclick", function () {
        elementProperty.addClass(".container-save-profile", "active");
        elementProperty.addClass(".edit-btn", "active");
        elementProperty.addClass(".footer-profile", "active");
        elementProperty.getElement(".input-profile-user", element => {
            element.disabled = false;
        });
    });

    elementProperty.addEventInElement(".btn-save-profile", "onclick", editProfile);

    elementProperty.addEventInElement(".btn-cancel-profile", "onclick", cancelFormEdit);

    function cancelFormEdit() {
        elementProperty.removeClass(".edit-btn", "active");
        elementProperty.removeClass(".container-save-profile", "active");
        elementProperty.removeClass(".footer-profile", "active");
        elementProperty.getElement(".input-profile-user", element => {
            element.disabled = true;
        });
    }

    elementProperty.addEventInElement(".go-back", 'onclick', function () {
        cancelFormEdit();

        Route.backPage();
    });

    elementProperty.addEventInElement("#settingProfile", "onclick", function () {
        Route.redirectDynamic("Setting", "Option");
    });

    cordova.getAppVersion.getVersionNumber().then(function (version) {
        elementProperty.getElement(".footer-profile", element => {
            element.innerHTML = `
                <a id="openTermsOfUse">Termos de Uso</a>
                <p>${version}</p>`;

            elementProperty.addEventInElement("#openTermsOfUse", "onclick", () => {
                const config = Session.get("configGeneral");

                if (config.length === 0)
                    return;

                const term = config.find(item => {
                    return item.key === 'customer_terms_of_use';
                });

                const link =
                    (!term.value.includes(".pdf")) ?
                        HOST_SITE + 'privacidade' :
                        encodeURI(HOST_SITE + 'privacidade');


                const page = cordova.InAppBrowser.open(link, '_blank',
                    'usewkwebview=yes,beforeload=get,hidenavigationbuttons=no,hideurlbar=yes,toolbarcolor=#FFFFFF,zoom=no,closebuttoncolor=#000000,location=no,disallowoverscroll=no,closebuttoncaption=Voltar');

                page.show();
            });
        });
    });

    Route.pageDynamic();
});
