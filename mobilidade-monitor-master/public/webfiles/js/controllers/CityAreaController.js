class CityAreaController {

    /**
     *
     * @param cityId
     * @param polygon
     * @param estate_id
     * @param name
     * @returns {Promise<any>}
     */
    static insert(cityId, polygon, estate_id, name, old_name) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`city/${cityId}/area`, "POST", {polygon, estate_id, name, old_name, short_name: null}, resolve, reject, true);
        });
    }

    static updateRoute(cityId, polygon, estate_id, name, old_name) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`city/${cityId}/area`, 'PUT', {polygon, estate_id, name, short_name: old_name, old_name}, resolve, reject, true);
        })
    }

    /**
     *
     * @param cityId
     * @returns {Promise<any>}
     */
    static get(cityId = "") {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`city/${cityId}`, "GET", null, resolve, reject, true)
        });
    }

    static mirroring({cityMirrorId, mirroringCityId, cityName, estateId}) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("city/mirroring", "POST", {
                cityMirrorId,
                mirroringCityId,
                nome: cityName,
                estado: estateId
            }, resolve, reject, true)
        })
    }
}