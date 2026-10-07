ManagerView.ClientView = {
    actionSplash: function(){
        if (Session.get("user").idUser === undefined) {
            Route.redirect("Login")
        }

        const views = [
            "splash/index",
        ];
        const js = [
            'controllers/CityController',
            "modulos/splash/index"
        ];
        const css = [
            "splash/index",
        ];

        viewController.nameView = "splash-view";

        layoutBuild(views, js, css);
    },
    actionIndex: function () {
        if (Session.get("user").idUser === undefined) {
            Route.redirect("Login")
        }

        const js = [
            'controllers/AdvertisingController',
            'controllers/RequiredFieldController',
            'controllers/EstablishmentController',
            'controllers/MilitaryForceController',
            'controllers/EmergencyMonitoringTypeController',
            'controllers/DriverCloseController',
            'controllers/DriverController',
            'controllers/TripController',
            'controllers/ZoneController',
            'controllers/CancellationReasonsController',
            'controllers/ChatController',
            'controllers/PriceController',
            'controllers/CustomerController',
            'controllers/EstateController',
            'controllers/LocationController',
            'controllers/CityController',
            'controllers/TripLongDistanceController',
            'controllers/TripPaymentFormController',
            'controllers/TripRatingController',
            'controllers/FavoriteDriverController',
            'controllers/CustomerPlaceController',
            'controllers/CustomerCardController',
            'controllers/PlaceController',
            'controllers/KnobTripController',
            'controllers/PartnerController',
            'controllers/AppController',
            'controllers/DiscountCouponController',
            'controllers/PendencyFieldController',
            'controllers/TripItemTypeController',
            'controllers/NotificationController',
            'controllers/TripBidController',
            'controllers/DeliveryInfoController',
            'service/MapService',
            'service/PaymentCard',
            'modulos/firebase/init',
            'modulos/trip/trip',
            'modulos/config/index',
            'modulos/menu/menu',
            'modulos/trip/initTrip',
            'modulos/trip/local',
            'modulos/trip/address',
            'modulos/trip/finishTrip',
            'modulos/trip/InfoTrip',
            'modulos/trip/option',
            'modulos/trip/modalNewTrip',
            'modulos/trip/QRCodeCapture',
            'modulos/paymentform/TripPaymentForm',
            'modulos/price/PriceTrip',
            'modulos/price/editPrice',
            'modulos/chat/comunication',
            'modulos/driver/anotherTypeDriver',
            'modulos/update/version',
            'modulos/client/location',
            'modulos/driver/checkFavorites',
            'modulos/trip/knobTrip',
            'modulos/client/getDocuments',
            "modulos/payment/cards",
            "modulos/place/selectPlace",
            "modulos/partner/selectTrip",
            "modulos/trip/cancelTrip",
            "modulos/trip/statusTrip",
            "modulos/trip/updateTrip",
            "modulos/security/index",
            'utils/evaluation',
            'utils/validate',
            "modulos/schedule/trip",
            "modulos/schedule/verifyScheduleTrip",
            "modulos/publicity/index",
            "modulos/coupon/applyCoupon",
            "modulos/status/index",
            "modulos/delivery/infoDelivery",
            "modulos/trip/withoutDestination",
            "modulos/client/social",
            "modulos/tabs/index",
            "modulos/place/cache",
            "modulos/trip/cancelTrip",
            "modulos/notify/index",
            "modulos/notify/push",
            "modulos/menu/adsMenu",
            "modulos/offer/index"
        ];
        const css = [
            'utils/assets',
            'callTaxiReturn',
            'progress',
            "menu/menu-close",
            "menu/menu",
            'preload',
            'mapa/mapa',
            'modal/modalTypesReturn',
            'modal/modalNewTrip',
            'trip/animation',
            'infoTrip',
            'preloader/connection-internet',
            'modal/modalSignaling',
            'modal/dataTrip',
            'modal/modalEvaluation',
            'modal/updateVersion',
            'modal/favoriteDriverTrip',
            'price/index',
            'setting/gpsDisabled',
            'customer/document',
            "modal/cards",
            "trip/editPrice",
            "modal/typeCustomer",
            "notification/container",
            "schedule/trip",
            "schedule/notification",
            "publicity/index",
            "coupon/applyCoupon",
            "security/index",
            "status/index",
            "trip/longDistance",
            "trip/cancel",
            "template/v2",
            "delivery/infoDelivery",
            "notify/index",
            "notification/detail",
            "trip/ride",
            "trip/tripCancel",
            "trip/localConfirmationOption",
            "place/editRoute",
            "notification/chat",
            "offer/index"
        ];
        const views = [
            'menu/menu-default',
            'menu/mainMenu',
            'call/index',
            'client/map',
            'client/infoTrip',
            'preload/index',
            'preload/preload-return',
            'trip/modalTypesReturn',
            'trip/modalNewTrip',
            'modal/infoReturn',
            'preload/connection',
            'modal/signalingArrival',
            'modal/dataTrip',
            'modal/evaluation',
            'modal/updateVersion',
            'modal/favoriteDriverTrip',
            'modal/gpsDisabled',
            'client/document',
            'chat/song',
            "modal/cards",
            "modal/typeCustomer",
            "notification/container",
            "schedule/trip",
            "schedule/detailScheduleTrip",
            "schedule/notification",
            "publicity/index",
            "coupon/applyCoupon",
            "security/index",
            "status/index",
            "trip/longDistance",
            "trip/cancel",
            "delivery/infoDelivery",
            "notify/index",
            "notify/detail",
            "trip/ride",
            "trip/tripCancel",
            "trip/localConfirmationOption",
            "place/editRoute",
            "notification/chat",
            "offer/index"
        ];

        viewController.nameView = "home-trip";

        layoutBuild(views, js, css);
    },
    actionChat: function () {
        const js = [
            'controllers/ChatController',
            'modulos/chat/chat',
        ];
        const css = [
            'chat',
        ];
        const views = [
            'chat/index',
        ];

        viewController.nameView = "chat-trip";

        layoutBuild(views, js, css);
    },
    actionPerfilDriver: function () {
        const js = [
            'controllers/UserController',
            'controllers/DriverController',
            'modulos/driver/perfil',
            'utils/FileUpload'
        ];
        const css = [
            'menu-close',
            'menu',
            'perfilDriver'
        ];
        const views = [
            'preload/index',
            'menu/mainChat',
            'driver/perfil',
        ];
        layoutBuild(views, js, css);
    },
    actionSetting: function () {
        const js = [
            'modulos/menu/menu',
            'modulos/setting/setting'
        ];
        const css = [
            'menu-close',
            'menu',
            'setting'
        ];
        const views = [
            'menu/mainDriver',
            'setting/setting',
        ];
        layoutBuild(views, js, css);
    },
    actionContactUs: function () {
        const js = [
            'utils/preload',
            'modulos/chat/contactUs',
            'controllers/CustomerController'
        ];
        const css = [
            'contactUs',
            'preload',
        ];
        const views = [
            'preload/index',
            'chat/contactUs',
        ];

        viewController.nameView = "contact-us";
        layoutBuild(views, js, css);
    },
    actionProfile: () => {
        const js = [
            'utils/preload',
            'modulos/client/profile',
            'controllers/CustomerController'
        ];
        const css = [
            'customer/profile',
            'menu/menuGeneral',
            'preload',
        ];
        const views = [
            'menu/menuGeneral',
            'preload/index',
            'profile/index',
        ];
        viewController.nameView = "viewProfile";
        layoutBuild(views, js, css);
    },
    actionIndication: function () {
        const js = [
            'controllers/UserIndicationController',
            'modulos/client/indication'
        ];
        const css = [
            'customer/indication'
        ];

        const views = [
            'client/indication'
        ];

        viewController.nameView = "list-indication";

        layoutBuild(views, js, css);
    },
    actionCoupon: function () {
        const js = [
            "controllers/DiscountCouponController",
            "modulos/promotion/coupon",
            "modulos/coupon/list"
        ];
        const css = [
            "promotion/coupon",
            'coupon/list'
        ];

        const views = [
            "promotion/coupon",
            'coupon/list'
        ];

        viewController.nameView = "list-coupon";

        layoutBuild(views, js, css);
    }
}
