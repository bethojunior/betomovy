class ScheduleCorporateRouteController {
    static list(companyId) {
        return ConnectionServer.sendRequestV2(`scheduleCorporateRoute/company/${companyId}`, "GET", null)
    }

    static add(data) {
        return ConnectionServer.sendRequestV2(`scheduleCorporateRoute`, "POST", data);
    }

    static delete(id) {
        return ConnectionServer.sendRequestV2(`scheduleCorporateRoute/${id}`, "DELETE", null);
    }

    static edit(id, data) {
        return ConnectionServer.sendRequestV2(`scheduleCorporateRoute/${id}`, "PUT", data);
    }

    static getCustomersByRoute(id) {
        return ConnectionServer.sendRequestV2(`scheduleCorporateRoute/${id}/customers`, "GET", null);
    }

    static insertCustomer(data) {
        return ConnectionServer.sendRequestV2(`scheduleCorporateRoute/customer`, "POST", data)
    }

    static deleteCustomer(id){
        return ConnectionServer.sendRequestV2(`scheduleCorporateRoute/customer/${id}`, "DELETE", null)
    }

    static activeByDate(companyId,date){
        return ConnectionServer.sendRequestV2(`scheduleCorporateRoute/company/${companyId}/scheduled`, "POST", {date});
    }
}