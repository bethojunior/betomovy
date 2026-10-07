ManagerView.RideView = {
    actionIndex: () => {
        const js = [
            "controllers/CustomerController",
            "controllers/CustomerRideController",
            "controllers/TripController",
            "controllers/TripPaymentFormController",
            "controllers/RoutePromotionalBannerController",
            "controllers/PlaceController",
            "controllers/CityController",
            'modulos/menu/menu',
            "modulos/tabs/index",
            'modulos/config/index',
            "modulos/firebase/init",
            "modulos/default/routes",
            "modulos/ride/scheduled",
            "modulos/ride/reserve",
            "modulos/ride/anotherBoardingPlace",
            "service/MapService",
        ];
        const css = [
            "default/routes",
            "travel/detail",
            "home/tabHome",
            "schedule/trip",
            "menu/menu",
            "menu/menu-close",
            "trip/boardingUnloading",
            "trip/ticket"
        ];
        const views = [
            "menu/mainMenu",
            "default/routes",
            "trip/ticket",
            "preload/index",
        ];

        viewController.nameView = "home-routes";

        layoutBuild(views, js, css);
    },
    actionAccompanyTrip: () => {
        const js = [
            "controllers/CityController",
            "controllers/TripController",
            "modulos/ride/accompanyTrip"
        ];
        const css = [
            "ride/accompanyTrip"
        ];
        const views = [
            "ride/accompanyTrip"
        ];

        viewController.nameView = "accompany-trip";

        layoutBuild(views, js, css);
    },
    actionChatSelected: function () {
        const js = [
            "controllers/ChatController",
            "modulos/chat/chatSelectedRider"
        ];
        const css = ["chat"];
        const views = [ 'chat/index'];

        viewController.nameView = "chat-trip-selected-rider";

        layoutBuild(views, js, css);
    }
}
