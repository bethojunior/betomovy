class ChatRepository {
    static sendMessage(tripReference,message){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`chatTrip/${tripReference}/message`,"POST",{message},resolve,reject);
        })
    }
}