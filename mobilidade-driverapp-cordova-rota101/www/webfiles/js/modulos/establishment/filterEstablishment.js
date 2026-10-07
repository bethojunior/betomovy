$(document).ready(() => {

    let checkClass;
    preload(true);

    window.addEventListener('keyboardDidShow', function(){

        document.getElementById("btnSendIndication").style.display = "none";

        elementProperty.getElement("#listTop3Hostel" , element =>{
            if(element.classList.contains("active")){
                element.classList.remove("active");
                checkClass = true;
            }
        });

    });


    window.addEventListener('keyboardDidHide', function () {

        document.getElementById("btnSendIndication").style.display = "block";

        if(checkClass){
            elementProperty.getElement("#listTop3Hostel" , element => {
                element.classList.add("active");
            });
        }



        elementProperty.getElement("#listTop3Hostel" , element =>{
            if(element.classList.contains("active")){
                elementProperty.getElement("#hostelIndication" , element => {
                    element.style.display = "none";
                });
            }
        });

        if(document.getElementById("formThisPage").style.display === "block"){
            elementProperty.getElement("#listTop3Hostel" , element =>{
                if(element.classList.contains("active")){
                    elementProperty.getElement("#hostelIndication" , element => {
                        element.style.display = "none";
                    });
                }
            });
        }

    });

    var chooseHostel = false;

    var cityId;

    const elementProperty = new ElementProperty();

    const userLogged = Session.get("user");

    const cityController = new CityController();

    const neighborhoodController = new NeighborhoodController();

    const clientController = new ClientController();

    elementProperty.addEventInElement(".star-classification", "onclick", function () {
        setEstablishmentClassification(parseInt(this.getAttribute("index")));
        chooseHostel = false;
    });


    function setEstablishmentClassification(value) {
        elementProperty.getElement(".star-classification", elementStart => {
            elementStart.classList.remove("active");

            if (parseInt(elementStart.getAttribute("index")) <= value)
                elementStart.classList.add("active");
        });
    }

    $('ul.tabs').tabs();

    Mask.setMaskPhone("#phoneWhats");
    Mask.setMaskPhone("#phoneMessage");

    cityController.getCities().then(result => {
        let listHosteis = "";
        const autocompleteCity = new Autocomplete();

        autocompleteCity.initAutocomplete("#autocompleteCity", result.data, "nome", ["nome"]);

        autocompleteCity.getItemSelected(city => {
            neighborhoodController.getAllByCity(city.cityId).then(result => {
                const neighborhoods = [];
                result.data.neighborhoods.map(item => {
                    neighborhoods.push({name: item});
                });

                setPriceMinMax(result.data.price);

                const neighborhoodCity = new Autocomplete();

                neighborhoodCity.initAutocomplete("#autocompleteNeighborhood", neighborhoods, "name", ["name"]);
            });
        });

        autocompleteCity.setSelectedItem(userLogged.cityId,"cityId");
        cityId = userLogged.cityId;

        EstablishmentController.GetByCommissionValue(userLogged.cityId).then(response => {

            if(response.status){
                response.data.map(item => {
                    listHosteis += `
                        <div class="col s12 marginCardHostel" value="${item.idEstablishment}" dataName="${item.fantasyName}">
                            <div class="col s4">
                                <img class="imgHostel" src="https://s-ec.bstatic.com/images/hotel/max1280x900/101/101430248.jpg">
                            </div>
                            <ul class="col s8">
                                <li class="limitName"><b>${item.fantasyName}</b></li>
                                <li>${item.neighborhood}</li>
                                <li>${CityConfig.getTypeCoin()}${item.minDailyRate}</li>
                            </ul>
                        </div>
                    `;
                });
                document.getElementById("listTop3Hostel").innerHTML = listHosteis;
                loadClickHostel();
                preload(false);
            }
        });

    });

    function setPriceMinMax(prices) {
        elementProperty.getElement(".min-value-establishment", element => {
            element.innerHTML = `${CityConfig.getTypeCoin()} ` .concat(Mask.maskMoney(parseFloat(prices.minDailyRate)));
        });

        elementProperty.getElement(".max-value-establishment", element => {
            element.innerHTML = `${CityConfig.getTypeCoin()} ` .concat(Mask.maskMoney(parseFloat(prices.maxDailyRate)));
        });

        elementProperty.getElement(".range-custom", element => {
            element.setAttribute("min", prices.minDailyRate);
            element.setAttribute("max", prices.maxDailyRate);
        });
    }

    elementProperty.addEventInElement(".btn-filter-establishment", "onclick", function () {

        elementProperty.getElement("#hostelIndication" , element => {
            element.style.display = "block";
        });
        elementProperty.getElement("#listTop3Hostel" , element => {
            element.classList.remove("active");
        });
        elementProperty.getElement(".footer-arrow-hostel", element=>{
            element.classList.remove("openHosteis");
        })

        const tabActive = $("ul.tabs li a.active")[0];
        const shareType = tabActive.href.split("#")[1];

        const userData = {
            bairro: document.getElementById("autocompleteNeighborhood").value,
            driverId: userLogged.idDriver,
            price: document.getElementById("establishmentPrice").value,
            phone: document.getElementById("phoneMessage").value,
            data : DateCustom.getNow()
        };

        switch (shareType) {
            case "numberWhats" : {

                if(document.getElementById("phoneWhats").value !== "") {
                    userData.phone = document.getElementById("phoneWhats").value.replace(/[^\d]+/g, '');

                    if(!chooseHostel){
                        clientController.shareByWhatsapp(false , userData , null);
                        return
                    }


                    clientController.shareByWhatsapp(true , HOST_HOSTEL+chooseHostel , userData.phone);
                    break;
                }
                Materialize.toast("Digite um número para enviar" , 2000);
                return;
            }
            case "numberPhone" : {
                userData.phone = document.getElementById("phoneMessage").value.replace(/[^\d]+/g, '');

                if(!chooseHostel) {
                    clientController.shareBySMS(true, userData, null, function () {
                        SwalCustom.messageDialog("Messagem foi enviada para o cliente", "Atenção", function () {
                            window.history.back();
                        }, "success");
                    });
                }

                clientController.shareBySMS(userData, function () {
                    SwalCustom.messageDialog("Messagem foi enviada para o cliente", "Atenção", function () {
                        window.history.back();
                    }, "success");
                });
                break;
            }
            case "emailClient" : {

                if(!chooseHostel) {
                    clientController.sendIndicationEmail(true, userData, null, function (result) {
                        if (!result.status) {
                            SwalCustom.messageDialog(result.message, function () {
                                window.history.back();
                            }, "info");
                            return;
                        }
                    });
                }

                userData.email = document.getElementById("emailClientShared").value.replace(/[^\d]+/g, '');
                clientController.sendIndicationEmail(userData, result => {
                    if (!result.status) {
                        SwalCustom.messageDialog(result.message, function () {
                            window.history.back();
                        }, "info");
                        return;
                    }
                    SwalCustom.messageDialog("E-mail foi enviado para o cliente", "Atenção", function () {
                        window.history.back();
                    }, "success");
                });
                break;
            }
        }

    });

    elementProperty.addEventInElement(".link-back","onclick",function(){
        Route.backPage();
    });

    function loadClickHostel() {
        elementProperty.addEventInElement(".marginCardHostel" , "onclick" , function (){

            if(this.classList.contains("hostelSelect")){
                this.classList.remove("hostelSelect");
                chooseHostel = false;

                return;
            }

            clearSelect();

            this.classList.add("hostelSelect");
            chooseHostel = this.getAttribute("value");
            Materialize.toast("Hotel "+this.getAttribute("dataName")+" escolhido" , 1000);

            elementProperty.getElement("#hostelIndication" , element => {
                element.style.display = "block";
            });

            elementProperty.getElement("#formThisPage" , element => {
                element.style.display = "block";
            });

            elementProperty.getElement("#listTop3Hostel" , element => {
                element.classList.remove("active");
            });

        });
    }

    function clearSelect(){
        elementProperty.getElement(".marginCardHostel" , element => {
            element.classList.remove("hostelSelect");
        });
    }


    elementProperty.addEventInElement(".footer-arrow-hostel", "onclick" , function(){

        elementProperty.getElement("#formThisPage" , element => {
            element.style.display = "none";
        });

        if(this.classList.contains("openHosteis")){
            this.classList.remove("openHosteis");
            elementProperty.getElement("#listTop3Hostel" , element => {
                element.classList.remove("active");
            });
            return;
        }
        document.getElementById("hostelIndication").style.display = "none";
        elementProperty.getElement("#listTop3Hostel" , element => {
            element.classList.add("active");
        });

        this.classList.add("openHosteis");

    });

    elementProperty.getElement("#listTop3Hostel" , element =>{
        if(element.classList.contains("active")){
            elementProperty.getElement("#hostelIndication" , element => {
                element.style.display = "none";
            });
        }
    });

});
