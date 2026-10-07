class DeliverySectionController {
    static store(formData) {
        return ConnectionServer.sendRequestWithFiles("deliverySection", "POST", formData, true);
    }

    static findAll() {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest("deliverySection/all", "GET", null, resolve, reject, true);
        });
    }

    static delete(id) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`deliverySection/${id}`, "DELETE", null, resolve, reject, true);
        });
    }

    static update(id, formData) {
        return ConnectionServer.sendRequestWithFiles(`deliverySection/${id}`, "POST", formData, true);
    }

    static findSectionsByCategory(categoryId) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`typeDeliveryCategoryBySection/${categoryId}`, "GET", null, resolve, reject, true);
        });
    }

    static linkCategoryInSections(typeDeliveryCategoryId, deliverySections) {
        return new Promise((resolve, reject) => {
            ConnectionServer.sendRequest(`typeDeliveryCategoryBySection`, "POST", {
                typeDeliveryCategoryId,
                deliverySections
            }, resolve, reject, true);
        });
    }
}