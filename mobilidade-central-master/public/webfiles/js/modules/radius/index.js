document.addEventListener("DOMContentLoaded",function(){
    const elementProperty = new ElementProperty();

    const manager = {
        id:null,
        radius: null,
        greaterRadius: null
    };

    getZone();

    function getZone(){
        const centralId = Session.getValueInSession("centralSelected", "id");
        if (!centralId) return;

        CentralRepository.getZone(centralId)
            .then(({status,response})=>{
                if(response == null){
                    manager.id = null;
                    return;
                }

                manager.id = response.idZone;
                manager.radius = response.radius;
                manager.greaterRadius = response.greaterRadius;
                fillForm();
            }).catch((err) => {
                console.error("Erro ao carregar raio de atendimento:", err);
            });
    }

    function fillForm(){
        const radEl = document.getElementById("radius");
        const greatRadEl = document.getElementById("greaterRadius");
        if (radEl) radEl.value = manager.radius ?? "";
        if (greatRadEl) greatRadEl.value = manager.greaterRadius ?? "";
    }

    elementProperty.addEventInElement("#saveRadius","onclick",function(){
        const centralId = Session.getValueInSession("centralSelected", "id");
        if (!centralId) {
            SwalCustom.messageDialog("","Selecione uma central para salvar o raio.",undefined,"warning");
            return;
        }

        const radEl = document.getElementById("radius");
        const greatRadEl = document.getElementById("greaterRadius");
        manager.radius = radEl ? radEl.value : "";
        manager.greaterRadius = greatRadEl ? greatRadEl.value : "";

        if(!manager.radius || manager.radius <= 0){
            SwalCustom.messageDialog("","O raio nominal deve ser maior que zero!",undefined,"info");
            return;
        }

        if(!manager.greaterRadius || manager.greaterRadius <= 0){
            SwalCustom.messageDialog("","O raio bloco deve ser maior que zero!",undefined,"info");
            return;
        }

        if(manager.id == null) {
            CentralRepository.insertZone(centralId, manager)
                .then(({status,response,message})=>{
                    SwalCustom.messageDialog("",message || "Raio salvo com sucesso!",undefined,"success");
                    getZone();
                }).catch(() => {
                    SwalCustom.messageDialog("","Erro ao salvar raio de atendimento.",undefined,"error");
                });
        }else{
            CentralRepository.updateZoneZone(
                centralId,
                manager.id,
                manager)
                .then(({status,response,message})=>{
                    SwalCustom.messageDialog("",message || "Raio atualizado com sucesso!",undefined,"success");
                    getZone();
                }).catch(() => {
                    SwalCustom.messageDialog("","Erro ao atualizar raio de atendimento.",undefined,"error");
                });
        }
    });
});
