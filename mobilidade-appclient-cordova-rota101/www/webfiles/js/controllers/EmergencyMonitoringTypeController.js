class EmergencyMonitoringTypeController {
    static findAll() {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`EmergencyMonitoringType/FindAll`, "GET", null, resolve, reject);
        });
    }
}