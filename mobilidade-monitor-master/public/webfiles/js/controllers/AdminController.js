class AdminController {
    static get() {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("admin", "GET", null, resolve, reject, true);
        });
    }

    static post(admin) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("admin", "POST", admin, resolve, reject, true);
        });
    }

    static delete(idUser) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`user/${idUser}`, "DELETE", null, resolve, reject, true);
        })
    }
}