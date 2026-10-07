ManagerView.TripView = {
    actionDetails: function () {
        const js = [];
        const css = [
            'trip/detailTrip',
        ];
        const views = [
            'trip/detailTrip',
        ];

        viewController.nameView = "trip-detail";
        layoutBuild(views, js, css);
    },
    actionTrips: function () {
        const js = [
            'modulos/trip/list'
        ];
        const css = [
            'trip/list'
        ];
        const views = [
            'trip/list'
        ];

        viewController.nameView = "trips";

        layoutBuild(views, js, css);
    },
    actionDetail: function () {
        const js = [
            'controllers/TripReceiptController',
            'controllers/RefusedDriverController',
            'controllers/TripReportTypeController',
            'modulos/trip/detail'
        ];
        const css = [
            'trip/detail'
        ];
        const views = [
            'trip/detail',
            'preload/index',
            'preload/preload-return',
        ];

        viewController.nameView = "trip-detail";

        layoutBuild(views, js, css);
    },
    actionReport: function(){
        const js = [
            "controllers/TripReportController",
            "modulos/trip/report"
        ];
        const css = [
            'contactUs',
            'preload',
        ];

        const views = [
            'preload/index',
            'chat/contactUs',
        ];

        viewController.nameView = "report-trip";
        layoutBuild(views, js, css);
    }
};