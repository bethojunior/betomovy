class ContactController {
    static getMessages(page = 1){
        return new Promise(resolve => {
            ConnectionServer.sendRequest('contactUs?page='+page , 'GET' , {} , resolve, null, true);
        });
    }

    static getReport(page = 1){
        return new Promise(resolve => {
            ConnectionServer.sendRequest('tripReport?page='+page , 'GET' , {} , resolve, null, true);
        });
    }
}