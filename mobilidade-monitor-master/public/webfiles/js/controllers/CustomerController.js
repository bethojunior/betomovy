class CustomerController extends ConnectionServer{
    /**
     * @param search
     * @returns {Promise<unknown>}
     */
    static listCustomerBy(search = {page:1}){
        return new Promise((resolve, reject) => {
            const gets = Object.keys(search).map((attribute)=>{
                return `${attribute}=${search[attribute]}`;
            }).join("&");

            ConnectionServer.sendRequest(`customer?${gets}`,"GET",null,resolve,reject, true);
        })
    }
    /**
     * @param name
     * @returns {Promise<unknown>}
     */
    static getByName(name = ''){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`customer?name=${name}`,"GET",null,resolve,reject);
        })
    }
    /**
     * @param id
     * @returns {Promise<unknown>}
     */
    static getCustomerById(id){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`customer/${id}`,"GET",null,resolve,reject);
        })
    }
    /**
     * @returns {Promise<unknown>}
     */
    static gender(){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`gender`,"GET",null,resolve,reject,true);
        })
    }
    /**
     * @returns {Promise<unknown>}
     */
    static getTypeUsers()
    {
        return new Promise(resolve => {
            this.sendRequest('userType','GET','',resolve,false,false);
        });
    }
}