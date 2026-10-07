const elementProperty = new ElementProperty();

const dataDriver = Session.getLocal('dataDriver');

const managerList = {
    idDriver: document.getElementById('idDriver').innerHTML,
    date: localStorage.getItem("dateFilter")
};

const createTableFinancial = () => {
    elementProperty.getElement(".logo-monitor", (these) => {
        these.src = `${environment.hosts.hostImageDefault}`;
    });

    DriverController.getFinancialDetailOfTrip(managerList.idDriver, managerList.date).then(({response: data}) => {
        if(managerList.date){
            let dataStrig = managerList.date.split(',');
            managerList.date =
                `${new Date(dataStrig[0]).toLocaleDateString()} - ${new Date(dataStrig[1]).toLocaleDateString()}`
        }else{
            managerList.date = "TODO PERIODO";
        }

        document.title = "CONTROLE E GESTÃO DE VALORES";
        
        list = ``;

        document.getElementById("nameDriver").innerText = dataDriver.name;
        document.getElementById("dateAtual").innerText = new Date().toLocaleString()
        document.getElementById("periodo").innerText = managerList.date

        if(data.length > 0){
            data.map(item => {  
                list += `
                    <tr>
                        <td>${new Date(item.date).toLocaleString()}</td>
                        <td>${item.customerName}</td>
                        <td>${item.paymentForm}</td>
                        <td>${item.typeOfRepass}</td>
                        <td><div class='numberReal'><span class='left'>R$</span><span class='rigth'>${Mask.maskMoney(item.price)}</span></div></td> 
                        <td><div class='numberReal'><span>R$</span><span class='rigth'>${Mask.maskMoney(item.appFee)}</span></div></td> 
                        <td><div class='numberReal'><span>R$</span><span class='rigth'>${Mask.maskMoney(item.anotherFee)}</span></div></td> 
                        <td><div class='numberReal'><span>R$</span><span class='rigth'>${Mask.maskMoney(item.paymentFormFee)}</span></span></div></td> 
                        <td><div class='numberReal'><span>R$</span><span class='rigth'>${Mask.maskMoney(item.reward)}</span></div></td>
                        <td><div class='numberReal'><span>R$</span><span class='rigth'></span> ${Mask.maskMoney(item.netValue)}</span></div></td>
                    </tr>
                `
            })
        }

        document.getElementById('table-financial').innerHTML += list

        document.getElementById("dataAtualFormatada").innerText = `${new Date().toLocaleString()}`

        window.print();
        // Remove div once printed
        setTimeout(function () { window.close()}, 500);
    })
}
 
createTableFinancial(managerList.idDriver)
