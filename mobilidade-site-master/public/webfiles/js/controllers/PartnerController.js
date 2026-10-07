class PartnerController {
    static requestPartnership(object){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("Partner/RequestPartnership","POST",object,resolve,reject,
                undefined,false);
        });
    }
}