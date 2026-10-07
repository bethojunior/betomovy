class PrepaidController {
   static getAll() {
      return new Promise((resolve, reject) => {
         ConnectionServer.sendRequest('creditPrepaidPurchase', 'GET', null, resolve, reject, true);
      });
   }
   static getByCity(cityId) {
      return new Promise((resolve, reject) => {
         ConnectionServer.sendRequest(
            `creditPrepaidPurchase/${cityId}`,
            'GET',
            null,
            resolve,
            reject,
            true
         );
      });
   }
   static credit(id) {
      return new Promise((resolve, reject) => {
         ConnectionServer.sendRequest(
            `creditPrepaidPurchase/${id}/credit`,
            'PUT',
            null,
            resolve,
            reject,
            true
         );
      });
   }
   static refuse(id) {
      return new Promise((resolve, reject) => {
         ConnectionServer.sendRequest(
            `creditPrepaidPurchase/${id}/refuse`,
            'PUT',
            null,
            resolve,
            reject,
            true
         );
      });
   }
}
