class CorporateRouteController {
    static all(id){
        return ConnectionServer.sendRequestV2(`corporateRoute/${id}/routes`,"GET",null)
    }
}