class LogController {
    insertMany(logs){
        return new Promise((resolve,reject)=>{
            ConnectionServer.sendRequest('Log/InsertMany', 'POST', {logs}, resolve,reject);
        });
    }
}