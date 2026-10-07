const elementProperty = new ElementProperty();
let thisPage = 1;
let lastPage = 0;

mountList();

elementProperty.addEventInElement("#listPreRegister", "onscroll", function () {
    if (this.scrollHeight - this.scrollTop === this.clientHeight) {
        thisPage = thisPage + 1;
        mountList(thisPage , true);
    }
});


function mountList(page = 1 , concat = false) {

    elementProperty.getElement('#listPreRegister' , element => {

        DriverController.getDriversMarket(page).then(resolve => {
            let data = resolve.data.data;
            lastPage = resolve.data.lastPage;

            let list = concat ? element.innerHTML : "";

            list += data.map(res => {
                return `
                    <div id="${res.idUser}" class="dataCostumer">
                        <div class="fistMark">
                            <span><b>Nome: </b>${res.name}<span><br>
                            <span><b>E-mail: </b><a href="mailto:${res.email}">${res.email}</a></span><br>
                            <span><b>Contato: </b>${res.phone}</span>
                         </div>
                         <div class="secondMark">
                            <span><b>Criado em: </b>${res.created_at.date.substr(0,19)}</span><br>
                            <span><b>Cidade: </b>${res.city}</span>
                        </div>
                    </div>
                                             
                                         
                `;
            }).join("");

            element.innerHTML = list;

        });

    });
}

