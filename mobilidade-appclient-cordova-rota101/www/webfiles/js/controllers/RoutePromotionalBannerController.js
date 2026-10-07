class RoutePromotionalBannerController {
    static findAll(){
        return new Promise((resolve, reject) => {
           ConnectionServer.sendRequest("routePromotionalBanner/findAll","GET",null,resolve,reject);
        });
    }
}
