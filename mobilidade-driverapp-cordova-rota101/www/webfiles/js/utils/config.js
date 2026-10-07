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
        ConnectionServer.sendRequest("appConfig/findByApp","POST",{appId: 2}, resolve,reject,undefined,false);
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
                --text-color-main:  ${config.mainColorText};
                --second-color: ${config.secondaryColor};
                --text-color-second: ${config.secondaryColorText}
             }`;

    viewController.elementProperty.getElement('.logo-preview-app', (element) => {
        element.src = config.logo;
    });

}
