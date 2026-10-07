class CompanyController {
    static preRegister(data) {
        return ConnectionServer.sendRequestV2("companyPreRegister", "POST", data);
    }
}