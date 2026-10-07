function checkCustomerStatus() {
    const capturePhoto = new CapturePhoto();

    const STATUS_PENDENCY = 2;

    const customerRegisterStatusType = {
        1: "LIBERADO",
        2: "AGUARDANDO LIBERAÇÃO",
        3: "BLOQUEADO"
    };

    const user = Session.get("user");

    document.querySelector("#nameStatusCustomer").innerHTML = user.name;
    document.querySelector("#documentStatusCustomer").innerHTML = user.document || "Não informado";
    document.querySelector("#phoneStatusCustomer").innerHTML = user.phone;
    document.querySelector("#emailStatusCustomer").innerHTML = user.email;
    document.querySelector("#statusCustomerRegisterStatusId").innerHTML =
        customerRegisterStatusType[user.customerRegisterStatusId];

    document.querySelector("#numberRGStatus").innerHTML = user.rg;

    updatePendency();

    if (user.customerRegisterStatusId == STATUS_PENDENCY) {
        viewController.elementProperty.addClass(
            ".container-status-customer",
            "active"
        );

        setTimeout(() => getUpdateTrip(), 15000);
    } else {
        viewController.elementProperty.removeClass(
            ".container-status-customer",
            "active"
        );
    }

    viewController.elementProperty.addEventInElement(
        "#showDocumentStatus",
        "onclick",
        () => {
            updatePendency();
            Route.startClassesInComponent(
                [{component: ".modal-status-customer", class: "active"}],
                () => {
                    viewController.elementProperty.removeClass(
                        ".modal-status-customer",
                        "active"
                    );
                }
            );
        }
    );

    function updatePendency() {
        PendencyFieldController.check().then(response => {
            if (!response.status) return;

            const user = Session.get("user");

            const rejectDocs =  response.data.filter(item => item.pendencyFieldStatus === "REPROVADO");

            if (rejectDocs.length > 0) {
                viewController.elementProperty.addClass(
                    ".reject-documents-text",
                    "active"
                );
            } else {
                viewController.elementProperty.removeClass(
                    ".reject-documents-text",
                    "active"
                );
            }

            viewController.elementProperty.getElement(
                "#listDocumentPendency",
                element => {
                    element.innerHTML = response.data
                        .map(item => {
                            return `<li class="open-document-customer" 
                      value='${JSON.stringify(item)}'>
                      <span>${item.description}</span>
                      <i class="material-icons">keyboard_arrow_right</i>
                      <p>${
                                item.fieldType === "file"
                                    ? "&nbsp;"
                                    : user[item.namePendencyFieldType] || ""
                            }</p>
                      <div>
                        <i class="material-icons">schedule</i>
                        <span>${item.pendencyFieldStatus}</span>
                      </div>
                    </li>`;
                        })
                        .join("");

                    viewController.elementProperty.addEventInElement(
                        ".open-document-customer",
                        "onclick",
                        function () {
                            const pendency = JSON.parse(this.getAttribute("value"));

                            if (pendency.fieldType === "file") {
                                openDocumentTypeFile(pendency);
                            } else {
                                openDocumentTypeText(pendency);
                            }
                        }
                    );
                }
            );
        });
    }

    function openDocumentTypeText(pendency) {
        const user = Session.get("user");

        switch (pendency.namePendencyFieldType) {
            case "document": {
                Mask.setMaskCpf("#valuePendencyText");
                break;
            }
            default: {
                Mask.removeMask("#valuePendencyText");
            }
        }

        document.querySelector("#descriptionPendencyText").innerHTML =
            pendency.description;

        document.querySelector("#valuePendencyText").value =
            user[pendency.namePendencyFieldType] || "";

        Route.startClassesInComponent(
            [{component: ".modal-open-text-document", class: "active"}],
            () => {
                viewController.elementProperty.removeClass(
                    ".modal-open-text-document",
                    "active"
                );
            }
        );

        viewController.elementProperty.addEventInElement(
            "#btnUpdateDocumentText",
            "onclick",
            function () {
                const value = document.querySelector("#valuePendencyText").value;
                if (value.trim().length <= 0)
                    return SwalCustom.messageDialog("", "Campo obrigatorio !", () =>
                        document.querySelector("#valuePendencyText").focus()
                    );

                this.disabled = true;

                const formData = new FormData();

                formData.append(pendency.namePendencyFieldType, value);

                ConnectionServer.sendFile("User/UpdateCustomerDocs", "POST", formData)
                    .then(() => {
                        SwalCustom.messageDialog(
                            "",
                            "Informação atualizada com sucesso",
                            () => {
                                Route.backPage();
                            },
                            "success"
                        );
                        getUpdateTrip();
                        setTimeout(() => updatePendency(), 1000);
                    })
                    .finally(() => {
                        this.disabled = false;
                    });
            }
        );
    }

    function openDocumentTypeFile(pendency) {
        document.querySelector("#boxPhotoDocument").style.backgroundImage = `url(${
            user[pendency.namePendencyFieldType]
        })`;

        document.querySelector("#descriptionPendencyPhoto").innerHTML =
            pendency.description;

        Route.startClassesInComponent(
            [{component: ".modal-open-photo-document", class: "active"}],
            () => {
                viewController.elementProperty.removeClass(
                    ".modal-open-photo-document",
                    "active"
                );
            }
        );

        viewController.elementProperty.addEventInElement(
            "#captureDocumentStatus",
            "onclick",
            () => {
                if (ConfigGeneral().get("enable_customer_open_gallery") == true) {
                    SwalCustom.dialogConfirm(getTextTranslate("status", "want-to-send-another-photo")).then(() => {
                        navigator.notification.confirm(getTextTranslate("status", "select-way-send-the-photo"), (status) => {
                            if (status === 1)
                                startCamera(Camera.PictureSourceType.CAMERA, photo => {
                                    document.querySelector(
                                        "#boxPhotoDocument"
                                    ).style.backgroundImage = `url(${photo.localToURL})`;

                                    const formData = new FormData();

                                    preload(true);
                                    FileUpload.prepare(photo).then(file => {
                                        formData.append(
                                            pendency.namePendencyFieldType,
                                            file.data,
                                            file.name
                                        );

                                        ConnectionServer.sendFile(
                                            "User/UpdateCustomerDocs",
                                            "POST",
                                            formData
                                        ).then(({ status }) => {
                                            preload(false);

                                            if(!status){
                                                return SwalCustom.messageDialog(
                                                    `${getTextTranslate("status", "error-message")}`,
                                                    `${getTextTranslate("status", "error-title")}`,
                                                    undefined, "error");
                                            }

                                            SwalCustom.messageDialog(
                                                `${getTextTranslate("status", "success-message")}`,
                                                `${getTextTranslate("status", "success-title")}`,
                                                () => {
                                                    Route.backPage();
                                                }, 'success');
                                            getUpdateTrip();
                                        });
                                    });
                                });

                            if (status === 2)
                                startGallery(Camera.PictureSourceType.SAVEDPHOTOALBUM, photo => {
                                    document.querySelector(
                                        "#boxPhotoDocument"
                                    ).style.backgroundImage = `url(${photo.localURL})`;

                                    const formData = new FormData();

                                    preload(true);
                                    FileUpload.prepare(photo).then(file => {
                                        formData.append(
                                            pendency.namePendencyFieldType,
                                            file.data,
                                            file.name
                                        );

                                        ConnectionServer.sendFile(
                                            "User/UpdateCustomerDocs",
                                            "POST",
                                            formData
                                        ).then(({ status }) => {
                                            preload(false);

                                            if(!status){
                                                return SwalCustom.messageDialog(
                                                    `${getTextTranslate("status", "error-message")}`,
                                                    `${getTextTranslate("status", "error-title")}`,
                                                    undefined, "error");
                                            }

                                            SwalCustom.messageDialog(
                                                `${getTextTranslate("status", "success-message")}`,
                                                `${getTextTranslate("status", "success-title")}`,
                                                () => {
                                                Route.backPage();
                                            }, 'success');
                                            getUpdateTrip();
                                        });
                                    });
                                });

                        }, getTextTranslate("status", "edit-profile-picture"), [
                            getTextTranslate("status", "type-camera"),
                            getTextTranslate("status", "type-gallery")
                        ]);
                    });
                } else {
                    SwalCustom.dialogConfirm(getTextTranslate("status", "want-to-send-another-photo")).then(() => {
                        startCamera(Camera.PictureSourceType.CAMERA, photo => {
                            document.querySelector(
                                "#boxPhotoDocument"
                            ).style.backgroundImage = `url(${photo.localToURL})`;

                            const formData = new FormData();
                            preload(true);
                            FileUpload.prepare(photo).then(file => {
                                formData.append(
                                    pendency.namePendencyFieldType,
                                    file.data,
                                    file.name
                                );

                                ConnectionServer.sendFile(
                                    "User/UpdateCustomerDocs",
                                    "POST",
                                    formData
                                ).then(({ status }) => {
                                    preload(false);

                                    if(!status){
                                        return SwalCustom.messageDialog(
                                            `${getTextTranslate("status", "error-message")}`,
                                            `${getTextTranslate("status", "error-title")}`,
                                            undefined, "error");
                                    }

                                    SwalCustom.messageDialog(
                                        `${getTextTranslate("status", "success-message")}`,
                                        `${getTextTranslate("status", "success-title")}`,
                                        () => {
                                            Route.backPage();
                                        }, 'success');
                                    getUpdateTrip();
                                });
                            });
                        });
                    })
                }
            }
        );
    }

    // function getImageBy(type, pendency) {
    //     capturePhoto.get(type).then(path => {
    //         FileUpload.getFile(path).then(photo => {
    //             const formData = new FormData();
    //
    //             FileUpload.prepare(photo).then(file => {
    //                 formData.append(
    //                     pendency.namePendencyFieldType,
    //                     file.data,
    //                     file.name
    //                 );
    //
    //                 ConnectionServer.sendFile(
    //                     "User/UpdateCustomerDocs",
    //                     "POST",
    //                     formData
    //                 ).then(() => {
    //                     getUpdateTrip();
    //                 });
    //             });
    //         });
    //         document.querySelector(
    //             "#boxPhotoDocument"
    //         ).style.backgroundImage = `url(${path})`;
    //     });
    // }

    function startCamera(srcType, callback) {
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

    viewController.elementProperty.addEventInElement(
        ".go-back-document",
        "onclick",
        () => {
            Route.backPage();
        }
    );
}
