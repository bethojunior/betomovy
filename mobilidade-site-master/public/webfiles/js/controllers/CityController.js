class CityController{
    /**
     * Retorna todas as cidades do braisil
     * @returns {Promise<any>}
     */
    static getAll(estado = null){
        return new Promise((resolve,reject)=>{
            let url = 'City/GetAll';

            if(estado !== null){
                url += `?estado=${estado}`;
            }


            ConnectionServer.sendRequest(url,'POST',{},result=>{
                if(!result.status){
                    reject(result);
                    return;
                }
                resolve(result)
            });
        });
    }


    /**
     *
     * @returns {Promise<any>}
     */
    getCities(){
        return new Promise((resolve,reject)=>{
            ConnectionServer.sendRequest('Establishment/GetCities','POST',{},result=>{
                if(!result.status){
                    reject(result);
                    return;
                }
                resolve(result)
            });
        });
    }

    /**
     *
     * @param position {Object}{lat:0,lng:0}
     * @returns {Promise<any>}
     */
    static getConfig(position){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("City/GetConfig","POST", position,resolve,reject,undefined,false);
        });
    }

    /**
     *
     * @returns {Promise<unknown>}
     */
    static getActives()
    {
        return new Promise(resolve => {
            ConnectionServer.sendRequest('City/getActives','GET','',resolve)
        })
    }

    static getActivesV2(){
        return ConnectionServer.sendRequestV2('activeCities','GET', null)
    }
}
