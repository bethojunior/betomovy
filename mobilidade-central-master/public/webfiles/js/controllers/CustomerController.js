class CustomerController {
    loginPartner(user, callback) {
        ConnectionServer.sendRequest('Customer/loginPartner', 'POST', user, callback);
    }

    getCurrentTrips(userId) {
        return new Promise(resolve => {
            ConnectionServer.sendRequest('Customer/GetCurrentTrips', 'POST', {userId}, resolve);
        });
    }

    actionNew(object) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest('Customer/NewTrip', 'POST', object, resolve, reject);
        });
    }

    getBalance(userId) {
        return new Promise(resolve => {
            ConnectionServer.sendRequest('Customer/getBalance', 'POST', {userId}, resolve);
        });
    }

    actionCancel(tripReference, userId, dateEnd, status = 'canceled') {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest('Customer/CancelTrip', 'POST', {tripReference, userId, dateEnd,status},
                resolve,reject);
        });
    }

    authenticateSocial(dataUser) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest('Customer/SocialLoginPartner', 'POST', dataUser, resolve, reject, false)
        });
    }

    getPartnerTrips(data) {
        return new Promise(resolve => {
            ConnectionServer.sendRequest('Customer/GetPartnerTrips', 'POST', {...data}, resolve)
        });
    }

    static editProfile(data) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest('CustomerPartner/EditProfile', 'POST', data, resolve, reject, true);
        });
    }

    checkEmail(email) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest('User/CheckEmail', 'POST', {email}, resolve, function () {
                reject("Ocorreu um error ao tentar fazer login");
            });
        });
    }

    authenticate(user) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest('Customer/login', 'POST', user, resolve, function () {
                reject("Ocorreu um error ao tentar fazer login");
            }, false);
        });
    }

    authenticateSocial(data) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest('Customer/LoginSocial', 'POST', data, resolve, reject, false);
        });
    }

    register(data) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest('Customer/Register', 'POST', data, resolve, reject);
        });
    }

    find(userId) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`user/${userId}`, 'GET', null, resolve, reject, false);
        });
    }

    getTrips(customerId, page, date = null, status = null) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest('Customer/GetTrips', 'POST',
                {
                    customerId, page, date, status
                }
                , resolve, reject, false);
        });
    }

    sendConfirmationCode(number){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest('Customer/SendConfirmationCode', 'POST',
                {number}, resolve, reject, false);
        });
    }
    checkEmailSignup(email){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest('Customer/CheckEmail', 'POST',
                {email}, resolve, reject, false);
        });
    }

    static checkCancellationFee(tripReference){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("customer/checkcancellationfee","POST",
                {tripReference},resolve,reject,false);
        });
    }

    static ForgotPassword(email) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("Customer/ForgotPassword", 'POST', {email}, resolve, reject, false);
        });
    }

    static changePassword(data) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest('Customer/ChangePassword', 'POST', data, resolve, reject, false)
        })
    }

    static sendEmail(data) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest('Customer/HelpMeEmail', 'POST', data, resolve, reject, false);
        })
    }

    static updatePhoto(customerId , photo){

        return new Promise((resolve,reject) => {

            const formData = new FormData();

            FileUpload.prepare(photo).then(file => {

                formData.append("photo", file.data, file.name);
                formData.append("customerId",customerId);

                ConnectionServer.sendFile("Customer/UpdateProfileImage", "POST", formData).then(resolve).catch(reject);

            });

        });
    }

    static updateDataCustomer(data){
        return new Promise((resolve , reject) => {
            ConnectionServer.sendRequest('Customer/EditProfile' , 'POST' , data , resolve , reject , false);
        });
    };

    static checkDocument(data){
        return new Promise((resolve , reject) => {
            ConnectionServer.sendRequest('Customer/CheckDocument' , 'POST' , data , resolve , reject , false);
        });
    };

    static checkPassword(password){
        return new Promise((resolve , reject) => {
            ConnectionServer.sendRequest('Customer/CheckPassword' , 'POST' , {password} , resolve , reject , false);
        });
    };


}