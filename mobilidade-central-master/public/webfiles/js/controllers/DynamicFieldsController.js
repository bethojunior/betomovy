class DynamicFieldsController {
    static insert(idCentral, data) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`central/${idCentral}/tripInfoQuestion`, "POST", data, resolve, reject);
        })
    };   

    static get(idCentral) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`central/${idCentral}/tripInfoQuestion`, "GET", null, resolve, reject);
        })
    };

    static questionById(idCentral, idQuestion) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`central/${idCentral}/tripInfoQuestion/${idQuestion}`, "GET", null, resolve, reject);
        })
    };

    static remove(idCentral, idQuestion){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`central/${idCentral}/tripInfoQuestion/${idQuestion}`,"DELETE", null , resolve, reject);
        });
    }

    static edit(idCentral, idQuestion, data){
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`central/${idCentral}/tripInfoQuestion/${idQuestion}`,"PUT", data, resolve, reject);
        });
    }
}