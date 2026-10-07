function checkLayoutByConfig(){
    if(Array.isArray(Session.get("appConfig"))){
        return getConfigByApp();
    }

    getConfigByApp();

    return Session.get("appConfig");
}

function getConfigByApp(){
    return requestConfig().then(({data})=>{
        Session.set("appConfig",data);

        return data;
    });
}

function requestConfig(){
    return new Promise((resolve, reject) => {
        ConnectionServer.sendRequest("appconfig/findbyapp","POST",{appId: 4}, resolve,reject,false);
    });
}


function changeLayoutByAppConfig(){
    const config = Session.get("appConfig");
    if(Array.isArray(config) || config == null)
        return;

    const elementStyle = document.querySelector("#appConfigStyle");

    elementStyle.innerHTML = `
            nameapp:before{
                content:"${config.name}"
            }
            :root {
                --main-color: ${config.mainColor};
                --main-seconds-color: ${config.mainColorText};
                --text-color-main: ${config.secondaryColor};
                --text-color-seconds: ${config.secondaryColorText}
             }`;

    viewController.elementProperty.getElement('.logo-preview-app', (element) => {
        element.src = config.logo;
    });

}