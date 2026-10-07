class TermsUsePolicyController {
    static getTerms() {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("termsUsePolicy", "GET", null, resolve, reject, true);
        });
    }

    static getTermByType(type) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`termsUsePolicy/findByType?type=${type}`, "GET", null, resolve, reject, true);
        });
    }

    static updateTerm(data){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`termsUsePolicy/update`, "POST", data, resolve, reject, true);
        });
    }
}