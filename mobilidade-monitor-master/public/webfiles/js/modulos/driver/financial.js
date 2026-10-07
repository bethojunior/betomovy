const elementProperty = new ElementProperty();
const dateObj = new Date();
let driverId = '';
let dataDriver = '';

let managerList = {
    currentPage: null,
    lastPage:null,
    idDriver: document.getElementById('idDriver').innerHTML,
    dateStart: null,
    dateEnd: null,
    filter: {
        page:1
    }
};

Controller.pathUrl().then(url => {
    driverId = url[4];
    DriverController.getById(driverId).then(({status,response}) => {
        if(status){
            Session.setLocal('dataDriver',response);
            dataDriver = response;
            document.getElementById("nameDriver").innerText = 'Motorista ' + response.name;
            return true;
        }
    });
});

const createListFinancialDriver = (isConcat = false) => {
    DriverController.getFinancialById(managerList.idDriver,managerList.filter).then(({response}) => {    
 
        const { data, current_page, last_page } = response;
        let arrayToCompare = [];

        list = ``;

        managerList.currentPage = parseInt(current_page);
        managerList.lastPage = parseInt(last_page);

        if(data.length > 0){
            data.map(item => {
                const isDuplicated = arrayToCompare.some(
                  (el) =>
                    el.tripReference === item.tripReference &&
                    el.price === item.price &&
                    el.flow === item.flow &&
                    el.date === item.date
                );

                if (!isDuplicated) {
                  arrayToCompare.push(item);
                  list += ` <li class="timeline">
                    <div class='timeline-content'>
                        <span style='background-color: ${
                          item.color
                        }' class="timeline-icon"></span>
                        <div class='content'>
                            <span>${new Date(
                              item.date
                            ).toLocaleString()}</span>  
                            <span>${item.summary}</span>  
                            <h4>Valor: <span>${Mask.maskMoney(
                              parseFloat(item.value)
                            )}</span></h4>
                        </div>
                    </div>
                </li>
                `;
                }
            });
            
            if(isConcat){
                document.getElementById('listFinancialDriver').innerHTML += list;
            }else{
                document.getElementById('listFinancialDriver').innerHTML = list;
            }
            
            return;
        }
        
        list +=  "<h2>Sem resultados</h2>";
        document.getElementById('listFinancialDriver').innerHTML = list;
    });

};
 

// Function scroll
elementProperty.addEventInElement("#listFinancialDriver", "onscroll", function() {
    if (this.scrollHeight - this.scrollTop === this.clientHeight) {
       if(managerList.currentPage < managerList.lastPage){
            managerList.currentPage += 1;

            managerList.filter.page = managerList.currentPage;

            createListFinancialDriver(true);
       }
    }
});


elementProperty.addEventInElement("#toggleModal", "onclick", () => {
    document.getElementById("filterDateStart").valueAsDate = new Date()
    document.getElementById("filterDateEnd").valueAsDate = new Date()

    elementProperty.addClass(".modal-filter-financial", "active")
 
});


elementProperty.addEventInElement(".close-filter", "onclick", () => {
    elementProperty.removeClass(".modal-filter-financial", "active")
});

elementProperty.addEventInElement("#filterFinancial", "onclick", () => {

    const dateStart = document.getElementById("filterDateStart").value;
    const dateEnd = document.getElementById("filterDateEnd").value;
 
    managerList.currentPage = 1;
    managerList.filter.page = 1;

    managerList.filter.startDate = dateStart;
    managerList.filter.endDate = dateEnd;

    localStorage.setItem('dateFilter', `${dateStart},${dateEnd}`);
    
    createListFinancialDriver();
    elementProperty.removeClass(".modal-filter-financial", "active");
});

elementProperty.addEventInElement("#printReport","onclick", () => {
    const conteudo = document.getElementById('printable').innerHTML,
    tela_impressao = window.open('');
    tela_impressao.document.write(conteudo);
    tela_impressao.window.print();
    tela_impressao.window.close();
});

createListFinancialDriver() ;
localStorage.setItem('dateFilter', ``);
