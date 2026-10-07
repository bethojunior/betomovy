class PlaceRepository {
    static getEstates(){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("estate","GET",null,resolve,reject);
        })
    }

    static getCityByEstate(estate){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`city?estateId=${estate}`,"GET",null,resolve,reject);
        })
    }

    /**
     *
     * @param text
     * @param location
     * @returns {Promise<any>}
     */
    static search(text,location){
        const {lat,lng} = location;
        const central = Session.get("centralSelected");
        let extraParams = "";
        let headers = {};

        if (central && central.id) {
            extraParams = "&source=central";
            headers = {
                "centralId": central.id,
                "enableCustomRadiusCentral": central.enableCustomRadiusCentral,
                "placesSearchRadius": central.placesSearchRadius
            };
        }

        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(
                `place/search?q=${encodeURIComponent(text)}&latlng=${lat},${lng}${extraParams}`,
                "GET",null,resolve,reject, headers);
        })
    }

    static searching(address,latlng){
        const {lat,lng} = latlng;
        const central = Session.get("centralSelected");
        let extraParams = "";
        let headers = {};

        if (central && central.id) {
            extraParams = "&source=central";
            headers = {
                "centralId": central.id,
                "enableCustomRadiusCentral": central.enableCustomRadiusCentral,
                "placesSearchRadius": central.placesSearchRadius
            };
        }

        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequestMain(`Place/Search?latlng=${lat},${lng}&q=${encodeURIComponent(address)}${extraParams}`,"GET",null,resolve, reject,false, headers);
        });
    }
}