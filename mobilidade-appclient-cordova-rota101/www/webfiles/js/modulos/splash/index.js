viewController.setObserver("splash-view", () => {
    setTimeout(() => {
        CityController.general().then(({data}) => {
            Session.set("configGeneral", data);

            if (ConfigGeneral().get("enable_mobility_app") != null) {
                if (ConfigGeneral().get("enable_mobility_app") == true) {
                    if (!Array.isArray(Session.get("tripReferenceFreight")))
                        return Route.redirect("Freight", "Index");
                    if (!Array.isArray(Session.get("tripReferenceRide")))
                        return Route.redirect("Ride", "Index");

                    return Route.redirect("Client", "Index");
                } else if (ConfigGeneral().get("enable_freight_app") == true) {
                    if (!Array.isArray(Session.get("tripReference")))
                        return Route.redirect("Client", "Index");
                    if (!Array.isArray(Session.get("tripReferenceRide")))
                        return Route.redirect("Ride", "Index");

                    return Route.redirect("Freight", "Index");
                } else if (ConfigGeneral().get("enable_share_trip_app") == true) {
                    if (!Array.isArray(Session.get("tripReference")))
                        return Route.redirect("Client", "Index");
                    if (!Array.isArray(Session.get("tripReferenceFreight")))
                        return Route.redirect("Freight", "Index");

                    return Route.redirect("Ride", "Index");
                } else {
                    return Route.redirect("Client", "Index");
                }
            } else {
                Route.redirect("Client", "Index");
            }
        });
    }, 500)
});
