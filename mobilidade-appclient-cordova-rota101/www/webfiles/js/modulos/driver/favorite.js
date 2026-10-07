viewController.setObserver("list-favorites-driver", function (data) {

    const elementProperty = new ElementProperty();

    const driverController = new DriverController();

    const favoriteDriverController = new FavoriteDriverController();

    const userLogged = Session.get("user");

    updateListFavorite();

    if(!Array.isArray(data))
        getDriverByCode(data.idDriver);

    const favorite = {
        driverId: null,
        size: 0
    };

    elementProperty.addEventInElement("#btnAddFavorite", "onclick", function () {
        if (favorite.size >= 3) {
            SwalCustom.messageDialog("", "Você só pode ter até 3 motoristas como favoritos!", undefined, "warning");
            return;
        }
        elementProperty.addClass(".modal-add-driver-favorite", "active");
    });

    elementProperty.addEventInElement("#cancelAddFavorite", "onclick", function () {
        elementProperty.removeClass(".modal-add-driver-favorite", "active");
    });

    elementProperty.addEventInElement("#addDriverFavorite", "onclick", function () {

        const text = document.getElementById("codeDriveFavorite").value;

        if (text.length <= 0) {
            SwalCustom.messageDialog("", "Informe o código do motorista", undefined, "warning");
            return;
        }

        if (!validateCode(text.toUpperCase())) {
            SwalCustom.messageDialog("", "Código inválido", undefined, "warning");
            return;
        }

        const code = text.replace(/[^0-9]/g, "");

        getDriverByCode(code);

    });

    function getDriverByCode(code){
        preload(true);
        driverController.getDriverById(code)
            .then(({status, data}) => {
                preload(false);
                if (!status) {
                    SwalCustom.messageDialog("", "Código inválido", undefined, "warning");
                    return;
                }
                favorite.driverId = parseInt(code);
                document.getElementById("codeDriveFavorite").value = "";
                showDriverData(data);
            }).catch(() => {
            preload(false);
        })
    }

    elementProperty.addEventInElement(".close-modal-confirmation-driver-favorite", "onclick", function () {
        elementProperty.removeClass(".container-confirmation-driver-favorite", "active");
    });

    elementProperty.addEventInElement("#addFavoriteDriver", "onclick", function () {
        preload(true);
        favoriteDriverController.insert(parseInt(userLogged.idCustomer), favorite.driverId)
            .then(({status, data}) => {
                preload(false);
                if (!status) {
                    SwalCustom.messageDialog("",
                        "Não foi possível adicionar o motorista aos favoritos", undefined, "warning");
                    return;
                }

                elementProperty.removeClass(".container-confirmation-driver-favorite", "active");
                updateListFavorite();
            }).catch(() => {
            preload(false);
        });
    });

    function showDriverData(data) {
        const config = Session.get("configGeneral");
        const picturesLink = config.find(item => {
            return item.key === 'link_storage_pictures';
        });
            
        const finalLink = `${picturesLink.value}driver/profile/compressed/`;

        elementProperty.getElement(".name-driver-favorite-add", element => {
            element.innerHTML = data.name;
        });
        elementProperty.getElement(".profile-add-favorite", element => {
            element.style.backgroundImage = `url(${finalLink}${data.profileImage})`;
        });

        elementProperty.removeClass(".modal-add-driver-favorite", "active");
        elementProperty.addClass(".container-confirmation-driver-favorite", "active");
    }

    viewController.onBack(function () {
        elementProperty.removeClass(".modal-add-driver-favorite", "active");
        elementProperty.removeClass(".container-confirmation-driver-favorite", "active");
        favorite.customerId = null;
        favorite.driverId = null;

    });


    function updateListFavorite() {
        preload(true);

        favoriteDriverController.list(parseInt(userLogged.idCustomer)).then(({status, data}) => {
            preload(false);
            if (!status) {
                SwalCustom.dialogConfirm("Não foi possível pegar a listagem de motoristas " +
                    "favoritos", "", "warning").then(updateListFavorite);
                return;
            }

            Session.set("favorites",data);

            elementProperty.getElement("#listFavoriteDriver", element => {
                element.innerHTML = data.map(driver => {
                    const config = Session.get("configGeneral");
                    const picturesLink = config.find(item => {
                        return item.key === 'link_storage_pictures';
                    });
                        
                    const finalLink = `${picturesLink.value}driver/profile/compressed/`;

                    return `<li>
                                <img style="background-image: url('${finalLink}${driver.driverImage}')">
                                <div>
                                    <div class="name-driver">${driver.driverName}</div>
                                    <div class="plate-driver">${driver.plate === null ? "NÃO INFORMADO" : driver.plate}</div>
                                    <i class="material-icons delete-favorite" value="${driver.idFavorite}">close</i>
                                </div>
                            </li>`;
                }).join("");

                favorite.size = data.length;

                for (let i = data.length - 1; i < 2; i++) {
                    element.innerHTML += `<li>
                        <img>
                        <div>
                            <div class="name-driver"></div>
                            <div class="plate-driver"></div>
                        </div>
                    </li>`;
                }

                elementProperty.addEventInElement(".delete-favorite", "onclick", deleteFavorite);
            });
        }).catch(() => {
            preload(false);
        });
    }

    function validateCode(value) {
        return /(([A-Z]){2})+(([0-9]){5})+(([A-Z]){1})/g.test(value)
    }

    function deleteFavorite() {
        const id = parseInt(this.getAttribute("value"));

        SwalCustom.dialogConfirm("Deseja remover o motorista ?", "", "info").then(function () {
            preload(true);

            favoriteDriverController.delete(id).then(({status, data}) => {
                preload(false);
                if (!status) {
                    SwalCustom.messageDialog("", "Não foi possivel remove o motorista", undefined, "warning");
                    return;
                }
                updateListFavorite()
            }).catch(() => {
                preload(false);
            })
        });
    }

    elementProperty.addEventInElement(".go-back","onclick",function(){
        Route.backPage();
    });
});