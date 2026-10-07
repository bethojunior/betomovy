class SupportController {
    getHelpCode() {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("Support/GetHelpCode", "POST", {}, resolve, reject)
        });
    }

}