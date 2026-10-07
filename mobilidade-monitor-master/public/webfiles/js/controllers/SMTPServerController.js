class SMTPServerController{
    static findAllActive(){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("smtpServer","GET", null,resolve,reject,true);
        })
    }

    static disable(){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("smtpServer/disable","PUT", null,resolve,reject,true);
        })
    }

    static create(data){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("smtpServer","POST", data,resolve,reject,true);
        })
    }

    static removeSmtp(smtpId) {
        return new Promise(resolve => {
            ConnectionServer.sendRequest(`smtpServer/${smtpId}/remove`, 'PUT', {}, resolve, undefined, true);
        });
    }

    static editSmtp(smtpId) {
        return new Promise(resolve => {
            ConnectionServer.sendRequest(`smtpServer/${smtpId}/edit`, 'get', {}, resolve, undefined, true);
        });
    }

    static updateSmtp(smtpId, data){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`smtpServer/${smtpId}/update`,"PUT", data,resolve,reject,true);
        })
    }

    static sendEmailSmtp(email){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("smtpServer/test","POST", email,resolve,reject,true);
        })
    }
}