class SupportController {
    getConfig(configKey){
        return new Promise((resolve, reject) => {
            ConnectionServer.
                sendRequest("Support/GetConfig","POST",{configKey},resolve,reject,false);
        });
    }

    static sendAlertHelp(data) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("Support/SendAlertHelp", "POST",
                data, resolve, reject,  false);
        });
    }

}