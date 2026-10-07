let stopNotificationMonitor = false;

document.addEventListener("DOMContentLoaded", function () {
    const user = Session.get("user");
    const configAlertPhotoPanicButton = Session.get('enable_alert_photo_panic') == 1 ? true : false
    

    changeHostEnv();

    function getConfigByKey(key){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequestApi(`Support/GetConfig`,'POST',{configKey: key}, resolve,reject,true);
        })
    }

    function changeHostEnv() {  
        getConfigByKey("link_storage_pictures").then((response) => {
            if(!response?.data) return; 
            const linkStoragePictures = response?.data || "";
            environment.hosts.hostImageDriver = `${linkStoragePictures}driver/profile/compressed/`;
            environment.hosts.hostImageDriverTemp = `${linkStoragePictures}driver/profile/temp/`;
            environment.hosts.hostDocs = `${linkStoragePictures}driver/docs/`;
            environment.hosts.hostImageClient = `${linkStoragePictures}customer/profile/compressed/`;
            environment.hosts.hostImageDefault = `${linkStoragePictures}default.jpg`;
            environment.hosts.hostImageCentral = `${linkStoragePictures}central/`;
            environment.hosts.hostAudio = `${linkStoragePictures}chat/trip/`;
        })
    }

    if (!(typeof $crisp === 'undefined')) {
        $crisp.push(["set", "user:email", [user.email]])
        $crisp.push(["set", "user:nickname", [`${user.name} - ${NAME_APP}`]])
    }

    const keys = Session.getLocal64('keysConfig');
    const manager = keys.find((res) => {
        return res.type == "GESTOR"
    })
    const billsButton = manager.config.find(item => {
        return item.key == "enable-button-bills-menu"
    })
    

    function color(status) {
        switch (status) {
            case 4:
                return "bg-danger";
            case 3:
                return "bg-warning";
            case 2:
                return "bg-warning";
            case 1:
                return "bg-success";
            default:
                return "bg-warning"
            }
    }

    getStatusBills()
    const admin ={
        token: "",
        project_name: ""
    }
    
    async function getStatusBills(){
        try {
            if(billsButton.value == "0") return;
            preload(true)
            const { response } = await AdminAnaController.loginAdmin();
            preload(false)
            if (!response) return;
            admin.token = response.token
            admin.project_name = response.customer.project_name
            const buttonElement = document.querySelector(".payment-btn")
            preload(true)
            const {response: data} = await AdminAnaController.getStatusBills(response.customer.project_name)
            preload(false)
            if(data?.original) {
                const error = data.original?.response?.errors
                SwalCustom.dialogConfirm(error?.length > 0 ? error[0] : "Identificamos alguns problemas com suas faturas", "Entrar em contato com o suporte", status => {
                    if (!status)
                        return;
                    
                    window.location.href =
                    "https://api.whatsapp.com/send?phone=55859677-7458&text=Olá, preciso de apoio do setor financeiro.";
                });
            }
    
            buttonElement.classList.add(color(data.status_id))
            buttonElement.innerHTML = data.status_message || "Visualizar faturas"
    
            activeButton()
        } catch(error) {
            console.log(error?.request)
        } finally {
            preload(false)
        }
    }

    function activeButton() {
        document.querySelector(".payment-btn").classList.remove("d-none")
        document.querySelector(".payment-btn").addEventListener('click', function () {
            openPaymentDebt()
        })
    }

    async function openPaymentDebt() {
        if(admin.project_name != "voutehomologar") {
            window.open(
                `https://checkout.prod.704apps.com.br/faturas-mensais?token=${admin.token}`
              );
        } else {
            window.open(
                `https://admin.dev.704apps.com.br/faturas-mensais?token=${admin.token}`
            );
        }
    }

    let namedriver = '';
    const elementProperty = new ElementProperty();

    const paramsSelectedNotification = {
        read: 0,
        userGroupId: null,
    };

    NotificationController.getAllGroup().then(({ response }) => {
        document.querySelector("#groupNotificationAdmin").innerHTML += response.map(item => {
            return `<option value="${item.id}">${item.name}</option>`;
        }).join("");
    });

    function getVersion() {
        ConnectionServer.sendRequest("databaseVersion", "GET", null, ({ response }) => {
            document.querySelector("#lastVersionMonitor").innerHTML = "#" + response.version;
        }, undefined, true);
    }

    verifyNotification();
    getVersion();

    function verifyNotification() {

        if (document.querySelector("#notificationAdminModal.show"))
            return countTimeVerifyNotification();

        if (!document.querySelector(".btn-notification-floating.active")) {
            if (stopNotificationMonitor)
                return;

            NotificationController.getNotificationBy({ "read": 0, "page": 1 }).then(({ status, response }) => {
                if (!status)
                    return swal('Erro ao listar notificações', 'Contate o suporte', 'info');

                if (response == null)
                    return countTimeVerifyNotification();

                if (response.data.length > 0)
                    elementProperty.addClass(".btn-notification-floating", "active");
            });
        }
    }

    elementProperty.addEventInElement("#btnNotificationFloatingView", "onclick", function () {
        preload(true);
        this.classList.remove("active");
        const cityId = Session.getLocal('citySelected').cityId;
        NotificationController.getNotificationBy({ "read": 0, "page": 1 }).then(async ({ status, response }) => {
            countTimeVerifyNotification();
            $('#notificationAdminModal').modal('show');
            document.querySelector("#listNotificationAdmin").innerHTML = createListNotificationAdmin(response);
            initEventsNotificationAdmin();
        }).finally(() => {
            preload(false);
        });

    });

    elementProperty.addEventInElement("#applyFilterNotificationAdmin", "onclick", function () {
        const valueGroup = document.querySelector("#groupNotificationAdmin").value;
        const valueRead = document.querySelector("input[name='typeStatusReadNotification']:checked").value;

        paramsSelectedNotification.userGroupId = valueGroup === '' ? null : valueGroup;
        paramsSelectedNotification.read = valueRead === '' ? null : valueRead;

        preload(true);

        NotificationController.getNotificationBy({ "page": 1, ...paramsSelectedNotification }).then(({ status, response }) => {
            $('#filterNotification').modal('hide');
            countTimeVerifyNotification();
            $('#notificationAdminModal').modal('show');
            document.querySelector("#listNotificationAdmin").innerHTML = createListNotificationAdmin(response);
            initEventsNotificationAdmin();
        }).finally(() => {
            preload(false);
        });

    });

    function initEventsNotificationAdmin() {
        elementProperty.addEventInElement("#showMoreNotification", "onclick", function () {
            const response = this.getAttribute("response");
            preload(true);

            const filters = Object.keys(paramsSelectedNotification).filter(key => {
                return paramsSelectedNotification[key] != null;
            }).map(key => {
                return `${key}=${paramsSelectedNotification[key]}`;
            }).join("&");

            ConnectionServer.sendRequestCustomer(`${response}&${filters}`, "GET", null, ({ response }) => {
                this.parentElement.remove();
                document.querySelector("#listNotificationAdmin").innerHTML += createListNotificationAdmin(response);
                initEventsNotificationAdmin();
                preload(false);
            });
        });

        elementProperty.addEventInElement(".view-notification-admin", "onclick", function () {
            this.parentElement.parentElement.parentElement.parentElement.classList.add("read-notification-admin");
            this.style.visibility = "hidden";

            const id = JSON.parse(this.getAttribute("notification"));
            NotificationController.notificationView(id);
        });
    }

    function countTimeVerifyNotification() {
        setTimeout(() => {
            verifyNotification();
        }, 20000);
    }

    function removeAccents(text = "") {
        if(!text && text?.length === 0) return;
        return text?.normalize('NFD')?.replace(/[\u0300-\u036f]/g, '');
    }

    function createListNotificationAdmin(response) {
        if (response == null)
            return `<div style="display: block;text-align: center">Sem notificação</div>`;
        let list =
            response.data.map(item => {
                return `<li class="list-group-item p-2 ${item.read == true ? "read-notification-admin" : ""}" >
                        <a href="#" class="item-notification-admin">
                            <div class="d-flex align-items-center">
                                <div class="w-25 d-flex align-items-center justify-content-center flex-column">
                                    <img src="${getImageNotification(item)}" onerror="this.src = '/webfiles/img/logo/logo.png'" class="rounded float-left" alt="..." width="60" height="60">
                                </div>
                                <div class="w-75">
                                    <h5 class="m-0" style="font-size: 13pt;font-width: 600;">${item.title.replace(/<\/?[^>]+(>|$)/g, "")}</h5>
                                    
                                    ${item.message}
                                </div>
                                ${item.read == true ? "" : `
                                <div class="w-auto">
                                        <button type="button" class="btn btn-primary view-notification-admin" notification='${item.id}'>Ok</button>
                                </div>
                                `}
                            </div>
                            ${removeAccents(item?.title) === removeAccents('BOTÃO DE PÂNICO') && item?.emergencyMonitoringTypeId === 6 && configAlertPhotoPanicButton && `
                                <video src="${item?.picture}" 
                                    controls
                                    title="Visualizar Vídeo"
                                    onclick="window.open('${item.picture}', '_blank')"
                                    style="width: 400px; height: 200px; border-radius: 10px; margin-top: 20px; cursor: pointer;"
                                    />
                            `}
                            <p class="m-0 mt-2 float-right small">${new Date(item.created_at).toLocaleString()}</p>
                        </a>
                    </li>`;
            }).join("");

        if (response.next_page_url) {
            list +=
                `<li  class="list-group-item p-2 d-flex justify-content-center">
                <button type="button" class="btn btn-link" id="showMoreNotification" response='${response.next_page_url}'>Mostrar mais</button>
                </li>`;
        }

        return list;
    }

    function getImageNotification(notification) {
        if (notification.user != null) {
            if (notification.userGroupId != 5) {
                return environment.hosts.hostImageDriver + notification.user.profileImage;
            } else {
                return environment.hosts.hostImageClient + notification.user.profileImage;
            }
        }

        return "/webfiles/img/logo/logo.png";
    }

    elementProperty.addEventInElement('#find-trip', 'onclick', function () {
        // let name = this.getAttribute('name');
        window.location.href = '/monitor/monitoring/' + namedriver;
    });

    elementProperty.addEventInElement('#open-trip', 'onclick', function () {
        let trip = this.getAttribute('trip');
        window.location.href = `/trip/${trip}/details`;
    });

    elementProperty.getElement('#version-monitor', that => {
        that.innerHTML = environment.hosts.version;
    });

    elementProperty.addEventInElement(".menu-option-item", "onclick", function () {

        if (this.classList.contains("active")) {
            this.classList.remove("active");
        } else {

            elementProperty.getElement(".menu-option-item", element => {
                element.classList.remove("active");
            });

            this.classList.add("active");
        }
    });

    elementProperty.addEventInElement("#openMenu", "onclick", function () {
        elementProperty.getElement(".container-nav-menu", element => {
            if (!element.classList.contains("active")) {
                element.classList.add("active");
                this.innerHTML = "close";
                return;
            }

            this.innerHTML = "menu";
            element.classList.remove("active");
        });
    });
    getCities()
    function getCities(){
        var cities = Session.getLocal64("cities")

        if(cities?.length > 0) {
            showCities(cities)
        } else {
            CityController.getActives().then(({ status, data }) => {
                if (!status)
                    return;
        
                Session.setLocal64("cities", data.map((city) => {
                    return {
                        cityId: city.cityId,
                        nome: city.nome,
                        shortName: city.shortName,
                        polygon: city.polygon,
                    };
                }));
        
                showCities(data);
            });
        }
    }

    function showCities(data) {
        elementProperty.getElement("#citySelectedMonitor", element => {
            element.innerHTML = data.map(city => {

                const isSelect = Session.getValueInSessionLocal("citySelected", "cityId") === city.cityId ?
                    "selected" : "";

                return `<option value='${JSON.stringify(city)}' ${isSelect}>${city.nome !== city.shortName ? city.shortName : city.nome}</option>`;
            }).join("");

            elementProperty.addEventInElement("#citySelectedMonitor", "onchange", function () {
                const city = JSON.parse(this.value);
                Session.setLocal("citySelected", city);
                Session.setLocal("pointsCity", getPathByPolygon(city.polygon));

                location.reload();
            });

            $('#citySelectedMonitor').select2({
                placeholder: "Selecione uma cidade",
                allowClear: true
            });
        });
    }

    function getPathByPolygon(stringPolygon) {
        stringPolygon = stringPolygon.replace("POLYGON((", "").replace("))", "");

        return stringPolygon.split(",").map((locationString) => {
            const location = locationString.split(" ");

            return { lat: parseFloat(location[0]), lng: parseFloat(location[1]) };
        });
    }

    elementProperty.addEventInElement("#logoutMenu", "onclick", function () {
        Session.deleteLocal("citySelected");
        Session.deleteLocal("pointsCity");
        const quantityRoles = Session.get("roles-length");

        for (let i = 0; i <= quantityRoles; i++) {
            Session.delete(`roles-${i}`);
        }
        Session.delete("roles-length");
        Session.delete("nameRole");
        localStorage.removeItem("@roles");

        location.href = '/logout';
    });


    elementProperty.addEventInElement(".menu-option", "onclick", function (event) {
        console.log(event);
        if (this.classList.contains("active")) {
            this.classList.remove("active");
        } else {

            elementProperty.getElement(".menu-option", element => {
                element.classList.remove("active");
            });

            this.classList.add("active");
        }
    });

    elementProperty.addEventInElement(".advanced-menu", "onclick", function () {
        if (this.classList.contains("active")) {
            this.classList.remove("active");
        } else {
            SwalCustom.dialogConfirmCustom("Atenção", `Alterações feitas nesta área sem conhecimento técnico podem alterar seriamente o funcionamento de seu Apps ou até desabilitar funções essenciais.`,
                {
                    yes: {
                        text: "SEGUIR!",
                        value: true,
                    },
                    no: {
                        text: "VOLTAR",
                        value: false,
                    },
                })
                .then(status => {
                    if (status)
                        this.classList.add("active");
                });
        }
    });

    function resetBalanceDrivers() {
        return new Promise(resolve => {
            ConnectionServer.sendRequest(
                'resetBalance/driver',
                'POST',
                {},
                resolve,
                undefined,
                true
            );
        });
    }

    elementProperty.addEventInElement('#reset-balance-drivers', 'onclick', function () {
        SwalCustom.dialogConfirm('Cuidado !', 'Essa função ZERA O SALDO DE TODOS OS MOTORISTAS DA CIDADE', (status) => {
            if (!status)
                return;
            preload(true);
            resetBalanceDrivers().then(status => {
                preload(false);
                if (!status)
                    return SwalCustom.messageDialog('Tente novamente', 'Ops.. Ocorreu um erro ao zerar os saldos!', 'error');

                SwalCustom.messageDialog('', 'Saldos zerados com sucesso!', 'success').then(() => {
                    window.location.reload(true);
                });
            });
        });
    });

    function resetNoteDrivers() {
        return new Promise(resolve => {
            ConnectionServer.sendRequest(
                'driver/resetRating',
                'PUT',
                {},
                resolve,
                undefined,
                true
            );
        });
    }

    elementProperty.addEventInElement('#reset-note-drivers', 'onclick', function () {
        SwalCustom.dialogConfirm('Essa função RESETA A NOTA DE TODOS OS MOTORISTAS DA CIDADE', 'Deseja continuar?', (status) => {
            if (!status)
                return;
            preload(true);
            resetNoteDrivers().then(status => {
                preload(false);
                if (!status)
                    return SwalCustom.messageDialog('Tente novamente', 'Ops.. Ocorreu um erro ao resetar as notas!', 'error');

                SwalCustom.messageDialog('', 'Notas resetadas com sucesso!', 'success').then(() => {
                    window.location.reload(true);
                });
            });
        });
    });


    elementProperty.addEventInElement(".clear-cache", "onclick", function () {
        if (this.classList.contains("active")) {
            this.classList.remove("active");
        } else {
            SwalCustom.dialogConfirmCustom("Atenção", ` Ao realizar o processo o usuário será deslogado do sistema.`,
                {
                    yes: {
                        text: "SEGUIR!",
                        value: true,
                    },
                    no: {
                        text: "VOLTAR",
                        value: false,
                    },
                })
                .then(status => {
                    if (status) {
                        cookieStore.getAll().then(cookies => cookies.forEach(cookie => {
                            cookieStore.delete(cookie.name);
                        }));
                        window.location.reload(true);
                    }

                });
        }
    });
})