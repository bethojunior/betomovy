class NotificationController extends ConnectionServer {
    /**
     * @param object
     * @returns {Promise<unknown>}
     */
    static send(object) {
        return new Promise((resolve, reject) => {
            this.sendRequest("notification/", "POST", object, resolve, reject, true);
        })
    }

    /**
     * @param objectPush
     * @returns {Promise<unknown>}
     */
    static push(objectPush) {
        return new Promise((resolve, reject) => {
            this.sendRequest('cityPush', 'POST', objectPush, resolve, reject);
        });
    }

    /**
     * @param objectPush
     * @returns {Promise<unknown>}
     */
    static sendPush(objectPush) {
        return new Promise((resolve, reject) => {
            this.sendRequest('cityPush', 'POST', objectPush, resolve, reject, true);
        });
    }

    /**
     * @returns {Promise<unknown>}
     */
    static getUnread() {
        return new Promise(resolve => {
            this.sendRequest('adminNotification/last', 'GET', '', resolve, false, true);
        })
    }

    static getAllNotificatiion() {
        return new Promise(resolve => {
            this.sendRequest('adminNotification', 'GET', '', resolve, false, true);
        })
    }

    static getNotificationBy(params) {
        return new Promise((resolve, reject) => {
            const filters = Object.keys(params).filter(key => {
                return params[key] != null;
            }).map(key => {
                return `${key}=${params[key]}`;
            }).join("&");

            this.sendRequest(`adminNotification?${filters}`, 'GET', '', resolve, reject, true);
        });
    }

    /**
     *
     * @param id
     * @returns {Promise<unknown>}
     */
    static notificationView(id) {
        return new Promise(resolve => {
            this.sendRequest(`adminNotification/${id}/read`, 'POST', '', resolve, false, true);
        })
    }

    static getAllGroup() {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("userGroup", "GET", null, resolve, reject, true);
        })
    }

    static adminNotificationType(){
        return new Promise((resolve,reject)=>{
            ConnectionServer.sendRequest("adminNotificationType","GET",null,resolve,reject,true)
        })
    }
}
