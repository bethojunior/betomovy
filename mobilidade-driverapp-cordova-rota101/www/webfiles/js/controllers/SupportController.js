class SupportController {
    getHelpCode() {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("Support/GetHelpCode", "POST", {}, resolve, reject)
        });
    }

    static sendAlertHelp(data) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("Support/SendAlertHelp", "POST",
                data, resolve, reject, undefined, false);
        });
    }

}