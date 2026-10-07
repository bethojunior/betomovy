class ClientController{
    shareByWhatsapp(check , userData , phone){

        if(check){
            window.location.href = API_HOST_WHAT+"send?phone=55"+phone+"&text="+userData;
            return;
        }

        const cryptData = window.btoa(JSON.stringify(userData));

        const link = `${CURRENT_HOST_PWA}cliente/filterhostel/?code=${cryptData}`;

        window.location.href = API_HOST_WHAT+"send?phone=55"+userData.phone+"&text="+link;
    }

    shareBySMS(check , userData , phone , callback) {

        const cryptData = window.btoa(JSON.stringify(userData));

        let link = `${CURRENT_HOST_PWA}cliente/filterhostel/?code=${cryptData}`;

        if(check){
            link = HOST_HOSTEL+userData;
        }


        const sms = {
            number: userData.phone,
            message : `link ${link}`
        };

        ConnectionServer.sendRequest('Establishment/SendSms','POST',sms,callback);
    }

    sendIndicationEmail(check , userData , phone ,callback) {

        const cryptData = window.btoa(JSON.stringify(userData));

        let link = `${CURRENT_HOST_PWA}cliente/filterhostel/?code=${cryptData}`;

        if(check){
            link = HOST_HOSTEL+userData;
        }

        const data = {
            email: userData.email,
            message : `link ${link}`
        };

        ConnectionServer.sendRequest('Establishment/SendIndicationEmail','POST',data,callback);
    }
}