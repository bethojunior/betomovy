class DependentUser {
    static insert({name, email, phone, password, nickname, relationship,gender}) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("DependentUser/Insert", "POST",
                {name, email, phone, password, nickname, relationship,gender}, resolve, reject, false)
        })
    }

    static findByResponsible() {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("DependentUser/FindByResponsible", "GET", null,
                resolve, reject);
        })
    }

    static delete(dependentUserId) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("DependentUser/Delete", "POST",
                {dependentUserId}, resolve, reject, false)
        })
    }
}
