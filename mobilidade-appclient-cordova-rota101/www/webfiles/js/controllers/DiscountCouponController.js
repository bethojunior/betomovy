class DiscountCouponController {
    static active({code, lat, lng}) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("DiscountCoupon/Activate", "POST",
                {code, lat, lng}
                , resolve, reject, false);
        });
    }

    static findActivated() {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("DiscountCoupon/FindActivated", "GET",
                null
                , resolve, reject, false);
        });
    }
}