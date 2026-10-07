class Position {
    static getPosition(callback){
        navigator.geolocation.watchPosition(callback,(error)=>{console.log(error)},
            {
                maximumAge:10000, timeout:5000, enableHighAccuracy: true
            });
    }

    static getCurrentPosition(callback){
        navigator.geolocation.getCurrentPosition(callback,undefined,
            {
                maximumAge:10000, timeout:5000, enableHighAccuracy: true
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