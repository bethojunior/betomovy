document.addEventListener("DOMContentLoaded", function () {
    preload(true)
    Promise.all([
        getConfig('route_optimization_google'),
        getConfig('route_optimization_mapbox'),
        getConfig('route_optimization_here'),
    ]).then(result=>{
        preload(false);
        document.querySelector("#routeOptimizationGoogleSelect").value = result[0].response;
        document.querySelector("#routeOptimizationMapboxSelect").value = result[1].response;
        document.querySelector("#routeOptimizationHereSelect").value = result[2].response;
    });

    elementProperty.addEventInElement("#routeOptimizationGoogleHandle","onclick",function(){
        updateKeyValue("route_optimization_google", document.querySelector("#routeOptimizationGoogleSelect").value)
    });

    elementProperty.addEventInElement("#routeOptimizationMapboxHandle","onclick",function(){
        updateKeyValue("route_optimization_mapbox", document.querySelector("#routeOptimizationMapboxSelect").value)
    });

    elementProperty.addEventInElement("#routeOptimizationHereHandle","onclick",function(){
        updateKeyValue("route_optimization_here", document.querySelector("#routeOptimizationHereSelect").value)
    });

    function updateKeyValue(key,value){
        const data = {};
        data[key] = value;
        preload(true);
        MapSettingController.update(data).then(({status}) => {
            preload(false);
            if(!status){
                return SwalCustom.messageDialog('Tente novamente', 'Ocorreu um erro ao atualizar sua configuração', 'error');
            }
            SwalCustom.messageDialog('', 'Configuração atualizada com sucesso!', 'success');
        });
    }

    function getConfig(key) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`config/${key}`,'GET',null, resolve,reject,true);
        });
    }
});