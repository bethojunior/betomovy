class DirectionController {
    static search(origin,destination,waypoints){
        return new Promise((resolve, reject) => {
            let params = `?origin=${origin}&destination=${destination}`;

            if(waypoints != null)
                params += `&waypoints=${waypoints}`;

            ConnectionServer.sendRequest(`direction/search${params}`,"GET",null,resolve,reject,undefined,false);
        });
    }


    static searchNative(origin,destination,waypoints){
        let params = `?origin=${origin}&destination=${destination}&simpleDirections=1`;

        if(waypoints != null)
            params += `&waypoints=${waypoints}`;

        return ConnectionServer.sendRequestNative(`${ConnectionServer.Host()}direction/search${params}`,"get");
    }

    static updateRoute(data){
        const port = Session.get("configLocation")?.port_url;

        const baseUrl = UrlBuilder.resolveWithPort(API_HOST_LOCATION, port);

        return ConnectionServer.sendRequestNative(`${baseUrl}/location/route`, "post",data);
    }
}
