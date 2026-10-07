class NotificationController {
    static findByUser(idUser, page) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`notification/findByUser?idUser=${idUser}&page=${page}`, "GET", null, resolve, reject)
        })
    }

    static viewed(idUser, idNotification) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("notification/viewed", "POST", {
                idUser,
                notifications: [idNotification]
            }, resolve, reject, undefined, false);
        });
    }
}
