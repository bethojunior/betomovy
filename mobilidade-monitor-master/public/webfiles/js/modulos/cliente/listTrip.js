let elementProperty = new ElementProperty();
let userId = getByUrl( 0 , 0, 3);

ClientController.getTripByUser(userId).then(resolve => {
   console.log(resolve);
});