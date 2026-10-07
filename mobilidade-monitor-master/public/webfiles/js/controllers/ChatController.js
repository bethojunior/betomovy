class ChatController {

    static getChatTrip(id){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`chat/${id}`,"GET",null,resolve,reject);
        });
    }
}