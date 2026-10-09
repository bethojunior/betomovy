document.addEventListener("DOMContentLoaded", function () {
    Mask.setMaskPhone(".mask-phone");
    bsCustomFileInput.init();
    let timeout = null;

    let placeSelected = null;
    const appPartnersElement = document.getElementById("apps-partners");

    function loadAppPartners() {
        if (!appPartnersElement) {
            return;
        }

        getAppPartners(this.value, result => {
            const listAppsPartners = result.data.response.data;

            appPartnersElement.innerHTML = '';

            const defaultOption = document.createElement('option');
            defaultOption.value = '';
            defaultOption.textContent = 'Aplicativo Parceiro';
            defaultOption.selected = true;
            appPartnersElement.appendChild(defaultOption);

            listAppsPartners.forEach(app => {
                const option = document.createElement('option');
                option.value = app.key;
                option.textContent = app.name_app;
                appPartnersElement.appendChild(option);
            });
        });
    }

    loadAppPartners();

    viewController.elementProperty.addEventInElement("#register-international", "onchange", function () {
        const isChecked = document.getElementById("register-international")?.checked;
        if (isChecked) {
            Mask.removeMask(".mask-phone");
        } else {
            Mask.setMaskPhone(".mask-phone");
        }
    });

    viewController.elementProperty.addEventInElement("#formRegister", "onsubmit", function (event) {
        event.preventDefault();
        const isChecked = document.getElementById("register-international")?.checked;

        const password = document.querySelector("#userPassword");
        const rePassword = document.querySelector("#rePassword");
        const phone = document.querySelector("#userPhone");
        const address = document.querySelector("#address");
        const logo = document.querySelector("#logo");
        const userName = document.querySelector("#userName");
        const userEmail = document.querySelector("#userEmail");
        const name = document.querySelector("#name");

        if (!userName.value.trim()) {
            userName.classList.add("is-invalid");
            userName.focus();
            return false;
        } else {
            userName.classList.remove("is-invalid");
        }

        if (!userEmail.value.trim()) {
            userEmail.classList.add("is-invalid");
            userEmail.focus();
            return false;
        } else {
            userEmail.classList.remove("is-invalid");
        }

        if (!ValidateForm.validatePhone(phone.value) && !isChecked) {
            phone.classList.add("is-invalid");
            phone.focus();
            return false;
        } else {
            phone.classList.remove("is-invalid");
        }

        if (password.value !== rePassword.value) {
            password.classList.add("is-invalid");
            rePassword.classList.add("is-invalid");
            password.focus();
            return false;
        } else {
            password.classList.remove("is-invalid");
            rePassword.classList.remove("is-invalid");
        }

        if (!name.value.trim()) {
            name.classList.add("is-invalid");
            name.focus();
            return false;
        } else {
            name.classList.remove("is-invalid");
        }

        if (placeSelected == null) {
            if (address.value.trim() !== "") {
                placeSelected = {
                    latitude: -3.7319,
                    longitude: -38.5267,
                    address: address.value.trim()
                };
                address.classList.remove("is-invalid");
                address.classList.add("is-valid");
            } else {
                address.classList.add("is-invalid");
                address.focus();
                return false;
            }
        } else {
            address.classList.remove("is-invalid");
            address.classList.add("is-valid");
        }

        const btnRegister = document.querySelector("#btnRegister");
        btnRegister.innerHTML = `<div class="spinner-border spinner-border-sm" role="status"><span class="sr-only">Loading...</span></div>`;
        btnRegister.disabled = true;
        document.querySelector("#listErrors").innerHTML = "";

        localStorage.setItem("emailRegisterInternational", JSON.stringify({
            email: userEmail?.value,
            name: userName?.value
        }));

        const handleSend = (fileData, fileName) => {
            const formData = new FormData();
            if (fileData) {
                formData.append("logo", fileData, fileName || "logo.png");
            }
            formData.append("name", name.value.trim());
            formData.append("address", placeSelected.address);
            formData.append("latitude", placeSelected.latitude);
            formData.append("longitude", placeSelected.longitude);
            formData.append("user[name]", userName.value.trim());
            formData.append("user[email]", userEmail.value.trim());
            formData.append("user[phone]", phone.value.trim());
            formData.append("user[password]", password.value);
            if (appPartnersElement && appPartnersElement.value) {
                formData.append("app_partner", appPartnersElement.value);
            }

            CentralRepository.register(formData).then((result) => {
                const isSuccess = result && (result.status === true || result.status === "true");
                if (isSuccess) {
                    UserRepository.login({
                        email: userEmail.value.trim(),
                        password: password.value
                    }).then(loginResult => {
                        const loginSuccess = loginResult && (loginResult.status === true || loginResult.status === "true");
                        if (!loginSuccess || !loginResult.response) {
                            swal("Central cadastrada com sucesso!", "Por favor, faça login com seu email e senha.", "success").then(() => {
                                window.location.href = "/";
                            });
                            return;
                        }

                        const response = loginResult.response;
                        const central_user = response.central_user;
                        const key_app_partner = response.key_app_partner;

                        Session.set("centrals", central_user);
                        delete response.central_user;

                        Session.set('user', response);
                        localStorage.setItem('keyAppPartner', JSON.stringify(key_app_partner));

                        if (environment.appPartner === "false" && key_app_partner !== null) {
                            Session.delete("user");
                            localStorage.removeItem('keyAppPartner');
                        }

                        window.location.href = "/";
                    }).catch(() => {
                        swal("Central cadastrada com sucesso!", "Por favor, faça login com seu email e senha.", "success").then(() => {
                            window.location.href = "/";
                        });
                    });
                } else {
                    const errorMsg = (result && (result.message || (result.errors && result.errors.message))) || "Erro ao registrar central";
                    swal("Atenção", errorMsg, "warning");
                    document.querySelector("#listErrors").innerHTML = `<div class="alert alert-danger" role="alert">${errorMsg}</div>`;
                    btnRegister.disabled = false;
                    btnRegister.innerHTML = "Criar conta";
                }
            }).catch((err) => {
                let errorMsg = "Erro ao registrar central";
                if (err) {
                    if (err.message) {
                        errorMsg = err.message;
                    } else if (err.response && typeof err.response === "object") {
                        errorMsg = Object.values(err.response).join(", ");
                    } else if (typeof err === "string") {
                        errorMsg = err;
                    }
                }
                swal("Erro", errorMsg, "error");
                document.querySelector("#listErrors").innerHTML = `<div class="alert alert-danger" role="alert">${errorMsg}</div>`;
                btnRegister.disabled = false;
                btnRegister.innerHTML = "Criar conta";
            });
        };

        if (logo.files && logo.files[0]) {
            ImageUpload.resize(logo.files[0], 300, 300).then(file => {
                handleSend(file.data, file.name);
            }).catch(() => {
                handleSend(logo.files[0], logo.files[0].name);
            });
        } else {
            handleSend(null, null);
        }
    });

    viewController.elementProperty.addEventInElement("#address", "oninput", function () {
        this.classList.remove("is-invalid");
        this.classList.remove("is-valid");
        placeSelected = null;
        clearTimeout(timeout);

        timeout = setTimeout(() => {
            getPlaces(this.value, result => {
                const listAddressSuggestion = document.querySelector("#listAddressSuggestion");
                listAddressSuggestion.innerHTML = result.map(place => {
                    return `<li class="place-selected" value='${JSON.stringify(place)}'>${place.display_name}</li>`;
                }).join("");


                viewController.elementProperty.addEventInElement(".place-selected", "onclick", function () {
                    clearTimeout(timeout);
                    const place = JSON.parse(this.getAttribute("value"));
                    const element = document.querySelector("#address");

                    let address = place.display_name;
                    element.classList.add("is-valid");
                    if (address.length > 100) 
                        address = address.substring(0, 100);
                    

                    element.value = address;

                    placeSelected = {
                        latitude: place.lat,
                        longitude: place.lon,
                        address: address
                    };

                    listAddressSuggestion.innerHTML = '';
                });
            })
        }, 500)
    });

    viewController.elementProperty.addEventInElement("#address", "onfocus", function () {
        this.select();
    });

    viewController.elementProperty.addEventInElement("#address", "onblur", function () {
        setTimeout(() => {
            clearTimeout(timeout);
            document.querySelector("#listAddressSuggestion").innerHTML = '';
        }, 500)
    });

    function getPlaces(value, callback) {
        ConnectionServer.sendRequestByUrl(`https://nominatim.openstreetmap.org/search?q=${value}&format=json`, "GET", null, callback, null)
    }

    function getAppPartners(_, callback) {
        ConnectionServer.sendRequestByUrl(`${environment.hosts.hostRequestApi}config/getapppartner`, "GET", null, callback, null)
    }
});
