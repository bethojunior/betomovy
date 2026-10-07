class SupportController {
    getHelpCode() {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequestMain("Support/GetHelpCode", "POST", {}, resolve, reject)
        });
    }

}