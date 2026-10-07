class ChatTripController{

    init(tripReference,callback){
        ConnectionServer.sendRequest('ChatTrip/Init','POST',{tripReference},callback);
    }

    sendMessage(tripReference,message,userId,callback){
        ConnectionServer.sendRequest('ChatTrip/SendMessage','POST',{tripReference,message,userId},callback);
    }

    sendMessageAudio(file,data){

        return new Promise((resolve, reject) => {
            const formData = new FormData();

            formData.append("chatTrip", JSON.stringify(data));
            formData.append("audio", file.data, file.name);

            ConnectionServer.sendFile('ChatTrip/SendMessageAudio','POST',formData)
                .then(resolve)
                .catch(reject);
        })
    }

    getMessages(tripReference,callback){
        ConnectionServer.sendRequest('ChatTrip/GetMessages','POST',{tripReference},callback);
    }
}