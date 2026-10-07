document.addEventListener("DOMContentLoaded",function(){
    const elementProperty = new ElementProperty();

    const managerRate = {
        rates:[],
        typeRateSelected:null
    };

    createTypes();

    updateListPrices();

    function updateListPrices(){
        CentralRepository.getPrices(Session.getValueInSession("centralSelected", "id"))
            .then(({response})=>{
                managerRate.rates = response;
            })
    }

    elementProperty.addEventInElement("#tripTypeId","onchange",function(){
        const rate = managerRate.rates.filter((type)=>{
            return parseInt(type.tripTypeId) === parseInt(this.value);
        });

        if(rate.length > 0 ){
            managerRate.typeRateSelected = rate[0];
            fillForm();
        }else{
            managerRate.typeRateSelected = null;
            clearForm();
        }
    });

    function createTypes() {
        TripRepository.getTripType().then(({status, response}) => {
            if (!status)
                return;

            elementProperty.getElement("#tripTypeId", element => {
                element.innerHTML = `<option value="" disabled selected>Selecione o tipo de tarifa</option>`;
                element.innerHTML += response.map(tripType => {
                    return `<option value="${tripType.idTripType}">${tripType.type}</option>`;
                })
            });
        });
    }

    Mask.setMoneyField(".input-value-price");

    function fillForm(){
        document.getElementById("tripTypeId").value = managerRate.typeRateSelected.tripTypeId;
        document.getElementById("tag").value = managerRate.typeRateSelected.tag;
        document.getElementById("color").value = managerRate.typeRateSelected.color;
        document.getElementById("min_price").value = Mask.maskMoney(managerRate.typeRateSelected.min_price);
        document.getElementById("base_price").value = Mask.maskMoney(managerRate.typeRateSelected.base_price);
        document.getElementById("km_price").value = Mask.maskMoney(managerRate.typeRateSelected.km_price);
        document.getElementById("minute_price").value = Mask.maskMoney(managerRate.typeRateSelected.minute_price);
        document.getElementById("tax_price").value = Mask.maskMoney(managerRate.typeRateSelected.tax_price);
        document.getElementById("another_fee").value = Mask.maskMoney(managerRate.typeRateSelected.another_fee);
        document.getElementById("waypoint_price").value = Mask.maskMoney(managerRate.typeRateSelected.waypoint_price);
    }

    function clearForm(){
        document.getElementById("tag").value = '';
        document.getElementById("color").value = '';
        document.getElementById("min_price").value = '0,00';
        document.getElementById("base_price").value = '0,00';
        document.getElementById("km_price").value = '0,00';
        document.getElementById("minute_price").value = '0,00';
        document.getElementById("tax_price").value = '0,00';
        document.getElementById("another_fee").value = '0,00';
        document.getElementById("waypoint_price").value = '0,00';
    }

    elementProperty.addEventInElement("#saveRate","onclick",function(){
        const rate = {
            centralId: Session.getValueInSession("centralSelected", "id"),
            tripTypeId: document.getElementById("tripTypeId").value,
            tag: document.getElementById("tag").value,
            color: document.getElementById("color").value,
        };

        if(rate.tripTypeId.length === 0){
            SwalCustom.messageDialog("","Informe o tipo de tarifa");
            return;
        }

        if(rate.tag.length === 0){
            SwalCustom.messageDialog("","Informe a descrição do preço");
            return;
        }

        elementProperty.getElement(".input-value-price",element=>{
            rate[element.getAttribute("id")] = Mask.removeMaskMoney(element.value);
        });

        if(rate.min_price === 0){
            SwalCustom.messageDialog("","Informe a preço minimo");
            return;
        }
        if(rate.base_price === 0){
            SwalCustom.messageDialog("","Informe a preço base");
            return;
        }
        if(rate.km_price === 0){
            SwalCustom.messageDialog("","Informe a preço por km");
            return;
        }
        if(rate.minute_price === 0){
            SwalCustom.messageDialog("","Informe a preço por minuto");
            return;
        }

        if(managerRate.typeRateSelected == null) {
            CentralRepository.addPrice(rate).then(({status, response,message}) => {
                SwalCustom.messageDialog("",message,undefined,"success");
                updateListPrices();
                clearForm();
                createTypes();
            });
        }else{
            CentralRepository.updatePrice(managerRate.typeRateSelected.id,rate).then(({status, response,message}) => {
                SwalCustom.messageDialog("",message,undefined,"success");
                updateListPrices();
                clearForm();
                createTypes();
            })
        }
    });
});