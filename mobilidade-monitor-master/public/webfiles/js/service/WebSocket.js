const keyTrip = "2c5145f8e4bf4b798aec";
const keyDriver = "47c97dd20c582a749a98";
const keyChatTrip = "f7f9e9feea6d087c950c";


class WebSocket{
    constructor(key){
        Pusher.logToConsole = false;

        this.pusher = new Pusher(key, {
            cluster: 'us2',
            encrypted: true
        });

        this.channel = null;
    }

    setChannel(nameChannel){
        this.channel =  this.pusher.subscribe(nameChannel);
    }

    observerSocket(event,callback){
        this.stopWebSocket(event);
        this.channel.bind(event,callback);
    }

    stopWebSocket(event){
        this.channel.unbind(event);
    }


}