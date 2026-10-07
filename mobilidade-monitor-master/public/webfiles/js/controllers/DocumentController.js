class DocumentController {
    static getAll() {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("doc", "GET", null, resolve, reject, true);
        });
    }

    static insert({label, link, description, image, text, pdf}) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("doc", "POST", {
                label,
                link,
                description,
                image,
                text,
                pdf
            }, resolve, reject, true);
        });
    }

    static delete(id) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`doc/${id}`, "DELETE", null, resolve, reject, true);
        })
    };

    static update(id, {label, link, description, image, text, pdf}) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`doc/${id}`, "PUT", {
                label,
                description,
                image,
                text,
                link,
                pdf
            }, resolve, reject, true);
        });
    }

    static getByUserType(id) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`doc/userType/${id}`, 'GET', null, resolve, reject, true);
        });
    }

    static insertDocUserType(userTypeId, documents) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`doc/userType/${userTypeId}`, "POST", documents, resolve, reject, true);
        });
    }

    static getAllStatus() {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`docStatus`, "GET", null, resolve, reject, true);
        });
    }

    static changeStatusDoc({id, docStatusId}) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`docUser/${id}`, "PUT", {docStatusId}, resolve, reject, true);
        })
    }

    static requestDocUser(docStatusId, docId, userId) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("docUser", "POST", {docId, docStatusId, userId}, resolve, reject, true);
        })
    }
}