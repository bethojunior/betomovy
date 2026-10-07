class ClienteController {
    static preRegister(data){
        return new Promise(resolve => {
            ConnectionServer.request('customer/register' , 'POST' , data , false , resolve)
        })
    }

    static getImagePromotion(){
        return new Promise(resolve => {
            ConnectionServer.request('Marketing/PromotionalImageCustomerRegister','POST',{},false , resolve);
        })
    }
} 