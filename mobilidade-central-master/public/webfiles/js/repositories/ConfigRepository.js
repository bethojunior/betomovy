class ConfigRepository {
    static getConfigByLocation(lat,lng){
        return new Promise((resolve, reject) => {
            ConnectionServer
                .sendRequest(
                    `config/location?lat=${lat}&lng=${lng}`,
                    `GET`,
                    null,
                    resolve,
                    reject);
        });
    }

    static getConfigBykey(key){
        return new Promise((resolve, reject) => {
            ConnectionServer
                .sendRequest(
                    `config/${key}`,
                    `GET`,
                    null,
                    resolve,
                    reject);
        });
    }
}