class KeyRepository {
    static putKeys(centralId, params){
        return new Promise((resolve, reject) => {
            ConnectionServer
                .sendRequest(
                    'ifood/keys/' + centralId,
                    `PUT`,
                    params,
                    resolve,
                    reject);
        });
    }

    static getKeys(centralId){
        return new Promise((resolve, reject) => {
            ConnectionServer
                .sendRequest(
                    'ifood/keys/' + centralId,
                    `get`,
                    '',
                    resolve,
                    reject);
        });
    }
}