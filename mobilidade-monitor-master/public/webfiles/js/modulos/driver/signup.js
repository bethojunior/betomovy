$(document).ready(function () {
    let userLogged = Session.get('user');
    let clickCitie = false;
    let isFormFinish = false, isValidateEmail = false;

    Mask.setMaskPhone("#phone");

    $("#licensePlate").inputmask({mask: ['AAA-9999', 'AAA9A99']});
    $("#cpf").inputmask({mask: ['999.999.999-99', '99.999.999/9999-99']});

    const elementProperty = new ElementProperty();
    const driverController = new DriverController();
    const supportController = new SupportController();

    elementProperty.addEventInElement('#cpf', 'onblur', () => {
        elementProperty.getElement('#cpf', res => {
            let document = res.value;

            DriverController.checkCpf({document}).then(resolve => {
                if (resolve.status) {
                    swal('ops', 'Cpf já cadastrado', 'info');
                    res.value = "";
                }
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
            password: "123456",
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
            rentalCompanyDocument: ""
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
        car: {
            licensePlate: null,
            renavam: null,
            markCar: null,
            modelCar: null,
            colorCar: null,
            numberSeatingCar: null,
        }
    };

    supportController.getHelpCode().then(({status, data}) => {
        if (!status)
            return;
        Session.set("codeSupport", data);
    });

    elementProperty.addEventInElement(".btn-next-step", "onclick", formPass);

    elementProperty.addEventInElement("#email", "onblur", function () {

        elementProperty.getElement(".container-preload-email", element => {
            element.classList.add("active");
        });

        driverController.checkEmail(this.value).then(result => {
            elementProperty.getElement(".container-preload-email", element => {
                element.classList.remove("active");
            });

            isValidateEmail = !result.status;
        });
    });

    async function formPass() {
        if (!formGroup.nextGroup()) {
            elementProperty.getElement(".preload-return", element => {
                element.style.display = "flex";
            });

            formGroup.validate.isRegistered = true;
            elementProperty.getElement(".back-to", element => {
                element.style.display = 'none';
            });

            async function verifyUserAndRegister() {
                let registerByManager = false;

                const managerVerificationResult = await ManagerController.verifyUserIsManager(userLogged.idUser);

                if (!managerVerificationResult.status) {
                    return;
                }

                if (managerVerificationResult.response != null) {
                    registerByManager = true;
                }

                const result = await driverController.register(dataDriver, registerByManager, userLogged.idUser);

                elementProperty.getElement(".preload-return", element => {
                    element.style.display = "none";
                });

                if (!result.status) {
                    elementProperty.getElement(".back-to", element => {
                        element.style.display = 'block';
                    });

                    formGroup.validate.isRegistered = false;
                    isFormFinish = false;
                    SwalCustom.messageDialog(result.message, "Atenção", "warning");
                    formGroup.beforeGroup();
                    return;
                }

                isFormFinish = true;

                if (isFormFinish) {
                    SwalCustom.messageDialog("", "Motorista criado com sucesso!", "success").then(() =>
                        window.location.reload()
                    );
                }
            }

            await verifyUserAndRegister();
        }
    }

    function isCompletePersonalData() {
        const inputs = [
            document.getElementById("name"),
            document.getElementById("cpf"),
            document.getElementById("email"),
            document.getElementById("phone")
        ];

        for (let i in inputs) {
            const input = inputs[i];

            if (input.value.length === 0) {
                input.focus();
                return false;
            }
        }

        return true;
    }

    elementProperty.addEventInElement("#btnPersonalData", "onclick", function () {
        if (!isCompletePersonalData())
            return;

        if (!isValidateEmail) {
            SwalCustom.messageDialog("E-mail já esta sendo utilizado", "Atenção", () => {
            }, "warning");
            return false;
        }

        dataDriver.driver.name = document.getElementById("name").value;
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

    elementProperty.addEventInElement("#isRentalOfVehicles", "onclick", function () {
        if (this.checked) {
            document.querySelector("#cnpjCompany").style.display = "block";
        } else {
            document.querySelector("#cnpjCompany").style.display = "none";
        }
    });

    elementProperty.addEventInElement("#btCRLV", "onclick", function () {
        dataDriver.driver.numberCRLV = document.getElementById("numberCRLV").value;
        dataDriver.car.licensePlate = document.getElementById("licensePlate").value.toUpperCase();
        dataDriver.car.markCar = document.getElementById("markCar").value;
        dataDriver.car.modelCar = document.getElementById("modelCar").value;
        dataDriver.car.numberSeatingCar = document.getElementById("numberSeatingCar").value;
        dataDriver.car.renavam = document.getElementById("renavam").value;
        dataDriver.car.colorCar = document.getElementById("colorCar").value;
        dataDriver.car.year = document.getElementById("yearCar").value;
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

    elementProperty.addEventInElement("#btnTerm", "onclick", function () {
        elementProperty.getElement("#useTerm", element => {
            if (!element.checked) {
                SwalCustom.messageDialog("Aceite os termos de condições do aplicativo para poder continuar ", "Atenção", () => {
                }, "warning");
            } else {
                formPass();
            }
        });
    });

    elementProperty.addEventInElement(".open-modal-document", "onclick", function () {
        elementProperty.getElement("#modalPreview" + this.getAttribute("value"), element => {
            element.classList.add("active");
        })
    });

    CityController.getActives().then(result => {
        elementProperty.getElement("#cityWork", element => {
            element.innerHTML = "<option value='' selected disabled >Selecione a cidade</option> " +
                result.data.map(city => {
                    return `<option value="${city.cityId}">${city.nome}</option>`;
                }).join("");
        });

        elementProperty.addEventInElement("#cityWork", "onchange", function () {
            dataDriver.driver.cityId = this.value;
        });

    });

   /* elementProperty.addEventInElement('#cityWork', 'onclick', function () {
        if (!clickCitie) {
            clickCitie = true;
            let element = this;
            CityController.getActives().then(result => {
                console.log(result);
                result.data.map(city => {
                    element.innerHTML += `<option value="${city.cityId}">${city.nome}</option>`;
                });
            });
            dataDriver.driver.cityId = this.value;
            dataDriver.station.cityId = this.value;
        }
    });*/

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

    elementProperty.addEventInElement("#btnCaptureProfile", "onchange", function () {
        if (this.files && this.files[0]) {
            const reader = new FileReader();

            reader.onload = (e) => {
                elementProperty.getElement(`#imgPreviewPROFILE`, element => {
                    element.style.backgroundImage = `url(${e.target.result})`;
                });
            };

            reader.readAsDataURL(this.files[0]);

            resizeAndUpload(this.files[0], (result) => {
                dataDriver.image[this.getAttribute("typeImage")] = {data: result, name: this.files[0].name};
            });
        }
    });

    elementProperty.addEventInElement(".file-image-driver", "onchange", function () {
        if (this.files && this.files[0]) {
            const reader = new FileReader();

            reader.onload = (e) => {
                elementProperty.getElement(`#imgPreview${this.getAttribute("typeImage")}`, element => {
                    element.setAttribute("src", e.target.result);
                });
            };

            reader.readAsDataURL(this.files[0]);

            resizeAndUpload(this.files[0], (result) => {
                dataDriver.image[this.getAttribute("typeImage")] = {data: result, name: this.files[0].name};
            });
        }
    });

    window.addEventListener('keyboardDidShow', function () {
        elementProperty.getElement(".btn-next-signup", element => {
            element.classList.add("active");
        });
        elementProperty.getElement(".bottom-button", element => {
            element.classList.add("active");
        });
        elementProperty.getElement(".container-signup", element => {
            element.classList.add("active");
        });
    });

    window.addEventListener('keyboardDidHide', function () {
        elementProperty.getElement(".btn-next-signup", element => {
            element.classList.remove("active");
        });
        elementProperty.getElement(".bottom-button", element => {
            element.classList.remove("active");
        });
        elementProperty.getElement(".container-signup", element => {
            element.classList.remove("active");
        });
    });

    function resizeAndUpload(file, callback) {
        const reader = new FileReader();
        reader.onloadend = function () {

            const tempImg = new Image();
            tempImg.src = reader.result;
            tempImg.onload = function () {

                const MAX_WIDTH = 500;
                const MAX_HEIGHT = 500;
                let tempW = tempImg.width;
                let tempH = tempImg.height;
                if (tempW > tempH) {
                    if (tempW > MAX_WIDTH) {
                        tempH *= MAX_WIDTH / tempW;
                        tempW = MAX_WIDTH;
                    }
                } else {
                    if (tempH > MAX_HEIGHT) {
                        tempW *= MAX_HEIGHT / tempH;
                        tempH = MAX_HEIGHT;
                    }
                }

                const canvas = document.createElement('canvas');
                canvas.width = tempW;
                canvas.height = tempH;
                const ctx = canvas.getContext("2d");
                ctx.drawImage(this, 0, 0, tempW, tempH);
                const dataURL = canvas.toDataURL(file.type);

                callback(b64toBlob(
                    dataURL.replace(`data:${file.type};base64,`, ''), file.type));
            }

        }
        reader.readAsDataURL(file);
    }

    function b64toBlob(b64Data, contentType, sliceSize) {
        contentType = contentType || '';
        sliceSize = sliceSize || 512;

        const byteCharacters = atob(b64Data);
        const byteArrays = [];

        for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
            let slice = byteCharacters.slice(offset, offset + sliceSize);

            let byteNumbers = new Array(slice.length);
            for (let i = 0; i < slice.length; i++) {
                byteNumbers[i] = slice.charCodeAt(i);
            }

            let byteArray = new Uint8Array(byteNumbers);

            byteArrays.push(byteArray);
        }

        return new Blob(byteArrays, {type: contentType});
    }

    formGroup.callbackIgnore = (element) => {
        const type = element.getAttribute("value");

        if (!formGroup.validate[type])
            return true;

        return !formGroup.validate[type].required;
    };

    UserController.userTypeDrivers().then(({status, response}) => {
        if (!status)
            return;

        elementProperty.getElement("#listTypesDriver", element => {
            element.innerHTML = response.map(({idUserType, picture, name, description}) => {
                return `<li class="type-driver-signup" value="${idUserType}">
                    <img src="${picture}">
                    <div>
                        <p>${name}</p>
                        <label>${description || ""}</label>
                    </div>
                    <i class="material-icons">keyboard_arrow_right</i>
                </li>`;
            }).join("");

            initEventSelectTypeDriver();
        })
    })

    function initEventSelectTypeDriver() {
        elementProperty.addEventInElement(".type-driver-signup", "onclick", function () {
            dataDriver.driver.userTypeId = this.getAttribute("value");
            preload(true);
            FormStepController.getByUserType(dataDriver.driver.userTypeId).then(({status, data}) => {
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
                preload(false);
            });
        });
    }

    function getDocumentsDriver() {
        DocUserTypeController.findByUserType(dataDriver.driver.userTypeId).then(({data}) => {

            elementProperty.getElement(".container-document-list", element => {
                element.innerHTML = data.map(item => {

                    dataDriver.driver.docs.push({docId: item.docId});

                    formGroup.screens.push({
                        selectors: `.document-driver-content[type='${item.docId}']`,
                        validated: false
                    });

                    return `<div class="document-driver-content" type="${item.docId}">
                                <h4>${item.label}</h4>
                                <div class="content-form-group">
                                    <div ${item.text == true ? "" : "hidden"} class="mb-1">
                                        <label>${item.description || ""}</label>
                                        <a  href="${item.link}" target="_blank" class="mb-1">
                                                ${item.link != null ? "Solicite o documento aqui" : ""}
                                        </a>
                                        <input type="text" class="form-control" placeholder="Digite" typeDocument="${item.docId}"/>
                                    </div>
                                    <div  ${item.image == true ? "" : "hidden"} class="file-document">
                                        <input type="file" typeDocument="${item.docId}" class="input-file-document">
                                        <span>Adicionar foto do documento</span>
                                        <a>
                                            <i class="material-icons">keyboard_arrow_right</i>
                                        </a>
                                    </div>
                                    <div class="content-image-document" typeDocument="${item.docId}"></div>
                                    <button class="btn btn-document-driver" 
                                    typeDocument='${JSON.stringify(item)}' type="button">PRÓXIMO</button>
                                    </div>
                            </div>`;
                }).join("");

                elementProperty.addEventInElement(".input-file-document", "onchange", function () {
                    const docId = this.getAttribute("typeDocument");

                    const doc = dataDriver.image.DOCUMENTS.find((item) => {
                        return item.docId === docId;
                    }) || {docId, image: null, inArray: false};

                    if (!doc.inArray) {
                        doc.inArray = true;

                        dataDriver.image.DOCUMENTS.push(doc);
                    }

                    if (this.files && this.files[0]) {
                        const reader = new FileReader();

                        reader.onload = (e) => {
                            document.querySelector(`.content-image-document[typeDocument='${docId}']`).style.backgroundImage =
                                `url(${e.target.result})`;
                        };

                        reader.readAsDataURL(this.files[0]);

                        resizeAndUpload(this.files[0], (result) => {
                            doc.image = {data: result, name: this.files[0].name};
                        });
                    }
                });

                elementProperty.addEventInElement(".btn-document-driver", "onclick", function () {
                    const data = JSON.parse(this.getAttribute("typeDocument"));

                    const doc = dataDriver.driver.docs.find(item => {
                        return item.docId === data.docId;
                    });


                    if (data.text == true) {
                        doc.text = document.querySelector(`input[typeDocument='${data.docId}']`).value;

                        if (doc.text.length === 0)
                            return SwalCustom.messageDialog("", `Digite o documento - ${data.label}`);
                    }

                    if (data.image == true) {
                        if (dataDriver.image.DOCUMENTS.filter(item => {
                            return data.docId === item.docId && item.image != null;
                        }).length === 0)
                            return SwalCustom.messageDialog("", `Retire uma foto do documento - ${data.label}`);
                    }

                    formPass();
                })
            });
        });
    }

});
