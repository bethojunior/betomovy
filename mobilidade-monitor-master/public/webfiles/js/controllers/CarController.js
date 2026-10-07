class CarController {
   static getPendingCars(cityId, page) {
      return new Promise((resolve, reject) => {
         ConnectionServer.sendRequest(`car/getPendingCars${cityId}?page=${page}`, 'GET', null, resolve, reject, true);
      });
   }

   static acceptCar(id) {
      return new Promise((resolve, reject) => {
         ConnectionServer.sendRequest('car/acceptCar', 'POST', { id }, resolve, reject, true);
      });
   }

   static rejectCar(id) {
      return new Promise((resolve, reject) => {
         ConnectionServer.sendRequest('car/rejectCar', 'POST', { id }, resolve, reject, true);
      });
   }
}
