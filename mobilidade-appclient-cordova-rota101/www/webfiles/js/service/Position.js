class Position {
    static getPosition(callback){
            navigator.geolocation.watchPosition(callback,(error)=>{console.log(error)},
                {
                    enableHighAccuracy:true
                });
    }

    static getCurrentPosition(callback){
        navigator.geolocation.getCurrentPosition(callback,undefined,
            {
                enableHighAccuracy:true
            });
    }

    static getPositionNetwork(){
        return new Promise(resolve=>{
            $.get("https://ipinfo.io", function(response) {
                resolve(response);
            }, "jsonp")
        });
    }
}