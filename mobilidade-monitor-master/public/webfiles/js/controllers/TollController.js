const cityId = Session.getLocal('citySelected').cityId;
class TollController {
   static insert({ name, address, value, polygon }) {
      return new Promise((resolve, reject) => {
         ConnectionServer.sendRequest(
            'toll',
            'POST',
            { name, address, value, polygon, cityId },
            resolve,
            reject,
            true
         );
      });
   }

   static listByCity(cityId) {
      return new Promise((resolve, reject) => {
         ConnectionServer.sendRequest(`toll/${cityId}`, 'GET', null, resolve, reject, true);
      });
   }

   static list() {
      return new Promise((resolve, reject) => {
         ConnectionServer.sendRequest('toll', 'GET', null, resolve, reject, true);
      });
   }

   static delete(id) {
      return new Promise((resolve, reject) => {
         ConnectionServer.sendRequest(`toll/${id}`, 'DELETE', null, resolve, reject, true);
      });
   }
}
