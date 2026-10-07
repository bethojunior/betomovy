class CorporateRouteCustomerController {
    static getCustomers(companyId) {
        return ConnectionServer.sendRequestV2(`corporateRoute/${companyId}/users`, "GET", null);
    }

    static insertCustomer(data) {
        return ConnectionServer.sendRequestV2(`corporateRoute/user`, "POST", data)
    }

    static deleteCustomer(id){
        return ConnectionServer.sendRequestV2(`corporateRoute/user/${id}`, "DELETE", null)
    }

    static getByDocument(companyId,document){
        return ConnectionServer.sendRequestV2(`corporateRoute/${companyId}/user?document=${document}`, "GET", null)
    }
}