class DriverAttachmentTypeController {
    static insert(formData) {
        return ConnectionServer.sendRequestWithFiles("driverAttachmentType", "POST", formData, true);
    }

    static getAll() {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("driverAttachmentType", "GET", null, resolve, reject, true)
        })
    }

    static changeStatus(id, status) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`driverAttachmentType/${id}/${status}`, "PUT", null, resolve, reject, true);
        })
    }

    static delete(id) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`driverAttachmentType/${id}`, "DELETE", null, resolve, reject, true);
        })
    }

    static update(id, data) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`driverAttachmentType/${id}`, "PUT", data, resolve, reject, true);
        })
    }

    static updatePicture(id, formData) {
        return ConnectionServer.sendRequestWithFiles(`driverAttachmentType/${id}/updatePicture`, "POST", formData, true);
    }
}