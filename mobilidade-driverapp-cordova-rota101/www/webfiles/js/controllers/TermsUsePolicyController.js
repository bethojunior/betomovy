class TermsUsePolicyController {
    static find(type) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`termsUsePolicy/findByType?type=${type}`, "GET",null, resolve, reject);
        });
    }
}
