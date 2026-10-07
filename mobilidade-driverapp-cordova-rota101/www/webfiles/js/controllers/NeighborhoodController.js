class NeighborhoodController{

    /**
     * Retorna os bairro da cidade
     * @param cityId
     * @returns {Promise<any>}
     */
    getAllByCity(cityId){
        return new Promise((resolve,reject)=>{
            ConnectionServer.sendRequest('Neighborhood/GetAll?city='+cityId,'POST',{},result=>{
                if(!result.status){
                    reject(result);
                    return;
                }
                resolve(result)
            });
        });
    }
}