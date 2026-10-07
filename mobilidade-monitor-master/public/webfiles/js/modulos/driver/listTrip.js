let elementProperty = new ElementProperty();
let driverId = getByUrl( 0 , 0, 3);
let thisPage = 1;
let lastPage = 0;
mountList();
elementProperty.addEventInElement("#listTrips", "onscroll", function () {
    if (this.scrollHeight - this.scrollTop === this.clientHeight) {
        thisPage = thisPage + 1;
        mountList(thisPage, true);
    }
});

function mountList(page = 1, concat = false, name = '') {
    elementProperty.getElement('#listTrips' , element => {
        let data = {};
        data.driverId = parseInt(driverId);
        data.page = thisPage;
        DriverController.getTripByDriver(data).then(resolve => {

            let dataTrip = resolve.data.data;
            lastPage = resolve.data.lastPage;
            let list = concat ? element.innerHTML : "";

            if(dataTrip[0] === undefined){
                swal('Não existe viagens desse motorista');
                setTimeout(()=>{
                    window.location.href = '/driver/list';
                },3000)
                return;
            }else{
                elementProperty.getElement('#driverName' , element =>{
                    element.innerHTML = dataTrip[0]['driverName'];
                });
            }
            list += dataTrip.map(res => {
                return `
                    <div class="dataListTrip">
                        <div class="first">
                            <span>Cliente : <b>${res.customerName}</b></span><br>
                            <span>Fone : ${res.customerPhone}</span><br>
                            <span>Data: ${Mask.setDate(res.date.date)}</span><br>
                            <span>${checkIfTripIsCanceled(res.canceledBy)}</span>
                        </div>
                        <div class="second">
                            Tipo : ${res.tripType} <br>
                            ${res.paymentForm}<br>
                            R$ ${Mask.maskMoney(parseFloat(res.price))}<br>
                            ${res.situation}
                        </div>
                        <div class="third">
                            <span>Origem  : ${res.originAddress}</span><br>
                            <span>Destino : ${res.destinationAddress}</span>
                        </div>
                    </div>                
                `;
            }).join(' ');
            element.innerHTML = list;
        });
    });
}

