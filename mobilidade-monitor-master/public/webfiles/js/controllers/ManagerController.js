class ManagerController {
    static insert(data){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("manager/","POST",data,resolve,reject,true);
        });
    }

    static list(page = 1){
        return new Promise((resolve, reject)=>{
            ConnectionServer.sendRequest('manager?cityId='+Session.getValueInSessionLocal("citySelected","cityId")+'&page='+page,
                'GET',null,resolve,reject,true);
        })
    }

    static drivers(userId,page){
        return new Promise((resolve, reject)=>{
            ConnectionServer.sendRequest(`manager/${userId}/drivers?page=${page}`,'GET',null,resolve,reject, true);
        })
    }

    static getManager(id){
        return new Promise((resolve, reject)=>{
            ConnectionServer.sendRequest(`manager/${id}`,'GET',null,resolve,reject,true);
        })
    }

    static update(data, id){
        return new Promise((resolve, reject)=>{
            ConnectionServer.sendRequest(`manager/${id}`,'PUT',data,resolve,reject,true);
        })
    }

    static remove(id){
        return new Promise((resolve, reject)=>{
            ConnectionServer.sendRequest(`manager/${id}`,'DELETE',null,resolve,reject,true);
        })
    }

    static listSelectAll(){
        return new Promise((resolve, reject)=>{
            ConnectionServer.sendRequest(`manager/select/all`,'GET',null,resolve,reject,true);
        })
    }

    static verifyUserIsManager(idUser){
        return new Promise((resolve, reject)=>{
            ConnectionServer.sendRequest(`manager/${idUser}/user`,'GET',null,resolve,reject,true);
        })
    }
}