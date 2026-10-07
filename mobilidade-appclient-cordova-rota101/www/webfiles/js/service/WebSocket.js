const keyTrip = environment.socket.keyTrip;
const keyChat = environment.socket.keyChat;

const channelTrip = "trip-channel";
const channelChat = "chat-channel";

class WebSocket{

    constructor(key){
       /* Pusher.logToConsole = false;

        this.pusher = new Pusher(key, {
            cluster: 'us2',
            encrypted: true
        });

        this.channel = null;*/
    }

    setChannel(nameChannel){
        /*if(environment.socket.test)
            nameChannel = nameChannel.concat("-dev");
        this.channel =  this.pusher.subscribe(nameChannel);*/
    }

    observerSocket(event,callback){
        //this.channel.bind(event,callback);
    }

    stopWebSocket(event){
        //this.channel.unbind(event);
    }


}