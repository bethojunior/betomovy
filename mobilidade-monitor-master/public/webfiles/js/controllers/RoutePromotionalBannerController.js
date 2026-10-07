class RoutePromotionalBannerController extends ConnectionServer{
        static listAllRoutePromotionalBanner() {
            return new Promise((resolve, reject) => {
               ConnectionServer.sendRequest("routePromotionalBanner", 'GET',null, resolve, reject, true);
            });
        }

        static saveRoutePromotionalBanner(picture) {
            const formData = new FormData();
            formData.append('picture', picture);
            return ConnectionServer.sendRequestWithFiles("routePromotionalBanner", 'POST',formData, true);
        }

        static deleteRoutePromotionalBanner(id) {
            return new Promise((resolve, reject) => {
                ConnectionServer.sendRequest(`routePromotionalBanner/${id}`, 'DELETE',null, resolve, reject, true);
            });
        }
}