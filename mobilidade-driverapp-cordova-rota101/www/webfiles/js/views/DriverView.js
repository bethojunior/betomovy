ManagerView.DriverView = {
    actionIndex: function () {
        if (Session.get("user").idUser === undefined) {
            Route.redirect("Login");
        }

        const js = [
            "service/MapService",
            "service/Push",
            "service/PaymentCard",
            "repositories/ChatRepository",
            "repositories/TripRouteRepository",
            "controllers/IfoodController",
            "controllers/FreightController",
            "controllers/DocUserTypeController",
            "controllers/DynamicAreaController",
            "controllers/DriverCloseController",
            "controllers/DirectionController",
            "controllers/AppController",
            "controllers/DocUserController",
            "controllers/RefusedDriverController",
            "controllers/DriverController",
            "controllers/DriverFormOfPaymentController",
            "controllers/LocationController",
            "controllers/ChatTripController",
            "controllers/CancellationReasonsController",
            "controllers/CityController",
            "controllers/ConfigController",
            "controllers/LogController",
            "controllers/StationController",
            "controllers/AdvertisingController",
            "controllers/TaximeterTripController",
            "controllers/SupportController",
            "controllers/StationTypeController",
            "controllers/TripController",
            "controllers/TripCallInfoController",
            "controllers/TripRatingController",
            "controllers/ChatBotTripController",
            "controllers/EmergencyMonitoringTypeController",
            "controllers/PriceController",
            "controllers/PrepaidController",
            "controllers/AddressBlacklistController",
            'controllers/TermsUsePolicyController',
            "controllers/PlaceController",
            "controllers/DeliveryOrderController",
            "controllers/NotificationController",
            "controllers/TripBidController",
            "controllers/TripRefusedController",
            "modulos/delivery/search",
            "modulos/delivery/manager",
            "modulos/trip/customerWaitTime",
            "modulos/init/device",
            "modulos/authenticate/StatusDriver",
            "modulos/ride/index",
            "modulos/driver/document",
            "modulos/driver/security",
            "modulos/driver/return",
            "modulos/driver/position",
            "modulos/driver/cooperative",
            "modulos/driver/statusDriver",
            "modulos/map/drivers",
            "modulos/trip/infoTrip",
            "modulos/trip/tripStatus",
            "modulos/setting/battery",
            "modulos/menu/menu",
            "modulos/menu/adsMenu",
            "modulos/trip/tripCancel",
            "modulos/trip/finishTrip",
            "modulos/trip/preAvailable",
            "modulos/notifications/newNotification",
            "modulos/trip/InfoClientTrip",
            "modulos/modal/infoReturn",
            "modulos/location/background",
            "modulos/location/monitoring",
            "modulos/trip/search",
            "modulos/version/version",
            "modulos/trip/trip",
            "modulos/trip/evaluateLocations",
            "modulos/trip/ifoodCode",
            "modulos/schedule/trip",
            "modulos/schedule/tripAccepted",
            "modulos/advertising/index",
            "utils/evaluation",
            "utils/FileUpload",
            "modulos/notifications/default",
            "modulos/knob/index",
            "modulos/driver/datasheet",
            "modulos/status/index",
            "modulos/prepaid/index",
            "modulos/driver/taximetro",
            "modulos/freight/detail",
            "modulos/freight/listFreight",
            "modulos/notify/index",
            "modulos/notification/index",
            "modulos/offer/index",
            "modulos/trip/loadEventTrip"
        ];
        const css = [
            "menu-close",
            "menu",
            "chatNotification",
            "home",
            "finishTrip",
            "tripCancel",
            "call",
            "newNotification",
            "preload",
            "return",
            "driver/security",
            "modal/modalSignaling",
            "modal/modalEvaluation",
            "modal/dataClient",
            "modal/infoReturn",
            "modal/updateVersion",
            "modal/optionNavigator",
            "modal/modalBlocked",
            "modal/sharedApp",
            "modal/ifoodCode",
            "trip/checkoutTrip",
            "trip/tripInWait",
            "trip/initTripInWait",
            "trip/customerWaitTime",
            "home/containerQRCode",
            "template/v2",
            "schedule/scheduleBar",
            "schedule/trips",
            "schedule/notification",
            "notification/default",
            "driver/datasheet",
            "security/index",
            "status/index",
            "splash/index",
            "prepaid/index",
            "delivery/observation",
            "driver/taximetro",
            "trip/evaluateLocations",
            "map/lite",
            "delivery/search",
            "delivery/manager",
            "ride/index",
            "freight/detail",
            "notify/index",
            "notification/index",
            "driver/updateProfilePicture",
            "permission/location",
            "advertising/index",
            "offer/index"
        ];
        const views = [
            "menu/mainDriver",
            "menu/navMenuV2",
            "driver/index",
            "notification/chat",
            "trip/finishTrip",
            "driver/call",
            "trip/tripCancel",
            "trip/customerWaitTime",
            "notification/modalNewNotification",
            "preloader/index",
            "driver/return",
            "modal/signalingClient",
            "modal/dataClient",
            "modal/evaluation",
            "modal/infoReturn",
            "modal/optionNavigator",
            "modal/sharedApp",
            "modal/ifoodCode",
            "trip/checkoutTrip",
            "trip/optionTripInWait",
            "modal/initTripInWait",
            "modal/modalBlocked",
            "modal/updateVersion",
            "schedule/scheduleBar",
            "schedule/trips",
            "schedule/tripAccepted",
            "schedule/notification",
            "notification/default",
            "qrcode/index",
            "driver/datasheet",
            "security/index",
            "status/index",
            "splash/index",
            "prepaid/index",
            "delivery/observation",
            "driver/taximetro",
            "trip/evaluateLocations",
            "delivery/search",
            "delivery/manager",
            "ride/index",
            "freight/detail",
            "notify/index",
            "notification/index",
            "driver/updateProfilePicture",
            "permission/location",
            "advertising/index",
            "offer/index",
        ];

        layoutBuild(views, js, css);
    },
    actionChat: function () {
        const js = [
            "controllers/DriverController",
            "controllers/ChatTripController",
            "modulos/driver/chat"
        ];
        const css = ["chat"];
        const views = ["trip/chat"];

        viewController.nameView = "chat-trip";

        layoutBuild(views, js, css);
    },
    actionRacingList: function () {
        const js = [
            "controllers/DriverController",
            "controllers/TripController",
            //'modulos/menu/menu',
            //'modulos/driver/chat',
            "modulos/driver/racingList",
            'utils/preload'
        ];
        const css = ["racingList"];
        const views = ["driver/racingList", 'preloader/index'];

        viewController.nameView = "racing-list";

        layoutBuild(views, js, css);
    },
    actionPerfilDriver: function () {
        const js = [
            "controllers/UserController",
            "controllers/DriverController",
            "modulos/driver/perfil",
            "controllers/DriverController",
            "controllers/BankAccountController",
            "controllers/BankController",
        ];
        const css = [
            "menu-close",
            "menu",
            "perfilDriver",
            'driver/account',
            "preload"
        ];
        const views = [
            "menu/mainChat",
            "driver/perfil",
            'driver/account',
            'preloader/index'
        ];

        viewController.nameView = "profile-driver";

        layoutBuild(views, js, css);
    },
    actionEditProfileDriver: function () {
        const js = ["modulos/driver/editProfile"];
        const css = ["menu-close", "menu", "driver/editProfile"];
        const views = ["menu/mainChat", "driver/editProfile"];

        viewController.nameView = "edit-profile-driver";

        layoutBuild(views, js, css);
    },
    actionSetting: function () {
        const js = ["modulos/menu/menu", "modulos/setting/setting"];
        const css = ["menu-close", "menu", "setting"];
        const views = ["menu/mainDriver", "setting/setting"];
        layoutBuild(views, js, css);
    },
    actionPromotion: function () {
        const js = [
            "controllers/PromotionController",
            "modulos/menu/menu",
            "modulos/setting/setting",
            "modulos/promotion/init"
        ];
        const css = ["menu-close", "menu", "setting", "promotion"];
        const views = ["menu/mainDriver", "preloader/index", "promotion/index"];
        layoutBuild(views, js, css);
    },
    actionRequestRelease: function () {
        const js = ["controllers/TripController", "modulos/trip/report"];
        const css = ["requestRelease"];
        const views = ["trip/requestRelease"];

        viewController.nameView = "trip-report";

        layoutBuild(views, js, css);
    },

    actionTripInWait: function () {
        const js = ["modulos/trip/tripInWait"];
        const css = [];
        const views = ["trip/tripInWait"];

        viewController.nameView = "trip-in-wait";

        layoutBuild(views, js, css);
    },

    actionCancelAnotherTrip: function () {
        const js = ["modulos/trip/cancelAnotherTrip"];
        const css = ["trip/cancelAnotherTrip"];

        const views = ["trip/cancelAnotherTrip"];

        viewController.nameView = "cancel-another-trip";

        layoutBuild(views, js, css);
    },
    actionCustomers: function () {
        const js = [
            "controllers/FavoriteDriverController",
            "controllers/RefusedCustomerController",
            "modulos/driver/customer"
        ];
        const css = ["driver/customers"];

        const views = ["driver/customers"];

        viewController.nameView = "list-customers";

        layoutBuild(views, js, css);
    },
    actionIndication: function () {
        const js = [
            "controllers/UserIndicationController",
            "modulos/driver/indication"
        ];
        const css = ["driver/indication"];

        const views = ["driver/indication"];

        viewController.nameView = "list-indication";

        layoutBuild(views, js, css);
    },
    actionWebApp() {
        const js = ["modulos/webapp/index"];
        const css = ["webapp/index"];
        const views = ["webapp/index"];

        viewController.nameView = "web-app";

        layoutBuild(views, js, css);
    },
    actionVehicle() {
        const js = [
            "controllers/CarController",
            "modulos/driver/vehicle"
        ];
        const css = ["driver/vehicle"];
        const views = ["driver/vehicle"];

        viewController.nameView = "vehicle-driver";

        layoutBuild(views, js, css);
    },
    actionMultipleChat() {
        const js = ["modulos/trip/multipleChat"];
        const css = ["trip/multipleChat"];
        const views = ["trip/multipleChat"];

        viewController.nameView = "multiple-chat";

        layoutBuild(views, js, css);
    },
    actionChatSelected: function () {
        const js = [
            "controllers/DriverController",
            "controllers/ChatTripController",
            "modulos/trip/chatSelectedRider"
        ];
        const css = ["chat"];
        const views = ["trip/chat"];

        viewController.nameView = "chat-trip-selected-rider";

        layoutBuild(views, js, css);
    },
    actionChatDelivery: function () {
        const js = [
            "modulos/delivery/chat"
        ];
        const css = ["chat"];
        const views = ["trip/chat"];

        viewController.nameView = "chat-trip-delivery";

        layoutBuild(views, js, css);
    },
    actionDeliveryOccurrence: function () {
        const js = [
            "controllers/DeliveryOrderController",
            "modulos/delivery/occurrence"
        ];
        const css = ["delivery/occurrence"];
        const views = ["delivery/occurrence"];

        viewController.nameView = "delivery-occurrence";

        layoutBuild(views, js, css);
    },
    actionDeliveries: function () {
        const js = [
            'modulos/delivery/list'
        ];
        const css = [
            'delivery/list'
        ];
        const views = [
            'delivery/list'
        ];

        viewController.nameView = "deliveries";

        layoutBuild(views, js, css);
    },
    actionAudit: function () {
        const js = ["libs/qrcode.min", "modulos/driver/audit"];
        const css = ["menu-close", "menu", "audit/index"];
        const views = ["menu/mainChat", "audit/index"];

        viewController.nameView = "audit";

        layoutBuild(views, js, css);
    },
};
