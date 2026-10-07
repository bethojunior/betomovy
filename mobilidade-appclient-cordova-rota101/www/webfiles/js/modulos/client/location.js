Route.waitView().then(()=>{

    const user = Session.get("user");

    const minute = 1000 * 60;

    const locationController = new LocationController();

    sendLocation();

    function sendLocation(){
        const position = Session.get("location");

        if(position.length === 0){
            setTimeout(sendLocation,minute);
            return;
        }

        locationController.insertByUser({
            "latitude": position.lat,
            "longitude": position.lng,
            "userId": user.idUser
        }).then(()=>{
            setTimeout(sendLocation,minute);
        }).catch(()=>{
            setTimeout(sendLocation,minute);
        })
    }

});