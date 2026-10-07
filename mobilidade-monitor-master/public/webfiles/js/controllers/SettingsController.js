class SettingsController extends ConnectionServer {
    /**
     *
     * @returns {Promise<unknown>}
     */
    static getPlaceholders() {
        return new Promise(resolve => {
            ConnectionServer.sendRequest(
                "deliveryInfoSuggestion",
                "GET",
                "",
                resolve,
                "",
                true
            );
        });
    }

    /**
     *
     * @param data
     * @returns {Promise<unknown>}
     */
    static updatePlaceHolders(data) {
        return new Promise(resolve => {
            ConnectionServer.sendRequest(
                "deliveryInfoSuggestion",
                "POST",
                data,
                resolve,
                "",
                true
            );
        });
    }

    /**
     *
     * @param data
     * @returns {Promise<any>}
     */
    static insertTypeItem(data) {
        return ConnectionServer.sendRequestWithFiles(
            "tripItemType",
            "POST",
            data,
            true
        );
    }

    /**
     *
     * @param id
     * @param data
     * @returns {Promise<any>}
     */
    static updateTypeItem(id, data) {
        return ConnectionServer.sendRequestWithFiles(
            "tripItemType/" + id,
            "POST",
            data,
            true
        );
    }

    /**
     *
     * @param method
     * @param data
     * @returns {Promise<any>}
     */
    static accessibilityHelp(method, data = null) {
        return ConnectionServer.sendRequestWithFiles(
            "accessibility/help",
            method,
            data,
            true
        );
    }

    /**
     *
     * @param id
     * @returns {Promise<any>}
     */
    static deleteAccessibilityHelp(id) {
        return ConnectionServer.sendRequestWithFiles(
            "accessibility/help/" + id,
            "DELETE",
            "",
            true
        );
    }

    /**
     *
     * @returns {Promise<unknown>}
     */
    static priceHelpers() {
        return new Promise(resolve => {
            ConnectionServer.sendRequest(
                "price/help?cityId=" +
                Session.getValueInSessionLocal("citySelected", "cityId"),
                "GET",
                "",
                resolve,
                "",
                true
            );
        });
    }

    /**
     *
     * @param id
     * @returns {Promise<unknown>}
     */
    static deleteHelper(id) {
        return new Promise(resolve => {
            ConnectionServer.sendRequest(
                "price/help/" + id,
                "DELETE",
                "",
                resolve,
                "",
                true
            );
        });
    }

    /**
     *
     * @param data
     * @returns {Promise<unknown>}
     */
    static insertPriceHelper(data) {
        return new Promise(resolve => {
            ConnectionServer.sendRequest(
                "price/help",
                "POST",
                data,
                resolve,
                "",
                true
            );
        });
    }

    /**
     *
     * @param id
     * @param method
     * @returns {Promise<unknown>}
     */
    static optionsTypeItem(id, method) {
        return new Promise(resolve => {
            ConnectionServer.sendRequest(
                "tripItemType/" + id,
                method,
                "",
                resolve,
                "",
                true
            );
        });
    }

    /**
     *
     * @param data
     * @returns {Promise<any>}
     */
    static insertItem(data) {
        return ConnectionServer.sendRequestWithFiles("item", "POST", data, true);
    }

    /**
     *
     * @returns {Promise<unknown>}
     */
    static getItems() {
        return new Promise(resolve => {
            ConnectionServer.sendRequest("item", "GET", "", resolve, "", true);
        });
    }

    /**
     *
     * @param id
     * @returns {Promise<unknown>}
     */
    static deleteItem(id) {
        return new Promise(resolve => {
            ConnectionServer.sendRequest(
                "item/" + id,
                "DELETE",
                "",
                resolve,
                "",
                true
            );
        });
    }

    /**
     *
     * @param id
     * @param data
     * @returns {Promise<unknown>}
     */
    static updateItem(id, data) {
        return new Promise(resolve => {
            ConnectionServer.sendRequest(
                "item/" + id,
                "POST",
                data,
                resolve,
                "",
                true
            );
        });
    }

    /**
     *
     * @returns {Promise<unknown>}
     */
    static getApps() {
        return new Promise(resolve => {
            ConnectionServer.sendRequest("app", "GET", "", resolve, undefined, true);
        });
    }

    /**
     *
     * @param id
     * @returns {Promise<unknown>}
     */
    static deleteAndActiveVersionApp(id, active) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("appVersion/" + id, "PUT", {active}, resolve, reject, true );
        });
    }

    /**
     *
     * @param page
     * @returns {Promise<unknown>}
     */
    static getVersion(page) {
        return new Promise(resolve => {
            ConnectionServer.sendRequest(
                "appVersion?page=" + page,
                "GET",
                "",
                resolve,
                undefined,
                true
            );
        });
    }

    /**
     *
     * @param data
     * @returns {Promise<unknown>}
     */
    static insertVersion(data) {
        return new Promise(resolve => {
            ConnectionServer.sendRequest("appVersion", "POST", data, resolve, undefined, true);
        });
    }

    /**
     *
     * @param data
     * @returns {Promise<any>}
     */
    static inertTerms(data) {
        return ConnectionServer.sendRequestWithFiles(
            "config/terms",
            "POST",
            data,
            true
        );
    }

    /**
     *
     * @param data
     * @returns {Promise<unknown>}
     */
    static getPlaces(data, {lat, lng}) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequestApi(
                `Place/Search?q=${data}&latlng=${lat},${lng}`,
                "GET",
                "",
                resolve
            );
        });
    }

    /**
     *
     * @param data
     * @returns {Promise<unknown>}
     */
    static getLocationByAddress(address) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequestApi(
                `Geocoding/search?address=${address}`,
                "GET",
                "",
                resolve,
                reject
            );
        });
    }

    /**
     *
     * @param data
     * @returns {Promise<unknown>}
     */
    static calculateRoute(data) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequestApi(
                `direction/search?${data}`,
                "GET",
                "",
                resolve
            );
        });
    }

    static getPaymentForms() {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(
                `tripPaymentForm`,
                "GET",
                null,
                resolve,
                reject,
                true
            )
        });
    }

    static getTypePaymentForm() {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(
                `paymentFormType`,
                "GET",
                null,
                resolve,
                reject,
                true
            )
        });
    }

    static insertPaymentForm(name, paymentFormTypeId) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(
                `tripPaymentForm`,
                "POST",
                {name, paymentFormTypeId},
                resolve,
                reject,
                true
            )
        });
    }

    static updatePaymentForm(id, name, paymentFormTypeId) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(
                `tripPaymentForm/${id}`,
                "PUT",
                {name, paymentFormTypeId},
                resolve,
                reject,
                true
            )
        });
    }

    static deletePaymentForm(id) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(
                `tripPaymentForm/${id}`,
                "DELETE",
                "",
                resolve,
                reject,
                true
            )
        });
    }
}