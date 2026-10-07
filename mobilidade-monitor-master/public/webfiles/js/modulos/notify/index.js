document.addEventListener("DOMContentLoaded", function () {

    preload(true);

    let initValues = [listCities, listUserTypes, renderListNotification];
    let allCities = [];
    let debounceTimer = null;

    function getURLBucket(){
        const arrayString = environment.hosts.hostImageClient.split("/");
        arrayString.splice(-4);
        return arrayString.join("/")+"/";
    }

    Promise.all([
        CityController.getActives(),
        UserTypeController.getActives(),
        getListNotification()
    ]).then((values) => {
        initValues.map((callback, index) => callback(values[index]));
        preload(false);
    });


    function getListNotification(page = 1) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`notification?page=${page}`, "GET", null, resolve, reject, true);
        })
    }

    function renderListNotification({response}) {
        document.querySelector("#listNotification").innerHTML = response.data.map(data => {
            return `<tr>
                        <td><p class="delimit-line" title="${data.title}">${data.title}</p></td>
                        <td><p class="delimit-line" title="${data.message}">${data.message}</p></td>
                        <td>${data.link ? `<a href="${data.link}" target="_blank">Ver</a>` : "-"}</td>
                        <td>${data.image ? `<a href="${`${getURLBucket()}${data.image}`}" target="_blank">Ver</a>` : "-"}</td>
                        <td>
                            <button type="button" class="btn btn-secondary button-tooltip btn-sm" 
                                data-toggle="bottom" 
                                data-placement="bottom" 
                                title="${data.notification_user_types.length > 0 ? data.notification_user_types.map(item => item.userType).join("\n") : "Não informado"}">
                                Usuários
                            </button>
                        </td>
                        <td>${data.city ? data.city.nome : 'Todas'}</td>
                        <td>
                            <button type="button" class="btn btn-link btn-sm remove-notification" idNotification="${data.idNotification}">Excluir</button>
                        </td>
                    </tr>`;
        }).join("");

        $('.button-tooltip').tooltip({boundary: 'window'});

        if (response.prev_page_url) {
            elementProperty.removeClass(".prev-page", "disabled")
        } else {
            elementProperty.addClass(".prev-page", "disabled")
        }

        if (response.next_page_url) {
            elementProperty.removeClass(".next-page", "disabled")
        } else {
            elementProperty.addClass(".next-page", "disabled")
        }

        elementProperty.addEventInElement(".next-page", "onclick", () => {
            preload(true);
            getListNotification(response.current_page + 1).then(renderListNotification).finally(() => preload(false));
        });

        elementProperty.addEventInElement(".prev-page", "onclick", () => {
            preload(true);
            getListNotification(response.current_page - 1).then(renderListNotification).finally(() => preload(false));
        });

        elementProperty.addEventInElement(".remove-notification", "onclick", function () {
            SwalCustom.dialogConfirm("Deseja remover essa notificação", "", status => {
                if (status) {
                    ConnectionServer.sendRequest(`notification/${this.getAttribute("idNotification")}`, "DELETE", null, () => {
                        preload(true);
                        getListNotification().then(renderListNotification).finally(() => preload(false));
                    },()=> { preload(false)},true);
                }
            });
        });
    }

    function listCities({data}) {
        allCities = data;
        setupCitySearch();
    }

    function updateCitiesDropdown(cities, showAll = false) {
        const dropdown = document.querySelector("#citiesDropdown");
        const loading = document.querySelector("#citiesLoading");
        
        loading.classList.add('cities-loading-hidden');
        
        if (cities.length === 0) {
            dropdown.innerHTML = '<div class="dropdown-item-text text-muted">Nenhuma cidade encontrada</div>';
        } else {
            dropdown.innerHTML = cities.map(city => 
                `<a class="dropdown-item city-option" href="#" data-city-id="${city.cityId}" data-city-name="${city.nome}">
                    ${city.nome}
                </a>`
            ).join("");
        }
        
        if (showAll || cities.length > 0) {
            dropdown.style.display = "block";
        }
    }

    function setupCitySearch() {
        const cityInput = document.querySelector("#citiesNotifySelected");
        const selectedCityId = document.querySelector("#selectedCityId");
        const dropdown = document.querySelector("#citiesDropdown");
        const loading = document.querySelector("#citiesLoading");
        
        cityInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase().trim();
            
            clearTimeout(debounceTimer);
            
            if (searchTerm.length === 0) {
                updateCitiesDropdown(allCities, true);
                selectedCityId.value = "";
                return;
            }
            
            loading.style.display = "block";
            dropdown.style.display = "none";
            
            debounceTimer = setTimeout(() => {
                const filteredCities = allCities.filter(city => 
                    city.nome.toLowerCase().includes(searchTerm)
                );
                updateCitiesDropdown(filteredCities, true);
            }, 300);
        });
        
        cityInput.addEventListener('focus', function() {
            if (this.value.trim().length === 0) {
                updateCitiesDropdown(allCities, true);
            } else {
                const searchTerm = this.value.toLowerCase().trim();
                const filteredCities = allCities.filter(city => 
                    city.nome.toLowerCase().includes(searchTerm)
                );
                updateCitiesDropdown(filteredCities, true);
            }
        });
        
        document.addEventListener('click', function(e) {
            if (!cityInput.contains(e.target) && !dropdown.contains(e.target)) {
                dropdown.style.display = "none";
            }
        });
                dropdown.addEventListener('click', function(e) {
            e.preventDefault();
            if (e.target.classList.contains('city-option')) {
                const cityId = e.target.getAttribute('data-city-id');
                const cityName = e.target.getAttribute('data-city-name');
                
                cityInput.value = cityName;
                selectedCityId.value = cityId;
                dropdown.style.display = "none";
            }
        });
        
        cityInput.addEventListener('keydown', function(e) {
            const items = dropdown.querySelectorAll('.city-option');
            let activeItem = dropdown.querySelector('.city-option.active');
            
            if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (!activeItem) {
                    items[0]?.classList.add('active');
                } else {
                    activeItem.classList.remove('active');
                    const nextItem = activeItem.nextElementSibling;
                    if (nextItem && nextItem.classList.contains('city-option')) {
                        nextItem.classList.add('active');
                    } else {
                        items[0]?.classList.add('active');
                    }
                }
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (!activeItem) {
                    items[items.length - 1]?.classList.add('active');
                } else {
                    activeItem.classList.remove('active');
                    const prevItem = activeItem.previousElementSibling;
                    if (prevItem && prevItem.classList.contains('city-option')) {
                        prevItem.classList.add('active');
                    } else {
                        items[items.length - 1]?.classList.add('active');
                    }
                }
            } else if (e.key === 'Enter') {
                e.preventDefault();
                if (activeItem) {
                    activeItem.click();
                }
            } else if (e.key === 'Escape') {
                dropdown.style.display = "none";
            }
        });
    }

    function listUserTypes({response}) {
        document.querySelector("#listUserTypesNotify").innerHTML += response.map(item => {
            return `<div class="form-check">
                      <input class="form-check-input checkbox-user-type" type="checkbox" value="${item.idUserType}" id="checkUserType${item.idUserType}">
                      <label class="form-check-label" for="checkUserType${item.idUserType}">
                        ${item.name}
                      </label>
                    </div>`
        }).join("");
    }


    elementProperty.addEventInElement("#openNewNotifyModal", "onclick", function () {
        elementProperty.getElement(".checkbox-user-type", element => {
            element.checked = false;
        });

        elementProperty.addEventInElement(".checkbox-user-type", "onchange", function () {
            countNumberUserType();
        });

        countNumberUserType();

        $("#newNotifyModal").modal("show")
    });

    elementProperty.addEventInElement("#openUserTypeModal", "onclick", function () {
        $("#userTypesModal").modal("show")
    });

    elementProperty.addEventInElement("#addNewNotify", "onclick", function () {

        if (document.querySelector("#title").value.length === 0)
            return alert("Informe o titula da notificação");

        if (document.querySelector("#message").value.length === 0)
            return alert("Informe a mensagem da notificação");

        if (document.querySelector("#selectedCityId").value.length === 0)
            return alert("Informe a cidade da notificação");


        const formData = new FormData();
        formData.append("title", document.querySelector("#title").value);
        formData.append("message", document.querySelector("#message").value);

        if (document.querySelector("#link").value.length > 0) {
            formData.append("link", document.querySelector("#link").value);
            formData.append("identifyUserInLink", document.getElementById('identifyUserInLink').checked ? 1 : 0);
        }

        if (document.querySelector("#imageNotify").files[0])
            formData.append("image", document.querySelector("#imageNotify").files[0]);

        formData.append("cityId", document.querySelector("#selectedCityId").value);

        for (let element of document.querySelectorAll(".checkbox-user-type:checked")) {
            formData.append("userTypes[]", element.value);
        }

        preload(true);

        ConnectionServer.sendRequestWithFiles("notification/store", "POST", formData, true)
            .then(({status, message}) => {
                SwalCustom.messageDialog("", message, status ? "success" : "info").then(()=>{
                    if(status){
                        clearModalFields();
                        preload(true);
                        getListNotification().then(renderListNotification).finally(() => preload(false));
                        $("#newNotifyModal").modal("hide")
                    }
                });
                preload(false);
            })
    });

    function countNumberUserType() {
        document.querySelector("#countUserType").innerHTML = `${document.querySelectorAll(".checkbox-user-type:checked").length}`;
    }

    elementProperty.addEventInElement("#saveTypeUser", "onclick", function () {
        if (document.querySelectorAll(".checkbox-user-type:checked").length === 0)
            return alert("Informe pelo menos um tipo de usuário");

        $("#userTypesModal").modal('hide')
    });

    function clearModalFields() {
        document.querySelector("#title").value = "";
        document.querySelector("#message").value = "";
        document.querySelector("#link").value = "";
        document.querySelector("#identifyUserInLink").checked = false;
        document.querySelector("#imageNotify").value = "";
        document.querySelector("#citiesNotifySelected").value = "";
        document.querySelector("#selectedCityId").value = "";
    }
});