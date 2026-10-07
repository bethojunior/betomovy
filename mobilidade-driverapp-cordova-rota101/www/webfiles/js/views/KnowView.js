ManagerView.KnobView = {
    actionCreateTrip: function(){
        const js = [
            "controllers/PlaceController",
            "controllers/PriceController",
            "controllers/TripTypeController",
            "controllers/TripPaymentFormController",
            "controllers/KnobTripController",
            "modulos/knob/createTrip"
        ];
        const css = [
            "preload",
            "knob/index"
        ];
        const views = [
            "preloader/index",
            "knob/index"
        ];

        viewController.nameView = "know-trip";

        layoutBuild(views, js, css);
    },
};