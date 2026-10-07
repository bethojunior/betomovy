class DriverAttachmentTypeController {
    static getAll() {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`delivery/driverAttachmentType`, "GET", null, resolve, reject, undefined, false, true)
        })
    }
}
