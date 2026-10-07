document.addEventListener("DOMContentLoaded",function(){
    const elementProperty = new ElementProperty();

    const manager = {
        id:null,
        radius: null,
        greaterRadius: null
    };

    getZone();

    function getZone(){
        CentralRepository.getZone(Session.getValueInSession("centralSelected", "id"))
            .then(({status,response})=>{
                if(response == null){
                    manager.id = null;
                    return;
                }

                manager.id = response.idZone;
                manager.radius = response.radius;
                manager.greaterRadius = response.greaterRadius;
                fillForm();
            })
    }

    function fillForm(){
        document.getElementById("radius").value = manager.radius;
        document.getElementById("greaterRadius").value = manager.greaterRadius;
    }

    elementProperty.addEventInElement("#saveRadius","onclick",function(){
        manager.radius = document.getElementById("radius").value;
        manager.greaterRadius = document.getElementById("greaterRadius").value;

        if(manager.radius.length === "" || manager.radius <= 0){
            SwalCustom.messageDialog("","O raio nominal deve ser maior que zero!",undefined,"info");
            return;
        }

        if(manager.greaterRadius.length === "" || manager.greaterRadius <= 0){
            SwalCustom.messageDialog("","O raio bloco deve ser maior que zero!",undefined,"info");
            return;
        }

        if(manager.id == null) {
            CentralRepository.insertZone(Session.getValueInSession("centralSelected", "id"),manager)
                .then(({status,response,message})=>{
                    SwalCustom.messageDialog("",message,undefined,"success");
                    getZone();
                })
        }else{
            CentralRepository.updateZoneZone(
                Session.getValueInSession("centralSelected", "id"),
                manager.id,
                manager)
                .then(({status,response,message})=>{
                    SwalCustom.messageDialog("",message,undefined,"success");
                    getZone();
                })
        }
    });
});