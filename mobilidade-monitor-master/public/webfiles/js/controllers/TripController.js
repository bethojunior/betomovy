class TripController {

    static actionNew(object, callback) {
        ConnectionServer.sendRequest('Trip/New', 'POST', object, callback);
    }

    static actionGet(tripReference, callback) {
        ConnectionServer.sendRequest('Trip/Get', 'POST', {tripReference}, callback);
    }

    static actionCancel(tripReference, dateEnd, callback) {
        ConnectionServer.sendRequest('Trip/Cancel', 'POST', {tripReference, dateEnd}, callback);
    }

    static listTripBy(search) {
        return new Promise((resolve, reject) => {

            const gets = Object.keys(search).filter((attribute)=>{
                return search[attribute] !== null;
            }).map((attribute) => {
                return `${attribute}=${search[attribute]}`;
            }).join("&");

            ConnectionServer.sendRequest(`trip?${gets}`, 'GET', null, resolve, reject, true);
        });
    }

    static getRouteTrip(tripReference) {
        return new Promise(resolve => {
            ConnectionServer.sendRequest(`trip/${tripReference}/way`, 'GET', null, resolve, undefined, true);
        });
    }

    static get(id) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`trip/${id}`, 'GET', null, resolve, '', true);
        })
    }

    static getRideTrip(id) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`trip/${id}/rideTrip`, 'GET', null, resolve, '', true);
        })
    }

    static getAnalysis(){
        return new Promise(resolve => {
            ConnectionServer.sendRequest('trip/in-analysis' , 'GET' , {} , resolve);
        });
    }

    static getTripInAnalysis(page){
        return new Promise(resolve => {
            ConnectionServer.sendRequest(`trip/analysis?page=${page}` , 'GET' , null , resolve, undefined, true);
        });
    }

    static getTripByDriver(idDriver){
        return new Promise(resolve => {
            ConnectionServer.sendRequest('trip/'+idDriver , 'GET' , {} , resolve);
        });
    }

    static canceledTrip(tripReference, callAgain = false){
        return new Promise(resolve => {
            ConnectionServer.sendRequest('trip/'+tripReference+'/cancel','PUT' , {callAgain} ,resolve,undefined,true);
        });
    }

    static releaseTripInAnalysi(tripReference){
        return new Promise(resolve => {
            ConnectionServer.sendRequest('trip/release/'+tripReference , 'PUT', {} , resolve, undefined, true);
        });
    }


    static getChat(trip){
        return new Promise(resolve => {
            ConnectionServer.sendRequest('chat/'+trip , 'GET' , {} , resolve, undefined, true);
        })
    }

    releaseTrip(refference){
        return new Promise(resolve => {
            ConnectionServer.sendRequest('trip/'+refference+'/release','PUT',{} , resolve);
        })
    }

    static aboutTrip(trip){
        return new Promise(resolve => {
            ConnectionServer.sendRequest('trip/'+trip+'/detail','GET',{},resolve)
        })
    }

    static getMessagesChatBot(action = 'get' , data = '')
    {
        return new Promise(resolve => {
            if(action === 'get')
                return ConnectionServer.sendRequest('chatBotTrip','GET','',resolve,'',true);
            ConnectionServer.sendRequest('chatBotTrip','POST',data,resolve,'',true);
        })
    }

    static deleteMessagesChatBot(id)
    {
        return new Promise(resolve => {
            ConnectionServer.sendRequest('chatBotTrip/'+id,'DELETE','',resolve,'',true);
        })
    }

    static insertMessagesChatBot()
    {
        return new Promise(resolve => {
            ConnectionServer.sendRequest('chatBotTrip/'+id,'DELETE','',resolve,'',true);
        })
    }

    static getTripTypes()
    {
        return new Promise(resolve => {
            ConnectionServer.sendRequest('chatBotTripType','GET','',resolve,'',true);
        })
    }

    /**
     *
     * @param method
     * @param id
     * @param data
     * @returns {Promise<resolve>}
     */
    static cancellationReasons(method = 'GET',id = '',data = '')
    {
        return new Promise(resolve => {
            switch (method) {
                case "GET":
                    ConnectionServer.sendRequest('cancellationReasons','GET','',resolve,'',true);
                    break;
                case "POST":
                    ConnectionServer.sendRequest(`cancellationReasons/insert`,'POST',data,resolve,'',true);
                    break;
                case "DELETE":
                    ConnectionServer.sendRequest(`cancellationReasons/${id}`,'DELETE','',resolve,'',true);
                    break;
            }
        })
    }

    static getStatusTrip() {
        return new Promise( resolve => {
            ConnectionServer.sendRequest('report/select/tripStatuses', 'GET', {}, resolve, undefined, true);
        });
    }

    static finishTrip(tripReference) {
        return new Promise( resolve => {
            ConnectionServer.sendRequest(`trip/${tripReference}/finish`, 'PUT', tripReference, resolve, undefined, true);
        });
    }

    static  releaseTripInAnalysis() {
        return new Promise(resolve => {
            ConnectionServer.sendRequest(`trip/release`, 'PUT', null, resolve, undefined, true);
        });
    }
}