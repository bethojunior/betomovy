class CategoryEstablishmentController {
    static getAllCategories() {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest('typeDeliveryCategory',"GET", null, resolve, reject, true);
        });
    }

    static addNewCategory(data) {
        return new Promise((resolve, reject) => {
           ConnectionServer.sendRequest('typeDeliveryCategory', "POST", data, resolve, reject, true);
        });
    }

    static editCategory(idCategory,data) {
        return new Promise((resolve, reject) => {
           ConnectionServer.sendRequest(`typeDeliveryCategory/${idCategory}`, "PUT", data, resolve, reject, true);
        });
    }

    static deleteCategory(idCategory) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`typeDeliveryCategory/${idCategory}`, "DELETE", null, resolve, reject, true);
        });
    }
}