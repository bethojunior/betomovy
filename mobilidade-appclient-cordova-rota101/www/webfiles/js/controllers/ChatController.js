class ChatController{
    static sendMessage(tripReference, message, userId , callback){
        ConnectionServer.sendRequest("ChatTrip/SendMessage" , "POST",
            {tripReference,message,userId },callback);
    }
    static getMessages(tripReference,callback){
        ConnectionServer.sendRequest('ChatTrip/GetMessages','POST',{tripReference},callback);
    }
    static sendMessageAudio(file,data){

        return new Promise((resolve, reject) => {
            const formData = new FormData();

            formData.append("chatTrip", JSON.stringify(data));
            formData.append("audio", file.data, file.name);

            ConnectionServer.sendFile('ChatTrip/SendMessageAudio','POST',formData)
                .then(resolve)
                .catch(reject);
        })
    }
}