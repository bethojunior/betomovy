class UtilController {
    static getMark(){
        return new Promise((resolve, reject)=>{
            ConnectionServer.requestApi(
                `http://fipeapi.appspot.com/api/1/carros/marcas.json`,
                'GET',null,resolve,reject);
        });
    }
    static getVehiclesMark(id){
        return new Promise((resolve, reject)=>{
            ConnectionServer.requestApi(
                `http://fipeapi.appspot.com/api/1/carros/veiculos/${id}.json`,
                'GET',null,resolve,reject);
        });
    }
}