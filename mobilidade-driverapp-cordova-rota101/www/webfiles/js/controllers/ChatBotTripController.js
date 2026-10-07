class ChatBotTripController {
    static sendMessage(userId, tripReference, chatBotTripTypeId) {
        return new Promise((resolve, reject) => {
           ConnectionServer.sendRequest("ChatBotTrip/SendMessage","POST",{userId,tripReference,chatBotTripTypeId}
           ,resolve,reject,undefined,false);
        });
    }
}