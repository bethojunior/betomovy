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

        if (placeSelected == null) {
            address.classList.add("is-invalid");
            address.classList.remove("is-valid");
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
        ImageUpload.resize(logo.files[0], 300, 300).then(file => {
            const formData = new FormData();
            formData.append("logo", file.data, file.name);
            formData.append("name", name.value);
            formData.append("address", placeSelected.address);
            formData.append("latitude", placeSelected.latitude);
            formData.append("longitude", placeSelected.longitude);
            formData.append("user[name]", userName.value);
            formData.append("user[email]", userEmail.value);
            formData.append("user[phone]", phone.value);
            formData.append("user[password]", password.value);
            if (appPartnersElement) {
                formData.append("app_partner", appPartnersElement.value);
            }

            CentralRepository.register(formData).then(({status}) => {
                if (status) {
                    UserRepository.login(
                        {
                            email: userEmail.value,
                            password: password.value
                        })
                        .then(result => {
                            if (!result.status) {
                                swal(result.message, "Usuário ou senha inválido", "info");
                                return;
                            }

                            const { central_user, key_app_partner } = result.response;

                            Session.set("centrals", central_user);
                            delete result.response.central_user;

                            Session.set('user', result.response);
                            localStorage.setItem('keyAppPartner', JSON.stringify(key_app_partner));

                            if (environment.appPartner === "false" && key_app_partner !== null) {
                                Session.delete("user");
                                localStorage.removeItem('keyAppPartner');
                            }

                            window.location.href = "/";
                        }).catch((message) => {
                        swal(message, "", "warning")
                    })
                }
            }).catch(({response}) => {
                document.body.scrollTo(0, 0);
                document.querySelector("#listErrors").innerHTML = Object.keys(response).map(attr => {
                    return `<div class="alert alert-danger" role="alert">${response[attr]}</div>`;
                }).join("");
                btnRegister.disabled = false;
                btnRegister.innerHTML = "Enviar";
            });
        });
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
