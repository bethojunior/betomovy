class TripAdapter {
    static normalize(trip) {
        const centralCustomer = trip.centralCustomer || trip.central_customer || {};

        const origin = trip.origin || {};
        const destination = trip.destination || {};

        const deliveryInfo = trip.deliveryInfo || trip.delivery_info || null;
        const tripItems = trip.tripItems || trip.trip_items || false;

        const tripWayPoints = (
            trip.tripWayPoints ||
            trip.trip_way_points ||
            []
        ).map((item) => ({
            lat: parseFloat(item.latitude),
            lng: parseFloat(item.longitude),
            neighborhood: item.neighborhood,
            address: item.address,
            latitude: parseFloat(item.latitude),
            longitude: parseFloat(item.longitude),
            obs: item.obs,
        }));

        return {
            userId: parseInt(trip.userId),
            tripTypeId: trip.tripTypeId,
            tripPaymentFormId: trip.tripPaymentFormId,

            origin: {
                address: origin?.address || origin?.name || "",
                latitude: parseFloat(origin.latitude),
                longitude: parseFloat(origin.longitude),
            },

            destination: {
                address: destination?.address || destination?.name || "",
                latitude: parseFloat(destination.latitude),
                longitude: parseFloat(destination.longitude),
            },

            centralId: trip.centralId,
            priceId: trip.priceId,
            distance: parseFloat(trip.distance),
            estimatedTripTime: parseFloat(trip.estimatedTripTime),

            centralCustomer,
            tripWayPoints,

            price: trip.price,

            tripDiscountCoupon: trip.tripDiscountCoupon || null,
            haveReturn: trip.haveReturn == '1' ? true : false,
            paidByCentral: false,
            deliveryInfo: deliveryInfo,
            tripItems: tripItems,
            multiplierDynamic: trip.multiplierDynamic || null,
        };
    }
}
