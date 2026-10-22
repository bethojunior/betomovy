$(document).ready(function () {

    // $('select').material_select();

    let isFormFinish = false, isValidateEmail = false;
    const responseKeyAppPartner = localStorage.getItem("keyAppPartner");
    const responseKeyAppPartnerParsed = JSON.parse(responseKeyAppPartner);

    Mask.setMaskPhone("#phone");
    $("#licensePlate").inputmask({mask: ['AAA-9999', 'AAA9A99']});

    const elementProperty = new ElementProperty();
    const driverController = new DriverController();
    const stationTypeController = new StationTypeController();
    const supportController = new SupportController();
    const cooperativeController = new CooperativeController();

    const formGroup = new FormGroup(".group-signup");

   /* formGroup.validate = {
        TYPE_DRIVER: false,
        PERSONAL_DATA: false,
        VALIDATE_NUMBER: false,
        SAFETY: false,
        COMPANY: false,
        DOCUMENT_CNH: false,
        DOCUMENT_CRLV: false,
        DOCUMENT_ALVARA: false,
        DOCUMENT_CRIMINAL_RECORD: false,
        PROFILE_IMAGE: false,
        TERMS: false,
        isRegistered: false
    };*/

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
            cnh: "",
            created_at: "",
            hasCardReader: false,
            numberCNH: null,
            numberCRLV: null,
            numberAlvara: null,
            numberCriminalRecord: null
        },
        image: {
            CNH: null,
            CRLV: null,
            ALVARA: null,
            PROFILE: null,
            CRIMINAL_RECORD: null
        },
        car: {
            licensePlate: null,
            renavam: null,
            markCar: null,
            modelCar: null,
            colorCar: null,
            numberSeatingCar: null,
        },
        centralId: Session.getValueInSession("centralSelected", "id")
    };

    supportController.getHelpCode().then(({status, data}) => {
        if (!status)
            return;
        Session.set("codeSupport", data);
    });

    elementProperty.addEventInElement(".type-driver-signup", "onclick", function () {
        dataDriver.driver.userTypeId = this.getAttribute("value");

        formGroup.validate.DOCUMENT_ALVARA = dataDriver.driver.userTypeId === "7";
        formPass();


        elementProperty.getElement(".back-to", element => {
            element.style.display = "block";
        })
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

    elementProperty.addEventInElement(".back-to", "onclick", goBackStep);

    function formPass() {
        if (!validateData())
            return;

        if (!formGroup.nextGroup()) {
            elementProperty.getElement(".preload-return", element => {
                element.style.display = "block";
            });

            formGroup.validate.isRegistered = true;
            elementProperty.getElement(".back-to", element => {
                element.style.display = 'none';
            });

            driverController.register(dataDriver).then(result => {

                if (!result.status) {
                    elementProperty.getElement(".back-to", element => {
                        element.style.display = 'block';
                    });
                    formGroup.validate.isRegistered = false;
                    isFormFinish = false;
                    SwalCustom.messageDialog(result.message || "Não foi possível concluir o cadastro do motorista", "Atenção", () => {
                    }, "warning");
                    formGroup.beforeGroup();
                    return;
                }

                isFormFinish = true;

                elementProperty.getElement(".group-signup-finish", element => {
                    element.classList.add("active");
                });

                elementProperty.addEventInElement(".finish-form", "onclick", function () {
                    location.href = '/driver/list';
                });
            }).catch(err => {
                console.error("Erro no cadastro de motorista:", err);
                formGroup.validate.isRegistered = false;
                isFormFinish = false;
                SwalCustom.messageDialog("Erro ao enviar dados do motorista. Tente novamente.", "Atenção", () => {}, "error");
            });
        }
    }

    function isCompletePersonalData() {
        const inputs = [
            document.getElementById("name"),
            document.getElementById("email"),
            document.getElementById("phone")
        ].filter(Boolean);

        for (let i in inputs) {
            const input = inputs[i];

            if (input.value.trim().length === 0) {
                input.focus();
                return false;
            }
        }

        return true;
    }

    function validateData() {

        if (formGroup.validate.PERSONAL_DATA)
            if (formGroup.validate.PERSONAL_DATA.required &&
                !formGroup.validate.PERSONAL_DATA.wasValidated) {

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
                dataDriver.driver.gender = document.getElementById("gender") ? document.getElementById("gender").value : "";
                const docInput = document.getElementById("cpf");
                dataDriver.driver.document = (docInput && docInput.value.trim().length > 0) ? docInput.value.trim() : ("DOC" + Date.now());

                formGroup.validate.PERSONAL_DATA.wasValidated = validateFormPersonalData(dataDriver);

                return formGroup.validate.PERSONAL_DATA.wasValidated;
            }
        /*   if (!formGroup.validate.VALIDATE_NUMBER) {

               validateForm.verifyCode = document.getElementById("verifyCode").value;

               formGroup.validate.VALIDATE_NUMBER = verifyCode(validateForm);

               return formGroup.validate.VALIDATE_NUMBER;
           }
           if (!formGroup.validate.SAFETY) {

               elementProperty.getElement("#password", element => {
                   dataDriver.driver.password = element.value;
               });

               formGroup.validate.SAFETY = verifyPassword(dataDriver);

               return formGroup.validate.SAFETY;
           }*/
        if (formGroup.validate.COMPANY)
            if (formGroup.validate.COMPANY.required &&
                !formGroup.validate.COMPANY.wasValidated) {

                //dataDriver.station.name = document.getElementById("nameStation").value;

                formGroup.validate.COMPANY.wasValidated = verifyCompany(dataDriver);

                return formGroup.validate.COMPANY.wasValidated;
            }

        if (formGroup.validate.DOCUMENT_CNH)
            if (formGroup.validate.DOCUMENT_CNH.required &&
                !formGroup.validate.DOCUMENT_CNH.wasValidated) {

            dataDriver.driver.numberCNH = document.getElementById("numberCNH").value;

            formGroup.validate.DOCUMENT_CNH.wasValidated = verifyDocumentCNH(dataDriver);

            return formGroup.validate.DOCUMENT_CNH.wasValidated;
        }

        if (formGroup.validate.DOCUMENT_CRLV)
            if (formGroup.validate.DOCUMENT_CRLV.required &&
                !formGroup.validate.DOCUMENT_CRLV.wasValidated) {

            dataDriver.driver.numberCRLV = document.getElementById("numberCRLV").value;
            dataDriver.car.licensePlate = document.getElementById("licensePlate").value.toUpperCase();
            dataDriver.car.markCar = document.getElementById("markCar").value;
            dataDriver.car.modelCar = document.getElementById("modelCar").value;
            dataDriver.car.numberSeatingCar = document.getElementById("numberSeatingCar").value;
            dataDriver.car.renavam = document.getElementById("renavam").value;
            dataDriver.car.colorCar = document.getElementById("colorCar").value;
            dataDriver.car.year = document.getElementById("yearCar").value;

            formGroup.validate.DOCUMENT_CRLV.wasValidated = verifyDocumentCRLV(dataDriver);

            return formGroup.validate.DOCUMENT_CRLV.wasValidated;
        }

        if (formGroup.validate.DOCUMENT_ALVARA)
            if (formGroup.validate.DOCUMENT_ALVARA.required &&
                !formGroup.validate.DOCUMENT_ALVARA.wasValidated) {

            dataDriver.driver.numberAlvara = document.getElementById("numberAlvara").value;

            formGroup.validate.DOCUMENT_ALVARA.wasValidated = verifyDocumentALVARA(dataDriver);

            dataDriver.driver.hasCardReader = document.getElementById("hasCardReader").checked;

            return formGroup.validate.DOCUMENT_ALVARA.wasValidated;
        }

        if (formGroup.validate.DOCUMENT_CRIMINAL_RECORD)
            if (formGroup.validate.DOCUMENT_CRIMINAL_RECORD.required &&
                !formGroup.validate.DOCUMENT_CRIMINAL_RECORD.wasValidated) {

            dataDriver.driver.numberCriminalRecord = document.getElementById("numberCriminalRecord").value;

            formGroup.validate.DOCUMENT_CRIMINAL_RECORD.wasValidated = verifyDocumentCriminalRecord(dataDriver);

            return formGroup.validate.DOCUMENT_CRIMINAL_RECORD.wasValidated;
        }

        if (formGroup.validate.PROFILE_IMAGE)
            if (formGroup.validate.PROFILE_IMAGE.required &&
                !formGroup.validate.PROFILE_IMAGE.wasValidated) {

            formGroup.validate.PROFILE_IMAGE.wasValidated = verifyDocumentProfile(dataDriver);

            return formGroup.validate.PROFILE_IMAGE.wasValidated;
        }

        if (formGroup.validate.TERMS)
            if (formGroup.validate.TERMS.required &&
                !formGroup.validate.TERMS.wasValidated) {

            elementProperty.getElement("#useTerm", element => {
                formGroup.validate.TERMS.wasValidated = element.checked;
                if (!element.checked) {
                    SwalCustom.messageDialog("Aceite os termos de condições do aplicativo para poder continuar ", "Atenção", () => {
                    }, "warning");
                }
            });

            return formGroup.validate.TERMS.wasValidated;
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

        if (formGroup.step === 9 && dataDriver.driver.userTypeId !== "7")
            formGroup.step -= 2;

        if (formGroup.step === 8 && dataDriver.driver.userTypeId === "7")
            formGroup.step--;


        if (formGroup.step === 0) {
            elementProperty.getElement(".back-to", element => {
                element.style.display = "none";
            });
        }
    }

    const inputCodes = document.getElementsByClassName("code-phone");

    elementProperty.addEventInElement(".code-phone", "oninput", function () {
        if (this.value.length === 0)
            return;

        const indexNextInput = parseInt(this.getAttribute("title")) + 1;

        validateForm.confirmationCode = `${inputCodes.item(0).value}${inputCodes.item(1).value}${inputCodes.item(2).value}${inputCodes.item(3).value}`;

        if (indexNextInput > inputCodes.length - 1) {
            formPass();
            return;
        }

        inputCodes[indexNextInput].focus();
    });

    EstateController.getAll().then(result => {
        elementProperty.getElement("#ufWork", element => {
            element.innerHTML += `<option value="" disabled selected>UF</option>`;
            result.data.map(estate => {
                element.innerHTML += `<option value="${estate.id}">${estate.sigla}</option>`;
            });
        });
    });

    elementProperty.addEventInElement("#ufWork", "onchange", function () {

        dataDriver.driver.estateId = this.value;

        CityController.getAll(this.value).then(result => {

            elementProperty.getElement("#cityWork", element => {
                element.innerHTML = `<option value="" disabled selected>Selecione a cidade</option>`;
                result.data.map(city => {
                    element.innerHTML += `<option value="${city.id}">${city.nome}</option>`;
                });
                //$('select').material_select()

                elementProperty.addEventInElement("#cityWork", "onchange", function () {
                    dataDriver.driver.cityId = this.value;
                    dataDriver.station.cityId = this.value;
                });
            });
        })
    });

    stationTypeController.getAll().then(result => {
        elementProperty.getElement("#typeStation", element => {
            element.innerHTML += `<option value="" disabled selected>Tipo de local</option>`;
            result.data.map(type => {
                element.innerHTML += `<option value="${type.idStationType}">${type.name}</option>`;
            });
            //  $('select').material_select();
        });
    });

    elementProperty.addEventInElement("#typeStation", "onchange", function () {
        dataDriver.station.stationTypeId = this.value;
    });

    elementProperty.getElement("#localReturn", element => {
        let _timeout = null;

        const dropdown = document.createElement('ul');
        dropdown.classList.add('address-suggestions');
        element.parentElement.classList.add('address-suggestions-field');
        element.parentElement.appendChild(dropdown);

        element.addEventListener('input', function () {
            clearTimeout(_timeout);
            dropdown.innerHTML = '';
            dropdown.classList.remove('address-suggestions--open');
            if (!this.value.trim()) return;
            _timeout = setTimeout(() => {
                const location = Session.getLocal('location') || { lat: 0, lng: 0 };
                PlaceRepository.searching(element.value, location).then(({ data }) => {
                    if (!data || !data.length) return;
                    dropdown.classList.add('address-suggestions--open');
                    dropdown.innerHTML = data.map((p) =>
                        `<li data-place='${JSON.stringify(p)}'>${p.address}</li>`
                    ).join('');
                    dropdown.querySelectorAll('li').forEach(li => {
                        li.addEventListener('click', function () {
                            const place = JSON.parse(this.getAttribute('data-place'));
                            element.value = place.address;
                            dataDriver.station.address = place.address;
                            dataDriver.station.latitude = place.latitude;
                            dataDriver.station.longitude = place.longitude;
                            dropdown.classList.remove('address-suggestions--open');
                            dropdown.innerHTML = '';
                        });
                    });
                });
            }, 500);
        });

        document.addEventListener('click', (e) => {
            if (!element.contains(e.target) && !dropdown.contains(e.target)) {
                dropdown.classList.remove('address-suggestions--open');
            }
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

    function initEventSelectTypeDriver() {
        elementProperty.addEventInElement(".type-driver-signup", "onclick", function () {
            if(Boolean(responseKeyAppPartnerParsed)) {
                dataDriver.driver.userTypeId = 3;
            } else {
                dataDriver.driver.userTypeId = this.getAttribute("value");
            }

            elementProperty.getElement("#preloadLogin", element => {
                element.style.marginTop = "0";
                element.style.top = "0";
                element.style.backgroundColor = "rgba(0,0,0,0.5)";
                element.style.display = "block";
            });

            RequiredFieldController.get(dataDriver.driver.userTypeId).then(({status, data}) => {
                if (!status)
                    return;

                formGroup.validate = {};

                data.map(item => {

                    formGroup.validate[item.description] = {
                        wasValidated: false,
                        required: item.compelField,
                    };
                });

                formGroup.nextGroup()
            }).finally(() => {
                elementProperty.getElement("#preloadLogin", element => {
                    element.style.display = "none";
                });
            });
        });
    }

    function getUserTypesDriverAppPartner() {
        preload(true);
        UserTypeController.getDriversAppPartner(responseKeyAppPartnerParsed).then(({status, data}) => {
            if (!status)
                return setTimeout(getUserTypesDriverAppPartner, 3000);

            viewController.elementProperty.getElement("#listUserType", element => {
                element.innerHTML = data.map(item => {
                    return `<li class="type-driver-signup sp-type-card" value="${item.idUserType}">
                                <img class="sp-type-card__img" src="${item.picture}">
                                <div class="sp-type-card__body">
                                    <p class="sp-type-card__name">${item.name}</p>
                                    <span class="sp-type-card__desc">${item.description || ""}</span>
                                </div>
                                <i class="material-icons sp-type-card__arrow">chevron_right</i>
                            </li>`;
                }).join("")
                preload(false);

                initEventSelectTypeDriver();
            });
        }).catch(() => {
            setTimeout(getUserTypesDriver, 3000);
        });
    }

    function getUserTypesDriver() {
        preload(true);
        UserTypeController.getDrivers().then(({status, data}) => {
            if (!status)
                return setTimeout(getUserTypesDriver, 3000);

            viewController.elementProperty.getElement("#listUserType", element => {
                element.innerHTML = data.map(item => {
                    return `<li class="type-driver-signup sp-type-card" value="${item.idUserType}">
                                <img class="sp-type-card__img" src="${item.picture}">
                                <div class="sp-type-card__body">
                                    <p class="sp-type-card__name">${item.name}</p>
                                    <span class="sp-type-card__desc">${item.description || ""}</span>
                                </div>
                                <i class="material-icons sp-type-card__arrow">chevron_right</i>
                            </li>`;
                }).join("")
                preload(false);

                initEventSelectTypeDriver();
            });
        }).catch(() => {
            setTimeout(getUserTypesDriver, 3000);
        });
    }

    formGroup.callbackIgnore = (element) => {
        const type = element.getAttribute("value");

        if(!formGroup.validate[type])
            return true;

        return !formGroup.validate[type].required;
    };

    if(Boolean(responseKeyAppPartnerParsed)) {
        getUserTypesDriverAppPartner();
    }

    if(!Boolean(responseKeyAppPartnerParsed)) {
        getUserTypesDriver();
    }
});