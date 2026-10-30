document.addEventListener("DOMContentLoaded", function () {
    
    const elementProperty = new ElementProperty();
    const favoriteDriver = new FavoriteDriver();

    let preferenceDrivers = [];
    let activeFilter = null; // null = todos | 'favorite' | 'disponivel' | 'corrida' | 'desligado'

    events();

    function driverStatusInfo(status) {
        switch (status) {
            case 'disponivel':
                return { label: 'Disponível', className: 'driver-status--available' };
            case 'corrida':
                return { label: 'Em corrida', className: 'driver-status--in_trip' };
            case 'desligado':
                return { label: 'Desligado', className: 'driver-status--off' };
            default:
                return { label: status || '', className: 'driver-status--off' };
        }
    }

    function isDriverOnline(data) {
        return data.status === 'disponivel';
    }

    function mountCard(element, data) {
        const isFavorite = data.isFavorite ? '#f59e0b' : '#b5b5b5'
        const status = driverStatusInfo(data.status);
        const avatar = data.profileImageUrl
            ? `<img class="rounded-circle" src="${data.profileImageUrl}" width="55px" height="55px" alt="Foto motorista">`
            : `<div class="driver-avatar-fallback"><i class="material-icons">person</i></div>`;

        element.innerHTML += `
            <div class="d-flex">
                <div class="driver-card" favorite="${data.isFavorite}" status="${data.status}" id="${data.idDriver}">
                    ${avatar}
                    <div>
                        <p>${data.name}</p>
                        <p>${data.phone}</p>
                        <p class="driver-card__meta">
                            <span class="driver-card__code">Código: ${Driver.code(data)}</span>
                            <span class="driver-status ${status.className}">
                                <span class="driver-status__dot"></span>${status.label}
                            </span>
                        </p>
                    </div>
                </div>
                <i style="color: ${isFavorite}" class="material-icons star-icon action-${data.idDriver}">star</i>
            </div>
            `

        // Só pode ir selecionado pra chamada personalizada quem está online — offline/em corrida não recebem chamado
        data.isFavorite != 0 && isDriverOnline(data)
        ? (preferenceDrivers.push(JSON.stringify(data.idDriver)), elementProperty.addClass(`#${data.idDriver}`, "active"))
        : elementProperty.removeClass(`#${data.idDriver}`, "active");
    }

    function favoriteDriverRequest(data) {
        preload(true);
        FavoriteDriver.updateFavoriteDriver(data).then(({status, message}) => {
            preload(false);
            if(!status)
                return SwalCustom.messageDialog('', message, () =>{}, 'error');
            
            getDiversToList();
            return SwalCustom.messageDialog('', message, () =>{}, 'success');
        })
    }

    function showMore(res, page = 1) {
        const central = Session.get("centralSelected");
        viewController.elementProperty.getElement('.show-more', element => {
            res.response.next_page_url 
            ? element.innerHTML = ` <button type="button" class="btn btn-primary" id="nextPage">Mostar mais</button>`
            : element.innerHTML = '';
        })

        elementProperty.addEventInElement("#nextPage", "onclick", function() {
            if(res.response.last_page > page) {
                page = page + 1
                preload(true);
                FavoriteDriver.listActives(central.id, page, activeFilter).then((res) => {
                    preload(false);
                    viewController.elementProperty.getElement(".scroll-modal", element => {
                        res.response.data.map(async (data) => {
                            await mountCard(element, data);
                            addEventsCard(data);
                        })
                    });
                    res.response.last_page > page 
                    ? '' 
                    : document.querySelector('.show-more').innerHTML = '';
                })
            } else {
                document.querySelector('.show-more').innerHTML = '';
            }
        });

    };

    
    function getDiversToList() {
        $("#collapseRegister").collapse('hide');
        preferenceDrivers = [];
        const central = Session.get("centralSelected");
        preload(true);
        FavoriteDriver.listActives(central.id, 1, activeFilter).then((res) => {
            preload(false);
            if(!res.status)
            return SwalCustom.messageDialog('', 'Erro ao buscar motorista ativos', () =>{}, 'error');

            $('#drivers-active-modal').modal('show');

            viewController.elementProperty.getElement(".scroll-modal", element => {
                element.innerHTML = '';

                if (res.response.data.length === 0) {
                    element.innerHTML = `<p class="drivers-empty-state">Nenhum motorista disponível no momento.</p>`;
                    document.querySelector('.show-more').innerHTML = '';
                    return;
                }

                res.response.data.map(async (data) => {
                    await mountCard(element, data);
                    addEventsCard(data);
                }).join('')
                Session.set('customTripList', JSON.stringify(preferenceDrivers))
            });

            showMore(res);
        });
    }

    // Exposta globalmente pra outras telas (ex: cadastro de motorista) atualizarem essa lista sem fechar/reabrir a modal
    window.refreshActiveDriversList = getDiversToList;

    function addEventsCard(data) {
        elementProperty.addEventInElement(`#${data.idDriver}`, "onclick", function() {
            if (!isDriverOnline(data)) return;

            viewController.elementProperty.getElement(`#${data.idDriver}`, card => {
                const rawList = Session.get('customTripList');
                let idsList = Array.isArray(rawList)
                  ? rawList
                  : (typeof rawList === 'string' && rawList
                      ? (() => { try { const p = JSON.parse(rawList); return Array.isArray(p) ? p : []; } catch (e) { return []; } })()
                      : []);
                
                if(card.classList.contains("active")) {
                    const removeId = idsList.filter((res) => {
                        return res !== card.id 
                    });
                    Session.set('customTripList', removeId)
                    return elementProperty.removeClass(`#${card.id}`, "active");
                }
                idsList.push(card.id);
                Session.set('customTripList', idsList);
            elementProperty.addClass(`#${card.id}`, "active");
            });
        });

        elementProperty.addEventInElement(`.action-${data.idDriver}`, "onclick", function() {
            viewController.elementProperty.getElement(`#${data.idDriver}`, card => {
                const isFavorite = card.getAttribute('favorite')
                SwalCustom.dialogConfirm(isFavorite == '0' 
                ? "Deseja favoritar esse motorista?" 
                : "Deseja remover esse motorista dos favoritos?").then(() => {
                    const removeFavorite = isFavorite == '1' ? 0 : 1
                    const request = {
                        centralId: central.id,
                        driverId: card.id,
                        isFavorite: removeFavorite
                    };

                    favoriteDriverRequest(request);
                }); 
            });
        });
    }

    function driverFavoriteIsEnable() {
        const key = 'enable_favorite_driver_central';
        ConfigRepository.getConfigBykey(key).then((res) => {
            viewController.elementProperty.getElement(".switch-type-trip", element => {
                res.response == '0'
                ? document.getElementById('list-active-drivers').remove()
                : document.getElementById('list-active-drivers').style.display = ''
            });

            elementProperty.addEventInElement("#list-active-drivers", "onclick", function() {
                getDiversToList()
            })
        })
    }

    // Filtro único (todos/favorito/online/ocupado/offline). Cada clique só seleciona aquele filtro.
    function selectFilter(filter) {
        activeFilter = filter || null;

        document.querySelectorAll('.drivers-filter-toggle-btn').forEach(button => {
            button.classList.toggle('active', button.dataset.filter === (filter || ''));
        });

        getDiversToList();
    }

    function bindFilterButtons() {
        document.querySelectorAll('.drivers-filter-toggle-btn').forEach(button => {
            button.onclick = () => selectFilter(button.dataset.filter);
        });
    }

    function events() {
        driverFavoriteIsEnable();
        bindFilterButtons();
    }
})